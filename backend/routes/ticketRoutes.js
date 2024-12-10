const express = require('express');
const QRCode = require('qrcode'); // Import the QR code library
const axios = require('axios'); // For API calls to Tap Payments
const cloudinary = require('../cloudinary'); // Cloudinary configuration
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Assuming a Purchase model exists
const { authenticateToken ,authorizeAdmin } = require('../middleware/auth');
const winston = require('winston');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Import and configure dotenv

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

// Fetch tickets by event ID and optionally filter by email or phoneNumber number for ORganizer page
router.get('/', async (req, res) => {
  try {
    const { eventId, email, phoneNumber } = req.query;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }

    const query = { eventId };

    if (email || phoneNumber) {
      const buyerFilter = {};
      if (email) buyerFilter.email = email;
      if (phoneNumber) buyerFilter.phoneNumber = phoneNumber;

      const buyers = await User.find(buyerFilter).select('_id');
      query.buyerId = { $in: buyers.map((user) => user._id) };
    }

    const tickets = await Ticket.find(query).populate('buyerId', 'email phoneNumber fullName');
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets.' });
  }
});
// Mark ticket as used
router.put('/:id/use', async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Populate ticket with buyer and event details
    const ticket = await Ticket.findById(ticketId).populate('eventId').populate('buyerId');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    if (ticket.used) {
      return res.status(400).json({ message: 'Ticket has already been used.' });
    }

    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();

    // Check if the event is from Alphantom
    if (ticket.eventId.isAlphantom) {
      // Ensure eventName and buyerEmail are properly fetched
      const eventName = ticket.eventId.name;
      const buyerEmail = ticket.buyerId.email;

      if (!eventName || !buyerEmail) {
        console.error('Event name or buyer email missing. Cannot send data to Alphantom API.');
      } else {
        const payload = {
          buyerEmail,
          eventName,
        };

        // Log the payload before sending
        console.log('Preparing to send Alphantom API request with payload:', payload);

        try {
          const response = await axios.post(process.env.APP_ALphantom_URL, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Log success response
          console.log('Alphantom API request sent successfully:', response.status, response.data);
        } catch (error) {
          // Log error response with details
          console.error('Error sending data to Alphantom API:', error.message);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
        }
      }
    }

    res.status(200).json({ message: 'Ticket marked as used successfully.', ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Error updating ticket status.' });
  }
});


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

    // Ensure countryCode is available
    if (!user.countryCode) {
      return res.status(400).json({ message: 'User does not have a valid country code.' });
    }

    // Construct the Tap charge payload
    const chargePayload = {
      amount: event.price, // Use event's price
      currency: event.currency, // Use event's currency
      customer_initiated: true,
      threeDSecure: true,
      description: `Purchase ticket for event: ${event.name}`,
      metadata: { eventId: event._id.toString(), userId: user._id.toString() },
      reference: { transaction: `txn_${event._id}`, order: `ord_${event._id}` },
      receipt: { email: true, sms: true },
      customer: {
        first_name: user.fullName,
        email: user.email,
        phone: { country_code: user.countryCode, number: user.phoneNumber }, // Use dynamic country code and phone number
      },
      source: { id: 'src_all' },
      redirect: { url: `${process.env.BASE_URL}/events/${event._id}` }, // Replace with actual redirect URL
    };

    // Make the Tap API request
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
// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email provider
  auth: {
    user: process.env.EMAIL_USER, // Use email user from .env
    pass: process.env.EMAIL_PASS, // Use email password from .env // Your email password or app password
  },
});

