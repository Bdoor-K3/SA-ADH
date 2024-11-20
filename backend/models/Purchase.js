const mongoose = require('mongoose');

// Define valid GCC currencies
const validGCCCurrencies = ['SAR', 'KWD', 'AED', 'OMR', 'BHD', 'QAR']; // Saudi Riyal, Kuwaiti Dinar, UAE Dirham, Omani Rial, Bahraini Dinar, Qatari Riyal

const purchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true }, // Reference to the ticket
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // Reference to the event
    purchaseDate: { type: Date, default: Date.now }, // Date of purchase
    amount: { type: Number, required: true }, // Total amount paid
    currency: {
      type: String,
      required: true,
      enum: validGCCCurrencies, // Restrict to GCC currencies
      validate: {
        validator: function (value) {
          return validGCCCurrencies.includes(value); // Custom validation (optional redundancy)
        },
        message: (props) => `${props.value} is not a valid GCC currency. Allowed currencies: ${validGCCCurrencies.join(', ')}.`,
      },
    },
    paid: { type: Boolean, default: true }, // Whether the ticket was paid for
    used: { type: Boolean, default: false }, // Whether the ticket has been used
    useDate: { type: Date }, // Date when the ticket was used
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
