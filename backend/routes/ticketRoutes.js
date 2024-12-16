const express = require("express");
const QRCode = require("qrcode"); // Import the QR code library
const axios = require("axios"); // For API calls to Tap Payments
const cloudinary = require("../cloudinary"); // Cloudinary configuration
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const Purchase = require("../models/Purchase"); // Assuming a Purchase model exists
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const winston = require("winston");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Import and configure dotenv

const router = express.Router();

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/ticketing.log" }),
  ],
});

// Tap Payments Configuration

// Fetch tickets by event ID and optionally filter by email or phoneNumber number for ORganizer page
router.get("/", async (req, res) => {
  try {
    const { eventId, email, phoneNumber } = req.query;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required." });
    }

    const query = { eventId };

    if (email || phoneNumber) {
      const buyerFilter = {};
      if (email) buyerFilter.email = email;
      if (phoneNumber) buyerFilter.phoneNumber = phoneNumber;

      const buyers = await User.find(buyerFilter).select("_id");
      query.buyerId = { $in: buyers.map((user) => user._id) };
    }

    const tickets = await Ticket.find(query).populate(
      "buyerId",
      "email phoneNumber fullName"
    );
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets." });
  }
});
// Mark ticket as used
router.put("/:id/use", async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Populate ticket with buyer and event details
    const ticket = await Ticket.findById(ticketId)
      .populate("eventId")
      .populate("buyerId");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    if (ticket.used) {
      return res.status(400).json({ message: "Ticket has already been used." });
    }

    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();

    // Check if the event is from Alphantom
    if (ticket.eventId.isAlphantom) {
      // Ensure eventName and buyerEmail are properly fetched
      const eventName = ticket.eventId.name;
      const buyerEmail = ticket.buyerId.email;

      if (!eventName || !buyerEmail) {
        console.error(
          "Event name or buyer email missing. Cannot send data to Alphantom API."
        );
      } else {
        const payload = {
          buyerEmail,
          eventName,
        };

        // Log the payload before sending
        console.log(
          "Preparing to send Alphantom API request with payload:",
          payload
        );

        try {
          const response = await axios.post(
            process.env.APP_ALphantom_URL,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Log success response
          console.log(
            "Alphantom API request sent successfully:",
            response.status,
            response.data
          );
        } catch (error) {
          // Log error response with details
          console.error("Error sending data to Alphantom API:", error.message);
          if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
          }
        }
      }
    }

    res
      .status(200)
      .json({ message: "Ticket marked as used successfully.", ticket });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Error updating ticket status." });
  }
});

