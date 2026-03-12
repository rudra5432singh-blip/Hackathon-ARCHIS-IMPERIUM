import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, Shield, Menu, X, User, Settings, LogOut } from 'lucide-react'

export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-white/90 border-b border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center shadow-sm">
              <Shield size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-800 text-[#1E3A8A] leading-tight tracking-tight font-black">SMART COMPLAINT</p>
              <p className="text-[10px] text-[#14B8A6] font-semibold tracking-widest uppercase leading-tight">Routing System</p>
            </div>
          </Link>
        </div>

        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                location.pathname === link.to
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false) }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">Notifications</p>
                    <span className="text-xs bg-[#EF4444] text-white px-2 py-0.5 rounded-full">3 new</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50">
                      <span className={`w-2 h-2 ${n.dot} rounded-full mt-1.5 shrink-0`}></span>
                      <div>
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2 text-center">
                    <button className="text-xs text-[#2563EB] font-medium hover:underline">View all</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false) }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">Admin User</p>
                <p className="text-[10px] text-gray-400">Administrator</p>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                    { icon: LogOut, label: 'Logout', danger: true },
                  ].map(item => (
                    <button
                      key={item.label}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${item.danger ? 'text-[#EF4444]' : 'text-gray-700'}`}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}
