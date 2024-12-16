
# **Sa'adh - Event Ticketing and Management System**

## **Project Overview**
Sa'adh is an event management and e-ticketing system designed to streamline event creation, user management, and ticket purchasing. It provides robust features like QR code generation, payment gateway integration, and admin/organizer role management.

---

## **Features**
1. **User Management**:
   - Registration, login, and profile management.
   - Admin and organizer roles with specific access.

2. **Event Management**:
   - Create, update, and delete events with Cloudinary image uploads.
   - Retrieve events by ID or filters (e.g., hidden, organizer-specific).

3. **Ticketing**:
   - Purchase tickets for events.
   - Validate tickets using QR codes.
   - Track tickets and purchases.

4. **Payment Integration**:
   - Tap Payments API for handling ticket purchases.

5. **Email Notifications**:
   - Send purchase confirmations and reset-password emails.

6. **Security**:
   - JWT-based authentication for secure endpoints.
   - Middleware for admin and organizer role-based access control.

---

## **Technologies Used**

| **Technology**      | **Purpose**                       |
|----------------------|-----------------------------------|
| **Node.js**         | Backend JavaScript runtime        |
| **Express.js**      | Web framework for Node.js         |
| **MongoDB**         | NoSQL database for data storage   |
| **Cloudinary**      | Image storage and management      |
| **Tap Payments**    | Payment gateway integration       |
| **JWT**             | Secure token-based authentication |
| **Nodemailer**      | Email service for notifications   |
| **Winston**         | Logging system for debugging      |
| **Swagger**         | API documentation and testing     |

---

## **Project Setup**

### **1. Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com) (local or cloud)
- A Cloudinary account for image uploads
- A Tap Payments account for payment gateway setup

---

### **2. Clone the Repository**
Run the following command in your terminal:
```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### **3. Install Dependencies**
Install the required Node.js packages:
```bash
npm install
```

---

### **4. Configure Environment Variables**
Create a `.env` file in the root directory and add the following environment variables:
```env
# Server
PORT=5001
BASE_URL=http://localhost:5001

# JWT Secret Key
JWT_SECRET=your_jwt_secret

# MongoDB Connection
MONGO_URI=your_mongodb_uri

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Tap Payments
TAP_SECRET_KEY=your_tap_secret_key
APP_ALphantom_URL=your_alphantom_api_url

# Exchange Rate API Key
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
```

---

### **5. Run the Server**
Start the development server:
```bash
npm start
```

The server will run on `http://localhost:5001` by default.

---

## **API Documentation**
Swagger documentation is available at:
```
http://localhost:5001/api-docs
```
It provides detailed documentation for all API endpoints, including request formats, parameters, and responses.

---

## **Testing the Endpoints**
You can test the API endpoints using:
- **Swagger UI** (at `/api-docs`)
- Tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/)

---

## **Project Structure**
```
.
├── models/                   # Mongoose models for MongoDB
│   ├── User.js
│   ├── Ticket.js
│   ├── Event.js
│   └── Purchase.js
│
├── routes/                   # Express routes for endpoints
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── userRoutes.js
│   ├── ticketRoutes.js
│   └── contactRoutes.js
│
├── middleware/               # Authorization middleware
│   └── auth.js
│
├── cloudinary/               # Cloudinary configuration
│   └── index.js
│
├── logs/                     # Logs folder for Winston
│   └── ticketing.log
│
├── server.js                 # Main server file
├── .env                      # Environment variables
├── package.json              # Node.js dependencies
└── README.md                 # Project documentation
```

---

## **Key Endpoints**
| **Endpoint**                 | **Method** | **Description**                      |
|------------------------------|------------|--------------------------------------|
| `/api/auth/register`         | POST       | Register a new user                  |
| `/api/auth/login`            | POST       | User login                           |
| `/api/events`                | GET/POST   | Retrieve or create events            |
| `/api/tickets`               | GET        | Fetch tickets for an event           |
| `/api/tickets/purchase`      | POST       | Purchase tickets                     |
| `/api/tickets/validate`      | POST       | Validate ticket via QR code          |
| `/api/users`                 | GET        | Retrieve all users (admin only)      |
| `/api/contact`               | POST       | Submit a contact form                |

For a full list of endpoints, refer to the Swagger documentation.

---

## **Contributing**
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature: your feature name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## **Troubleshooting**
- **MongoDB Connection Error**: Ensure your MongoDB server is running and the connection string in `.env` is correct.
- **Cloudinary Issues**: Verify your API credentials and folder settings.
- **Tap Payments Errors**: Double-check your Tap Secret Key and API payload.
- **Swagger Not Showing**: Restart the server and visit `/api-docs`.

---

## **License**
This project is licensed under the MIT License.

