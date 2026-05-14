import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form:', form);
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900">Get in Touch</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Have questions about our services or need help finding a caregiver? Our support team is here for you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          {[
            { icon: Phone, title: 'Call Us', val: '+1 (555) 123-4567', desc: 'Available 24/7 for emergencies' },
            { icon: Mail, title: 'Email Us', val: 'support@alderly.com', desc: 'Typical response within 2 hours' },
            { icon: MapPin, title: 'Visit Us', val: '123 Care Street, Medical District', desc: 'San Francisco, CA 94103' },
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-lg text-blue-600 font-medium">{item.val}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="p-8 bg-blue-600 rounded-[2rem] text-white space-y-4">
            <MessageSquare className="w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold">Need Help Now?</h3>
            <p className="text-blue-100">Our clinical coordinators are ready to help you plan the perfect care journey.</p>
            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Start Live Chat
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Message Sent!</h2>
              <p className="text-gray-500 max-w-sm">
                Thank you for reaching out. One of our clinical coordinators will contact you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input 
                  required
                  type="text" 
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="How can we help?"
                  className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea 
                  required
                  rows="5" 
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us about your requirements..."
                  className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
