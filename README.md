# DocAppoint — Doctor Appointment Booking System

**Live Site URL:** 
**Server API URL:** 

<<<<<<< HEAD
- **Live Web Application URL**: 
- **Server API URL**: 
=======
DocAppoint is a modern, full-stack healthcare platform that connects patients with verified specialist doctors for seamless appointment booking and management.
>>>>>>> 669c37b (Update client with Better Auth integration)

---

## 🌟 Key Features

- 🩺 **Browse & Book Verified Doctors** — Explore a directory of certified medical specialists across Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, and more. View full doctor profiles including experience, hospital, availability, and consultation fee, then book directly from the details page via a guided modal form.

- 🔐 **Secure Authentication with Google OAuth** — Users can register and log in using their real Google account via Better Auth OAuth 2.0, or use traditional email/password with strict validation (minimum 6 characters, at least 1 uppercase and 1 lowercase letter). Sessions persist across page reloads on all private routes — logged-in users are never redirected to login on refresh.

- 📅 **Private Patient Dashboard** — A fully protected dashboard allows logged-in users to view all their booked appointments, update existing bookings with a pre-filled modal (doctor info and email are read-only for data integrity), delete appointments with a styled confirmation modal (no native browser dialogs used), and manage their profile name and photo.

- 🔍 **Live Search & Sort on All Appointments** — The All Appointments page features real-time doctor search by name, specialty, or hospital with 300ms debouncing, and sort options by consultation fee (low-to-high / high-to-low) and highest rating — all powered by server-side filtering.

- ⭐ **Doctor Reviews System** — After a consultation, patients can submit a star rating (1–5) and a written review on the doctor's profile. Reviews are saved to MongoDB and rendered instantly without a page refresh, ordered newest-first with reviewer initials and date.

- 🌓 **Dark / Light Theme Toggle & Responsive Design** — A full dark/light mode toggle is available in the navbar with preference persisted via localStorage. The entire application is responsive across mobile, tablet, and desktop with a collapsible hamburger menu and adaptive card grids.

- 🛡️ **Custom 404 Page & Error Handling** — All invalid routes render a branded custom 404 page. No native `alert()`, `confirm()`, or `prompt()` dialogs are used anywhere — all feedback is delivered via toast notifications or custom styled modals.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS, Lucide React icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | Better Auth + JWT |
| Social Login | Google OAuth 2.0 |
| Notifications | React Hot Toast |
| Deployment | Vercel (client) + Render (server) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud OAuth 2.0 credentials

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/docappoint.git
cd docappoint
```

### 2. Setup the Server
```bash
cd server
npm install
```

Create `.env` in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AUTH_SECRET=your_better_auth_secret_32_chars_minimum
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 3. Setup the Client
```bash
cd client
npm install
```

Create `.env.local` in `/client`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev   # starts on http://localhost:3000
```

---

## 📄 Pages Overview

| Route | Description | Auth Required |
|-------|-------------|:---:|
| `/` | Home — Hero Slider, Top 3 Rated Doctors, How It Works, Medical Specialties | No |
| `/appointments` | All doctors with live search & sort | No |
| `/doctors/[id]` | Doctor profile, Book Appointment button, Patient Reviews | Yes (to book/review) |
| `/login` | Email/password login + Google OAuth | No |
| `/register` | Email registration + Google OAuth with password validation | No |
| `/dashboard` | My Bookings + My Profile (private route) | **Yes** |

---

## 🔐 Google OAuth Setup

For Google OAuth to work locally:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web Application)
3. Add Authorized redirect URI: `http://localhost:5000/api/auth/callback/google`
4. Copy credentials to your server `.env`

---

## ✨ Bonus Features Implemented

- ✅ Doctor reviews with star rating system
- ✅ Sort by consultation fee and rating
- ✅ Live search with 300ms debounce
- ✅ Dark / Light theme toggle
- ✅ SEO metadata on all pages
- ✅ Custom styled 404 page
- ✅ Loading spinners on all async operations
- ✅ No native browser dialogs — custom ConfirmModal used

---

© 2026 DocAppoint. Built with ❤️ for quality healthcare access.
