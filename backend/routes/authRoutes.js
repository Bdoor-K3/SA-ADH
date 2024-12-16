const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer'); // For sending emails
const router = express.Router();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with fullName, email, phoneNumber, countryCode, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: All required fields must be provided or user already exists.
 *       500:
 *         description: Error registering user.
 */

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, countryCode, password } = req.body;

  // Validate required fields
  if (!fullName || !email || !phoneNumber || !countryCode || !password) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      countryCode,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with email and password, and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Email and password are required.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Error logging in.
 */

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
});


// Forget and reset Password 

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'mail.happiness.sa', // SMTP Host from Plesk
  port: 465, // For SSL
  secure: true, // True for SSL
  auth: {
    user: process.env.EMAIL_USER1_Contact, // Your email
    pass: process.env.EMAIL_PASS1_Contact, // Your email password or app password
  },
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     description: Send a password reset email to the provided user email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to your email.
 *       400:
 *         description: Email is required.
 *       404:
 *         description: User with this email does not exist.
 *       500:
 *         description: Error sending password reset email.
 */

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    user.resetToken = token;
    user.resetTokenUsed = false;
    user.resetTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

    const resetLinkContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <!-- Header Section -->
      <div style="background-color: #aa336a; color: #fff; padding: 20px; text-align: center;">
        <h1>Password Reset Request</h1>
      </div>
      
      <!-- Body Section -->
      <div style="padding: 20px;">
        <!-- English Content -->
        <div style="text-align: left; margin-bottom: 20px;">
          <p>Hello,</p>
          <p>You have requested a password reset. Please click the link below to reset your password:</p>
          <p><a href="${resetLink}" style="color: #aa336a; font-weight: bold;">Reset Password</a></p>
          <p>This link will expire in 24 hours.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <!-- Arabic Content -->
        <div style="text-align: right; direction: rtl;">
          <p>مرحبًا،</p>
          <p>لقد طلبت إعادة تعيين كلمة المرور. يرجى النقر على الرابط أدناه لإعادة تعيين كلمة المرور الخاصة بك:</p>
          <p><a href="${resetLink}" style="color: #aa336a; font-weight: bold;">إعادة تعيين كلمة المرور</a></p>
          <p>سينتهي صلاحية هذا الرابط خلال 24 ساعة.</p>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
        <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #aa336a;">${process.env.EMAIL_USER}</a>.</p>
        <p>إذا كان لديك أي استفسارات، يرجى الاتصال بنا عبر البريد الإلكتروني: <a href="mailto:${process.env.EMAIL_USER}" style="color: #aa336a;">${process.env.EMAIL_USER}</a>.</p>
      </div>
    </div>
  `;
  


    await transporter.sendMail({
      from: process.env.EMAIL_USER1_Contact,
      to: email,
      subject: 'Password Reset Request',
      html: resetLinkContent, // Use the updated email content here
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Error sending password reset email.', error: error.message });
  }
});


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user's password using a valid reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful.
 *       400:
 *         description: Reset token is required or password is invalid.
 *       404:
 *         description: Invalid or expired reset token.
 *       500:
 *         description: Error resetting password.
 */
// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Reset token is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password is required and must be at least 6 characters.' });
  }

  try {
    // Find the user with the given reset token
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token.' });
    }

    // Check if the token has already been used
    if (user.resetTokenUsed) {
      return res.status(400).json({ message: 'This reset link has already been used.' });
    }

    // Check if the token is expired
    if (user.resetTokenExpires && user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset token has expired.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and mark the token as used
    user.password = hashedPassword;
    user.resetTokenUsed = true;
    user.resetToken = null; // Clear the token after use
    user.resetTokenExpires = null; // Clear expiration date
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password.', error: error.message });
  }
});



module.exports = router;
