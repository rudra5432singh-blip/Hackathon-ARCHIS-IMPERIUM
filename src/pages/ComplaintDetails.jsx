import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, User, Building, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function ComplaintDetails() {
  const { id } = useParams()
  const { API_URL, user, socket } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [comment, setComment] = useState('')

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/${id}`);
      setComplaint(res.data);
    } catch (err) {
      console.error('Fetch detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, API_URL]);

  useEffect(() => {
    if (socket) {
      const handleUpdate = (update) => {
        if (update.id === id) {
          fetchDetails();
        }
      };
      socket.on('complaintUpdated', handleUpdate);
      return () => socket.off('complaintUpdated', handleUpdate);
    }
  }, [socket, id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/complaints/${id}/status`, { status: newStatus, comment });
      setComment('');
      fetchDetails();
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  if (!complaint) return <div className="p-10 text-center">Complaint not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-8 bg-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-primary p-2 bg-blue-50 rounded-lg tracking-tighter">CASE #{complaint.id}</span>
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{complaint.title}</h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">{complaint.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Location</p>
                  <p className="text-xs font-bold text-slate-700">{complaint.location || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Clock size={16} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reported On</p>
                  <p className="text-xs font-bold text-slate-700">{new Date(complaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Timeline & Updates</h3>
              <div className="space-y-6">
                {complaint.ComplaintUpdates?.map((u, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-blue-50"></div>
                      <div className="w-0.5 flex-1 bg-slate-100 mt-2"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-black text-slate-700">{u.status}</span>
                        <span className="text-[10px] text-slate-400 font-medium">— {new Date(u.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {u.comment || 'Status updated by department.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card p-6 bg-slate-900 text-white">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-400">Department Node</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building size={18} className="text-primary-light" />
                <p className="text-sm font-bold">{complaint.Department?.name || 'Unassigned'}</p>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-amber-400" />
                <p className="text-sm font-bold uppercase tracking-tighter">Priority: {complaint.priority}</p>
              </div>
            </div>
          </div>

          {user?.role === 'Department Admin' && user?.department_id === complaint.department_id && (
            <div className="premium-card p-6 bg-white border-2 border-primary/10">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-slate-800">Admin Actions</h3>
              <textarea
                placeholder="Add internal comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full premium-input h-24 mb-4 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleStatusUpdate('In Progress')}
                  disabled={updating}
                  className="premium-button bg-amber-500 text-white text-[10px] h-10"
                >In Progress</button>
                <button 
                  onClick={() => handleStatusUpdate('Resolved')}
                  disabled={updating}
                  className="premium-button bg-emerald-500 text-white text-[10px] h-10"
                >Resolved</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
