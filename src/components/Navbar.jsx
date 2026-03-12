import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Shield, Menu, X, User, Settings, LogOut } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/submit', label: 'Submit Complaint' },
    { to: '/track', label: 'Track' },
  ]

  const notifications = [
    { id: 1, text: 'Complaint #C-1042 resolved', time: '2m ago', dot: 'bg-green-500' },
    { id: 2, text: 'New complaint assigned to Roads dept.', time: '15m ago', dot: 'bg-blue-500' },
    { id: 3, text: 'Complaint #C-1039 escalated', time: '1h ago', dot: 'bg-yellow-500' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm ring-1 ring-black/[0.02]">
      <div className="flex items-center justify-between h-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden active:scale-90"
          >
            <Menu size={20} className="text-slate-600" />
          </button>
          
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center shadow-[0_8px_16px_rgba(37,99,235,0.2)] ring-4 ring-white"
            >
              <Shield size={20} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-[14px] font-black text-slate-800 leading-none tracking-tighter">ARCHIS <span className="text-primary tracking-[0.2em] font-extrabold ml-0.5">IMPERIUM</span></p>
              <p className="text-[9px] text-emerald-600 font-black tracking-[0.3em] uppercase mt-1 leading-none opacity-80">Smart City Shield</p>
            </div>
          </Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-1.5 px-1.5 py-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/20 shadow-inner">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 no-underline whitespace-nowrap ${
                location.pathname === link.to
                  ? 'bg-white text-primary shadow-[0_2px_10px_rgba(0,0,0,0.06)] scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
              className={`relative p-2.5 rounded-xl transition-all ${notifOpen ? 'bg-primary/5 text-primary' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden ring-1 ring-black/5"
                >
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <p className="text-[13px] font-black text-slate-800">Alert Center</p>
                    <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">3 New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white transition-colors border-b border-slate-50 cursor-pointer group">
                        <span className={`w-2 h-2 ${n.dot} rounded-full mt-1.5 shrink-0 shadow-sm group-hover:scale-125 transition-transform`}></span>
                        <div>
                          <p className="text-[13px] text-slate-700 font-medium leading-tight">{n.text}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 text-[11px] text-primary font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                    View Comprehensive Log
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
              className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:ring-4 active:ring-primary/5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white text-[11px] font-black shadow-inner">
                AD
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 mt-3 w-60 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden ring-1 ring-black/5"
                >
                  <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-800 tracking-tight">Admin User</p>
                    <p className="text-[10px] text-slate-400 font-bold opacity-80 mt-0.5">administrator@archis.gov</p>
                  </div>
                  <div className="p-1.5">
                    {[
                      { icon: User, label: 'Manage Profile', onClick: () => setProfileOpen(true) },
                      { icon: Settings, label: 'System Preferences' },
                      { icon: LogOut, label: 'Sign Out Account', danger: true },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.onClick) item.onClick()
                          setDropdownOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:bg-white hover:shadow-sm ${item.danger ? 'text-rose-500 hover:text-rose-600' : 'text-slate-600 hover:text-primary'}`}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="h-32 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              </div>
              <div className="px-8 pb-8">
                <div className="relative -mt-14 mb-6">
                  <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-2xl ring-1 ring-black/5">
                    <div className="w-full h-full rounded-[1.25rem] bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white text-3xl font-black shadow-inner">
                      AD
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Admin User</h2>
                    <p className="text-sm text-slate-400 font-bold mt-1">Municipal Oversight Unit</p>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setProfileOpen(false)}
                    className="p-2.5 hover:bg-slate-100 rounded-2xl transition-colors"
                  >
                    <X size={20} className="text-slate-400" />
                  </motion.button>
                </div>
                <div className="mt-8 grid gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5">Current Role</p>
                    <p className="text-sm font-black text-slate-700">Senior Systems Administrator</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5">Department</p>
                    <p className="text-sm font-black text-slate-700">Infrastructure & Digital Governance</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5">Official ID</p>
                    <p className="text-sm font-black text-slate-700 tracking-widest">IMP-2026-ARCHIS</p>
                  </div>
                </div>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="premium-button w-full mt-8 bg-slate-900 text-white hover:bg-black shadow-2xl shadow-slate-900/20 h-14"
                >
                  Edit Professional Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}
