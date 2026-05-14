import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Loaded Pages
const Homepage = lazy(() => import('./pages/Homepage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Services = lazy(() => import('./pages/Services'));
const CaregiverSearch = lazy(() => import('./pages/CaregiverSearch'));
const CaregiverProfile = lazy(() => import('./pages/CaregiverProfile'));

// Dashboard & Management
const FamilyDashboard = lazy(() => import('./pages/dashboard/FamilyDashboard'));
const AddPatient = lazy(() => import('./pages/patients/AddPatient'));
const PatientDetail = lazy(() => import('./pages/patients/PatientDetail'));
const EditPatient = lazy(() => import('./pages/patients/EditPatient'));
const CaregiverRegister = lazy(() => import('./pages/caregiver/CaregiverRegister'));
const CaregiverDashboard = lazy(() => import('./pages/caregiver/CaregiverDashboard'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CaregiverVerification = lazy(() => import('./pages/admin/CaregiverVerification'));
const CaregiverDetailReview = lazy(() => import('./pages/admin/CaregiverDetailReview'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ServiceManagement = lazy(() => import('./pages/admin/ServiceManagement'));
const BookingMonitor = lazy(() => import('./pages/admin/BookingMonitor'));
const DisputeResolution = lazy(() => import('./pages/admin/DisputeResolution'));
const Reports = lazy(() => import('./pages/admin/Reports'));

// Booking & Tracking
const CreateBooking = lazy(() => import('./pages/booking/CreateBooking'));
const BookingSummary = lazy(() => import('./pages/booking/BookingSummary'));
const MyBookings = lazy(() => import('./pages/booking/MyBookings'));
const ServiceTracking = lazy(() => import('./pages/tracking/ServiceTracking'));
const NotificationSettings = lazy(() => import('./pages/settings/NotificationSettings'));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner fullPage />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/caregivers" element={<CaregiverSearch />} />
                <Route path="/caregivers/:id" element={<CaregiverProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Shared Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<FamilyDashboard />} />
                  <Route path="/bookings" element={<MyBookings />} />
                  <Route path="/tracking/:bookingId" element={<ServiceTracking />} />
                  <Route path="/settings/notifications" element={<NotificationSettings />} />
                  
                  {/* Family Only */}
                  <Route path="/patients/new" element={<AddPatient />} />
                  <Route path="/patients/:id" element={<PatientDetail />} />
                  <Route path="/patients/:id/edit" element={<EditPatient />} />
                  <Route path="/bookings/new/:caregiverId" element={<CreateBooking />} />
                  <Route path="/bookings/summary/:id" element={<BookingSummary />} />
                </Route>

                {/* Caregiver Only */}
                <Route element={<ProtectedRoute allowedRoles={['Caregiver']} />}>
                  <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
                  <Route path="/caregiver/register" element={<CaregiverRegister />} />
                </Route>

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/caregivers" element={<CaregiverVerification />} />
                  <Route path="/admin/caregivers/:id" element={<CaregiverDetailReview />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/services" element={<ServiceManagement />} />
                  <Route path="/admin/bookings" element={<BookingMonitor />} />
                  <Route path="/admin/disputes" element={<DisputeResolution />} />
                  <Route path="/admin/reports" element={<Reports />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
