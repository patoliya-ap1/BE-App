# 🚀 Backend API - Node.js + Express + TypeScript

A scalable and production-ready backend built using **Node.js**, **Express**, and **TypeScript**. This project includes authentication, user management, posts CRUD, caching, background jobs, and strong security practices.

---

## 🌐 Live URLs

* **Backend Base URL**
  https://be-app-4yhn.onrender.com

* **Swagger API Docs**
  https://be-app-4yhn.onrender.com/api-docs/

---

## 📦 Features

### 🔐 Authentication & Authorization

* User Signup & Login
* JWT-based authentication
* Email verification with token
* SMS integration using Twilio

### 👤 User Profile

* CRUD operations for user profile
* Upload profile image
* Image compression before storing
* Store image URL in database

### 📝 Posts

* Full CRUD operations for posts
* Pagination support
* Filtering support
* Filter query caching using Redis

---

## 🛠️ Tech Stack

* **Node.js + Express**
* **TypeScript**
* **MongoDB (Mongoose)**
* **Redis (Remote)**
* **JWT Authentication**
* **BullMQ (Background Jobs)**
* **Cron Jobs**
* **Winston Logger**
* **Helmet (Security Middleware)**
* **Twilio (SMS Service)**

---

## ⚙️ Validation & Security

### ✅ Validation

* Mongoose schema validation (before saving to DB)
* Express request validation

### 🔒 Security Measures

* Protection against:

  * XSS (Cross-Site Scripting)
  * CSRF (Cross-Site Request Forgery)
  * SQL Injection
  * DoS attacks
* Implemented using Helmet & rate limiting

---

## ⚡ Caching & Performance

* Redis used for:

  * Caching filtered post queries
  * Storing filter keys and values in response
* Remote Redis server integration
* Pub/Sub system for event-driven communication
* Event Emitters for internal events

---

## 🧵 Background Jobs

* BullMQ for queue-based job processing
* Cron jobs for scheduled tasks
* Async processing (emails, sms , etc.)

---

## 📂 API Modules

* **Auth APIs** → Signup, Login, Verify Email
* **User APIs** → Profile ,Update, Image Upload
* **Post APIs** → Create, Read, Update, Delete, Filter, Pagination

👉 Check all endpoints in Swagger Docs:
https://be-app-4yhn.onrender.com/api-docs/

---

## 📁 Project Setup

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Run in development
npm run dev

# Build project
npm run build

# Start production server
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

REDIS_URL=your_redis_url

EMAIL_SERVICE=your_email_config
TWILIO_SID=your_twilio_sid
TWILIO_AUTH=your_twilio_auth
```

---

## 📊 Logging

* Winston logger for:

  * Error logs
  * Request logs
  * Debugging production issues

---

## 📌 Notes

* Follows clean architecture and modular structure
* Designed for scalability and real-world production usage
* Uses async handling and centralized error middleware


---

## 👨‍💻 Author

Developed as a full-feature backend system demonstrating real-world best practices in Node.js ecosystem.

---
