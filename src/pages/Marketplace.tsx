import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Search, Wrench, User as UserIcon, Hammer, Star, CheckCircle2, Users, TrendingUp, ThumbsUp,
  Clock, Heart, Map as MapIcon, Zap
} from 'lucide-react';
import { APIProvider, Map as GoogleMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { cn, formatDate, calculateDistance, formatDistance } from '../lib/utils';
import { useStore } from '../lib/useStore';
import { store } from '../lib/store';
import { Job, JobCategory, User } from '../types';
import { Button, Card } from '../components/ui';
import { useState } from 'react';

const categoryIcons: Record<string, React.ElementType> = {
  Electrical: Zap,
  Plumbing: Wrench,
  Carpentry: Hammer,
  'Smart Home': Wrench,
  Other: Wrench,
};

interface MarketplaceProps {
  userLocation: { lat: number; lng: number } | null;
  onViewWorkerProfile: (worker: User) => void;
}

export function Marketplace({ userLocation, onViewWorkerProfile }: MarketplaceProps) {
  const { jobs, currentUser } = useStore();
  const navigate = useNavigate();

  const MAP_KEY = (import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta.env as any).GOOGLE_MAPS_PLATFORM_KEY || '')
    .replace('PASTE_YOUR_GOOGLE_MAPS_KEY_HERE', '');

  const nearbyJobs = jobs.filter(j => {
    if (!userLocation) return true;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, j.location.lat, j.location.lng);
    return distance <= 100;
  });

  const mapJobs = jobs.filter(j => {
    if (!userLocation) return true;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, j.location.lat, j.location.lng);
    return distance <= 100 && (j.status === 'Open' || j.status === 'Bidding');
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <JobFeed jobs={nearbyJobs} userLocation={userLocation} />
      </div>
      <div className="hidden lg:block space-y-6">
        <div className="sticky top-24">
          <Card className="h-[400px] bg-gray-100 relative group overflow-hidden border-2 border-white rounded-[32px] shadow-xl">
            {MAP_KEY ? (
              <APIProvider apiKey={MAP_KEY}>
                <GoogleMap
                  center={userLocation || { lat: 12.9716, lng: 77.5946 }}
                  defaultZoom={11}
                  mapId="lovi_map"
                  style={{ width: '100%', height: '100%' }}
                >
                  {userLocation && (
                    <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }} title="You">
                      <div className="w-10 h-10 bg-sky-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce z-50">
                        {currentUser?.role === 'Worker' ? (
                          <Hammer className="w-5 h-5 text-white" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </AdvancedMarker>
                  )}
                  {mapJobs.map(j => (
                    <AdvancedMarker key={j.id} position={{ lat: j.location.lat, lng: j.location.lng }} onClick={() => navigate(`/job/${j.id}`)}>
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg shadow-lg flex items-center justify-center border-2 border-white hover:scale-110 transition-transform cursor-pointer">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                    </AdvancedMarker>
                  ))}
                </GoogleMap>
              </APIProvider>
            ) : (
              <div className="h-full flex items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm">
                <div className="max-w-[200px]">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="w-8 h-8 text-sky-500" />
                  </div>
                  <p className="text-sm text-gray-900 font-bold mb-1">Interactive Map</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Add your Google Maps API Key to .env to enable the radar.</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl border border-gray-100 z-10 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-sky-600">
                <MapPin className="w-3 h-3" />
                Marketplace (100km Radius)
              </p>
            </div>
          </Card>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#0F172A]">Recommended Professionals</h3>
              <button onClick={() => navigate('/professionals')} className="text-[10px] font-semibold text-[#0EA5E9] hover:text-[#0284C7] transition-colors">View All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {store.getUsers().filter(u => u.role === 'Worker').slice(0, 6).map(u => (
                <motion.div
                  key={u.id}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-36 bg-white rounded-xl border border-[#E2E8F0] p-4 text-center cursor-pointer hover:border-[#0EA5E9]/30 hover:shadow-md transition-all"
                  onClick={() => onViewWorkerProfile(u)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center mx-auto mb-3 text-white text-sm font-bold shadow-sm">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-xl" />
                    ) : u.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-[#0F172A] truncate flex items-center justify-center gap-1">
                    {u.name?.split(' ')[0]}
                    {u.verified && <CheckCircle2 className="w-3 h-3 text-[#0EA5E9]" />}
                  </p>
                  <p className="text-[9px] text-[#64748B] mt-0.5 truncate">{u.skills?.slice(0, 1)}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-[#F59E0B] font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    {u.rating || '4.5'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl text-white">
            <h3 className="font-bold text-sm mb-4">Platform Trust</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2.4K+', label: 'Jobs Completed', icon: CheckCircle2 },
                { value: '98%', label: 'Satisfaction Rate', icon: ThumbsUp },
                { value: '500+', label: 'Expert Pros', icon: Users },
                { value: '₹12Cr', label: 'Total Earnings', icon: TrendingUp },
              ].map((stat, i) => {
                const StatIcon = stat.icon;
                return (
                  <div key={i} className="text-center p-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <StatIcon className="w-4 h-4 text-[#0EA5E9]" />
                    </div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-[9px] text-[#94A3B8] mt-1 font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- JobFeed (extracted from inline) ---

function JobFeed({ jobs, userLocation }: { jobs: Job[]; userLocation: { lat: number; lng: number } | null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<JobCategory | 'All'>('All');
  const [showAll, setShowAll] = useState(false);
  const { currentUser } = useStore();
  const navigate = useNavigate();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || job.category === category;
    const isActive = job.status === 'Open' || job.status === 'Bidding';

    if (showAll) return matchesSearch && matchesCategory && isActive;

    const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, job.location.lat, job.location.lng) : null;
    const isNearby = distance === null || distance <= 100;

    return matchesSearch && matchesCategory && isActive && isNearby;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
        >
          <option value="All">All Categories</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Smart Home">Smart Home</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-[#E2E8F0]">
          <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-[#CBD5E1]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">No jobs found nearby</h3>
          <p className="text-sm text-[#64748B] max-w-xs mx-auto mt-1 mb-5">We couldn't find any active jobs within 100km of your location.</p>
          <Button variant="outline" onClick={() => setShowAll(true)}>View All Available Jobs</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job, idx) => {
            const isOwner = job.clientId === currentUser?.id;
            const distance = userLocation && job.location
              ? calculateDistance(userLocation.lat, userLocation.lng, job.location.lat, job.location.lng)
              : null;
            const CatIcon = categoryIcons[job.category] || Wrench;

            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="h-full flex flex-col group border border-[#E2E8F0] hover:border-[#0EA5E9]/30 hover:shadow-lg hover:shadow-[#0EA5E9]/5 transition-all rounded-xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#0EA5E9]/0 via-[#0EA5E9]/20 to-[#0EA5E9]/0 group-hover:from-[#0EA5E9]/40 group-hover:via-[#0EA5E9]/60 group-hover:to-[#0EA5E9]/40 transition-all" />

                  <div className="p-5 flex-1" onClick={() => navigate(`/job/${job.id}`)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                          <CatIcon className="w-4.5 h-4.5 text-[#0EA5E9]" />
                        </div>
                        <div>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            job.urgency === 'High' ? "bg-red-50 text-red-500" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                          )}>
                            {job.urgency === 'High' ? 'Urgent' : 'Standard'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            {distance !== null && (
                              <span className="text-[10px] text-[#64748B] flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-[#0EA5E9]" />
                                {formatDistance(distance)}
                              </span>
                            )}
                            <span className="text-[10px] text-[#94A3B8]">• {job.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-[#0F172A] leading-none">₹{job.budget.toLocaleString()}</p>
                        {job.bids.length > 0 && (
                          <p className="text-[10px] font-semibold text-[#0EA5E9] mt-0.5">{job.bids.length} bid{job.bids.length > 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] mb-1 group-hover:text-[#0EA5E9] transition-colors leading-snug">{job.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                        {job.location?.address?.split(',')[0] || 'Remote'}
                      </span>
                      <span className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                        Posted {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {isOwner && job.bids.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-1.5">
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Recent Proposals</p>
                        {job.bids.slice().reverse().slice(0, 2).map(bid => (
                          <div key={bid.id} className="flex justify-between items-center text-[10px] bg-[#0EA5E9]/5 px-3 py-2 rounded-lg border border-[#0EA5E9]/10">
                            <span className="font-semibold text-[#0F172A] truncate">{bid.workerName}</span>
                            <span className="font-bold text-[#0EA5E9]">₹{bid.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                      <Clock className="w-3 h-3" />
                      {job.status === 'Open' ? 'Accepting bids' : 'In review'}
                    </div>
                    <div className="flex gap-2">
                      <Button className="text-[10px] py-1.5 h-auto font-semibold px-3" variant="ghost" onClick={() => navigate(`/job/${job.id}`)}>
                        {isOwner ? 'Manage' : 'View Details'}
                      </Button>
                      {currentUser?.role === 'Worker' && (job.status === 'Open' || job.status === 'Bidding') && (
                        <Button
                          className="text-[10px] py-1.5 h-auto font-semibold px-3"
                          variant="secondary"
                          onClick={() => navigate(`/job/${job.id}`)}
                        >
                          Submit Bid
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
