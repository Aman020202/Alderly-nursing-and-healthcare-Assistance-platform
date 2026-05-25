import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initSocket } from './sockets/tracking.js';
import { setupSecurity } from './middleware/security.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL, // .env mein Vercel ka URL dalenge
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Apply Security
setupSecurity(app);

// Apply Rate Limiting to API
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import caregiverRoutes from './routes/caregivers.js';
import adminCaregiverRoutes from './routes/admin/caregiverVerification.js';
import serviceRoutes from './routes/services.js';
import caregiverSearchRoutes from './routes/caregiverSearch.js';
import availabilityRoutes from './routes/availability.js';
import bookingRoutes from './routes/bookings.js';
import careNoteRoutes from './routes/careNotes.js';
import serviceTrackingRoutes from './routes/serviceTracking.js';
import adminDashboardRoutes from './routes/admin/dashboard.js';
import adminUserRoutes from './routes/admin/users.js';
import adminReportRoutes from './routes/admin/reports.js';
import notificationRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/admin/caregivers', adminCaregiverRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/caregiver-search', caregiverSearchRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/care-notes', careNoteRoutes);
app.use('/api/tracking', serviceTrackingRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reports', adminReportRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Only start the server if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default app;