// Configure Cloudinary
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: "mail.happiness.sa",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper Function: Retry Async Requests
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 5000;
const retryAsync = async (
  fn,
  retriesLeft = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
) => {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retriesLeft > 0) {
      const retryAfter = error.response.headers["retry-after"];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return retryAsync(fn, retriesLeft - 1, delay * 2);
    } else if (retriesLeft <= 1) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryAsync(fn, retriesLeft - 1, delay);
  }
};
// Exchange Rate API (Example using ExchangeRate-API or Open Exchange Rates)
const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY; // Add your API key to `.env`
    const url = `https://open.er-api.com/v6/latest/${fromCurrency}`; // ExchangeRate-API endpoint

    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });

    const rates = response.data.rates;
    if (!rates || !rates[toCurrency]) {
      throw new Error(
        `Exchange rate for ${fromCurrency} to ${toCurrency} not found.`
      );
    }

    return rates[toCurrency];
  } catch (error) {
    console.error("Error fetching exchange rate:", error.message);
    throw new Error("Unable to fetch exchange rate.");
  }
};
// Purchase Tickets
router.post("/purchase", authenticateToken, async (req, res) => {
  const { eventIds, tickets } = req.body;

  if (
    !Array.isArray(eventIds) ||
    eventIds.length === 0 ||
    !Array.isArray(tickets) ||
    tickets.length === 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "At least one event ID and one ticket class with quantity are required.",
      });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalAmount = 0;
    const freeTickets = [];
    const paidTickets = [];
    const ticketsToPurchase = [];
    const eventsMap = new Map();
    const currencyCounts = {};

    // Step 1: Gather event information and count currencies
    for (const eventId of eventIds) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res
          .status(404)
          .json({ message: `Event with ID ${eventId} not found.` });
      }

      // Track currency counts
      currencyCounts[event.currency] =
        (currencyCounts[event.currency] || 0) + 1;

      eventsMap.set(eventId, event);
    }

    // Step 2: Determine the main currency
    const mainCurrency = Object.keys(currencyCounts).reduce((a, b) =>
      currencyCounts[a] > currencyCounts[b] ? a : b
    );

    // Step 3: Process tickets and calculate total amount
    for (const { eventId, ticketClass, quantity } of tickets) {
      const event = eventsMap.get(eventId);

      if (!event) {
        return res
          .status(404)
          .json({ message: `Event with ID ${eventId} not found.` });
      }

      const selectedClass = event.tickets.find((t) => t.name === ticketClass);
      if (!selectedClass) {
        return res
          .status(404)
          .json({
            message: `Ticket class '${ticketClass}' not found for event ${event.name}.`,
          });
      }

      if (selectedClass.quantity - selectedClass.sold < quantity) {
        return res.status(400).json({
          message: `Not enough tickets available for class '${ticketClass}' in event '${event.name}'.`,
        });
      }

      selectedClass.sold += quantity;

      // Convert price to main currency if needed
      let ticketPriceInMainCurrency = selectedClass.price;
      if (event.currency !== mainCurrency) {
        const exchangeRate = await getExchangeRate(
          event.currency,
          mainCurrency
        );
        ticketPriceInMainCurrency = selectedClass.price * exchangeRate;
      }

      const ticketData = {
        eventId,
        eventName: event.name,
        ticketClass,
        quantity,
        price: ticketPriceInMainCurrency,
      };

      if (selectedClass.price === 0) {
        freeTickets.push(ticketData);
      } else {
        paidTickets.push(ticketData);
        totalAmount += ticketPriceInMainCurrency * quantity;
      }

      ticketsToPurchase.push(ticketData);
    }

    // Step 4: Prepare payment payload
    const chargePayload = {
      amount: totalAmount.toFixed(2), // Ensure the amount is formatted correctly
      currency: mainCurrency,
      customer_initiated: true,
      threeDSecure: true,
      description: "Purchase tickets for events",
      metadata: {
        eventIds: eventIds.join(","),
        userId: user._id.toString(),
        tickets: JSON.stringify(paidTickets),
        currency: mainCurrency,
      },
      customer: {
        first_name: user.fullName,
        email: user.email,
        phone: { country_code: user.countryCode, number: user.phoneNumber },
      },
      source: { id: "src_all" },
      redirect: { url: `${process.env.BASE_URL}/cart/success` },
    };

    // Step 5: Send payment request to Tap API
    const response = await axios.post(
      "https://api.tap.company/v2/charges",
      chargePayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 6: Respond with success and payment URL
    res.status(200).json({
      status: "success",
      message: "Redirecting to payment gateway. Free tickets issued.",
      freeTickets,
      paymentUrl: response.data.transaction.url,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res
      .status(500)
      .json({
        message: "Error processing ticket purchase",
        error: error.message,
      });
  }
});

