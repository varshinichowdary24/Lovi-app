import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, CheckCircle2, Briefcase, User as UserIcon, Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/useStore';
import { User } from '../types';
import { Button } from '../components/ui';

export function Professionals({ onViewWorkerProfile }: { onViewWorkerProfile: (worker: User) => void }) {
  const { users } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const workers = users.filter(u => u.role === 'Worker');

  const filteredWorkers = searchQuery
    ? workers.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        w.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : workers;

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search professionals by name or skill..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredWorkers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-[#E2E8F0]">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto mb-5">
            <UserIcon className="w-8 h-8 text-[#CBD5E1]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">No professionals found</h3>
          <p className="text-sm text-[#64748B] mt-1 mb-6 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms.' : 'There are no registered professionals yet.'}
          </p>
          <Button variant="secondary" onClick={() => navigate('/marketplace')}>Browse Jobs Instead</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((worker, idx) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#0EA5E9]/30 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onViewWorkerProfile(worker)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm">
                  {worker.avatar ? (
                    <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    worker.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#0F172A] truncate">{worker.name}</h3>
                    {worker.verified && <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#64748B] truncate">{worker.skills?.slice(0, 3).join(' • ') || 'General Professional'}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-yellow-600 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{worker.rating || '4.5'}</span>
                    <span className="text-[#94A3B8] font-medium">({worker.completedJobs || 0} jobs)</span>
                  </div>
                </div>
              </div>
              {worker.bio && (
                <p className="text-sm text-[#64748B] line-clamp-2 mb-4">{worker.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {worker.skills?.slice(0, 4).map(skill => (
                  <span key={skill} className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                    {skill}
                  </span>
                ))}
              </div>
              <Button variant="outline" className="w-full text-xs py-2 h-auto" onClick={(e) => { e.stopPropagation(); onViewWorkerProfile(worker); }}>
                View Profile
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
