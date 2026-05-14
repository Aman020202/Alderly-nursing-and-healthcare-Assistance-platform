import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Users, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Activity,
  Calendar,
  Smartphone
} from 'lucide-react';

const Homepage = () => {
  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase">
              <Star className="w-4 h-4 mr-2" /> #1 Healthcare Platform in the Region
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Compassionate Care, <br />
              <span className="text-blue-600">Reimagined for Elders.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Connecting families with verified, professional nurses and caregivers. Transparent tracking, real-time updates, and peace of mind for your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/caregivers"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all group"
              >
                Find a Caregiver <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Our Services
              </Link>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" /> Verified Experts</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" /> 24/7 Support</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" /> No Hidden Fees</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 -z-10" />
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Real-time Tracking</h4>
                    <p className="text-xs text-gray-500">Live service updates</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Nursing Service Started', time: '10:00 AM', status: 'completed' },
                  { label: 'Medication Administered', time: '10:30 AM', status: 'completed' },
                  { label: 'Vital Signs Recorded', time: '11:15 AM', status: 'active' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className={`w-2 h-2 mt-2 rounded-full ${step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${step.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900 font-bold'}`}>{step.label}</p>
                      <p className="text-xs text-gray-400">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="bg-blue-600 rounded-[3rem] p-12 text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-2xl shadow-blue-200">
          <div>
            <p className="text-4xl font-black mb-2">5k+</p>
            <p className="text-blue-100 font-medium">Verified Nurses</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">12k+</p>
            <p className="text-blue-100 font-medium">Happy Families</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">25k+</p>
            <p className="text-blue-100 font-medium">Care Hours</p>
          </div>
          <div>
            <p className="text-4xl font-black mb-2">4.9/5</p>
            <p className="text-blue-100 font-medium">Avg Rating</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900">Platform Features Built for Trust</h2>
          <p className="text-gray-500">We prioritize security, transparency, and clinical excellence in everything we do.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Identity Verification', desc: 'Every caregiver undergoes rigorous background checks and credential verification.', color: 'bg-emerald-500' },
            { icon: Smartphone, title: 'Real-time Alerts', desc: 'Get instant notifications on your phone for every milestone in your loved one\'s care.', color: 'bg-blue-500' },
            { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book by the hour, day, week, or month. Manage shifts effortlessly through your dashboard.', color: 'bg-purple-500' },
            { icon: Heart, title: 'Compassionate Care', desc: 'Our matching algorithm finds the right personality and specialty for your patient.', color: 'bg-rose-500' },
            { icon: Activity, title: 'Care Documentation', desc: 'Access clinical notes, medication logs, and daily observation reports anytime.', color: 'bg-orange-500' },
            { icon: Clock, title: '24/7 Availability', desc: 'Emergency support and round-the-clock nursing assistance whenever you need it.', color: 'bg-indigo-500' },
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-4"
            >
              <div className={`w-12 h-12 ${feat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                <feat.icon />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{feat.title}</h4>
              <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="relative bg-gray-900 rounded-[3rem] p-12 lg:p-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Ready to find the <br /> perfect caregiver?
              </h2>
              <p className="text-gray-400 text-lg">
                Join thousands of families who trust Alderly for their elder care needs. Start your search today and find a professional who feels like family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all text-center">
                  Create an Account
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-gray-800 text-white rounded-2xl font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-all text-center">
                  Talk to an Expert
                </Link>
              </div>
            </div>
            <div className="hidden lg:block text-right">
               <div className="inline-block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-left space-y-6">
                  <div className="flex -space-x-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-700 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">4.9/5 Average Rating</p>
                    <p className="text-gray-400">Based on 12,000+ family reviews</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
