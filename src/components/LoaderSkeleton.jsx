import { motion } from 'framer-motion'

function SkeletonBox({ className }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`bg-gray-200 rounded-xl ${className}`}
    />
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-8 w-16" />
          <SkeletonBox className="h-3 w-20" />
        </div>
        <SkeletonBox className="w-11 h-11 rounded-xl" />
      </div>
    </div>
  )
}

export function ComplaintCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1">
          <SkeletonBox className="w-16 h-6 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-1/2" />
          </div>
        </div>
        <SkeletonBox className="w-20 h-6 rounded-full" />
      </div>
      <SkeletonBox className="h-3 w-full mb-1.5" />
      <SkeletonBox className="h-3 w-2/3 mb-4" />
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-3 w-24" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {[200, 120, 100, 90, 80].map((w, j) => (
            <td key={j} className="px-4 py-4">
              <SkeletonBox className={`h-3.5 rounded`} style={{ width: w }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default function LoaderSkeleton({ type = 'card', count = 3 }) {
  if (type === 'stats') return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: count }).map((_, i) => <StatsCardSkeleton key={i} />)}</div>
  return <div className="space-y-4">{Array.from({ length: count }).map((_, i) => <ComplaintCardSkeleton key={i} />)}</div>
}
