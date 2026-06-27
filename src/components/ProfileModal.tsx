import { motion } from 'motion/react';
import { X, Star, CheckCircle2, LogOut } from 'lucide-react';
import { useStore } from '../lib/useStore';
import { store } from '../lib/store';
import { Button } from './ui';

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currentUser } = useStore();

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-sky-500/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative h-32 bg-sky-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover border-4 border-white" />
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                {currentUser.verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-gray-500">{currentUser.email}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
              <div className="flex items-center gap-1 justify-end mt-2 text-yellow-600 font-bold">
                <Star className="w-4 h-4 fill-current" />
                {currentUser.rating || 'N/A'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined</p>
              <p className="font-bold">May 2024</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
              <p className="font-bold">{currentUser.completedJobs || 0} Jobs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-green-600 font-bold">Verified</p>
            </div>
          </div>

          {currentUser.bio && (
            <div className="mb-8">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{currentUser.bio}</p>
            </div>
          )}

          {currentUser.skills && currentUser.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-gray-100 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Management</p>
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-100 hover:bg-red-50 py-3"
                onClick={() => { store.signOut(); onClose(); }}
              >
                <LogOut className="w-5 h-5" />
                Sign Out of Lovi
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
