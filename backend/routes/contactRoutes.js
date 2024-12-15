const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact'); // Adjust the path if necessary
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// POST: Add a new contact message
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check for cooldown (email or phone number already submitted within the last 30 minutes)
    const cooldownTime = Date.now() - 30 * 60 * 1000;
    const existingContact = await Contact.findOne({
      $or: [{ email }, { phone }],
      createdAt: { $gte: new Date(cooldownTime) },
    });

    if (existingContact) {
      return res.status(429).json({ message: 'You can only submit once every 30 minutes.' });
    }

    // Create and save new contact message
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Send acknowledgment email
    const transporter = nodemailer.createTransport({
      host: 'mail.happiness.sa', // Replace with your SMTP provider's host
      port: 465, // Adjust based on your provider (587 for TLS, 465 for SSL)
      secure: true, // Use true for SSL
      auth: {
        user: process.env.EMAIL_USER1_Contact, // Your email
        pass: process.env.EMAIL_PASS1_Contact, // Your email password
      },
    });

    const emailSubject = 'Thank you for contacting us!';
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #ff79c1; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">${emailSubject}</h1>
          </div>
          <div style="padding: 20px; text-align: left;">
            <p>Dear ${name},</p>
            <p>We have received your message and will contact you as soon as possible. Below is a copy of your message:</p>
            <blockquote style="background: #f9f9f9; border-left: 4px solid #ff79c1; padding: 10px; margin: 20px 0;">
              <strong>Message:</strong> ${message}
            </blockquote>
            <p>Thank you for reaching out to us!</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="text-align: right; direction: rtl;">
              عزيزي ${name}، <br>
              لقد تلقينا رسالتك وسنتواصل معك في أقرب وقت ممكن. فيما يلي نسخة من رسالتك:
            </p>
            <blockquote style="background: #f9f9f9; border-right: 4px solid #ff79c1; padding: 10px; direction: rtl;">
              <strong>الرسالة:</strong> ${message}
            </blockquote>
            <p style="text-align: right; direction: rtl;">شكرًا لتواصلك معنا!</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 20px; text-align: center;">
            <p>If you have any further questions, feel free to reply to this email.</p>
            <p>إذا كانت لديك أي استفسارات إضافية، فلا تتردد في الرد على هذا البريد الإلكتروني.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Saada Support" <${process.env.EMAIL_USER1_Contact}>`, // Sender's email
      to: email, // Recipient's email
      subject: emailSubject,
      html: emailContent,
    });

    res.status(201).json({ message: 'Your message has been received. Thank you!' });
  } catch (error) {
    console.error('Error saving contact message or sending email:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// GET: Retrieve all contact messages (Admin only)
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
// DELETE: Delete a contact message by ID (Admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      const contact = await Contact.findByIdAndDelete(id); // Use findByIdAndDelete
      if (!contact) {
        return res.status(404).json({ message: 'Contact message not found.' });
      }
  
      res.status(200).json({ message: 'Contact message deleted successfully.' });
    } catch (error) {
      console.error('Error deleting contact message:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

module.exports = router;
