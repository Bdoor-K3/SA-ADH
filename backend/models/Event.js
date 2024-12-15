const mongoose = require('mongoose');

const ticketClassSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Name of the ticket type (e.g., VIP, Standard)
  price: { type: Number, required: true },    // Price of the ticket
  quantity: { type: Number, required: true }, // Total quantity of tickets for this class
  sold: { type: Number, default: 0 },         // Tickets sold for this class
});

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dateOfEvent: { type: Date, required: true },
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    tickets: [ticketClassSchema], // Array of ticket classes
    currency: {
      type: String,
      enum: ['SAR', 'KWD', 'AED', 'BHD', 'OMR', 'QAR'],
      default: 'SAR',
      required: true,
    },
    purchaseStartDate: { type: Date, required: true },
    purchaseEndDate: { type: Date, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bannerImage: { type: String },
    mainImage: { type: String },
    eventListImage: { type: String },
    isAlphantom: { type: Boolean, default: false },
    hide: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
