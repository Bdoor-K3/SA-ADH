const express = require('express');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Purchase = require('../models/Purchase');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');


const router = express.Router();

// Get All Users
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users without purchaseHistory

    // Fetch purchases for each user and attach them
    const usersWithPurchases = await Promise.all(
      users.map(async (user) => {
        const purchases = await Purchase.find({ userId: user._id })
          .populate('ticketId') // Populate ticket details
          .populate('eventId'); // Populate event details

        return { ...user._doc, purchaseHistory: purchases }; // Attach purchaseHistory dynamically
      })
    );

    res.status(200).json(usersWithPurchases);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get User by Email
router.get('/email/:email', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the user's purchases
    const purchases = await Purchase.find({ userId: user._id })
      .populate('ticketId') // Populate ticket details
      .populate('eventId'); // Populate event details

    res.status(200).json({ user, purchaseHistory: purchases });
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    res.status(500).json({ message: error.message });
  }
});


// Update User
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { password, ...rest } = req.body; // Extract the password and other fields

    let updateFields = { ...rest };

    // If the password is being updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User Not Found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete User
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User Not Found' });
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch purchases for the user
    const purchases = await Purchase.find({ userId: user._id })
      .populate('ticketId')
      .populate('eventId');

    res.status(200).json({ user, purchaseHistory: purchases });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});


// Get All Organizers
router.get('/organizers', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Fetch organizers with selected fields
    const organizers = await User.find({ role: 'organizer' }).select('_id fullName email');
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizers', error: error.message });
  }
});

module.exports = router;
