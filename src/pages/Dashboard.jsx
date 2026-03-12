import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Clock, CheckCircle2, AlertCircle, ChevronRight, X, TrendingUp, FileText } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import LoaderSkeleton, { TableRowSkeleton, StatsCardSkeleton } from '../components/LoaderSkeleton'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const DEPARTMENTS = [
  { name: 'Roads Dept', resolved: 45, complaints: 52, pct: 86 },
  { name: 'Sanitation', resolved: 128, complaints: 142, pct: 90 },
  { name: 'Power Grid', resolved: 32, complaints: 48, pct: 66 },
  { name: 'Water Board', resolved: 12, complaints: 28, pct: 42 },
]

export default function Dashboard({ showToast }) {
  const { user, socket, API_URL } = useAuth()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [allComplaints, setAllComplaints] = useState([])

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints`);
      setAllComplaints(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [API_URL]);

  useEffect(() => {
    if (socket) {
      const handleNew = (newComplaint) => {
        if (user.role === 'Citizen' && newComplaint.created_by !== user.id) return;
        if (user.role === 'Department Admin' && newComplaint.department_id !== user.department_id) return;

        setAllComplaints(prev => [newComplaint, ...prev]);
        showToast && showToast('New complaint received!', 'info');
      };

      const handleUpdate = ({ id, status }) => {
        setAllComplaints(prev => prev.map(c => 
          c.id === id ? { ...c, status } : c
        ));
      };

      socket.on('complaintCreated', handleNew);
      socket.on('complaintUpdated', handleUpdate);

      return () => {
        socket.off('complaintCreated', handleNew);
        socket.off('complaintUpdated', handleUpdate);
      };
    }
  }, [socket, user, showToast]);

  const filtered = allComplaints.filter(c => {
    const s = search.toLowerCase()
    const matchSearch = c.title.toLowerCase().includes(s) || c.id.toLowerCase().includes(s)
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 lg:px-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Governance Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.name} — {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Network Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [0,1,2,3].map(i => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard title="Total Cases" value={allComplaints.length} icon={FileText} color="text-primary" bgGradient="bg-gradient-to-br from-blue-600 to-blue-400" delay={0.1} />
            <StatsCard title="In Progress" value={allComplaints.filter(c => c.status === 'In Progress').length} icon={Clock} color="text-amber-500" bgGradient="bg-gradient-to-br from-amber-500 to-orange-400" delay={0.2} />
            <StatsCard title="Resolved" value={allComplaints.filter(c => c.status === 'Resolved').length} icon={CheckCircle2} color="text-emerald-500" bgGradient="bg-gradient-to-br from-emerald-500 to-teal-400" delay={0.3} />
            <StatsCard title="Escalated" value={allComplaints.filter(c => c.status === 'Escalated').length} icon={AlertCircle} color="text-rose-500" bgGradient="bg-gradient-to-br from-rose-500 to-pink-400" delay={0.4} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 premium-card overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-gray-50/30">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Active Complaints</h2>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Filter by ID or title..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium w-48 shadow-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
              >
                {['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {['ID', 'Title', 'Dept', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {loading ? (
                  <TableRowSkeleton rows={5} />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <p className="text-sm font-semibold text-slate-400">No complaints found.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <Link to={`/complaint/${c.id}`} className="text-[12px] font-black text-primary hover:text-primary-light no-underline tracking-tighter">
                          #{c.id}
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate">{c.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{c.category}</span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                            c.priority === 'urgent' ? 'bg-rose-100 text-rose-600' : 
                            c.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {c.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[11px] text-slate-500 font-bold uppercase">
                        {c.Department?.name?.split(' ')[0] || 'TBD'}
                      </td>
                      <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-5 text-[11px] text-slate-400 font-medium">
                        {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6"
        >
          <h2 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">System Performance</h2>
          <div className="space-y-6">
            {DEPARTMENTS.map((d, i) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{d.name}</p>
                  <span className="text-[11px] font-black text-emerald-600">{d.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <button className="premium-button w-full bg-primary text-white text-[10px]">Export System Logs</button>
            <button className="premium-button w-full border border-slate-200 text-slate-600 text-[10px]">Access Audit Trail</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
