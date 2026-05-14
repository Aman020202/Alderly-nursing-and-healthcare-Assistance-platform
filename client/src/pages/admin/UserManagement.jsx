import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserTableRowSkeleton } from '../../components/Skeleton';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, role: roleFilter, page, limit: 15 });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users?${params}`, { headers });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [debouncedSearch, roleFilter, page]);

  const handleSuspend = async (userId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/suspend`, {}, { headers });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <Link to="/admin" className="text-blue-600 text-sm font-medium flex items-center"><ArrowLeft className="h-4 w-4 mr-1"/>Back</Link>
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <input type="text" placeholder="Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"/>
          </div>
          <select value={roleFilter} onChange={e=>{setRoleFilter(e.target.value);setPage(1);}} className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="All">All Roles</option>
            <option value="Elderly/Family">Family</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? [...Array(10)].map((_, i) => <UserTableRowSkeleton key={i} />)
              : users.map(u=>(
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="flex items-center"><div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mr-3">{u.name.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div></div></td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100">{u.role}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{u.isSuspended?<span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-800">Suspended</span>:<span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>}</td>
                  <td className="px-6 py-4 text-right">{u.role!=='Admin'&&<button onClick={()=>handleSuspend(u._id)} className={`px-3 py-1.5 text-xs font-medium rounded-md border ${u.isSuspended?'text-green-700 border-green-200 bg-green-50':'text-red-700 border-red-200 bg-red-50'}`}>{u.isSuspended?'Reactivate':'Suspend'}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1&&<div className="px-6 py-4 border-t flex justify-center space-x-2"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button><span className="px-3 py-1 text-sm">Page {page}/{totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button></div>}
      </div>
    </div>
  );
};
export default UserManagement;
