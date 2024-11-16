const express = require('express');
const Log = require('../models/Log');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Create Log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const log = new Log(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Logs
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const logs = await Log.find().populate('userId');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Logs for a Specific User
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
