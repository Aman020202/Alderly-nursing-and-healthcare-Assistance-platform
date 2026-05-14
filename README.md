# Alderly: Elderly Nursing & Healthcare Assistance Platform

Alderly is a comprehensive platform designed to connect families with professional healthcare providers for elder care. It features real-time tracking, care documentation, scheduling, and verified nursing assistance.

## 🚀 Features

- **Real-time Tracking**: Live status updates for ongoing care services via Socket.io.
- **Verified Caregivers**: Rigorous verification system for healthcare professionals.
- **Care Documentation**: Digital care notes with photo attachments.
- **Comprehensive Dashboards**: Tailored views for Families, Caregivers, and Administrators.
- **Notification System**: In-app, Email, and Push notifications for critical updates.
- **Analytics & Reporting**: Detailed admin reports on revenue, performance, and completion rates.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Security**: Rate limiting, Helmet (XSS protection), Mongo Sanitize, JWT Authentication.
- **DevOps**: Docker, Nginx, GitHub Actions (CI/CD).

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (Local or Atlas)
- Docker (Optional)

### Installation

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env # Add your variables
   npm run dev
   ```
3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🐳 Docker Deployment

To run the entire platform in a production-like environment locally:

```bash
docker-compose up --build
```

## 📋 Deployment Instructions

### Frontend (Vercel)
1. Import the `client` directory to Vercel.
2. Set Environment Variable: `VITE_API_URL` to your backend API URL.
3. Vercel will automatically build and deploy.

### Backend (Render / Railway)
1. Import the `server` directory.
2. Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
3. Use `npm install && node server.js` as the build/start command.

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Whitelist the IP addresses of your backend servers.
3. Copy the Connection String and use it as `MONGO_URI`.

## 🛡 Security
The platform includes built-in rate limiting (100 req/15min) and auth rate limiting (20 attempts/hr). Ensure you set a strong `JWT_SECRET` and use `HTTPS` in production.

## 📄 License
This project is licensed under the MIT License.
