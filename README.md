git
# GigFlow - Freelance Marketplace

GigFlow is a full-stack freelance marketplace application where users can post gigs, bid on projects, and hire freelancers.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & Context API
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (HttpOnly Cookies) + bcrypt

## Features
- **Authentication**: Register, Login, Logout with secure HttpOnly cookies.
- **Gig Management**: Post gigs, browse gigs with search, view gig details.
- **Bidding System**: Freelancers can place bids on open gigs.
- **Dashboard**: Track your posted gigs and manage incoming bids.
- **Hiring Logic**: Atomic hiring process that updates gig status and rejects other bids automatically.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

## Getting Started

### 1. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# App runs on http://localhost:3000
```

## Folder Structure

- `/backend`: Express API and Database logic.
- `/frontend`: Next.js UI application.

## Usage Guide
1. **Register** a new account.
2. **Post a Gig** via the dashboard or specific page.
3. **Register** a second account (in incognito) to act as a freelancer.
4. **Bid** on the created gig from the freelancer account.
5. **Hire** the freelancer from the original account's dashboard.
