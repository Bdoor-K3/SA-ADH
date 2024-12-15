const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    QRCode: { type: String, required: true },
    ticketClass: { type: String, required: true },
    QRCodeImage: { type: String },
    used: { type: Boolean, default: false },
    useDate: { type: Date },
    purchaseDate: { type: Date, default: Date.now },
    tapId: { type: String, unique: false }, // New field to track Tap Payment ID
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
