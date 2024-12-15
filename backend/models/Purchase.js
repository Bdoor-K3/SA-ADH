const mongoose = require('mongoose');

// Define valid GCC currencies
const validGCCCurrencies = ['SAR', 'KWD', 'AED', 'OMR', 'BHD', 'QAR'];

// Ticket Detail Schema for embedded ticket details
const ticketDetailsSchema = new mongoose.Schema({
  ticketClass: { type: String, required: true },
  ticketId: {type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  QRCodeImage: { type: String },
});
const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    tickets: [ticketDetailsSchema], // Array of ticket details
    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }], // Array of event references
    purchaseDate: { type: Date, default: Date.now }, // Date of purchase
    amount: { type: Number, required: true }, // Total amount for the purchase
    currency: {
      type: String,
      required: true,
      enum: validGCCCurrencies, // Restrict to GCC currencies
      validate: {
        validator: function (value) {
          return validGCCCurrencies.includes(value);
        },
        message: (props) => `${props.value} is not a valid GCC currency. Allowed currencies: ${validGCCCurrencies.join(', ')}.`,
      },
    },
    paid: { type: Boolean, default: false }, // Whether the purchase is paid
    tapId: { type: String, default: null }, // Tap payment ID for tracking the transaction
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
