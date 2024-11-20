const express = require('express');
const QRCode = require('qrcode'); // Import the QR code library
const axios = require('axios'); // For API calls to Tap Payments
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Assuming a Purchase model exists
const { authenticateToken } = require('../middleware/auth');
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

  try {
    const response = await axios.get(`${TAP_API_BASE_URL}/${tap_id}`, {
      headers: {
        Authorization: `Bearer ${TAP_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const chargeDetails = response.data;

    if (chargeDetails.status !== 'CAPTURED') {
      logger.warn('Payment failed or not completed.');
      return res.status(400).json({ message: 'Payment failed or not completed' });
    }

    const { eventId, userId } = chargeDetails.metadata;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      logger.error('Event or User not found.');
      return res.status(404).json({ message: 'Event or User not found.' });
    }

    // Generate QR code for the ticket
    const qrCodeData = `${user._id}|${event._id}|${new Date().toISOString()}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Create a new ticket
    const newTicket = new Ticket({
      eventId: event._id,
      buyerId: user._id,
      QRCode: qrCodeData,
      QRCodeImage: qrCodeImage,
    });

    const savedTicket = await newTicket.save();

    // Create a new purchase record
    const newPurchase = new Purchase({
      userId: user._id,
      ticketId: savedTicket._id,
      eventId: event._id,
      amount: event.price,
      currency: event.currency,
      paid: true,
    });

    const savedPurchase = await newPurchase.save();
    const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #aa336a; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Your Ticket for ${event.name}</h1>
          <h1 style="margin: 0; font-size: 24px;">تذكرتك لـ ${event.name}</h1>
        </div>
    
        <!-- Body -->
        <div style="padding: 20px;">
          <!-- English Section -->
          <div>
            <h2 style="font-size: 18px;">Thank you for your purchase!</h2>
            <p style="font-size: 16px;">Here are your ticket details:</p>
            <ul style="padding: 0; list-style: none; margin: 0;">
              <li style="margin: 10px 0; font-size: 16px;"><strong>Event:</strong> ${event.name}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>Date:</strong> ${new Date(event.dateOfEvent).toLocaleDateString()}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>Price:</strong> ${event.price} ${event.currency}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            <p style="margin: 20px 0; font-size: 16px;">Please scan the QR code below at the event entrance:</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${savedTicket.QRCodeImage}" alt="QR Code" style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 5px;" />
            </div>
            <p style="margin: 20px 0; font-size: 16px;">We look forward to seeing you at the event!</p>
          </div>

          <!-- Arabic Section -->
          <div style="direction: rtl; text-align: right; margin-top: 30px;">
            <h2 style="font-size: 18px;">شكراً لشرائك!</h2>
            <p style="font-size: 16px;">فيما يلي تفاصيل تذكرتك:</p>
            <ul style="padding: 0; list-style: none; margin: 0;">
              <li style="margin: 10px 0; font-size: 16px;"><strong>الفعالية:</strong> ${event.name}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>التاريخ:</strong> ${new Date(event.dateOfEvent).toLocaleDateString()}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>السعر:</strong> ${event.price} ${event.currency}</li>
              <li style="margin: 10px 0; font-size: 16px;"><strong>تاريخ الشراء:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
            <p style="margin: 20px 0; font-size: 16px;">يرجى مسح رمز الاستجابة السريعة أدناه عند مدخل الفعالية:</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${savedTicket.QRCodeImage}" alt="رمز الاستجابة السريعة" style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 5px;" />
            </div>
            <p style="margin: 20px 0; font-size: 16px;">نتطلع لرؤيتك في الفعالية!</p>
          </div>
        </div>
    
        <!-- Footer -->
        <div style="background-color: #f8f8f8; color: #666; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0; font-size: 14px;">If you have any questions, please contact us at <a href="mailto:val1ion@gmail.com" style="color: #aa336a; text-decoration: none;">val1ion@gmail.com</a>.</p>
          <p style="margin: 0; font-size: 14px;">إذا كانت لديك أي أسئلة، يرجى التواصل معنا على <a href="mailto:val1ion@gmail.com" style="color: #aa336a; text-decoration: none;">val1ion@gmail.com</a>.</p>
          <p style="margin: 10px 0 0; font-size: 14px;">&copy; ${new Date().getFullYear()} Event Ticketing</p>
        </div>
      </div>
    </div>
    `;  
    // Send the QR code to the user's email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: `Your Ticket for ${event.name}`,
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error sending email: ${err.message}`);
      } else {
        logger.info(`Email sent: ${info.response}`);
      }
    });

    res.status(200).json({ ticket: savedTicket });
  } catch (error) {
    logger.error(`Error processing payment callback: ${error.message}`);
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
