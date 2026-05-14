import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, Smartphone, Save } from 'lucide-react';

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState({
    inApp_booking: true,
    inApp_status: true,
    inApp_message: true,
    inApp_payment: true,
    inApp_review: true,
    email_booking: true,
    email_status: true,
    email_message: false,
    email_payment: true,
    email_review: false,
    push_booking: true,
    push_status: true,
    push_message: true,
    push_payment: false,
    push_review: false
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    // In production, this would call an API to save preferences
    console.log('Saving notification preferences:', prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = [
    { key: 'booking', label: 'Booking Confirmations', desc: 'When a booking is created or confirmed' },
    { key: 'status', label: 'Status Changes', desc: 'When booking status changes (accepted, started, completed)' },
    { key: 'message', label: 'New Messages', desc: 'When you receive a new message' },
    { key: 'payment', label: 'Payment Reminders', desc: 'Payment due dates and receipts' },
    { key: 'review', label: 'Review Requests', desc: 'Reminders to leave reviews after service' }
  ];

  const channels = [
    { key: 'inApp', label: 'In-App', icon: Bell },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'push', label: 'Push', icon: Smartphone }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <Link to="/dashboard" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-500 mt-1">Choose how and when you'd like to be notified.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-700">Notification Type</div>
          {channels.map(ch => (
            <div key={ch.key} className="text-center">
              <div className="flex items-center justify-center space-x-1.5">
                <ch.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{ch.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {categories.map((cat, i) => (
          <div key={cat.key} className={`grid grid-cols-4 gap-4 px-6 py-4 items-center ${i < categories.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div>
              <p className="text-sm font-medium text-gray-900">{cat.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
            </div>
            {channels.map(ch => {
              const prefKey = `${ch.key}_${cat.key}`;
              return (
                <div key={ch.key} className="flex justify-center">
                  <button
                    onClick={() => toggle(prefKey)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${prefs[prefKey] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[prefKey] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={handleSave} className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm transition-colors">
          <Save className="h-4 w-4 mr-2" /> Save Preferences
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Preferences saved!</span>}
      </div>
    </div>
  );
};

export default NotificationSettings;
