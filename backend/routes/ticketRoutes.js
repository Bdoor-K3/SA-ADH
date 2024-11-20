const express = require('express');
const QRCode = require('qrcode'); // Import the QR code library
const axios = require('axios'); // For API calls to Tap Payments
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Assuming a Purchase model exists
const { authenticateToken } = require('../middleware/auth');
const winston = require('winston');

const router = express.Router();

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

// Tap Payments Configuration
const TAP_SECRET_KEY = process.env.TAP_SECRET_KEY; // Set your Tap secret key in .env
const TAP_API_BASE_URL = 'https://api.tap.company/v2/charges'; // Tap Payments API URL

// Purchase Ticket with Tap Payments
router.post('/purchase', authenticateToken, async (req, res) => {
  const { eventId } = req.body;

  try {
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if tickets are available
    const ticketsSold = await Ticket.countDocuments({ eventId });
    if (ticketsSold >= event.ticketsAvailable) {
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    // Find the user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 1: Create a Tap payment request
    const chargePayload = {
      amount: event.price, // Use event's price
      currency: event.currency, // Use event's currency
      customer_initiated: true,
      threeDSecure: true,
      description: `Purchase ticket for event: ${event.title}`,
      metadata: { eventId: event._id.toString(), userId: user._id.toString() },
      reference: { transaction: `txn_${event._id}`, order: `ord_${event._id}` },
      receipt: { email: true, sms: true },
      customer: {
        first_name: user.name,
        email: user.email,
        phone: { country_code: 966, number: user.phone }, // Assuming user has a phone field
      },
      source: { id: 'src_all' },
      redirect: { url: `${process.env.BASE_URL}/events/${event._id}` }, // Replace with actual redirect URL
    };

    const response = await axios.post(TAP_API_BASE_URL, chargePayload, {
      headers: {
        Authorization: `Bearer ${TAP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Return the payment URL for the user
    res.status(200).json({ url: response.data.transaction.url });
  } catch (error) {
    logger.error(`Error initiating payment: ${error.message}`);
    const errorMessage = error.response?.data || error.message;
    res.status(500).json({ message: 'Error initiating payment', error: errorMessage });
  }
});


router.get('/payment/callback', async (req, res) => {
  const { tap_id } = req.query;

  try {
    console.log('Received tap_id:', tap_id); // Debug log

    const response = await axios.get(`${TAP_API_BASE_URL}/${tap_id}`, {
      headers: {
        Authorization: `Bearer ${TAP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Tap Payments charge details:', response.data); // Debug log
    const chargeDetails = response.data;

    if (chargeDetails.status !== 'CAPTURED') {
      logger.warn('Payment failed or not completed.');
      return res.status(400).json({ message: 'Payment failed or not completed' });
    }

    const { eventId, userId } = chargeDetails.metadata;
    console.log(`Event ID: ${eventId}, User ID: ${userId}`); // Debug log

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      console.error('Event or User not found.');
      return res.status(404).json({ message: 'Event or User not found.' });
    }

    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeData,
      QRCodeImage: qrCodeImage,
    });

    const savedTicket = await newTicket.save();
    console.log('Saved ticket:', savedTicket); // Debug log

    const newPurchase = new Purchase({
      userId: user._id,
      ticketId: savedTicket._id,
      eventId: event._id,
      amount: event.price,
      currency: event.currency,
      paid: true,
    });

    const savedPurchase = await newPurchase.save();
    console.log('Saved purchase:', savedPurchase); // Debug log

    res.status(200).json({ ticket: savedTicket });
  } catch (error) {
    console.error(`Error processing payment callback: ${error.message}`);
    res.status(500).json({ message: 'Error processing payment callback', error: error.message });
  }
});


// Validate Ticket
router.post('/validate', authenticateToken, async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  try {
    logger.info(`Validation request received for QRCode: ${qrCodeData}, eventId: ${eventId}`);

    // Find the ticket
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

    // Update the purchase record
    const purchase = await Purchase.findOne({ ticketId: ticket._id });
    if (purchase) {
      purchase.used = true;
      purchase.useDate = new Date();
      await purchase.save();
    }

    logger.info('Ticket validated successfully.');
    res.status(200).json({ message: 'Ticket validated successfully.', ticket });
  } catch (error) {
    logger.error(`Error validating ticket: ${error.message}`);
    res.status(500).json({ message: 'Error validating ticket.', error: error.message });
  }
});

module.exports = router;