router.get('/payment/callback', async (req, res) => {
  const { tap_id } = req.query;

  if (!tap_id) {
    logger.error('Missing tap_id in callback request');
    return res.status(400).json({
      status: 'failed',
      message: 'Missing tap_id in callback request',
    });
  }

  try {
    // Check if the ticket with the same tap_id already exists
    const existingTicket = await Ticket.findOne({ tapId: tap_id });
    if (existingTicket) {
      logger.info('Ticket already exists for this tap_id');
      return res.status(200).json({
        status: 'success',
        message: 'Payment already verified and ticket issued.',
        ticket: existingTicket,
      });
    }

    // Fetch payment details from Tap Payments
    const response = await axios.get(`https://api.tap.company/v2/charges/${tap_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const chargeDetails = response.data;

    // Check payment status
    if (chargeDetails.status !== 'CAPTURED') {
      logger.warn(`Payment failed or not completed. Reason: ${chargeDetails.response?.message || 'Unknown'}`);
      return res.status(400).json({
        status: 'failed',
        message: chargeDetails.response?.message || 'Payment failed or not completed',
      });
    }

    const { eventId, userId } = chargeDetails.metadata || {};

    if (!eventId || !userId) {
      logger.error('Missing metadata in Tap API response');
      return res.status(400).json({
        status: 'failed',
        message: 'Missing eventId or userId in payment metadata',
      });
    }

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event) {
      logger.error('Event not found');
      return res.status(404).json({ status: 'failed', message: 'Event not found' });
    }
    if (!user) {
      logger.error('User not found');
      return res.status(404).json({ status: 'failed', message: 'User not found' });
    }

    // Generate QR Code
    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    let qrCodeBase64;
    try {
      qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
    } catch (qrError) {
      logger.error(`Error generating QR Code: ${qrError.message}`);
      return res.status(500).json({
        status: 'failed',
        message: 'Error generating QR Code',
      });
    }

    // Upload QR code to Cloudinary
    let cloudinaryUpload;
    try {
      cloudinaryUpload = await cloudinary.uploader.upload(qrCodeBase64, {
        folder: 'tickets',
        public_id: `ticket_${user._id}_${event._id}`,
        overwrite: true,
      });
    } catch (uploadError) {
      logger.error(`Error uploading QR Code to Cloudinary: ${uploadError.message}`);
      return res.status(500).json({
        status: 'failed',
        message: 'Error uploading QR Code to Cloudinary',
      });
    }

    const qrCodeCloudinaryUrl = cloudinaryUpload.secure_url;

    // Create and save the ticket with tapId
    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeData,
      QRCodeImage: qrCodeCloudinaryUrl,
      tapId: tap_id, // Save tapId to ensure uniqueness
    });

    const savedTicket = await newTicket.save();

    // Create and save the purchase record
    const newPurchase = new Purchase({
      userId: user._id,
      ticketId: savedTicket._id,
      eventId: event._id,
      amount: event.price,
      currency: event.currency,
      paid: true,
    });

    await newPurchase.save();

    // Send confirmation email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
          <div style="background-color: #aa336a; color: #fff; padding: 20px; text-align: center;">
            <h1>Your Ticket for ${event.name}</h1>
          </div>
          <div style="padding: 20px;">
            <p>Thank you for your purchase! Here are your ticket details:</p>
            <ul>
              <li><strong>Event:</strong> ${event.name}</li>
              <li><strong>Date:</strong> ${new Date(event.dateOfEvent).toLocaleDateString()}</li>
              <li><strong>Price:</strong> ${event.price} ${event.currency}</li>
              <li><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            <p>Scan the QR code below at the event entrance:</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCodeCloudinaryUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
            </div>
            <p>We look forward to seeing you at the event!</p>
          </div>
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
            <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #aa336a;">${process.env.EMAIL_USER}</a></p>
          </div>
        </div>
      </div>
    `;


    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Your Ticket for ${event.name}`,
      html: emailContent,
    });

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Payment approved and ticket issued successfully.',
      ticket: {
        QRCodeImage: qrCodeCloudinaryUrl,
        details: savedTicket,
      },
    });
  } catch (error) {
    if (error.response?.status === 429) {
      logger.error('Rate limit exceeded: Too many requests to Tap Payments API.');
      return res.status(429).json({
        status: 'failed',
        message: 'Rate limit exceeded. Please try again later.',
      });
    }

    logger.error(`Error processing payment callback: ${error.message}`);
    return res.status(500).json({
      status: 'failed',
      message: 'Error processing payment callback',
      error: error.message,
    });
  }
});

router.post('/purchase/free', authenticateToken, async (req, res) => {
  const { eventId } = req.body;

  try {
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the event is free
    if (event.price > 0) {
      return res.status(400).json({ message: 'This endpoint is only for free events' });
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

    // Generate QR Code data
    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    let qrCodeBase64;
    try {
      qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
    } catch (qrError) {
      logger.error(`Error generating QR Code: ${qrError.message}`);
      return res.status(500).json({ message: 'Error generating QR Code' });
    }

    // Upload QR code to Cloudinary
    let cloudinaryUpload;
    try {
      cloudinaryUpload = await cloudinary.uploader.upload(qrCodeBase64, {
        folder: 'tickets',
        public_id: `free_ticket_${user._id}_${event._id}`,
        overwrite: true,
      });
    } catch (uploadError) {
      logger.error(`Error uploading QR Code to Cloudinary: ${uploadError.message}`);
      return res.status(500).json({ message: 'Error uploading QR Code to Cloudinary' });
    }

    const qrCodeCloudinaryUrl = cloudinaryUpload.secure_url;

    // Create and save the ticket
    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeData,
      QRCodeImage: qrCodeCloudinaryUrl,
    });

    const savedTicket = await newTicket.save();

    // Create and save the purchase record
    const newPurchase = new Purchase({
      userId: user._id,
      ticketId: savedTicket._id,
      eventId: event._id,
      amount: 0, // Free event
      currency: event.currency,
      paid: true,
    });

    await newPurchase.save();

    // Send confirmation email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
          <div style="background-color: #aa336a; color: #fff; padding: 20px; text-align: center;">
            <h1>Your Ticket for ${event.name}</h1>
          </div>
          <div style="padding: 20px;">
            <p>Thank you for reserving your free ticket! Here are your ticket details:</p>
            <ul>
              <li><strong>Event:</strong> ${event.name}</li>
              <li><strong>Date:</strong> ${new Date(event.dateOfEvent).toLocaleDateString()}</li>
              <li><strong>Price:</strong> Free</li>
              <li><strong>Reservation Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            <p>Scan the QR code below at the event entrance:</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${qrCodeCloudinaryUrl}" alt="QR Code" style="width: 200px; height: 200px;" />
            </div>
            <p>We look forward to seeing you at the event!</p>
          </div>
          <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
            <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #aa336a;">${process.env.EMAIL_USER}</a></p>
          </div>
        </div>
      </div>
    `;

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Your Ticket for ${event.name}`,
      html: emailContent,
    });

    // Return success response
    return res.status(200).json({
      message: 'Ticket reserved successfully.',
      ticket: {
        QRCodeImage: qrCodeCloudinaryUrl,
        details: savedTicket,
      },
    });
  } catch (error) {
    logger.error(`Error reserving free ticket: ${error.message}`);
    return res.status(500).json({ message: 'Error reserving free ticket', error: error.message });
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

// Fetch All Tickets api/Tickets/alphantom
router.get('/ALphantom/', async (req, res) => {
  try {
    const { email, eventId, used } = req.query;

    let query = {};

    // Filter by user email
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      query.buyerId = user._id;
    }

    // Filter by event ID
    if (eventId) {
      query.eventId = eventId;
    }

    // Filter by usage status
    if (used === 'true') {
      query.used = true;
    } else if (used === 'false') {
      query.used = false;
    }

    const tickets = await Ticket.find(query)
      .populate('eventId', 'name dateOfEvent')
      .populate('buyerId', 'fullName email');

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets.', error: error.message });
  }
});
// Fetch All Tickets
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { email, eventId, used } = req.query;

    let query = {};

    // Filter by user email
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      query.buyerId = user._id;
    }

    // Filter by event ID
    if (eventId) {
      query.eventId = eventId;
    }

    // Filter by usage status
    if (used === 'true') {
      query.used = true;
    } else if (used === 'false') {
      query.used = false;
    }

    const tickets = await Ticket.find(query)
      .populate('eventId', 'name dateOfEvent')
      .populate('buyerId', 'fullName email');

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets.', error: error.message });
  }
});


// Get Tickets by Event ID
router.get('/event/:eventId', authenticateToken, authorizeAdmin, async (req, res) => {
  const { eventId } = req.params;

  try {
    const tickets = await Ticket.find({ eventId })
      .populate('buyerId', 'fullName email')
      .populate('eventId', 'name dateOfEvent');

    if (!tickets.length) {
      return res.status(404).json({ message: 'No tickets found for this event.' });
    }

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets by event ID:', error);
    res.status(500).json({ message: 'Error fetching tickets by event ID.', error: error.message });
  }
});


module.exports = router;