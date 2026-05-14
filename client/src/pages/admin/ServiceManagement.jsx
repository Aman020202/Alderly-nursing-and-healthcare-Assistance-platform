import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Edit2, Save, X } from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name:'', description:'', basePrice:0, icon:'Activity' });

  const fetchServices = async () => {
    try { const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`); setServices(res.data); }
    catch(err){ console.error(err); } finally { setLoading(false); }
  };
  useEffect(()=>{ fetchServices(); },[]);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const handleSave = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/services/${id}`, editData, { headers });
      setEditingId(null); fetchServices();
    } catch(err){ alert('Failed to update service'); }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/services`, newService, { headers });
      setShowAdd(false); setNewService({ name:'', description:'', basePrice:0, icon:'Activity' }); fetchServices();
    } catch(err){ alert('Failed to add service'); }
  };

  if(loading) return <div className="p-20 text-center"><div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"/></div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <Link to="/admin" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1"/>Back</Link>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <button onClick={()=>setShowAdd(!showAdd)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><Plus className="h-4 w-4 mr-1"/>Add Service</button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="font-bold text-gray-900">New Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Service Name" value={newService.name} onChange={e=>setNewService({...newService,name:e.target.value})} className="px-3 py-2 border rounded-md text-sm"/>
            <input type="number" placeholder="Base Price" value={newService.basePrice} onChange={e=>setNewService({...newService,basePrice:Number(e.target.value)})} className="px-3 py-2 border rounded-md text-sm"/>
            <textarea placeholder="Description" value={newService.description} onChange={e=>setNewService({...newService,description:e.target.value})} className="px-3 py-2 border rounded-md text-sm md:col-span-2" rows="2"/>
          </div>
          <div className="flex space-x-2"><button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Save</button><button onClick={()=>setShowAdd(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Cancel</button></div>
        </div>
      )}

      <div className="space-y-4">
        {services.map(s=>(
          <div key={s._id} className="bg-white rounded-xl shadow-sm border p-6">
            {editingId===s._id ? (
              <div className="space-y-3">
                <input value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm font-bold"/>
                <textarea value={editData.description} onChange={e=>setEditData({...editData,description:e.target.value})} className="w-full px-3 py-2 border rounded-md text-sm" rows="2"/>
                <input type="number" value={editData.basePrice} onChange={e=>setEditData({...editData,basePrice:Number(e.target.value)})} className="w-32 px-3 py-2 border rounded-md text-sm"/>
                <div className="flex space-x-2"><button onClick={()=>handleSave(s._id)} className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md text-sm"><Save className="h-3.5 w-3.5 mr-1"/>Save</button><button onClick={()=>setEditingId(null)} className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-sm"><X className="h-3.5 w-3.5 mr-1"/>Cancel</button></div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold text-gray-900">{s.name}</h3><p className="text-sm text-gray-600 mt-1">{s.description}</p><p className="text-sm font-semibold text-green-600 mt-2">Base: ${s.basePrice}/hr</p></div>
                <button onClick={()=>{setEditingId(s._id);setEditData({name:s.name,description:s.description,basePrice:s.basePrice});}} className="flex items-center px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"><Edit2 className="h-3.5 w-3.5 mr-1"/>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ServiceManagement;
