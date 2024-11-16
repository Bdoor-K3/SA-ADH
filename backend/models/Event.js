const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dateOfEvent: { type: Date, required: true },
    price: { type: Number, required: true },
    ticketsAvailable: { type: Number, required: true },
    purchaseStartDate: { type: Date, required: true },
    purchaseEndDate: { type: Date, required: true },
    organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Organizer IDs
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
