import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, UserCheck, CalendarCheck, DollarSign, ArrowRight, ShieldCheck, AlertTriangle, BarChart3, FileText } from 'lucide-react';
import { BookingTrendChart, RevenueByServiceChart, SatisfactionChart } from '../../components/charts/BookingChart';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [trends, setTrends] = useState([]);
  const [revenueByService, setRevenueByService] = useState([]);
  const [satisfaction, setSatisfaction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        const [kpiRes, trendRes, revRes, satRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard/kpis`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard/booking-trends`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard/revenue-by-service`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard/satisfaction`, { headers })
        ]);
        setKpis(kpiRes.data);
        setTrends(trendRes.data);
        setRevenueByService(revRes.data);
        setSatisfaction(satRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>;

  const kpiCards = [
    { label: 'Total Users', value: kpis?.totalUsers || 0, icon: Users, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Active Caregivers', value: kpis?.activeCaregivers || 0, icon: UserCheck, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Bookings This Month', value: kpis?.bookingsThisMonth || 0, icon: CalendarCheck, color: 'bg-indigo-500', bgLight: 'bg-indigo-50' },
    { label: 'Revenue This Month', value: `$${(kpis?.revenueThisMonth || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500', bgLight: 'bg-emerald-50' }
  ];

  const navLinks = [
    { label: 'User Management', desc: 'View, search, and manage all platform users.', to: '/admin/users', icon: Users },
    { label: 'Caregiver Verifications', desc: 'Approve or reject caregiver applications.', to: '/admin/caregivers', icon: ShieldCheck },
    { label: 'Service Management', desc: 'Add, edit, or disable service categories.', to: '/admin/services', icon: BarChart3 },
    { label: 'Booking Monitor', desc: 'Monitor all bookings across the platform.', to: '/admin/bookings', icon: CalendarCheck },
    { label: 'Dispute Resolution', desc: 'Handle user-raised disputes and complaints.', to: '/admin/disputes', icon: AlertTriangle },
    { label: 'Reports & Analytics', desc: 'Generate detailed performance reports.', to: '/admin/reports', icon: FileText }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and key performance indicators.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${kpi.bgLight}`}>
              <kpi.icon className={`h-6 w-6 text-white ${kpi.color} rounded-lg p-1`} style={{ width: 32, height: 32 }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Booking & Revenue Trends (6 Months)</h2>
          {trends.length > 0 ? <BookingTrendChart data={trends} /> : <p className="text-gray-400 text-center py-12">No trend data available yet.</p>}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue by Service Type</h2>
          {revenueByService.length > 0 ? <RevenueByServiceChart data={revenueByService} /> : <p className="text-gray-400 text-center py-12">No revenue data available yet.</p>}
        </div>
      </div>

      {/* Satisfaction Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">User Satisfaction Trends</h2>
        {satisfaction.length > 0 ? <SatisfactionChart data={satisfaction} /> : <p className="text-gray-400 text-center py-12">No review data available yet.</p>}
      </div>

      {/* Quick Nav Links */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Management Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.to} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                  <link.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{link.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
