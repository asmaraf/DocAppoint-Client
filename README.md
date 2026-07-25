# Doctor Appointment Manager (DocAppoint)

Welcome to **DocAppoint**, an advanced Doctor Appointment Booking System built with Next.js, React, Tailwind CSS, Node.js, Express, and MongoDB.

- **Live Web Application URL**: [https://docappoint-client.vercel.app]
- **Server API URL**: [https://docappoint-server.onrender.com]

---

## Key Website Features

- 🩺 **Dynamic Doctor Directory & Top-Rated Specialists**: Browse certified doctors across Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, and Dentistry with real-time consultation fees, ratings, and experience details.
- 🔍 **Real-Time Doctor Name Search & Sorting**: Instantly filter available doctors by doctor name, specialty, or hospital, and sort appointments by consultation fee (low-to-high / high-to-low) and rating.
- 🔐 **Better Auth Compatible JWT Authentication**: Secure user login, registration with strict password validation (min 6 characters, at least 1 uppercase & 1 lowercase letter), and seamless Google/GitHub social login.
- 📅 **Private Patient Dashboard & Controlled Booking Management**: Manage personal bookings with controlled pre-filled update modals (maintaining read-only doctor info and user email for data integrity) and instant item deletion.
- 🌓 **Dark / Light Theme Toggle & Responsive Design**: Seamless mode switcher with persisted local storage settings, glassmorphism UI elements, custom medical loading animations, custom 404 page, and full mobile/tablet/desktop responsiveness.

---

## Tech Stack & Architecture

- **Client**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, React Hot Toast
- **Server**: Express.js, MongoDB Atlas (Mongoose), JWT, BcryptJS, CORS, Dotenv
- **Deployment**: Vercel (Client) & Render (Server)

---

## Getting Started Locally

```bash
# Clone repository
git clone https://github.com/araf/DocAppoint.git

# Navigate to client
cd client

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Visit `http://localhost:3000` to view the application live.
