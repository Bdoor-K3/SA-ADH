const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dateOfEvent: { type: Date, required: true },
    price: { type: Number, required: true },
    currency: { 
      type: String, 
      enum: ['SAR', 'KWD', 'AED', 'BHD', 'OMR', 'QAR'], // GCC Currencies
      default: 'SAR',
      required: true 
    },
    ticketsAvailable: { type: Number, required: true },
    purchaseStartDate: { type: Date, required: true },
    purchaseEndDate: { type: Date, required: true },
    organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
