const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // References Event
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References User
    purchaseDate: { type: Date, default: Date.now },
    used: { type: Boolean, default: false },
    useDate: { type: Date },
    QRCode: { type: String, unique: true }, // Ensure QRCode is unique
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
