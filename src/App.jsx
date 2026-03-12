import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import TrackComplaint from './pages/TrackComplaint'
import ComplaintDetails from './pages/ComplaintDetails'
import ToastNotification from './components/ToastNotification'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAFB] font-sans">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex pt-16">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/dashboard" element={<Dashboard showToast={showToast} />} />
              <Route path="/submit" element={<SubmitComplaint showToast={showToast} />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/complaint/:id" element={<ComplaintDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </BrowserRouter>
  )
}
