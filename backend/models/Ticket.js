const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    QRCode: { type: String, required: true }, // Raw QR code data for validation
    QRCodeImage: { type: String }, // Base64 image (optional for UI)
    used: { type: Boolean, default: false },
    useDate: { type: Date },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
