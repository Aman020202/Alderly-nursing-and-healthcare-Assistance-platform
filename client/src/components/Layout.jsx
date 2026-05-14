import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  Heart, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut,
  BarChart3,
  Search,
  MessageSquare,
  Activity
} from 'lucide-react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/caregiver/dashboard');

  const menuItems = {
    'Elderly/Family': [
      { label: 'Dashboard', icon: Home, to: '/dashboard' },
      { label: 'My Patients', icon: Users, to: '/dashboard' },
      { label: 'My Bookings', icon: Calendar, to: '/bookings' },
      { label: 'Find Caregivers', icon: Search, to: '/caregivers' },
      { label: 'Care Notes', icon: Activity, to: '/bookings' },
      { label: 'Settings', icon: Settings, to: '/settings/notifications' },
    ],
    'Caregiver': [
      { label: 'Dashboard', icon: Home, to: '/caregiver/dashboard' },
      { label: 'My Schedule', icon: Calendar, to: '/bookings' },
      { label: 'My Profile', icon: Heart, to: `/caregivers/${user?.caregiverProfileId || ''}` },
      { label: 'Care Notes', icon: Activity, to: '/bookings' },
      { label: 'Settings', icon: Settings, to: '/settings/notifications' },
    ],
    'Admin': [
      { label: 'Admin Home', icon: BarChart3, to: '/admin' },
      { label: 'User Management', icon: Users, to: '/admin/users' },
      { label: 'Verifications', icon: ShieldCheck, to: '/admin/caregivers' },
      { label: 'Reports', icon: BarChart3, to: '/admin/reports' },
      { label: 'Disputes', icon: MessageSquare, to: '/admin/disputes' },
      { label: 'Settings', icon: Settings, to: '/settings/notifications' },
    ]
  };

  const currentMenuItems = user ? menuItems[user.role] : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {user && isDashboard && (
          <aside className={`
            fixed lg:sticky top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-4 flex flex-col h-full">
              <nav className="flex-1 space-y-1">
                {currentMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                      ${location.pathname === item.to 
                        ? 'bg-blue-50 text-blue-600 font-bold' 
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${user && isDashboard ? 'lg:max-w-[calc(100vw-16rem)]' : 'container mx-auto'}`}>
          {children}
        </main>
      </div>

      {!isDashboard && (
        <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 mb-4">
                <Activity className="h-8 w-8" />
                <span>Alderly</span>
              </Link>
              <p className="text-gray-500 max-w-sm">
                Empowering families and healthcare professionals with a modern, transparent, and reliable nursing assistance platform.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/services" className="hover:text-blue-600 transition-colors">Our Services</Link></li>
                <li><Link to="/caregivers" className="hover:text-blue-600 transition-colors">Find a Nurse</Link></li>
                <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Alderly Healthcare Assistance Platform. Built with care for our elders.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
