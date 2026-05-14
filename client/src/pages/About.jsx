import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Users, Target, Activity } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Vision Header */}
      <section className="pt-12 text-center space-y-6 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl lg:text-6xl font-black text-gray-900">Our Mission for Quality Care.</h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Alderly was founded on a simple belief: every elder deserves dignified, professional, and compassionate care in the comfort of their own home.
        </p>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Heart, title: 'Compassion First', desc: 'We select caregivers not just for their technical skills, but for their heart and empathy.', color: 'text-rose-500 bg-rose-50' },
          { icon: ShieldCheck, title: 'Absolute Integrity', desc: 'Trust is our currency. We maintain the highest standards of verification and clinical oversight.', color: 'text-blue-500 bg-blue-50' },
          { icon: Users, title: 'Family Centric', desc: 'We build technology that keeps families connected, informed, and at ease 24/7.', color: 'text-purple-500 bg-purple-50' },
        ].map((v, i) => (
          <div key={i} className="text-center space-y-4">
            <div className={`w-16 h-16 ${v.color} rounded-2xl mx-auto flex items-center justify-center`}>
              <v.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{v.title}</h3>
            <p className="text-gray-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </section>

      {/* Story Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Why We Started Alderly</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The idea for Alderly came from a personal struggle. Finding a reliable nurse for an aging grandparent felt like an impossible task. The lack of transparency, the difficult scheduling, and the uncertainty of care quality were constant stresses.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We decided to fix it. By combining healthcare expertise with modern technology, we created a platform that bridges the gap between professional caregivers and families in need.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-3xl font-black text-blue-600">2023</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Year Founded</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600">120+</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Team Members</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800" 
              alt="Elder Care" 
              className="rounded-[3rem] shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
