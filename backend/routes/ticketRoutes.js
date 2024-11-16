const express = require('express');
const QRCode = require('qrcode'); // Import the QR code library
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const winston = require('winston');

// Configure Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/ticketing.log' }),
  ],
});

// Purchase Ticket
router.post('/purchase', authenticateToken, async (req, res) => {
  const { eventId } = req.body;

  try {
    logger.info(`Purchase request received for eventId: ${eventId}`);

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      logger.warn(`Event not found for eventId: ${eventId}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    // Count tickets already purchased for this event
    const ticketsSold = await Ticket.countDocuments({ eventId });
    if (ticketsSold >= event.ticketsAvailable) {
      logger.warn(`No tickets available for eventId: ${eventId}`);
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      logger.warn(`User not found for userId: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate QR code data
    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    logger.info(`QR Code generated for userId: ${user._id}, eventId: ${event._id}`);

    // Create a new ticket
    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeData, // Save raw QR code data
    });
    const savedTicket = await newTicket.save();
    logger.info(`Ticket successfully created with ticketId: ${savedTicket._id}`);

    // Update the user's purchase history
    user.purchaseHistory.push({
      ticketId: savedTicket._id,
      purchaseDate: savedTicket.purchaseDate,
      used: false,
      useDate: null,
    });
    await user.save();
    logger.info(`Purchase history updated for userId: ${user._id}`);

    res.status(201).json({ message: 'Ticket purchased successfully', ticket: savedTicket });
  } catch (error) {
    logger.error(`Error purchasing ticket: ${error.message}`);
    res.status(500).json({ message: 'Error purchasing ticket', error: error.message });
  }
});

// Validate Ticket by QR Code
router.post('/validate', authenticateToken, async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  try {
    logger.info(`Validation request received for QRCode: ${qrCodeData}, eventId: ${eventId}`);

    // Find the ticket based on the QR code and event ID
    const ticket = await Ticket.findOne({ QRCode: qrCodeData, eventId });

    if (!ticket) {
      logger.warn(`Invalid ticket. No matching ticket found for QRCode: ${qrCodeData}, eventId: ${eventId}`);
      return res.status(404).json({
        message: 'Invalid ticket. No matching ticket found for this event.',
      });
    }

    if (ticket.used) {
      logger.warn(`Ticket already used. QRCode: ${qrCodeData}, ticketId: ${ticket._id}`);
      return res.status(400).json({
        message: 'This ticket has already been used.',
        useDate: ticket.useDate,
      });
    }

    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();
    logger.info(`Ticket validated and updated to used for ticketId: ${ticket._id}`);

    res.status(200).json({ message: 'Ticket validated successfully.', ticket });
  } catch (error) {
    logger.error(`Error validating ticket: ${error.message}`);
    res.status(500).json({ message: 'Error validating ticket.', error: error.message });
  }
});

module.exports = router;
