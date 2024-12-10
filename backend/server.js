const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Routes
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

// Start Server
const PORT =   5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
