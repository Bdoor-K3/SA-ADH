const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary'); // Cloudinary configuration
const Event = require('../models/Event');
const { authenticateToken, authorizeAdmin, authorizeOrganizer } = require('../middleware/auth');
const router = express.Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'events', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png' ,'svg'], // Allowed image formats
  },
});

const upload = multer({ storage });
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      dateOfEvent,
      price,
      currency,
      ticketsAvailable,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category,
      location,
      city,
      isAlphantom, // Include this in the request body
    } = req.body;

    const newEvent = new Event({
      name,
      description,
      dateOfEvent,
      price,
      currency,
      ticketsAvailable,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category: category || 'General',
      location,
      city,
      image: req.file ? req.file.path : null,
      isAlphantom: isAlphantom === 'true', // Convert string to boolean
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      dateOfEvent,
      price,
      currency,
      ticketsAvailable,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category,
      location,
      city,
      isAlphantom, // Include this in the request body
    } = req.body;

    const updateFields = {
      name,
      description,
      dateOfEvent,
      price,
      currency,
      ticketsAvailable,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category: category || 'General',
      location,
      city,
      isAlphantom: isAlphantom === 'true', // Convert string to boolean
    };

    if (req.file) {
      updateFields.image = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Events backend.happiness.sa/api/events/
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get Event with Tickets
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const tickets = await Ticket.find({ eventId: event._id }).populate('buyerId');
    res.status(200).json({ event, tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Delete Event
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get Events Assigned to Organizer
router.get('/organizer/events', authenticateToken, authorizeOrganizer, async (req, res) => {
  try {
    const events = await Event.find({ organizers: req.user.userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events for organizer', error: error.message });
  }
});


module.exports = router;
