const express = require('express');
const QRCode = require('qrcode'); // Import the QR code library
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

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

    // Generate QR code data
    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    

    // Create a new ticket
    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeImage, // Save the QR code image
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

router.post('/validate', authenticateToken, async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  try {
    // Find the ticket based on the QR code and event ID
    const ticket = await Ticket.findOne({ QRCode: qrCodeData, eventId });

    if (!ticket) {
      return res.status(404).json({
        message: 'Invalid ticket. No matching ticket found for this event.',
      });
    }

    if (ticket.used) {
      return res.status(400).json({
        message: 'This ticket has already been used.',
        useDate: ticket.useDate,
      });
    }

    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();

    res.status(200).json({ message: 'Ticket validated successfully.', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error validating ticket.', error: error.message });
    print(error)
  }
});




module.exports = router;
