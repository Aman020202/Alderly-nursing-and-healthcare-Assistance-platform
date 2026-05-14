import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Filter } from 'lucide-react';

const DisputeResolution = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDispute, setActiveDispute] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchDisputes = async () => {
    try { const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/reports/disputes?status=${statusFilter}`,{headers}); setDisputes(res.data); }
    catch(err){ console.error(err); } finally{ setLoading(false); }
  };
  useEffect(()=>{ fetchDisputes(); },[statusFilter]);

  const handleUpdate = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/reports/disputes/${id}`,{status,adminNotes,resolution},{headers});
      setActiveDispute(null); setAdminNotes(''); setResolution(''); fetchDisputes();
    } catch(err){ alert('Failed to update dispute'); }
  };

  const getStatusColor = s => ({ Open:'bg-red-100 text-red-800','Under Review':'bg-yellow-100 text-yellow-800',Resolved:'bg-green-100 text-green-800',Dismissed:'bg-gray-100 text-gray-800' }[s]||'bg-gray-100');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <Link to="/admin" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1"/>Back</Link>
      <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500"/>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white">
          <option value="All">All</option><option value="Open">Open</option><option value="Under Review">Under Review</option><option value="Resolved">Resolved</option><option value="Dismissed">Dismissed</option>
        </select>
      </div>

      {loading?<div className="py-12 text-center"><div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto"/></div>
      :disputes.length===0?<div className="bg-white rounded-xl border p-12 text-center text-gray-500">No disputes found.</div>
      :<div className="space-y-4">{disputes.map(d=>(
        <div key={d._id} className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start mb-3">
            <div><h3 className="font-bold text-gray-900">{d.reason}</h3><p className="text-sm text-gray-500">By: {d.raisedBy?.name} ({d.raisedBy?.role}) • {new Date(d.createdAt).toLocaleDateString()}</p></div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(d.status)}`}>{d.status}</span>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mb-3">{d.description}</p>
          {d.adminNotes&&<p className="text-sm text-gray-600 mb-2"><strong>Admin Notes:</strong> {d.adminNotes}</p>}
          {d.resolution&&<p className="text-sm text-green-700 mb-2"><strong>Resolution:</strong> {d.resolution}</p>}

          {activeDispute===d._id?(
            <div className="space-y-3 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <textarea placeholder="Admin notes..." value={adminNotes} onChange={e=>setAdminNotes(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" rows="2"/>
              <textarea placeholder="Resolution details..." value={resolution} onChange={e=>setResolution(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" rows="2"/>
              <div className="flex space-x-2">
                <button onClick={()=>handleUpdate(d._id,'Under Review')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-xs font-medium">Mark Under Review</button>
                <button onClick={()=>handleUpdate(d._id,'Resolved')} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium">Resolve</button>
                <button onClick={()=>handleUpdate(d._id,'Dismissed')} className="px-3 py-1.5 bg-gray-500 text-white rounded-md text-xs font-medium">Dismiss</button>
                <button onClick={()=>setActiveDispute(null)} className="px-3 py-1.5 bg-white border rounded-md text-xs">Cancel</button>
              </div>
            </div>
          ):(d.status!=='Resolved'&&d.status!=='Dismissed'&&
            <button onClick={()=>{setActiveDispute(d._id);setAdminNotes(d.adminNotes||'');setResolution(d.resolution||'');}} className="text-sm text-blue-600 font-medium hover:underline mt-2">Manage Dispute →</button>
          )}
        </div>
      ))}</div>}
    </div>
  );
};
export default DisputeResolution;
