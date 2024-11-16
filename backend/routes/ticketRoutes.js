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
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Count tickets already purchased for this event
    const ticketsSold = await Ticket.countDocuments({ eventId });
    if (ticketsSold >= event.ticketsAvailable) {
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  // Generate QR code as text and Base64 image
const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`; // Raw QR code data
const qrCodeImage = await QRCode.toDataURL(qrCodeData); // Base64 image for frontend display

// Save raw text data for validation and Base64 image for UI
const newTicket = new Ticket({
  eventId: event._id,
  buyerId: user._id,
  QRCode: qrCodeData, // Save raw text QR code data
  QRCodeImage: qrCodeImage, // Optional: Save Base64 image for UI
});

    const savedTicket = await newTicket.save();

    // Update the user's purchase history
    user.purchaseHistory.push({
      ticketId: savedTicket._id,
      purchaseDate: savedTicket.purchaseDate,
      used: false,
      useDate: null,
    });
    await user.save();

    res.status(201).json({ message: 'Ticket purchased successfully', ticket: savedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing ticket', error: error.message });
  }
});

// Validate Ticket by QR Code
// Validate Ticket by QR Code
router.post('/validate', authenticateToken, async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  try {
    logger.info(`Validation request received for QRCode: ${qrCodeData}, eventId: ${eventId}`);

    // Validate ticket
    const ticket = await Ticket.findOne({ QRCode: qrCodeData, eventId });
    if (!ticket) {
      logger.warn('Invalid ticket. No matching ticket found.');
      return res.status(404).json({ message: 'Invalid ticket. No matching ticket found.' });
    }

    if (ticket.used) {
      logger.warn('Ticket already used.');
      return res.status(400).json({
        message: 'This ticket has already been used.',
        useDate: ticket.useDate,
      });
    }

    // Mark the ticket as used
    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();

    // Update the user's purchase history
    const user = await User.findById(ticket.buyerId);
    if (!user) {
      logger.error('User not found for the validated ticket.');
      return res.status(404).json({ message: 'User not found.' });
    }

    const purchaseHistoryEntry = user.purchaseHistory.find(
      (entry) => entry.ticketId.toString() === ticket._id.toString()
    );
    if (purchaseHistoryEntry) {
      purchaseHistoryEntry.used = true;
      purchaseHistoryEntry.useDate = ticket.useDate;
      await user.save();
    } else {
      logger.warn('No matching purchase history entry found for the validated ticket.');
    }

    logger.info('Ticket validated successfully.');
    res.status(200).json({ message: 'Ticket validated successfully.', ticket });
  } catch (error) {
    logger.error(`Error validating ticket: ${error.message}`);
    res.status(500).json({ message: 'Error validating ticket.', error: error.message });
  }
});


module.exports = router;