// Payment Callback
router.get("/payment/callback", async (req, res) => {
  const { tap_id } = req.query; // Extracting `tap_id` from query

  if (!tap_id) {
    console.error("Callback received without tap_id");
    return res
      .status(400)
      .json({
        status: "failed",
        message: "Missing tap_id in callback request",
      });
  }

  console.log(`Received callback with tap_id: ${tap_id}`); // Debug log for `tap_id`

  try {
    const response = await retryAsync(() =>
      axios.get(`https://api.tap.company/v2/charges/${tap_id}`, {
        headers: { Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` },
      })
    );

    const chargeDetails = response.data;

    if (chargeDetails.status !== "CAPTURED") {
      console.error(`Payment not captured for tap_id: ${tap_id}`);
      return res
        .status(400)
        .json({ status: "failed", message: "Payment not completed." });
    }

    const { metadata } = chargeDetails;
    if (!metadata || !metadata.userId || !metadata.tickets) {
      console.error("Missing required metadata in payment details");
      return res
        .status(400)
        .json({ status: "failed", message: "Missing metadata information." });
    }

    const user = await User.findById(metadata.userId);
    if (!user) {
      console.error(`User not found for userId: ${metadata.userId}`);
      return res
        .status(404)
        .json({ status: "failed", message: "User not found." });
    }

    const ticketsToPurchase = JSON.parse(metadata.tickets || "[]");
    const eventIds = ticketsToPurchase.map((ticket) => ticket.eventId);

    let totalAmount = ticketsToPurchase.reduce(
      (acc, ticket) => acc + ticket.price * ticket.quantity,
      0
    );
    let currency = metadata.currency || "USD";

    // Create or update a new purchase record
    let purchase = await Purchase.findOne({ tapId: tap_id });

    if (!purchase) {
      purchase = new Purchase({
        userId: user._id,
        eventIds,
        amount: totalAmount,
        currency: currency,
        paid: false,
        tapId: tap_id, // Use tap_id directly
        tickets: [], // Placeholder for tickets
      });

      await purchase.save();
    }

    const issuedTickets = [];

    for (const { eventId, ticketClass, quantity, price } of ticketsToPurchase) {
      const event = await Event.findById(eventId);

      if (!event) {
        console.warn(`Event with ID ${eventId} not found.`);
        continue;
      }

      const selectedClass = event.tickets.find((t) => t.name === ticketClass);
      if (
        !selectedClass ||
        selectedClass.quantity - selectedClass.sold < quantity
      ) {
        console.warn(
          `Not enough tickets available for class '${ticketClass}' in event '${event.name}'.`
        );
        continue;
      }

      selectedClass.sold += quantity;

      for (let i = 0; i < quantity; i++) {
        const qrCodeData = `${user._id}|${
          event._id
        }|${ticketClass}|${new Date().toISOString()}`;
        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
        const uploadResponse = await cloudinary.uploader.upload(qrCodeBase64, {
          folder: "tickets",
        });

        const ticket = new Ticket({
          eventId: event._id,
          buyerId: user._id,
          QRCode: qrCodeData,
          QRCodeImage: uploadResponse.secure_url,
          ticketClass,
          used: false,
          tapId: tap_id,
        });

        const savedTicket = await ticket.save();

        const ticketDetails = {
          ticketId: savedTicket._id,
          eventId: savedTicket.eventId,
          ticketClass: savedTicket.ticketClass,
          quantity: 1,
          price: price,
          QRCodeImage: savedTicket.QRCodeImage,
        };

        issuedTickets.push(ticketDetails);
        purchase.tickets.push(ticketDetails); // Add to purchase.tickets
      }

      await event.save();
    }

    // Update purchase with issued tickets and event IDs
    purchase.eventIds = [
      ...new Set([...(purchase.eventIds || []), ...eventIds]),
    ];
    purchase.paid = true;
    await purchase.save();

    console.log("Purchase and tickets synchronized successfully");

    // Send email to user with tickets
    const emailContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #4CAF50;">Thank you for your purchase!</h2>
        <h3>شكراً لشرائك التذاكر!</h3>
        <p>Your tickets for the events have been generated:</p>
        <p>تم إصدار تذاكرك للأحداث:</p>
        <hr>
        ${issuedTickets
          .map(
            (ticket) => `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
              <p><strong>Event ID:</strong> ${ticket.eventId}</p>
              <p><strong>Ticket Class:</strong> ${ticket.ticketClass}</p>
              <p><strong>Price:</strong> ${ticket.price}</p>
              <img src="${ticket.QRCodeImage}" alt="QR Code" style="width: 150px; height: 150px;" />
            </div>
          `
          )
          .join("")}
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your Tickets / تذاكرك",
      html: emailContent,
    });

    res.status(200).json({
      status: "success",
      message: "Payment verified, tickets issued, and email sent successfully.",
      tickets: issuedTickets,
    });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.status(500).json({
      status: "failed",
      message: "Error processing payment callback",
      error: error.message,
    });
  }
});

// Validate Ticket
router.post("/validate", authenticateToken, async (req, res) => {
  const { qrCodeData, eventId } = req.body;

  try {
    logger.info(
      `Validation request received for QRCode: ${qrCodeData}, eventId: ${eventId}`
    );

    // Find the ticket
    const ticket = await Ticket.findOne({ QRCode: qrCodeData, eventId });
    if (!ticket) {
      logger.warn("Invalid ticket. No matching ticket found.");
      return res
        .status(404)
        .json({ message: "Invalid ticket. No matching ticket found." });
    }

    if (ticket.used) {
      logger.warn("Ticket already used.");
      return res.status(400).json({
        message: "This ticket has already been used.",
        useDate: ticket.useDate,
      });
    }

    // Mark the ticket as used
    ticket.used = true;
    ticket.useDate = new Date();
    await ticket.save();

    // Update the purchase record
    const purchase = await Purchase.findOne({ ticketId: ticket._id });
    if (purchase) {
      purchase.used = true;
      purchase.useDate = new Date();
      await purchase.save();
    }

    logger.info("Ticket validated successfully.");
    res.status(200).json({ message: "Ticket validated successfully.", ticket });
  } catch (error) {
    logger.error(`Error validating ticket: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error validating ticket.", error: error.message });
  }
});

// Fetch All Tickets api/Tickets/alphantom
router.get("/ALphantom/", async (req, res) => {
  try {
    const { email, eventId, used } = req.query;

    let query = {};

    // Filter by user email
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      query.buyerId = user._id;
    }

    // Filter by event ID
    if (eventId) {
      query.eventId = eventId;
    }

    // Filter by usage status
    if (used === "true") {
      query.used = true;
    } else if (used === "false") {
      query.used = false;
    }

    const tickets = await Ticket.find(query)
      .populate("eventId", "name dateOfEvent")
      .populate("buyerId", "fullName email");

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res
      .status(500)
      .json({ message: "Error fetching tickets.", error: error.message });
  }
});
// Fetch All Tickets
router.get("/", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { email, eventId, used } = req.query;

    let query = {};

    // Filter by user email
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      query.buyerId = user._id;
    }

    // Filter by event ID
    if (eventId) {
      query.eventId = eventId;
    }

    // Filter by usage status
    if (used === "true") {
      query.used = true;
    } else if (used === "false") {
      query.used = false;
    }

    const tickets = await Ticket.find(query)
      .populate("eventId", "name dateOfEvent")
      .populate("buyerId", "fullName email");

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res
      .status(500)
      .json({ message: "Error fetching tickets.", error: error.message });
  }
});

