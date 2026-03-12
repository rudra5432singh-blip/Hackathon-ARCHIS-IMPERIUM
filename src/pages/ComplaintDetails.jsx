import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Building2, Tag, Calendar, Image as ImageIcon } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import ComplaintTimeline from '../components/ComplaintTimeline'

const DETAILS = {
  'C-1001': {
    title: 'Large pothole on MG Road near signal',
    description: 'A massive pothole has formed near the main traffic signal causing accidents daily. Vehicles are swerving dangerously to avoid it. The pothole is approximately 2 feet wide and 6 inches deep. Multiple two-wheelers have had accidents here in the past week.',
    category: 'Roads & Infrastructure',
    department: 'PWD - Roads Division',
    location: 'MG Road, near Halasur Signal, Bengaluru',
    date: 'March 08, 2026',
    status: 'Resolved',
    image: null,
    timeline: [
      { type: 'submitted', title: 'Complaint Submitted', time: 'Mar 08, 9:14 AM', description: 'Complaint received and logged in the system.', by: 'Citizen Portal' },
      { type: 'assigned', title: 'Assigned to Department', time: 'Mar 08, 10:02 AM', description: 'Auto-routed to PWD Roads Division based on category.', by: 'SCRS Auto Router' },
      { type: 'in-progress', title: 'Work Order Created', time: 'Mar 09, 11:30 AM', description: 'Field team dispatched to inspect site. Material procurement initiated.', by: 'Eng. Ramesh Kumar, PWD' },
      { type: 'in-progress', title: 'Repair In Progress', time: 'Mar 10, 8:00 AM', description: 'Road crew on site. Pothole filling underway.', by: 'Field Team A' },
      { type: 'resolved', title: 'Complaint Resolved', time: 'Mar 10, 4:30 PM', description: 'Pothole successfully repaired and road surface restored.', by: 'Superintendent, PWD' },
    ],
  },
  'C-1039': {
    title: 'Power outage affecting hospital block',
    description: 'Complete power outage affecting the hospital block in our area. Medical equipment is running on backup generators. Situation is critical as fuel for generators will last only 6 more hours. Immediate intervention required.',
    category: 'Electricity',
    department: 'BESCOM - Power Distribution',
    location: 'Rajajinagar, Near General Hospital, Bengaluru',
    date: 'March 09, 2026',
    status: 'Escalated',
    image: null,
    timeline: [
      { type: 'submitted', title: 'Complaint Submitted', time: 'Mar 09, 7:22 AM', description: 'Emergency complaint marked as high priority.', by: 'Hospital Admin Portal' },
      { type: 'assigned', title: 'Escalated to Senior Officer', time: 'Mar 09, 7:25 AM', description: 'Auto-escalated due to healthcare facility involvement. SEO notified.', by: 'SCRS Escalation Engine' },
      { type: 'escalated', title: 'Awaiting Emergency Crew', time: 'Mar 09, 8:10 AM', description: 'Emergency crew en route. ETA 45 mins. Backup transformer being arranged.', by: 'BESCOM Emergency Cell' },
    ],
  },
}

const DEFAULT_DETAIL = {
  title: 'Complaint Not Found',
  description: 'This complaint does not exist or has been removed.',
  category: 'Unknown', department: 'Unknown', location: 'Unknown',
  date: 'N/A', status: 'Pending', image: null, timeline: [],
}

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
      <Icon size={15} className="text-[#1E3A8A]" />
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
    </div>
  </div>
)

export default function ComplaintDetails() {
  const { id } = useParams()
  const detail = DETAILS[id] || { ...DEFAULT_DETAIL, title: `Complaint ${id}`, timeline: [
    { type: 'submitted', title: 'Complaint Submitted', time: 'Recently', description: 'Complaint received and logged.', by: 'Citizen Portal' },
    { type: 'assigned', title: 'Department Assigned', time: 'Processing', description: 'Being routed to concerned department.', by: 'SCRS Router' },
  ]}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-8 lg:px-8"
    >
      {/* Back */}
      <Link to="/track" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E3A8A] transition-colors no-underline mb-6 font-medium">
        <ArrowLeft size={16} /> Back to Complaints
      </Link>

      {/* Title header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">{id}</span>
              <StatusBadge status={detail.status} />
            </div>
            <h1 className="text-xl font-black text-gray-800 leading-snug">{detail.title}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{detail.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: info + image */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-2">Complaint Info</h2>
            <InfoRow icon={Tag} label="Category" value={detail.category} />
            <InfoRow icon={Building2} label="Department" value={detail.department} />
            <InfoRow icon={MapPin} label="Location" value={detail.location} />
            <InfoRow icon={Calendar} label="Submitted" value={detail.date} />
          </div>

          {/* Image panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Attached Evidence</h2>
            {detail.image ? (
              <img src={detail.image} alt="Complaint" className="w-full rounded-xl object-cover max-h-48" />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl text-gray-400">
                <ImageIcon size={28} className="mb-2" />
                <p className="text-xs font-medium">No image attached</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-6">Complaint Timeline</h2>
          <ComplaintTimeline events={detail.timeline} />
        </div>
      </div>
    </motion.div>
  )
}
