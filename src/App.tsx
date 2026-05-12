/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Wrench, 
  User as UserIcon, 
  Bell, 
  Menu, 
  X, 
  Hammer, 
  Zap, 
  Droplets, 
  PaintBucket, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Map as MapIcon,
  Camera,
  Image as ImageIcon,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

import { useStore } from './lib/useStore';
import { cn, formatDate } from './lib/utils';
import { Job, JobCategory, User, Bid } from './types';
import { store } from './lib/store';

// --- Components ---

const ReviewModal = ({ isOpen, onClose, onReview, job }: { isOpen: boolean, onClose: () => void, onReview: (rating: number, comment: string) => void, job: Job }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-4">How was {job.clientName === store.getCurrentUser()?.name ? 'the service' : 'the client'}?</h2>
        <p className="text-gray-500 mb-6 text-sm">Your feedback helps the Lovi community grow and identifies top-tier talent.</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)}>
              <Star className={cn("w-10 h-10 transition-all", rating >= star ? "text-yellow-500 fill-current" : "text-gray-200")} />
            </button>
          ))}
        </div>

        <textarea 
          className="w-full p-4 border border-gray-200 rounded-xl mb-6 h-32 focus:ring-2 focus:ring-black outline-none"
          placeholder="Share your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="flex gap-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">Skip</Button>
          <Button onClick={() => onReview(rating, comment)} className="flex-1" variant="secondary">Submit Feedback</Button>
        </div>
      </motion.div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { currentUser, setCurrentUser, users } = useStore();
  
  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative h-32 bg-black">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <img src={currentUser.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white" />
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
              <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 uppercase font-bold px-2">Switch Account (Demo)</p>
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => { setCurrentUser(user); onClose(); }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      currentUser.id === user.id ? "bg-gray-100 border border-gray-200 shadow-sm" : "hover:bg-gray-50"
                    )}
                  >
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{user.role}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex flex-col justify-end">
                <Button variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 py-3">
                  <LogOut className="w-5 h-5" />
                  Sign Out of Lovi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ReviewListView = () => {
  const { jobs, reviews, users } = useStore();
  
  return (
    <div className="space-y-6">
      <div className="bg-black text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Platform Reputation</h2>
          <p className="opacity-70 max-w-lg">Lovi Works maintains high standards through authentic feedback and a transparent bidding system.</p>
        </div>
        <Star className="absolute top-0 right-0 w-48 h-48 text-white/5 -rotate-12 translate-x-12 -translate-y-6" fill="currentColor" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-full md:col-span-1">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-orange-600" />
            Performance Metrics
          </h3>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-bold">4.9</span>
            <div className="pb-1">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Average Worker Rating</p>
            </div>
          </div>
          <div className="space-y-3">
             {[
               { label: 'Verified Skills', count: '100%' },
               { label: 'On-time Rate', count: '94%' },
               { label: 'Safety Score', count: '98%' },
             ].map(stat => (
               <div key={stat.label} className="flex items-center justify-between">
                 <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                 <span className="text-sm font-bold">{stat.count}</span>
               </div>
             ))}
          </div>
        </Card>

        <div className="col-span-full md:col-span-1 lg:col-span-2 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Worker Performance Feedbacks
          </h3>
          {reviews.length > 0 ? (
            reviews.map(review => {
              const fromUser = users.find(u => u.id === review.fromId);
              const toUser = users.find(u => u.id === review.toId);
              const job = jobs.find(j => j.id === review.jobId);
              
              return (
                <div key={review.id}>
                  <Card className="p-5 border-none bg-white shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img src={fromUser?.avatar} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-bold">{fromUser?.name}</p>
                          <p className="text-[10px] text-gray-400">Review for <span className="text-black font-bold">{toUser?.name}</span></p>
                        </div>
                      </div>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-current" : "text-gray-200")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <span>Job: {job?.title}</span>
                       <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
               <ThumbsUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
               <p className="text-sm text-gray-500 italic">No feedback entries yet. Complete a job to leave a review!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const JobDetailsView = ({ job, onClose, onAcceptBid, onBid }: { 
  job: Job, 
  onClose: () => void, 
  onAcceptBid: (bid: Bid) => void,
  onBid: (amount: number, message: string) => void
}) => {
  const { currentUser } = useStore();
  const [bidAmount, setBidAmount] = useState(job.budget);
  const [bidMessage, setBidMessage] = useState('');
  const isOwner = job.clientId === currentUser?.id;
  const isWorker = currentUser?.role === 'Worker';
  const alreadyBid = job.bids.some(b => b.workerId === currentUser?.id);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] flex justify-end">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">Job Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                job.status === 'Open' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              )}>
                {job.status}
              </span>
              <span className="text-2xl font-bold">₹{job.budget}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
            
            {job.photos && job.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {job.photos.map((p, i) => (
                  <img key={i} src={p} className="w-full h-40 object-cover rounded-xl" />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Category</p>
              <p className="font-bold flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                {job.category}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Client</p>
              <p className="font-bold">{job.clientName}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Bids ({job.bids.length})
            </h3>

            {isOwner && job.status === 'Bidding' && (
              <div className="space-y-3">
                {job.bids.map(bid => (
                  <div key={bid.id}>
                    <Card className="p-4 border-orange-100 bg-orange-50/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                            {bid.workerName.charAt(0)}
                          </div>
                          <p className="font-bold">{bid.workerName}</p>
                        </div>
                        <span className="text-xl font-bold">₹{bid.amount}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 italic">"{bid.message}"</p>
                      <Button 
                        className="w-full py-2 text-sm" 
                        variant="secondary"
                        onClick={() => onAcceptBid(bid)}
                      >
                        Accept Quotation
                      </Button>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {isWorker && !isOwner && job.status === 'Open' && !alreadyBid && (
              <Card className="p-6 space-y-4 border-black/10 bg-gray-50">
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500">Submit your Quote</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold mb-1 block">Your Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-200 rounded-lg text-lg font-bold"
                        scroll-behavior="none"
                        value={bidAmount}
                        onChange={e => setBidAmount(Number(e.target.value))}
                      />
                   </div>
                   <div className="flex items-end">
                      <Button className="w-full py-3 h-[50px]" onClick={() => onBid(bidAmount, bidMessage)}>Send Bid</Button>
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold mb-1 block">Message</label>
                   <textarea 
                     className="w-full p-3 border border-gray-200 rounded-lg h-24"
                     placeholder="Tell the client why you're a good fit..."
                     value={bidMessage}
                     onChange={e => setBidMessage(e.target.value)}
                   />
                </div>
              </Card>
            )}

            {alreadyBid && (
               <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-bold">You've submitted a bid!</p>
                  <p className="text-xs text-gray-500">The client will review your quote and get back to you.</p>
               </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-orange-600 text-white hover:bg-orange-700',
    outline: 'border border-black text-black hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
  };
  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2', 
        variants[variant], 
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)}>
    {children}
  </div>
);

const Navbar = ({ onMenuClick, onNotifyClick, onProfileClick }: { onMenuClick: () => void, onNotifyClick: () => void, onProfileClick: () => void }) => {
  const { currentUser } = useStore();
  return (
    <nav className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight">Lovi Works</span>
          <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ml-1">Beta</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative" onClick={onNotifyClick}>
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-1 hover:bg-gray-50 p-1.5 rounded-xl transition-colors text-left"
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold">{currentUser?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{currentUser?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <UserIcon className="w-6 h-6" />
              </div>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }: { 
  isOpen: boolean, 
  onClose: () => void, 
  activeTab: string, 
  onTabChange: (tab: string) => void 
}) => {
  const { currentUser } = useStore();
  
  const menuItems = [
    { id: 'feed', label: 'Public Feed', icon: MapIcon, roles: ['Client', 'Worker', 'Admin'] },
    { id: 'my-jobs', label: 'My Projects', icon: Wrench, roles: ['Client', 'Worker'] },
    { id: 'reviews', label: 'Feedbacks', icon: ThumbsUp, roles: ['Client', 'Worker', 'Admin'] },
    { id: 'analytics', label: 'Admin Analytics', icon: TrendingUp, roles: ['Admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser?.role || ''));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between lg:hidden mb-8">
            <span className="font-bold">Menu</span>
            <button onClick={onClose}><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-1">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  activeTab === item.id 
                    ? "bg-black text-white shadow-lg shadow-black/10" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="mt-auto">
            <Card className="p-4 bg-orange-50 border-orange-100">
               <p className="text-xs font-bold text-orange-800 mb-1">Lovi Support</p>
               <p className="text-[10px] text-orange-600">Need help with your smart installations?</p>
               <Button variant="ghost" className="p-0 text-[10px] uppercase font-bold text-orange-800 mt-2 hover:bg-transparent">Contact Us</Button>
            </Card>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Page Fragments ---

const JobFeed = ({ jobs, onSelectJob }: { jobs: Job[], onSelectJob: (job: Job) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<JobCategory | 'All'>('All');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || job.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search micro-jobs near you..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <motion.div layout key={job.id}>
            <Card className="h-full flex flex-col">
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    job.urgency === 'High' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {job.urgency} Urgency
                  </div>
                  <span className="text-lg font-bold">₹{job.budget}</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold leading-tight mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3" />
                    {job.location.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <Wrench className="w-3 h-3" />
                    {job.category}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Posted {formatDate(job.createdAt)}
                </div>
                <div className="flex gap-2">
                  <Button className="text-xs py-1.5 h-auto" variant="ghost" onClick={() => onSelectJob(job)}>Details</Button>
                  {store.getCurrentUser()?.role === 'Worker' && job.status === 'Open' && (
                    <Button 
                      className="text-xs py-1.5 h-auto" 
                      variant="secondary"
                      onClick={() => onSelectJob(job)}
                    >
                      Bid
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PostJobWizard = ({ onPost }: { onPost: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electrical' as JobCategory,
    budget: 500,
    address: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    photos: [] as string[]
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const simulatePhotoUpload = () => {
    const urls = [
      'https://images.unsplash.com/photo-1558403194-611308249627?w=800&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
      'https://images.unsplash.com/photo-1595844730298-b9f0ff98ffd0?w=800&q=80'
    ];
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, urls[Math.floor(Math.random() * urls.length)]]
    }));
    toast.success('Photo added!');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Post a New Job</h2>
        <p className="text-gray-500 text-sm">Need a hand? Our professionals are ready to help.</p>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full", step >= i ? "bg-black" : "bg-gray-100")} />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Job Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Electrical', 'Plumbing', 'Carpentry', 'Smart Home', 'General Handyman', 'Other'] as JobCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={cn(
                      "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                      formData.category === cat ? "border-black bg-black text-white" : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    {cat === 'Electrical' && <Zap className="w-6 h-6" />}
                    {cat === 'Plumbing' && <Droplets className="w-6 h-6" />}
                    {cat === 'Carpentry' && <Hammer className="w-6 h-6" />}
                    {cat === 'Smart Home' && <Zap className="w-6 h-6" fill="currentColor" />}
                    {cat === 'General Handyman' && <Wrench className="w-6 h-6" />}
                    {cat === 'Other' && <LayoutDashboard className="w-6 h-6" />}
                    <span className="text-xs font-bold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={next} className="w-full py-4">Next Step</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Job Title</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl"
                  placeholder="e.g. Fix living room fan"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea 
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl h-32"
                  placeholder="Describe what needs to be done..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={prev} className="flex-1">Back</Button>
              <Button onClick={next} className="flex-1">Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold mb-2">Upload Photos</label>
              <div className="grid grid-cols-2 gap-4">
                 {formData.photos.map((p, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                       <img src={p} className="w-full h-full object-cover" />
                       <button 
                        onClick={() => setFormData(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))}
                        className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                 ))}
                 {formData.photos.length < 4 && (
                    <button 
                      onClick={simulatePhotoUpload}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-black transition-colors"
                    >
                      <Camera className="w-6 h-6 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase text-gray-400">Add Photo</span>
                    </button>
                 )}
              </div>
              <p className="text-[10px] text-gray-400">Upload up to 4 photos to help workers quote accurately.</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={prev} className="flex-1">Back</Button>
              <Button onClick={next} className="flex-1">Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Location</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl"
                  placeholder="Street name, neighborhood..."
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Budget (₹)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Urgency</label>
                  <select 
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl"
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={prev} className="flex-1">Back</Button>
              <Button onClick={() => onPost(formData)} className="flex-1" variant="secondary">Post Job Now</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const { jobs, users, reviews, currentUser, addJob, addBid, acceptBid, completeJob, addReview } = useStore();
  const [activeTab, setActiveTab] = useState('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [jobToReview, setJobToReview] = useState<Job | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const MAP_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handlePostJob = (data: any) => {
    addJob({
      ...data,
      location: {
        lat: 12.9716,
        lng: 77.5946,
        address: data.address
      },
      clientId: currentUser?.id || 'c1',
      clientName: currentUser?.name || 'Guest'
    });
    toast.success('Job posted successfully!');
    setShowPostModal(false);
    setActiveTab('my-jobs');
  };

  const handleAcceptBid = (bid: Bid) => {
    if (!selectedJob) return;
    acceptBid(selectedJob.id, bid.id);
    toast.success(`Worker ${bid.workerName} selected!`);
    setSelectedJobId(null);
  };

  const handleBid = (amount: number, message: string) => {
    if (!selectedJob || !currentUser) return;
    addBid(selectedJob.id, {
      workerId: currentUser.id,
      workerName: currentUser.name,
      amount,
      message
    });
    toast.success('Bid submitted successfully!');
    setSelectedJobId(null);
  };

  const handleCompleteJob = (job: Job) => {
    completeJob(job.id);
    setJobToReview(job);
    setShowReviewModal(true);
    toast.success('Job marked as completed!');
  };

  const handleReview = (rating: number, comment: string) => {
    if (!jobToReview || !currentUser) return;
    addReview({
      jobId: jobToReview.id,
      fromId: currentUser.id,
      toId: currentUser.id === jobToReview.clientId ? jobToReview.assignedWorkerId! : jobToReview.clientId,
      rating,
      comment
    });
    toast.success('Feedback submitted!');
    setShowReviewModal(false);
    setJobToReview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="bottom-right" />
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onNotifyClick={() => toast('No new notifications')} 
        onProfileClick={() => setShowProfileModal(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {showPostModal ? (
              <motion.div 
                key="wizard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PostJobWizard onPost={handlePostJob} />
                <div className="max-w-xl mx-auto px-6">
                  <Button variant="ghost" onClick={() => setShowPostModal(false)} className="w-full">Cancel</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-7xl mx-auto h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      {activeTab === 'feed' && "Local Micro-Jobs"}
                      {activeTab === 'my-jobs' && "My Projects"}
                      {activeTab === 'analytics' && "Admin Dashboard"}
                      {activeTab === 'reviews' && "Community Feedback"}
                    </h1>
                    <p className="text-gray-500">
                      {activeTab === 'feed' && "Find skilled local workers for your home tasks."}
                      {activeTab === 'my-jobs' && "Track your ongoing and completed projects."}
                      {activeTab === 'analytics' && "Monitor platform growth and worker density."}
                      {activeTab === 'reviews' && "See how others are rating our Lovi-certified pros."}
                    </p>
                  </div>
                  
                  {currentUser?.role === 'Client' && activeTab !== 'analytics' && !showPostModal && (
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowPostModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Post a Job
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {selectedJob && (
                    <JobDetailsView 
                      job={selectedJob} 
                      onClose={() => setSelectedJobId(null)}
                      onAcceptBid={handleAcceptBid}
                      onBid={handleBid}
                    />
                  )}
                  {jobToReview && (
                    <ReviewModal 
                      isOpen={showReviewModal} 
                      onClose={() => setShowReviewModal(false)}
                      onReview={handleReview}
                      job={jobToReview}
                    />
                  )}
                  {showProfileModal && (
                    <ProfileModal 
                      isOpen={showProfileModal} 
                      onClose={() => setShowProfileModal(false)} 
                    />
                  )}
                </AnimatePresence>

                {activeTab === 'feed' && (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <JobFeed 
                          jobs={jobs.filter(j => j.status === 'Open' || j.status === 'Bidding')} 
                          onSelectJob={(job) => setSelectedJobId(job.id)}
                        />
                      </div>
                      <div className="hidden lg:block space-y-6">
                        <div className="sticky top-24">
                          <Card className="h-[400px] bg-gray-100 relative group overflow-hidden">
                            {MAP_KEY ? (
                              <APIProvider apiKey={MAP_KEY}>
                                <GoogleMap
                                  defaultCenter={{ lat: 12.9716, lng: 77.5946 }}
                                  defaultZoom={11}
                                  mapId="lovi_map"
                                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                                  style={{ width: '100%', height: '100%' }}
                                >
                                  {jobs.map(j => (
                                    <AdvancedMarker key={j.id} position={j.location}>
                                      <Pin background="#ea580c" borderColor="#000" glyphColor="#fff" />
                                    </AdvancedMarker>
                                  ))}
                                </GoogleMap>
                              </APIProvider>
                            ) : (
                              <div className="h-full flex items-center justify-center p-8 text-center bg-gray-200">
                                <div>
                                  <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-sm text-gray-500 font-medium">Add Google Maps API Key to see jobs nearby</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-gray-200 z-10 shadow-sm">
                              <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-orange-600" />
                                Nearby Jobs (Bangalore)
                              </p>
                            </div>
                          </Card>
                          
                          <div className="mt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                Top Technicians
                              </h3>
                              <Button variant="ghost" className="text-[10px] uppercase font-bold p-0">View All</Button>
                            </div>
                            <div className="space-y-3">
                              {store.getUsers().filter(u => u.role === 'Worker').slice(0, 3).map(u => (
                                <div key={u.id}>
                                  <Card className="p-3 border-none shadow-none bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                      <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold flex items-center gap-1 truncate">
                                          {u.name}
                                          {u.verified && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                                        </p>
                                        <p className="text-[10px] text-gray-500 truncate">{u.skills?.join(', ')}</p>
                                      </div>
                                      <div className="text-xs font-bold flex items-center gap-1 text-yellow-700">
                                        <Star className="w-3 h-3 fill-current" />
                                        {u.rating}
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                   </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewListView />
                )}

                {activeTab === 'my-jobs' && (
                  <div className="space-y-4">
                    {jobs.filter(j => j.clientId === currentUser?.id || j.assignedWorkerId === currentUser?.id).length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">No active jobs yet</h3>
                        <p className="text-gray-500">Post a job to get started with Lovi Works.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {jobs.filter(j => j.clientId === currentUser?.id || j.assignedWorkerId === currentUser?.id).map(job => (
                          <div key={job.id}>
                            <Card className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                    job.status === 'Open' ? "bg-green-100 text-green-700" : 
                                    job.status === 'Bidding' ? "bg-orange-100 text-orange-700" : 
                                    job.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                                  )}>
                                    {job.status}
                                  </span>
                                  <span className="text-xs text-gray-400 font-mono">{job.id}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {job.location.address}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Posted {formatDate(job.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="md:w-64 flex flex-col justify-between items-end border-l border-gray-100 pl-6">
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Budget</p>
                                  <p className="text-2xl font-bold">₹{job.budget}</p>
                                </div>
                                <div className="space-y-2 w-full mt-4">
                                  {job.bids.length > 0 && job.status === 'Bidding' && (
                                    <p className="text-[10px] text-right text-orange-600 font-bold uppercase">{job.bids.length} Bids Received</p>
                                  )}
                                  <div className="flex gap-2 w-full mt-4">
                                    <Button className="flex-1 text-sm" variant="outline" onClick={() => setSelectedJobId(job.id)}>View Details</Button>
                                    {job.status === 'In Progress' && job.clientId === currentUser?.id && (
                                      <Button className="flex-1 text-sm" variant="secondary" onClick={() => handleCompleteJob(job)}>Complete</Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'analytics' && currentUser?.role === 'Admin' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Professionals', value: users.filter(u => u.role === 'Worker').length, change: '+12%', icon: UserIcon },
                        { label: 'Total Clients', value: users.filter(u => u.role === 'Client').length, change: '+5%', icon: ThumbsUp },
                        { label: 'Market Liquidity', value: `${Math.round((jobs.filter(j => j.status === 'Completed').length / jobs.length) * 100)}%`, change: 'Healthy', icon: Zap },
                        { label: 'Total Revenue Flow', value: `₹${jobs.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`, change: '+18%', icon: TrendingUp },
                      ].map((stat, i) => (
                        <div key={i}>
                          <Card className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                              <h3 className="text-3xl font-bold">{stat.value}</h3>
                              <p className={cn(
                                "text-xs font-bold mt-1",
                                stat.change.includes('+') || stat.change === 'Healthy' ? "text-green-600" : "text-orange-600"
                              )}>{stat.change} overall</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <stat.icon className="w-6 h-6 text-black" />
                            </div>
                          </div>
                        </Card>
                      </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="p-8 lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-xl font-bold">User Directory</h3>
                            <p className="text-sm text-gray-500">Monitor activity and performance of all platform users.</p>
                          </div>
                          <div className="flex gap-2">
                             <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase">{users.length} Total</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-100">
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">User</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 text-center">Role</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 text-center">Activity</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400 text-center">Rating</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {users.map(user => {
                                const userJobs = jobs.filter(j => j.clientId === user.id || j.assignedWorkerId === user.id);
                                return (
                                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                      <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                                        <div>
                                          <p className="text-sm font-bold">{user.name}</p>
                                          <p className="text-[10px] text-gray-400">{user.email}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 text-center">
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold",
                                        user.role === 'Worker' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                      )}>
                                        {user.role}
                                      </span>
                                    </td>
                                    <td className="py-4 text-center">
                                      <span className="text-xs font-bold text-gray-600">
                                        {user.role === 'Worker' ? `${user.completedJobs || 0} Done` : `${jobs.filter(j => j.clientId === user.id).length} Posted`}
                                      </span>
                                    </td>
                                    <td className="py-4 text-center">
                                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-600">
                                        <Star className="w-3 h-3 fill-current" />
                                        {user.rating || '0.0'}
                                      </div>
                                    </td>
                                    <td className="py-4">
                                      <div className="flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", user.verified ? "bg-green-500" : "bg-gray-300")} />
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{user.verified ? 'Verified' : 'Pending'}</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </Card>

                      <div className="space-y-6">
                        <Card className="p-8">
                          <h3 className="text-lg font-bold mb-6">Market Distribution</h3>
                          <div className="space-y-6">
                            {[
                              { label: 'Active Projects', value: jobs.filter(j => ['Open', 'Bidding', 'In Progress'].includes(j.status)).length, total: jobs.length },
                              { label: 'Bidding Velocity', value: jobs.reduce((acc, curr) => acc + curr.bids.length, 0), total: users.length * 2 },
                              { label: 'Review Loop', value: reviews.length, total: jobs.filter(j => j.status === 'Completed').length },
                            ].map(stat => (
                              <div key={stat.label} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                  <span className="text-gray-400">{stat.label}</span>
                                  <span>{stat.value}</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-black" 
                                    style={{ width: `${Math.min(100, (stat.value / (stat.total || 1)) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <Card className="p-8 bg-gray-50 border-none shadow-none">
                           <div className="text-center">
                              <TrendingUp className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                              <h4 className="font-bold mb-2">Platform Growth</h4>
                              <p className="text-xs text-gray-500 mb-6">Users matching through Lovi has increased by 22% this quarter.</p>
                              <Button className="w-full" variant="outline">Export Reports</Button>
                           </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

