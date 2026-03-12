import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Search, X, Filter, ChevronDown } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import { StatsCardSkeleton, TableRowSkeleton } from '../components/LoaderSkeleton'
import { Link } from 'react-router-dom'

const STATS = [
  { title: 'Total Complaints', value: 1284, icon: FileText, color: 'text-[#1E3A8A]', bgGradient: 'bg-gradient-to-br from-[#1E3A8A] to-[#2563EB]', trend: '+12% this month' },
  { title: 'Pending', value: 342, icon: Clock, color: 'text-yellow-600', bgGradient: 'bg-gradient-to-br from-yellow-400 to-orange-500', trend: '-5% vs last week' },
  { title: 'In Progress', value: 487, icon: TrendingUp, color: 'text-sky-600', bgGradient: 'bg-gradient-to-br from-sky-400 to-[#14B8A6]', trend: '+8% this week' },
  { title: 'Resolved', value: 455, icon: CheckCircle, color: 'text-green-600', bgGradient: 'bg-gradient-to-br from-green-400 to-[#22C55E]', trend: '+22% this month' },
]

const COMPLAINTS = [
  { id: 'C-1042', title: 'Broken traffic signal at main junction', category: 'Roads', department: 'PWD', status: 'Resolved', date: 'Mar 10, 2026' },
  { id: 'C-1041', title: 'No water supply in sector 4B', category: 'Water', department: 'BWSSB', status: 'In Progress', date: 'Mar 10, 2026' },
  { id: 'C-1040', title: 'Illegal construction near lake boundary', category: 'Other', department: 'BBMP', status: 'Pending', date: 'Mar 09, 2026' },
  { id: 'C-1039', title: 'Power outage affecting hospital block', category: 'Electricity', department: 'BESCOM', status: 'Escalated', date: 'Mar 09, 2026' },
  { id: 'C-1038', title: 'Public park encroachment', category: 'Other', department: 'BBMP', status: 'Pending', date: 'Mar 08, 2026' },
  { id: 'C-1037', title: 'Damaged stormwater drain', category: 'Sanitation', department: 'BWSSB', status: 'In Progress', date: 'Mar 08, 2026' },
  { id: 'C-1036', title: 'Missing manhole cover on main road', category: 'Roads', department: 'PWD', status: 'Resolved', date: 'Mar 07, 2026' },
]

const DEPARTMENTS = [
  { name: 'PWD - Roads', complaints: 312, resolved: 241, pct: 77 },
  { name: 'BWSSB - Water', complaints: 284, resolved: 190, pct: 67 },
  { name: 'BESCOM - Power', complaints: 198, resolved: 165, pct: 83 },
  { name: 'BBMP - Sanitation', complaints: 490, resolved: 327, pct: 67 },
]

export default function Dashboard({ showToast }) {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [allComplaints, setAllComplaints] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('user_complaints') || '[]')
    setAllComplaints([...saved, ...COMPLAINTS])
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

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
          <h1 className="text-2xl font-black text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Thursday, 12 March 2026 — Bengaluru Municipal Zone</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Data
          </span>
          <button
            onClick={() => showToast && showToast('Dashboard refreshed!', 'info')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-semibold hover:bg-[#1e40af] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0,1,2,3].map(i => <StatsCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => <StatsCard key={i} {...s} delay={i * 0.08} />)}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Complaints Table — takes 2/3 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-2 premium-card overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap bg-gray-50/30">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Recent Complaints</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Filter by ID or title..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium w-48 shadow-sm"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-0.5 rounded-md transition-colors"><X size={12} className="text-gray-400" /></button>}
              </div>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
              >
                {['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {['ID', 'Title', 'Department', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {loading ? (
                  <TableRowSkeleton rows={7} />
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Search size={32} className="text-gray-200" />
                       <p className="text-sm font-semibold text-slate-400">No matching complaints found</p>
                    </div>
                  </td></tr>
                ) : filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <Link to={`/complaint/${c.id}`} className="text-[12px] font-black text-primary hover:text-primary-light no-underline tracking-tighter transition-colors">#{c.id}</Link>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-700 max-w-[240px] truncate leading-relaxed">{c.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{c.category}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[11px] text-slate-500 font-black tracking-tighter uppercase">{c.department}</span>
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-5 text-[11px] text-slate-400 font-medium whitespace-nowrap">{c.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Department performance */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="premium-card p-6"
        >
          <h2 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">Department Performance</h2>
          <div className="space-y-6">
            {DEPARTMENTS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{d.name}</p>
                  <span className={`text-[11px] font-black ${d.pct >= 80 ? 'text-emerald-600' : d.pct >= 65 ? 'text-amber-600' : 'text-rose-500'}`}>{d.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    className={`h-full rounded-full ${d.pct >= 80 ? 'bg-emerald-500' : d.pct >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight">{d.resolved} Resolved</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight">{d.complaints} Total</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
            {[
              { label: 'Export Analytics Report', color: 'bg-slate-900 text-white shadow-lg shadow-slate-200' },
              { label: 'Resource Allocation', color: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => showToast && showToast(`${btn.label} triggered!`, 'info')}
                className={`w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
