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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FloatingInput name="title" label="Complaint Title" icon={FileText} value={form.title} onChange={handleChange} focused={focused} setFocused={setFocused} />

      <div className="relative">
        <div className={`absolute left-3 top-3.5 transition-colors ${focused === 'desc' || form.description ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>
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
          className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-sm font-medium text-gray-800 outline-none transition-all resize-none ${
            focused === 'desc' ? 'border-[#1E3A8A] bg-white shadow-sm' : 'border-transparent hover:border-gray-200'
          }`}
        />
      </div>

      <div className="relative">
        <div className="absolute left-3 top-3.5 text-gray-400">
          <Tag size={16} />
        </div>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <FloatingInput name="location" label="Location / Area" icon={MapPin} value={form.location} onChange={handleChange} focused={focused} setFocused={setFocused} />

      {/* Image Upload */}
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-gray-200 hover:border-[#1E3A8A] rounded-xl p-5 cursor-pointer transition-colors group"
      >
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setImage(null); setImagePreview(null) }}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#1E3A8A] transition-colors">
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
              <Image size={20} />
            </div>
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Complaint'
        )}
      </motion.button>
    </form>
  )
}

const FloatingInput = ({ name, label, icon: Icon, type = 'text', value, onChange, focused, setFocused }) => (
  <div className="relative">
    <div className={`absolute left-3 top-3.5 transition-colors ${focused === name || value ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>
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
      className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-sm font-medium text-gray-800 outline-none transition-all ${
        focused === name ? 'border-[#1E3A8A] bg-white shadow-sm' : 'border-transparent hover:border-gray-200'
      }`}
    />
  </div>
)
