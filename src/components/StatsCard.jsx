import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function StatsCard({ title, value, icon: Icon, color, trend, bgGradient, delay = 0 }) {
  const count = useCounter(value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-default relative overflow-hidden"
    >
      {/* background blob */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${bgGradient}`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-3xl font-black ${color}`}>{count.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-green-500" />
              <span className="text-[11px] text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgGradient}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}
