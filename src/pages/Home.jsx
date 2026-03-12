import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, BarChart3, CheckCircle, Users, Clock, Globe } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Instant Routing', desc: 'AI-powered routing directs complaints to the right department in seconds.', color: 'bg-blue-100 text-blue-600' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live dashboards track resolution rates and department performance.', color: 'bg-teal-100 text-teal-600' },
  { icon: Clock, title: 'SLA Tracking', desc: 'Automated escalation ensures complaints are resolved within SLA limits.', color: 'bg-orange-100 text-orange-600' },
  { icon: Globe, title: 'Multi-department', desc: 'Seamless coordination across all government departments and agencies.', color: 'bg-purple-100 text-purple-600' },
]

const stats = [
  { label: 'Complaints Resolved', value: '24,800+' },
  { label: 'Departments Connected', value: '48' },
  { label: 'Avg. Resolution Time', value: '3.2 days' },
  { label: 'Citizen Satisfaction', value: '94%' },
]

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1e4090] to-[#0f2560] px-6 py-24 lg:py-32">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#14B8A6]/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold mb-6 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
            System Online — Serving Citizens Across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
          >
            Smart Complaint
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#14B8A6]">
              Routing System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A government-grade civic technology platform that intelligently routes citizen complaints
            to the right department — ensuring faster resolutions and greater transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/submit"
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all no-underline hover:scale-105 active:scale-95"
            >
              Submit a Complaint <ArrowRight size={16} />
            </Link>
            <Link
              to="/track"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all no-underline backdrop-blur-sm"
            >
              Track Status
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative max-w-4xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center bg-white/10 border border-white/15 rounded-2xl px-4 py-4 backdrop-blur-sm">
              <p className="text-2xl font-black text-white mb-1">{s.value}</p>
              <p className="text-[11px] text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-black text-gray-800 mb-3">Built for Governments. Designed for Citizens.</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Every feature is designed to reduce bureaucratic friction and give citizens the transparency they deserve.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-[#38BDF8]" />
              <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-widest">Citizen Portal</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Have a complaint? We're listening.</h2>
            <p className="text-white/60 text-sm">Submit your complaint in under 2 minutes. Get real-time updates.</p>
            <div className="flex items-center gap-3 mt-4">
              {['24/7 Support', 'Anonymous Option', 'Real-time Updates'].map(t => (
                <span key={t} className="flex items-center gap-1 text-[11px] text-white/70 font-medium">
                  <CheckCircle size={11} className="text-green-400" /> {t}
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all no-underline shrink-0 hover:scale-105 active:scale-95"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </motion.div>
  )
}
