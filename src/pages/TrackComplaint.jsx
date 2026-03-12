import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, AlertCircle } from 'lucide-react'
import ComplaintCard from '../components/ComplaintCard'
import LoaderSkeleton from '../components/LoaderSkeleton'
import StatusBadge from '../components/StatusBadge'

const COMPLAINTS = [
  { id: 'C-1001', title: 'Large pothole on MG Road near signal', category: 'Roads', department: 'PWD - Roads Division', status: 'Resolved', location: 'MG Road', date: 'Mar 08, 2026', description: 'A massive pothole has formed near the main traffic signal causing accidents daily. Vehicles are swerving dangerously to avoid it.' },
  { id: 'C-1002', title: 'Water supply disrupted for 3 days', category: 'Water', department: 'BWSSB - Water Supply', status: 'In Progress', location: 'Koramangala 5th Block', date: 'Mar 09, 2026', description: 'No water supply in our area for the past 3 days. We have raised multiple complaints but no action taken.' },
  { id: 'C-1003', title: 'Street light out since 2 weeks', category: 'Electricity', department: 'BESCOM - Lighting', status: 'Pending', location: 'Indiranagar', date: 'Mar 10, 2026', description: 'Street light near children park has been out for 2 weeks creating unsafe environment at night.' },
  { id: 'C-1004', title: 'Garbage not collected for 5 days', category: 'Sanitation', department: 'BBMP - Solid Waste', status: 'Pending', location: 'Whitefield', date: 'Mar 10, 2026', description: 'Garbage has not been collected in our locality for 5 consecutive days, causing hygiene issues.' },
  { id: 'C-1005', title: 'Sewage overflow near school', category: 'Sanitation', department: 'BWSSB - Sewage', status: 'In Progress', location: 'Jayanagar', date: 'Mar 11, 2026', description: 'Sewage is overflowing onto the main road near the government school, posing a health hazard to students.' },
  { id: 'C-1006', title: 'Broken footpath near bus stop', category: 'Roads', department: 'PWD - Roads Division', status: 'Resolved', location: 'HSR Layout', date: 'Mar 07, 2026', description: 'Footpath near the main bus stop is completely broken, making it difficult for pedestrians and elderly.' },
]

const ALL_STATUSES = ['All', 'Pending', 'In Progress', 'Resolved']
const ALL_CATEGORIES = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation']

export default function TrackComplaint() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('All')
  const [loading] = useState(false)
  const [allComplaints, setAllComplaints] = useState([])

  useState(() => {
    const saved = JSON.parse(localStorage.getItem('user_complaints') || '[]')
    setAllComplaints([...saved, ...COMPLAINTS])
  }, [])

  const filtered = allComplaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'All' || c.status === status
    const matchCat = category === 'All' || c.category === category
    return matchSearch && matchStatus && matchCat
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8 lg:px-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">Track Complaints</h1>
        <p className="text-gray-500 text-sm mt-1">Search, filter, and monitor all submitted complaints.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, ID, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-[#1E3A8A] rounded-xl text-sm outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium outline-none border-2 border-transparent focus:border-[#1E3A8A] cursor-pointer transition-all">
              {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium outline-none border-2 border-transparent focus:border-[#1E3A8A] cursor-pointer transition-all">
              {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoaderSkeleton type="card" count={4} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <AlertCircle size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No complaints found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="flex items-center gap-1.5">
              {ALL_STATUSES.slice(1).map(s => (
                <span key={s} className="flex items-center gap-1 text-[11px] text-gray-500">
                  <StatusBadge status={s} />
                  <span className="hidden sm:inline">{COMPLAINTS.filter(c => c.status === s).length}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => <ComplaintCard key={c.id} complaint={c} index={i} />)}
          </div>
        </>
      )}
    </motion.div>
  )
}