// Get Tickets by Event ID
router.get(
  "/event/:eventId",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { eventId } = req.params;

    try {
      const tickets = await Ticket.find({ eventId })
        .populate("buyerId", "fullName email")
        .populate("eventId", "name dateOfEvent");

      if (!tickets.length) {
        return res
          .status(404)
          .json({ message: "No tickets found for this event." });
      }

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets by event ID:", error);
      res
        .status(500)
        .json({
          message: "Error fetching tickets by event ID.",
          error: error.message,
        });
    }
  }
);
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Fetch tickets by event ID
 *     description: Retrieve tickets for a specific event, with optional filters by email or phone number.
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter tickets by buyer email.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter tickets by buyer phone number.
 *     responses:
 *       200:
 *         description: List of tickets for the specified event.
 *       400:
 *         description: Event ID is required.
 *       500:
 *         description: Error fetching tickets.
 */
/**
 * @swagger
 * /api/tickets/{id}/use:
 *   put:
 *     summary: Mark ticket as used
 *     description: Update a ticket's status to 'used' and trigger optional integration with external systems.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the ticket to mark as used.
 *     responses:
 *       200:
 *         description: Ticket marked as used successfully.
 *       400:
 *         description: Ticket has already been used.
 *       404:
 *         description: Ticket not found.
 *       500:
 *         description: Error updating ticket status.
 */
/**
 * @swagger
 * /api/tickets/purchase:
 *   post:
 *     summary: Purchase tickets for events
 *     description: Process ticket purchases for events, handling free and paid tickets with Tap Payments integration.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of event IDs to purchase tickets for.
 *               tickets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     eventId:
 *                       type: string
 *                     ticketClass:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Payment initialized, redirecting to the payment gateway.
 *       400:
 *         description: Invalid input or insufficient tickets.
 *       500:
 *         description: Error processing ticket purchase.
 */
/**
 * @swagger
 * /api/tickets/payment/callback:
 *   get:
 *     summary: Handle payment callback
 *     description: Verify payment completion and generate tickets upon successful payment.
 *     parameters:
 *       - in: query
 *         name: tap_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tap payment ID to verify payment status.
 *     responses:
 *       200:
 *         description: Payment verified, tickets issued, and email sent.
 *       400:
 *         description: Payment verification failed or invalid callback data.
 *       500:
 *         description: Error processing payment callback.
 */
/**
 * @swagger
 * /api/tickets/event/{eventId}:
 *   get:
 *     summary: Fetch tickets by event ID
 *     description: Retrieve all tickets associated with a specific event ID. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema
           type: string
         description: The ID of the event to fetch tickets for.
     responses:
       200:
         description: List of tickets for the specified event.
       404:
         description: No tickets found for this event.
       500:
         description: Error fetching tickets.
 */
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Fetch all tickets
 *     description: Retrieve all tickets with optional filters for email, event ID, and usage status. Admin authorization is required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter tickets by buyer email.
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filter tickets by event ID.
 *       - in: query
 *         name: used
 *         schema:
 *           type: boolean
 *         description: Filter tickets by usage status (true or false).
 *     responses:
 *       200:
 *         description: List of tickets matching the filter criteria.
 *       404:
 *         description: User not found for given email.
 *       500:
 *         description: Error fetching tickets.
 */

module.exports = router;
