import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, Loader2, MapPin, FileText, Tag, AlignLeft, Image } from 'lucide-react'

const categories = ['Roads & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Public Safety', 'Parks & Recreation', 'Other']

export default function ComplaintForm({ onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState('')
  const fileRef = useRef()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = ev => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))
    
    const newComplaint = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      ...form,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      department: 'Pending Assignment'
    }

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('user_complaints') || '[]')
    localStorage.setItem('user_complaints', JSON.stringify([newComplaint, ...saved]))

    setSubmitting(false)
    setSubmitted(true)
    if (onSuccess) onSuccess()
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-16 px-6"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="absolute inset-0 bg-emerald-100 rounded-full"
          />
          <svg className="absolute inset-0 w-full h-full text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
              d="M20 6L9 17L4 12"
            />
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Submission Successful</h3>
          <p className="text-slate-500 text-sm mb-10 max-w-[280px] mx-auto leading-relaxed">
            Your complaint has been registered and is being routed for immediate action.
          </p>
          
          <button
            onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', location: '' }); setImage(null); setImagePreview(null) }}
            className="premium-button bg-primary text-white hover:bg-primary-light shadow-xl shadow-blue-500/20 px-8"
          >
            Submit Another
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FloatingInput name="title" label="Complaint Title" icon={FileText} value={form.title} onChange={handleChange} focused={focused} setFocused={setFocused} />

      <div className="relative group">
        <div className={`absolute left-3 top-4 transition-colors ${focused === 'desc' || form.description ? 'text-primary' : 'text-slate-400'}`}>
          <AlignLeft size={16} />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          onFocus={() => setFocused('desc')}
          onBlur={() => setFocused('')}
          placeholder="Describe your complaint in detail..."
          rows={4}
          required
          className={`premium-input w-full pl-10 resize-none ${focused === 'desc' ? 'border-primary ring-4 ring-primary/5' : ''}`}
        />
      </div>

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
          <Tag size={16} />
        </div>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="premium-input w-full pl-10 appearance-none cursor-pointer"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <FloatingInput name="location" label="Location / Area" icon={MapPin} value={form.location} onChange={handleChange} focused={focused} setFocused={setFocused} />

      {/* Image Upload */}
      <div
        onClick={() => fileRef.current.click()}
        className="premium-card p-6 cursor-pointer group border-dashed border-2 bg-slate-50/50 hover:bg-white transition-all overflow-hidden"
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="preview" className="w-full h-44 object-cover rounded-xl shadow-inner" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={e => { e.stopPropagation(); setImage(null); setImagePreview(null) }}
              className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-slate-400 group-hover:text-primary transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-110">
              <Image size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">Click to upload photo evidence</p>
              <p className="text-[11px] font-medium">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.98 }}
        className="premium-button w-full bg-primary text-white hover:bg-primary-light shadow-xl shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-14"
      >
        {submitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={18} />
            </motion.div>
            <span className="font-bold tracking-tight">Processing submission...</span>
          </>
        ) : (
          <span className="font-bold tracking-tight">Submit Registration</span>
        )}
      </motion.button>
    </form>
  )
}

const FloatingInput = ({ name, label, icon: Icon, type = 'text', value, onChange, focused, setFocused }) => (
  <div className="relative group">
    <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focused === name || value ? 'text-primary' : 'text-slate-400'}`}>
      <Icon size={16} />
    </div>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused('')}
      placeholder={label}
      required
      className={`premium-input w-full pl-10 ${focused === name ? 'border-primary ring-4 ring-primary/5 shadow-sm' : ''}`}
    />
  </div>
)
