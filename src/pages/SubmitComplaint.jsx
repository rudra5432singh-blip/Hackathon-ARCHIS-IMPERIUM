import { motion } from 'framer-motion'
import ComplaintForm from '../components/ComplaintForm'
import { FileText, MapPin, Bell, Shield } from 'lucide-react'

const steps = [
  { icon: FileText, title: 'Fill the Form', desc: 'Provide complaint details, category, and location.' },
  { icon: Shield, title: 'Auto Routing', desc: 'AI assigns it to the responsible department instantly.' },
  { icon: Bell, title: 'Get Updates', desc: 'Receive real-time status updates on your complaint.' },
  { icon: MapPin, title: 'Resolution', desc: 'Department resolves and closes the complaint on-site.' },
]

export default function SubmitComplaint({ showToast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8 lg:px-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800">Submit a Complaint</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below. Your complaint will be routed to the appropriate department automatically.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-6 py-5">
              <h2 className="text-white font-bold text-base">Complaint Details</h2>
              <p className="text-white/60 text-xs mt-0.5">All fields marked are required</p>
            </div>
            <div className="p-6">
              <ComplaintForm onSuccess={() => showToast && showToast('Complaint submitted successfully!', 'success')} />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">How It Works</h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center shrink-0">
                    <step.icon size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{step.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-5">
            <div className="flex items-start gap-2 mb-2">
              <Shield size={16} className="text-[#1E3A8A] mt-0.5" />
              <p className="text-sm font-bold text-[#1E3A8A]">Your Privacy is Protected</p>
            </div>
            <p className="text-xs text-blue-600 leading-relaxed">
              Your personal information is encrypted and only shared with the relevant department for resolution purposes. All complaints can be submitted anonymously.
            </p>
          </div>

          {/* SLA box */}
          <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Resolution SLA</p>
            {[
              { cat: 'Emergency', time: '24 hours', bar: 'w-full' },
              { cat: 'High Priority', time: '3 days', bar: 'w-4/5' },
              { cat: 'Normal', time: '7 days', bar: 'w-3/5' },
              { cat: 'Low Priority', time: '15 days', bar: 'w-2/5' },
            ].map(s => (
              <div key={s.cat} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white/80">{s.cat}</span>
                  <span className="text-xs text-white/60">{s.time}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full">
                  <div className={`h-full ${s.bar} bg-white/60 rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
