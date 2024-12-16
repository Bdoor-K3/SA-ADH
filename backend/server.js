const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Swagger Configuration
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'API Documentation', version: '1.0.0' },
      servers: [{ url: 'http://localhost:5001' }],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      }
      ,
    },
    apis: ['./routes/*.js'], // Path to your route files
  };
  


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events.
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get all logs
 *     description: Retrieve a list of all logs for diagnostics.
 *     responses:
 *       200:
 *         description: A list of logs.
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieve a list of all tickets.
 *     responses:
 *       200:
 *         description: A list of tickets.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users.
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticate a user and retrieve a token.
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *       401:
 *         description: Authentication failed.
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     description: Submit a contact form for inquiries.
 *     responses:
 *       200:
 *         description: Contact form submitted successfully.
 */

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

// Start Server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
