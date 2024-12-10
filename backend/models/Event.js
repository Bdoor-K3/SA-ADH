const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dateOfEvent: { type: Date, required: true },
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    price: { type: Number, required: true },
    currency: {
      type: String,
      enum: ['SAR', 'KWD', 'AED', 'BHD', 'OMR', 'QAR'],
      default: 'SAR',
      required: true,
    },
    ticketsAvailable: { type: Number, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
