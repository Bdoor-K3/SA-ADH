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

const upload = multer({ storage }).fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'mainImage', maxCount: 1 },
  { name: 'eventListImage', maxCount: 1 },
]);

router.post('/', authenticateToken, authorizeAdmin, upload, async (req, res) => {
  try {
    const {
      name,
      description,
      dateOfEvent,
      timeStart,
      timeEnd,
      tickets, // New tickets field
      currency,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category,
      location,
      city,
      isAlphantom,
      hide,
    } = req.body;

    const parsedTickets = JSON.parse(tickets); // Parse tickets array from JSON string

    const newEvent = new Event({
      name,
      description,
      dateOfEvent,
      timeStart,
      timeEnd,
      tickets: parsedTickets, // Add tickets to event schema
      currency,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category: category || 'General',
      location,
      city,
      bannerImage: req.files['bannerImage'] ? req.files['bannerImage'][0].path : null,
      mainImage: req.files['mainImage'] ? req.files['mainImage'][0].path : null,
      eventListImage: req.files['eventListImage'] ? req.files['eventListImage'][0].path : null,
      isAlphantom: isAlphantom === 'true',
      hide: hide === 'true',
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', authenticateToken, authorizeAdmin, upload, async (req, res) => {
  try {
    const {
      name,
      description,
      dateOfEvent,
      timeStart,
      timeEnd,
      tickets, // New tickets field
      currency,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category,
      location,
      city,
      isAlphantom,
      hide,
    } = req.body;

    const updateFields = {
      name,
      description,
      dateOfEvent,
      timeStart,
      timeEnd,
      tickets: tickets ? JSON.parse(tickets) : undefined, // Parse tickets if provided
      currency,
      purchaseStartDate,
      purchaseEndDate,
      organizers,
      category: category || 'General',
      location,
      city,
      isAlphantom: isAlphantom === 'true',
      hide: hide === 'true',
    };

    if (req.files['bannerImage']) {
      updateFields.bannerImage = req.files['bannerImage'][0].path;
    }
    if (req.files['mainImage']) {
      updateFields.mainImage = req.files['mainImage'][0].path;
    }
    if (req.files['eventListImage']) {
      updateFields.eventListImage = req.files['eventListImage'][0].path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: error.message });
  }
});



// Get All Events backend.happiness.sa/api/events/
router.get('/admin/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { showHidden } = req.query;

    const filter = {};
    if (showHidden !== 'true') {
      filter.hide = false; // Only show visible events by default
    }

    const events = await Event.find(filter);
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

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event with images uploaded to Cloudinary. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               dateOfEvent:
 *                 type: string
 *                 format: date
 *               timeStart:
 *                 type: string
 *               timeEnd:
 *                 type: string
 *               tickets:
 *                 type: string
 *                 description: JSON string representing tickets data.
 *               currency:
 *                 type: string
 *               purchaseStartDate:
 *                 type: string
 *                 format: date
 *               purchaseEndDate:
 *                 type: string
 *                 format: date
 *               organizers:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *               mainImage:
 *                 type: string
 *                 format: binary
 *               eventListImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     description: Update event details and images. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               dateOfEvent:
 *                 type: string
 *                 format: date
 *               timeStart:
 *                 type: string
 *               timeEnd:
 *                 type: string
 *               tickets:
 *                 type: string
 *               currency:
 *                 type: string
 *               purchaseStartDate:
 *                 type: string
 *               purchaseEndDate:
 *                 type: string
 *               organizers:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               city:
 *                 type: string
 *               bannerImage:
 *                 type: string
 *                 format: binary
 *               mainImage:
 *                 type: string
 *                 format: binary
 *               eventListImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events/admin/:
 *   get:
 *     summary: Retrieve all events (Admin only)
 *     description: Fetch all events in the database. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all events.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve visible events
 *     description: Fetch all visible events unless `showHidden=true` is specified in the query.
 *     parameters:
 *       - in: query
 *         name: showHidden
 *         schema:
 *           type: boolean
 *         description: Set to true to include hidden events.
 *     responses:
 *       200:
 *         description: List of events.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Retrieve an event by ID
 *     description: Fetch details of an event by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by its ID. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/events/organizer/events:
 *   get:
 *     summary: Retrieve events assigned to the organizer
 *     description: Fetch events that are assigned to the authenticated organizer.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of events assigned to the organizer.
 *       500:
 *         description: Error fetching events.
 */
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Retrieve event details with tickets
 *     description: Fetch event details and its associated tickets.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details with tickets.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */

module.exports = router;
