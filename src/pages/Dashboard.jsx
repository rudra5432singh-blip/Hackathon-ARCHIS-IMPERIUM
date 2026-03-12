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

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const filtered = COMPLAINTS.filter(c => {
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

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Complaints Table — takes 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-bold text-gray-800">Recent Complaints</h2>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-7 pr-7 py-1.5 bg-gray-50 rounded-lg text-xs outline-none border-2 border-transparent focus:border-[#1E3A8A] transition-all font-medium w-36"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400" /></button>}
              </div>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-medium outline-none cursor-pointer border-2 border-transparent focus:border-[#1E3A8A] transition-all"
              >
                {['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID', 'Title', 'Department', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton rows={6} />
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No results found</td></tr>
                ) : filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <Link to={`/complaint/${c.id}`} className="text-xs font-bold text-[#1E3A8A] no-underline hover:underline">{c.id}</Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-gray-700 max-w-[200px] truncate">{c.title}</p>
                      <p className="text-[11px] text-gray-400">{c.category}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 font-medium whitespace-nowrap">{c.department}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5 text-[11px] text-gray-400 whitespace-nowrap">{c.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-5">Department Performance</h2>
          <div className="space-y-4">
            {DEPARTMENTS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700">{d.name}</p>
                  <span className={`text-[11px] font-bold ${d.pct >= 80 ? 'text-green-600' : d.pct >= 65 ? 'text-yellow-600' : 'text-red-500'}`}>{d.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    className={`h-full rounded-full ${d.pct >= 80 ? 'bg-green-500' : d.pct >= 65 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-gray-400">{d.resolved} resolved</p>
                  <p className="text-[11px] text-gray-400">{d.complaints} total</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
            <p className="text-xs font-bold text-gray-600 mb-3">Quick Actions</p>
            {[
              { label: 'Export Full Report', color: 'bg-[#1E3A8A] text-white' },
              { label: 'Send Escalation Alerts', color: 'bg-red-50 text-red-600 border border-red-100' },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => showToast && showToast(`${btn.label} triggered!`, 'info')}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80 ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
