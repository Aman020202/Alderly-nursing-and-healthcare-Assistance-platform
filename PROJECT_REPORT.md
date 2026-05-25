# Project Report: Alderly Nursing and Healthcare Assistance Platform

## 1. Executive Summary
The **Alderly Nursing and Healthcare Assistance Platform** is a comprehensive, full-stack web application designed to connect families and patients with qualified caregivers. The platform streamlines the process of finding, booking, and managing in-home healthcare services. It provides distinct interfaces and functionalities for Families/Patients, Caregivers, and Administrators, ensuring a secure, transparent, and efficient caregiving ecosystem.

## 2. Technology Stack

### Frontend (Client)a
- **Framework:** React 19
- **Build Tool:** Vite for fast, optimized builds
- **Styling:** Tailwind CSS (v4) for utility-first responsive design, enhanced with Framer Motion for animations
- **Routing:** React Router DOM (v7) for seamless Single Page Application (SPA) navigation
- **State Management & Forms:** React Hook Form for robust form validation
- **Data Visualization:** Recharts for analytical dashboards
- **Real-Time Communication:** Socket.io-client for live notifications and service tracking
- **Icons:** Lucide React

### Backend (Server)
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js 
- **Database:** MongoDB, managed via Mongoose Object Data Modeling (ODM)
- **Real-Time Communication:** Socket.io for bidirectional event-based communication
- **Authentication:** JSON Web Tokens (JWT) and bcryptjs for secure password hashing
- **Security:** Helmet (HTTP headers), express-rate-limit (DDoS protection), express-mongo-sanitize (NoSQL injection prevention), xss-clean, and CORS

### Infrastructure & Deployment
- **Hosting:** Vercel (Serverless Functions for the backend API, Static Site Generation for the frontend)
- **Monorepo Structure:** Unified repository containing both `client` and `server` logic, natively integrated with Vercel's build pipeline.

---

## 3. Core Architecture & Database Models
The system follows a standard MERN (MongoDB, Express, React, Node.js) architecture. The backend exposes a RESTful API, supplemented by WebSockets for real-time features.

### Database Entities (MongoDB Models)
1. **User (`User.js`):** Central authentication model supporting role-based access control (`family`, `caregiver`, `admin`).
2. **Patient (`Patient.js`):** Stores medical history, care requirements, and demographic details of individuals receiving care.
3. **Caregiver (`Caregiver.js`):** Contains professional qualifications, availability, service areas, hourly rates, and verification status.
4. **Booking (`Booking.js`):** Manages the lifecycle of a care session, tracking dates, times, associated costs, and current status (e.g., pending, confirmed, completed).
5. **Service (`Service.js`):** Defines the catalog of healthcare services offered on the platform (e.g., Physiotherapy, General Nursing).
6. **CareNote (`CareNote.js`):** Digital logs maintained by caregivers during a session to update families on patient health and activities.
7. **Review (`Review.js`):** Feedback system allowing families to rate and review caregivers post-service.
8. **Notification (`Notification.js`):** In-app alert system for booking updates and administrative messages.
9. **Dispute (`Dispute.js`):** Conflict resolution model for handling disagreements between families and caregivers.

---

## 4. Key Features & Modules

### A. Authentication & Security
- Secure registration and login flows with role assignment.
- JWT-based authorization protecting API endpoints.
- Rate limiting on authentication routes to prevent brute-force attacks.

### B. Family & Patient Portal
- **Dashboard:** Overview of upcoming bookings and recent care notes.
- **Patient Management:** Ability to add and edit profiles for multiple patients/family members.
- **Caregiver Search:** Advanced filtering system to find caregivers based on location, service type, hourly rate, and ratings.
- **Booking System:** Request care sessions, view booking summaries, and track service status.

### C. Caregiver Portal
- **Profile Management:** Set up professional profiles, upload credentials, and manage availability schedules.
- **Dashboard:** View incoming booking requests, accept/decline jobs, and monitor upcoming schedules.
- **Service Tracking:** Real-time tracking interface to log activities and write Care Notes during an active shift.

### D. Administrator Dashboard
- **User Management:** Oversee all registered families and caregivers.
- **Caregiver Verification:** Review uploaded credentials and approve/reject caregiver profiles to maintain platform safety.
- **Dispute Resolution:** Manage and resolve conflicts raised by users.
- **Platform Analytics:** View systemic reports and platform usage metrics.

### E. Real-Time Capabilities
- **Live Notifications:** Users receive instant updates when a booking status changes or a new message arrives.
- **Live Tracking:** (Designed with Socket.io) Enables families to see real-time status updates when a caregiver is actively providing a service.

---

## 5. Security & Compliance
- **Data Protection:** Passwords are encrypted before database insertion. JWT tokens are used statelessly to prevent session hijacking.
- **Input Validation:** All incoming data is sanitized against XSS and NoSQL injection attacks.
- **Deployment Security:** Environment variables conceal sensitive database URIs and JWT secrets.

## 6. Deployment Workflow
The application is configured for a unified deployment on **Vercel**:
- The React application is built via Vite and served globally via Vercel's Edge Network.
- The Express API is bundled via an `api/index.js` entry point and served as highly scalable Vercel Serverless Functions.
- Continuous Integration / Continuous Deployment (CI/CD) is natively handled by Vercel upon pushing to the `main` GitHub branch.
