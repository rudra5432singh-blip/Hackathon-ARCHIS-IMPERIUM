import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Map as MapIcon, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HeatmapMap from '../components/HeatmapMap';
import AnalyticsFilters from '../components/AnalyticsFilters';
import StatsCard from '../components/StatsCard';

export default function Analytics() {
  const { API_URL, socket } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const fetchLocations = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await axios.get(`${API_URL}/analytics/complaint-locations?${params.toString()}`);
      setComplaints(res.data);
    } catch (err) {
      console.error('Fetch locations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [filters, API_URL]);

  useEffect(() => {
    if (socket) {
      const handleNew = () => fetchLocations();
      const handleUpdate = () => fetchLocations();

      socket.on('complaintCreated', handleNew);
      socket.on('complaintUpdated', handleUpdate);

      return () => {
        socket.off('complaintCreated', handleNew);
        socket.off('complaintUpdated', handleUpdate);
      };
    }
  }, [socket]);

  // Statistics calculation
  const total = complaints.length;
  const categoriesCount = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoriesCount).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 lg:px-8"
    >
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Activity className="text-rose-500" size={28} />
            City Geospatial Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time complaint density and hotspot visualization dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Tracking
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Mapped Cases" value={total} icon={MapIcon} color="text-primary" bgGradient="bg-gradient-to-br from-blue-600 to-indigo-500" delay={0.1} />
        <StatsCard title="Top Hotspot" value={topCategory} icon={AlertCircle} color="text-rose-500" bgGradient="bg-gradient-to-br from-rose-500 to-pink-500" delay={0.2} />
        <StatsCard title="Total Density" value={`${total > 0 ? (total * 1.2).toFixed(1) : 0}%`} icon={TrendingUp} color="text-amber-500" bgGradient="bg-gradient-to-br from-amber-500 to-orange-400" delay={0.3} />
        <StatsCard title="Filtered Events" value={total} icon={FileText} color="text-indigo-500" bgGradient="bg-gradient-to-br from-indigo-500 to-purple-500" delay={0.4} />
      </div>

      <AnalyticsFilters filters={filters} setFilters={setFilters} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="premium-card p-1 bg-white relative overflow-hidden"
      >
        <HeatmapMap complaints={complaints} />
        
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compiling Geospatial Data...</p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 premium-card p-6 bg-slate-900 text-white">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-60 text-white">Heatmap Color Index</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full"></div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter opacity-80">
                <span>Low Intensity</span>
                <span>Critical Density</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[240px]">
              Regions highlighted in <span className="text-rose-400 font-bold">Red</span> indicate high-priority clusters requiring immediate resource allocation.
            </p>
          </div>
        </div>
        <div className="premium-card p-6 bg-white border-2 border-primary/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">Export Options</h3>
          <button className="w-full premium-button bg-slate-100 text-slate-800 text-[10px] mb-2">Download Heatmap Overlay</button>
          <button className="w-full premium-button bg-primary text-white text-[10px]">Generate Spatial Report</button>
        </div>
      </div>
    </motion.div>
  );
}
