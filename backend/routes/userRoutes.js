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

        return { ...user._doc }; // Attach purchaseHistory dynamically
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
      .populate('tickets') // Populate ticket details
      .populate('eventId'); // Populate event details

    res.status(200).json({ user, purchaseHistory: purchases });
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    let updateFields = { ...rest };

    // Skip password update if it's empty
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User Not Found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ message: 'Error updating user.', error: error.message });
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
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchases = await Purchase.find({ userId: user._id })
      .populate({ path: 'eventIds', model: 'Event' }) // Populate `eventIds`
      .populate({ path: 'tickets', model: 'Ticket' }) // Populate `tickets`
      .exec();

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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users.
 *       401:
 *         description: Unauthorized - Admin access required.
 *       500:
 *         description: Error fetching users.
 */

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     description: Retrieve a user and their purchase history by email. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to retrieve.
 *     responses:
 *       200:
 *         description: User details with purchase history.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error fetching user by email.
 */
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update user information, including the password if provided.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update.
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
 *               password:
 *                 type: string
 *                 description: Leave empty to skip password update.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error updating user.
 */
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error deleting user.
 */
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile and purchase history of the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile and purchase history.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error fetching user profile.
 */
/**
 * @swagger
 * /api/users/organizers:
 *   get:
 *     summary: Get all organizers
 *     description: Retrieve a list of all users with the 'organizer' role. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all organizers.
 *       500:
 *         description: Error fetching organizers.
 */

module.exports = router;
