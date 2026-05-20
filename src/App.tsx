/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
  MessageSquare,
  Clock
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

import { useStore } from './lib/useStore';
import { cn, formatDate, calculateDistance, formatDistance } from './lib/utils';
import { Job, JobCategory, User, Bid, Location } from './types';
import { store } from './lib/store';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

// --- Base Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600',
    secondary: 'bg-sky-400 text-white hover:bg-sky-500',
    outline: 'border border-sky-500 text-sky-500 hover:bg-sky-50',
    ghost: 'hover:bg-sky-50 text-gray-600',
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

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    className={cn('bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)} 
    onClick={onClick}
  >
    {children}
  </div>
);

// --- Modals & Complex Components ---

const ReviewModal = ({ isOpen, onClose, onReview, job }: { isOpen: boolean, onClose: () => void, onReview: (rating: number, comment: string) => void, job: Job }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { users } = useStore();
  const worker = users.find(u => u.id === job.assignedWorkerId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sky-500/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Rate {worker?.name || 'the worker'}</h2>
        <p className="text-gray-500 mb-6 text-sm text-center">How was the service provided for "{job.title}"? Your feedback is visible to all users and admins.</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
              <Star className={cn("w-10 h-10 transition-all", rating >= star ? "text-yellow-500 fill-current" : "text-gray-200")} />
            </button>
          ))}
        </div>

        <textarea 
          className="w-full p-4 border border-gray-200 rounded-xl mb-6 h-32 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
          placeholder="Share your experience with this worker..."
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
    <div className="fixed inset-0 bg-sky-500/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
};

const JobDetailsView = ({ job, onClose, onAcceptBid, onBid, onMarkCompleted, userLocation }: { 
  job: Job, 
  onClose: () => void, 
  onAcceptBid: (bid: Bid) => void,
  onBid: (amount: number, message: string) => void,
  onMarkCompleted: (job: Job) => void,
  userLocation: { lat: number, lng: number } | null
}) => {
  const { currentUser, reviews, users } = useStore();
  const [bidAmount, setBidAmount] = useState(job.budget);
  const [bidMessage, setBidMessage] = useState('');
  const [expandedWorkerId, setExpandedWorkerId] = useState<string | null>(null);
  
  const isOwner = job.clientId === currentUser?.id;
  const isWorker = currentUser?.role === 'Worker';
  const isAssignedWorker = job.assignedWorkerId === currentUser?.id;
  const alreadyBid = job.bids.some(b => b.workerId === currentUser?.id);
  
  const distance = userLocation && job.location 
    ? calculateDistance(userLocation.lat, userLocation.lng, job.location.lat, job.location.lng)
    : null;

  useEffect(() => {
    console.log('JobDetailsView mounted', { 
      jobId: job.id, 
      bids: job.bids, 
      isOwner, 
      currentUserId: currentUser?.id,
      clientId: job.clientId 
    });
  }, [job, isOwner, currentUser]);

  const jobReviews = reviews.filter(r => r.jobId === job.id);

  return (
    <div className="fixed inset-0 bg-sky-500/40 backdrop-blur-md z-[90] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Job Details</h2>
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
              job.status === 'Open' ? "bg-green-100 text-green-700" : 
              job.status === 'Completed' ? "bg-emerald-500 text-white shadow-sm" : "bg-blue-100 text-blue-700"
            )}>
              {job.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-sky-600">₹{job.budget}</span>
                    {distance !== null && (
                      <span className="text-xs font-bold text-sky-500 flex items-center gap-1 bg-sky-50 self-start px-2 py-1 rounded-full">
                        <MapPin className="w-3 h-3" />
                        {formatDistance(distance)} from you
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Clock className="w-4 h-4" />
                    Posted {formatDate(job.createdAt)}
                  </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">{job.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{job.description}</p>
                
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-gray-50 rounded-xl flex items-center gap-2 border border-gray-100">
                    <Wrench className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-bold">{job.category}</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 rounded-xl flex items-center gap-2 border border-gray-100">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-bold">{job.location?.address}</span>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 rounded-xl flex items-center gap-2 border border-gray-100">
                    <UserIcon className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-bold">{job.clientName}</span>
                  </div>
                </div>
              </div>

              {job.photos && job.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {job.photos.map((p, i) => (
                    <img key={i} src={p} className="w-full h-48 object-cover rounded-2xl shadow-sm hover:shadow-md transition-shadow" />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Dual Completion Section */}
              {(isOwner || isAssignedWorker) && (job.status === 'In Progress' || job.status === 'Completed') && (
                <Card className="p-8 bg-sky-50 border-sky-100 border-2">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-sky-900">
                      <CheckCircle2 className="w-6 h-6 text-sky-500" />
                      Work Completion Status
                    </h3>
                    {job.selectedBidId && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Contracted Amount</p>
                        <p className="text-xl font-black text-sky-600">₹{job.bids.find(b => b.id === job.selectedBidId)?.amount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", job.clientMarkedCompleted ? "bg-sky-500 border-sky-500 text-white" : "border-gray-200 text-gray-300")}>
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Client</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", job.workerMarkedCompleted ? "bg-sky-500 border-sky-500 text-white" : "border-gray-200 text-gray-300")}>
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Worker</span>
                    </div>
                  </div>
                  
                  {isOwner && !job.clientMarkedCompleted && job.status === 'In Progress' && (
                    <Button className="w-full py-4 text-lg" variant="secondary" onClick={() => onMarkCompleted(job)}>
                      Mark Work as Completed
                    </Button>
                  )}
                  {isAssignedWorker && !job.workerMarkedCompleted && job.status === 'In Progress' && (
                    <Button className="w-full py-4 text-lg" variant="secondary" onClick={() => onMarkCompleted(job)}>
                      Mark Work as Completed
                    </Button>
                  )}
                  {((isOwner && job.clientMarkedCompleted) || (isAssignedWorker && job.workerMarkedCompleted)) && job.status === 'In Progress' && (
                    <div className="text-center space-y-2">
                      <p className="text-sm text-sky-700 font-bold animate-pulse">Waiting for the other party to confirm...</p>
                      <p className="text-[10px] text-sky-500 uppercase tracking-widest">Both must confirm to finalize payment and rating</p>
                    </div>
                  )}
                  {job.status === 'Completed' && (
                    <div className="text-center py-2">
                      <p className="text-sky-600 font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Job Fully Completed & Verified
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Integrated Feedback Section */}
              {jobReviews.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl flex items-center gap-2 text-gray-900">
                    <ThumbsUp className="w-6 h-6 text-sky-500" />
                    Final Job Feedback
                  </h3>
                  <div className="space-y-4">
                    {jobReviews.map(review => {
                      const fromUser = users.find(u => u.id === review.fromId);
                      return (
                        <div key={review.id}>
                          <Card className="p-6 bg-gray-50 border-none shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <img src={fromUser?.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                  <p className="text-sm font-bold">{fromUser?.name}</p>
                                  <p className="text-[10px] text-gray-400 uppercase font-bold">{fromUser?.role}</p>
                                </div>
                              </div>
                              <div className="flex text-yellow-500 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <Star key={i} className={cn("w-3.5 h-3.5", i <= review.rating ? "fill-current" : "text-gray-200")} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-gray-100">
            <h3 className="font-bold text-2xl flex items-center gap-3 text-gray-900">
              <MessageSquare className="w-7 h-7 text-sky-500" />
              Professional Bids & Proposals ({job.bids.length})
            </h3>

            {/* Professional Bids Section for Clients */}
            {isOwner && (
              <div className="space-y-6">
                {job.bids.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No proposals received yet. Workers will start bidding soon!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {job.bids.map(bid => {
                      const worker = users.find(u => u.id === bid.workerId);
                      const workerReviews = reviews.filter(r => r.toId === bid.workerId);
                      const isExpanded = expandedWorkerId === bid.workerId;
                      
                      return (
                        <div key={bid.id}>
                          <Card className={cn(
                            "p-6 border-2 transition-all cursor-pointer",
                            job.selectedBidId === bid.id ? "bg-sky-50 border-sky-500 shadow-md" : "border-gray-100 hover:border-sky-200"
                          )} onClick={() => setExpandedWorkerId(isExpanded ? null : bid.workerId)}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-lg font-bold overflow-hidden shadow-sm">
                                  {worker?.avatar ? <img src={worker.avatar} className="w-full h-full object-cover" /> : bid.workerName.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-lg">{bid.workerName}</p>
                                    {worker?.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-yellow-600 font-bold text-sm">
                                    <Star className="w-4 h-4 fill-current" />
                                    {worker?.rating || '0.0'}
                                    <span className="text-gray-400 font-medium text-xs ml-1">({workerReviews.length} reviews)</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-2xl font-black text-gray-900">₹{bid.amount}</span>
                            </div>
                            
                            {bid.message && (
                              <p className="text-gray-600 mb-6 italic leading-relaxed">"{bid.message}"</p>
                            )}
                            
                            {isExpanded && workerReviews.length > 0 && (
                              <div className="mb-6 space-y-3 pt-4 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Feedback for Worker</p>
                                {workerReviews.slice(0, 2).map(r => (
                                  <div key={r.id} className="text-xs p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="flex justify-between mb-1">
                                      <div className="flex text-yellow-500">
                                        {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-2.5 h-2.5", i <= r.rating ? "fill-current" : "text-gray-100")} />)}
                                      </div>
                                      <span className="text-[10px] text-gray-400">{formatDate(r.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-500 line-clamp-2">"{r.comment}"</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(job.status === 'Open' || job.status === 'Bidding') && !job.selectedBidId && (
                              <Button 
                                className="w-full py-3" 
                                variant="secondary"
                                onClick={(e) => { e.stopPropagation(); onAcceptBid(bid); }}
                              >
                                Accept Quotation
                              </Button>
                            )}
                            {job.selectedBidId === bid.id && (
                              <div className="w-full py-2 bg-sky-500 text-white rounded-lg text-center font-bold text-sm uppercase tracking-wider">
                                Currently Working
                              </div>
                            )}
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bidding Section for Workers */}
            {isWorker && !isOwner && !alreadyBid && (job.status === 'Open' || job.status === 'Bidding') && (
              <Card className="p-8 space-y-6 border-sky-500/10 bg-gray-50 rounded-3xl">
                <h4 className="font-bold text-lg uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit your Quotation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 block ml-1">Your Proposed Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-2xl font-black text-sky-600 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all"
                        value={bidAmount}
                        onChange={e => setBidAmount(Number(e.target.value))}
                      />
                   </div>
                   <div className="flex items-end">
                      <Button className="w-full py-4 h-[64px] rounded-2xl shadow-lg shadow-sky-500/20" onClick={() => onBid(bidAmount, bidMessage)}>Send Proposal Now</Button>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 block ml-1">Message to Client</label>
                   <textarea 
                     className="w-full p-4 bg-white border border-gray-200 rounded-2xl h-32 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all resize-none"
                     placeholder="Explain your approach and why you're the best fit for this job..."
                     value={bidMessage}
                     onChange={e => setBidMessage(e.target.value)}
                   />
                </div>
              </Card>
            )}

            {isWorker && !isOwner && alreadyBid && (
               <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-green-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold mb-1 text-green-700">Proposal Sent</h4>
                  <p className="text-sm text-gray-500">You have already submitted a bid for this job. The client will review your quote.</p>
               </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onMenuClick, onNotifyClick, onProfileClick, onLogoClick }: { 
  onMenuClick: () => void, 
  onNotifyClick: () => void, 
  onProfileClick: () => void,
  onLogoClick: () => void 
}) => {
  const { currentUser } = useStore();
  return (
    <nav className="h-20 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <Menu className="w-7 h-7 text-gray-600" />
        </button>
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onLogoClick}
        >
          <div className="rounded-full border border-gray-100 p-1 bg-white shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="https://lovi.life/Favicon.png" alt="Lovi Icon" className="h-7 w-7 object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-gray-900">LOVI</span>
            <span className="text-[10px] bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full uppercase font-black tracking-widest align-middle">Beta</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2.5 hover:bg-gray-100 rounded-xl relative transition-colors" onClick={onNotifyClick}>
          <Bell className="w-6 h-6 text-gray-500" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-10 w-px bg-gray-200 mx-2 hidden sm:block"></div>
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-4 pl-1 hover:bg-gray-50 p-2 rounded-2xl transition-all text-left group cursor-pointer"
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{currentUser?.name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{currentUser?.role}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-100 border-2 border-gray-100 overflow-hidden group-hover:border-sky-200 transition-all shadow-sm">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <UserIcon className="w-7 h-7" />
              </div>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, onClose, onRefresh }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onRefresh: () => void
}) => {
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: 'feed', label: 'Job Marketplace', icon: LayoutDashboard, roles: ['Client', 'Worker', 'Admin'], path: '/' },
    { id: 'radar', label: 'Maps', icon: MapIcon, roles: ['Client', 'Worker'], path: '/radar' },
    { id: 'my-jobs', label: 'My Projects', icon: Wrench, roles: ['Client', 'Worker'], path: '/my-jobs' },
    { id: 'analytics', label: 'Admin Panel', icon: TrendingUp, roles: ['Admin'], path: '/analytics' },
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
            className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 z-50 transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:block",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between lg:hidden mb-10">
            <span className="font-black text-xl tracking-tight">MENU</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
          </div>

          <div className="space-y-2">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold",
                  location.pathname === item.path 
                    ? "bg-sky-500 text-white shadow-xl shadow-sky-500/30" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-6 h-6", location.pathname === item.path ? "text-white" : "text-sky-500")} />
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => { onRefresh(); onClose(); }}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <Bell className="w-6 h-6 text-sky-500" />
              Sync Data
            </button>
          </div>
          
          <div className="mt-auto">
            <Card className="p-6 bg-sky-50 border-sky-100 border shadow-none rounded-3xl">
               <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/20">
                 <MessageSquare className="w-5 h-5 text-white" />
               </div>
               <p className="text-sm font-bold text-sky-900 mb-1">Lovi Support</p>
               <p className="text-[10px] text-sky-500 font-bold uppercase tracking-wider mb-4">24/7 Concierge</p>
               <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-sky-600 bg-white hover:bg-sky-100 rounded-xl py-3 border border-sky-200/50">Contact Us</Button>
            </Card>
          </div>
        </div>
      </aside>
    </>
  );
};

const JobDetailsRoute = ({ 
  onAcceptBid, 
  onBid, 
  onMarkCompleted, 
  userLocation 
}: { 
  onAcceptBid: (jobId: string, bid: Bid) => void,
  onBid: (jobId: string, amount: number, message: string) => void,
  onMarkCompleted: (job: Job) => void,
  userLocation: { lat: number, lng: number } | null
}) => {
  const { id } = useParams<{ id: string }>();
  const { jobs } = useStore();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return <Navigate to="/" />;
  }

  return (
    <JobDetailsView 
      job={job} 
      onClose={() => navigate(-1)} 
      onAcceptBid={(bid) => onAcceptBid(job.id, bid)}
      onBid={(amount, message) => onBid(job.id, amount, message)}
      onMarkCompleted={onMarkCompleted}
      userLocation={userLocation}
    />
  );
};

// --- Page Fragments ---

const JobFeed = ({ jobs, userLocation }: { 
  jobs: Job[], 
  userLocation: { lat: number, lng: number } | null
}) => {
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search micro-jobs near you..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
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
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No jobs found nearby</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">We couldn't find any active jobs within a 100km radius of your location.</p>
          <Button variant="outline" onClick={() => setShowAll(true)}>View All Available Jobs</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => {
            const isOwner = job.clientId === currentUser?.id;
            const distance = userLocation && job.location 
              ? calculateDistance(userLocation.lat, userLocation.lng, job.location.lat, job.location.lng)
              : null;

            return (
              <motion.div layout key={job.id}>
                <Card className="h-full flex flex-col group hover:border-sky-500 transition-colors">
                  <div className="p-5 flex-1 space-y-4" onClick={() => navigate(`/job/${job.id}`)}>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <div className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider self-start",
                          job.urgency === 'High' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {job.urgency} Urgency
                        </div>
                        {distance !== null && (
                          <div className="px-2 py-1 bg-sky-50 text-sky-600 rounded text-[10px] font-bold uppercase tracking-wider self-start flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {formatDistance(distance)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold block">₹{job.budget}</span>
                        {job.bids.length > 0 && (
                          <span className="text-[10px] font-bold text-sky-500 flex items-center justify-end gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {job.bids.length} bids
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3 text-sky-500" />
                        {job.location?.address || 'Location N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Wrench className="w-3 h-3 text-sky-500" />
                        {job.category}
                      </div>
                    </div>

                    {/* Owner Quick Bid Preview in Feed */}
                    {isOwner && job.bids.length > 0 && (
                      <div className="pt-2 space-y-2">
                         <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Recent Proposals</p>
                         {job.bids.slice().reverse().slice(0, 2).map(bid => (
                           <div key={bid.id} className="flex justify-between items-center text-[10px] bg-sky-50/50 p-2 rounded-lg border border-sky-100">
                             <span className="font-bold truncate">{bid.workerName}</span>
                             <span className="font-black text-sky-600">₹{bid.amount}</span>
                           </div>
                         ))}
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-xs text-gray-400 font-medium">
                      Posted {formatDate(job.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button className="text-xs py-1.5 h-auto font-bold uppercase tracking-wider" variant="ghost" onClick={() => navigate(`/job/${job.id}`)}>
                        {isOwner ? 'Manage Bids' : 'Details'}
                      </Button>
                      {currentUser?.role === 'Worker' && (job.status === 'Open' || job.status === 'Bidding') && (
                        <Button 
                          className="text-xs py-1.5 h-auto font-bold uppercase tracking-wider" 
                          variant="secondary"
                          onClick={() => navigate(`/job/${job.id}`)}
                        >
                          Send Bid
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
            <div key={i} className={cn("h-1.5 flex-1 rounded-full", step >= i ? "bg-sky-500" : "bg-gray-100")} />
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
                      formData.category === cat ? "border-sky-500 bg-sky-500 text-white" : "border-gray-100 hover:border-gray-200"
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
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-sky-500 transition-colors"
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
  const { jobs, users, reviews, currentUser, addJob, addBid, acceptBid, markJobCompleted, addReview } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [jobToReview, setJobToReview] = useState<Job | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const performInit = async () => {
    setInitError(null);
    setIsInitializing(true);
    try {
      await store.load();
    } catch (err: any) {
      console.error('Initialization error:', err);
      setInitError(err.message || 'Connection failed.');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          if (!userLocation) {
            setUserLocation({ lat: 12.9716, lng: 77.5946 });
          }
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = store.onEvent((event) => {
      if (event.type === 'new_job') {
        if (currentUser?.role === 'Worker') {
          const job = event.payload;
          toast.success(`New Job: ${job.title} in ${job.category}!`, {
            icon: '🆕',
            duration: 5000,
          });
        }
      } else if (event.type === 'new_bid') {
        const { bid, job } = event.payload;
        if (currentUser?.role === 'Client' && job?.client_id === currentUser.id) {
          const workerName = users.find(u => u.id === bid.worker_id)?.name || 'A professional';
          toast.success(`${workerName} just bid ₹${bid.amount} on your job: "${job.title}"`, {
            icon: '💰',
            duration: 6000,
          });
        }
      } else if (event.type === 'job_completed') {
        const job = event.payload;
        if (currentUser?.id === job?.clientId || currentUser?.id === job?.assignedWorkerId) {
          toast.success(`Job Completed: "${job.title}" is now finalized!`, {
            icon: '✅',
            duration: 8000,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser, users]);

  useEffect(() => {
    if (!currentUser && jobs.length === 0) {
      performInit();
    }
  }, []);

  const MAP_KEY = (import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta.env as any).GOOGLE_MAPS_PLATFORM_KEY || '')
    .replace('PASTE_YOUR_GOOGLE_MAPS_KEY_HERE', '');

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-xs text-center">
          <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-500/30 animate-pulse">
            <img src="https://lovi.life/Favicon.png" alt="Lovi Icon" className="h-10 w-10 brightness-0 invert" />
          </div>
          <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Initializing Lovi...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Toaster position="bottom-right" />
        <Auth />
      </>
    );
  }

  const handlePostJob = async (data: any) => {
    toast.loading('Posting your job...', { id: 'post-job' });
    try {
      // Get the actual authenticated user from Supabase to ensure RLS compliance
      const { data: { user } } = await supabase.auth.getUser();
      const postUserId = user?.id;
      
      // Fallback only if no auth user exists (for local/demo only - usually results in RLS error in production)
      const finalUserId = postUserId || currentUser?.id || store.getCurrentUser()?.id;
      const finalUserName = currentUser?.name || store.getCurrentUser()?.name || 'Guest';

      if (!finalUserId) {
        toast.error('You must be logged in to post a job.', { id: 'post-job' });
        return;
      }

      await addJob({
        ...data,
        location: {
          lat: userLocation?.lat || 12.9716,
          lng: userLocation?.lng || 77.5946,
          address: data.address
        },
        clientId: finalUserId,
        clientName: finalUserName
      });

      toast.success('Job posted successfully!', { id: 'post-job' });
      setShowPostModal(false);
      navigate('/my-jobs');
    } catch (err: any) {
      console.error('Error posting job:', err);
      const errorMessage = err.message || 'Failed to post job.';
      const errorCode = err.code ? ` (Error ${err.code})` : '';
      toast.error(`${errorMessage}${errorCode}`, { id: 'post-job' });
    }
  };

  const handleRefresh = async () => {
    toast.loading('Syncing data...', { id: 'refresh' });
    try {
      await store.load();
      toast.success('Data synchronized!', { id: 'refresh' });
    } catch (err) {
      toast.error('Sync failed.', { id: 'refresh' });
    }
  };

  const handleAcceptBid = (jobId: string, bid: Bid) => {
    acceptBid(jobId, bid.id);
    toast.success(`Worker ${bid.workerName} selected!`);
  };

  const handleBid = (jobId: string, amount: number, message: string) => {
    if (!currentUser) return;
    addBid(jobId, {
      workerId: currentUser.id,
      workerName: currentUser.name,
      amount,
      message
    });
    toast.success('Bid submitted successfully!');
  };

  const handleMarkCompleted = async (job: Job) => {
    if (!currentUser) return;
    const isBothMarked = await markJobCompleted(job.id, currentUser.role as 'Client' | 'Worker');
    
    if (isBothMarked) {
      // Show the review modal to the Client to rate the Worker
      if (currentUser.role === 'Client') {
        setJobToReview(job);
        setShowReviewModal(true);
      } else if (currentUser.role === 'Worker' && job.clientId) {
        // If worker marked it last, the client should eventually see it.
        // In a real app, we'd notify the client. For this demo, if the client is 
        // watching their 'My Jobs' page, they'll see the status change.
      }
      toast.success('Job fully completed and confirmed!');
    } else {
      toast.success('Work marked as completed. Waiting for other party...');
    }
  };

  const handleReview = (rating: number, comment: string) => {
    if (!jobToReview || !currentUser) return;
    addReview({
      jobId: jobToReview.id,
      fromId: currentUser.id,
      toId: jobToReview.assignedWorkerId!,
      rating,
      comment
    });
    toast.success('Feedback submitted! Worker rating updated.');
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
        onLogoClick={() => {
          navigate('/');
          setShowPostModal(false);
        }}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onRefresh={handleRefresh}
        />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/post-job" element={
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PostJobWizard onPost={handlePostJob} />
                  <div className="max-w-xl mx-auto px-6">
                    <Button variant="ghost" onClick={() => navigate('/')} className="w-full">Cancel</Button>
                  </div>
                </motion.div>
              } />
              
              <Route path="*" element={
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-7xl mx-auto h-full"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {location.pathname === '/' && "Marketplace Feed"}
                        {location.pathname === '/radar' && "Maps"}
                        {location.pathname === '/my-jobs' && "My Project Portfolio"}
                        {location.pathname === '/analytics' && "Platform Insights"}
                      </h1>
                      <p className="text-gray-500 font-medium">
                        {location.pathname === '/' && "Connect with top-rated local professionals for any task."}
                        {location.pathname === '/radar' && "Scanning for micro-jobs in your area."}
                        {location.pathname === '/my-jobs' && "Manage your active contracts and work history."}
                        {location.pathname === '/analytics' && "Comprehensive overview of Lovi system performance."}
                      </p>
                    </div>
                    
                    {currentUser?.role === 'Client' && location.pathname !== '/analytics' && (
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate('/post-job')}
                        className="flex items-center gap-2 py-3 px-6 shadow-lg shadow-sky-500/20"
                      >
                        <Plus className="w-5 h-5" />
                        Post a New Job
                      </Button>
                    )}
                  </div>

                  <AnimatePresence>
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

                  <Routes>
                    <Route path="/job/:id" element={
                      <JobDetailsRoute 
                        onAcceptBid={handleAcceptBid}
                        onBid={handleBid}
                        onMarkCompleted={handleMarkCompleted}
                        userLocation={userLocation}
                      />
                    } />
                    <Route path="/" element={
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          <JobFeed 
                            jobs={jobs.filter(j => {
                              if (!userLocation) return true;
                              const distance = calculateDistance(userLocation.lat, userLocation.lng, j.location.lat, j.location.lng);
                              return distance <= 100;
                            })} 
                            userLocation={userLocation}
                          />
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
                                    {jobs
                                      .filter(j => {
                                        if (!userLocation) return true;
                                        const distance = calculateDistance(userLocation.lat, userLocation.lng, j.location.lat, j.location.lng);
                                        return distance <= 100 && (j.status === 'Open' || j.status === 'Bidding');
                                      })
                                      .map(j => (
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
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Add your Google Maps API Key to VITE_GOOGLE_MAPS_PLATFORM_KEY in .env to enable the radar.</p>
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
                            
                            <div className="mt-8">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-lg flex items-center gap-2 text-gray-900">
                                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                                  Top Professionals
                                </h3>
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest p-0 text-sky-500">Explore All</Button>
                              </div>
                              <div className="space-y-4">
                                {store.getUsers().filter(u => u.role === 'Worker').slice(0, 3).map(u => (
                                  <div key={u.id}>
                                    <Card className="p-4 border-none shadow-sm bg-white hover:shadow-md transition-all cursor-pointer">
                                      <div className="flex items-center gap-4">
                                        <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-50 shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold flex items-center gap-2 truncate text-gray-900">
                                            {u.name}
                                            {u.verified && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                                          </p>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase truncate tracking-wider">{u.skills?.slice(0, 2).join(' • ')}</p>
                                        </div>
                                        <div className="text-xs font-black flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
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
                    } />

                    <Route path="/radar" element={
                      <div className="h-[calc(100vh-250px)] min-h-[500px]">
                        <Card className="h-full bg-gray-100 relative group overflow-hidden border-2 border-white rounded-[40px] shadow-2xl">
                          {MAP_KEY ? (
                            <APIProvider apiKey={MAP_KEY}>
                              <GoogleMap
                                center={userLocation || { lat: 12.9716, lng: 77.5946 }}
                                defaultZoom={11}
                                mapId="lovi_full_map"
                                style={{ width: '100%', height: '100%' }}
                              >
                                {userLocation && (
                                  <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }} title="You">
                                    <div className="w-12 h-12 bg-sky-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce z-50">
                                      {currentUser?.role === 'Worker' ? (
                                        <Hammer className="w-6 h-6 text-white" />
                                      ) : (
                                        <UserIcon className="w-6 h-6 text-white" />
                                      )}
                                    </div>
                                  </AdvancedMarker>
                                )}
                                {jobs
                                  .filter(j => j.status === 'Open' || j.status === 'Bidding')
                                  .map(j => (
                                    <AdvancedMarker key={j.id} position={{ lat: j.location.lat, lng: j.location.lng }} onClick={() => navigate(`/job/${j.id}`)}>
                                      <div className="w-10 h-10 bg-emerald-500 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white hover:scale-125 transition-transform cursor-pointer">
                                        <Wrench className="w-5 h-5 text-white" />
                                      </div>
                                    </AdvancedMarker>
                                  ))}
                              </GoogleMap>
                            </APIProvider>
                          ) : (
                            <div className="h-full flex items-center justify-center p-12 text-center bg-white/50 backdrop-blur-md">
                              <div className="max-w-sm">
                                <div className="w-24 h-24 bg-sky-100 rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                  <MapIcon className="w-12 h-12 text-sky-500" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Satellite Radar Offline</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                  To activate the job discovery radar, please add your Google Maps API Key to the project environment settings.
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-3xl border border-gray-100 z-10 shadow-xl flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-sky-600 mb-0.5">
                                <Zap className="w-3 h-3 fill-current" />
                                Live Job Radar
                              </p>
                              <h4 className="text-sm font-black text-gray-900">Scanning for micro-jobs in your area</h4>
                            </div>
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                              {jobs.filter(j => j.status === 'Open').length} Active
                            </div>
                          </div>
                        </Card>
                      </div>
                    } />

                    <Route path="/my-jobs" element={
                      <div className="space-y-6">
                        {jobs.filter(j => currentUser?.role === 'Worker' ? j.assignedWorkerId === currentUser?.id : j.clientId === currentUser?.id).length === 0 ? (
                          <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                              <Wrench className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Your portfolio is empty</h3>
                            <p className="text-gray-500 max-sm mx-auto mt-2">Start by posting a new job or browsing the marketplace for opportunities.</p>
                          </div>
                        ) : (
                          <div className="grid gap-6">
                            {jobs.filter(j => currentUser?.role === 'Worker' ? j.assignedWorkerId === currentUser?.id : j.clientId === currentUser?.id).map(job => (
                              <div key={job.id}>
                                <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex flex-col md:flex-row gap-8">
                                  {job.photos && job.photos.length > 0 && (
                                    <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-[32px] overflow-hidden shadow-lg">
                                      <img src={job.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                      <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        job.status === 'Open' ? "bg-green-100 text-green-700" : 
                                        job.status === 'Bidding' ? "bg-sky-100 text-sky-700" : 
                                        job.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                                        "bg-gray-100 text-gray-700"
                                      )}>
                                        {job.status}
                                      </span>
                                      <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Job ID: {job.id.slice(0, 8)}</span>
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 text-gray-900 leading-tight">{job.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{job.description}</p>
                                    <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-sky-500" />
                                        {job.location?.address}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-sky-500" />
                                        {formatDate(job.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="md:w-72 flex flex-col justify-between items-end md:border-l border-gray-100 md:pl-8">
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Contract Value</p>
                                      <p className="text-3xl font-black text-gray-900">₹{job.budget.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-3 w-full mt-8">
                                      {job.bids.length > 0 && (
                                        <>
                                          <p className="text-[10px] text-right text-sky-500 font-black uppercase tracking-widest">{job.bids.length} Active Proposals</p>
                                          {currentUser?.id === job.clientId && (
                                            <div className="space-y-2 mt-2">
                                              {job.bids.slice().reverse().slice(0, 3).map(bid => (
                                                <div key={bid.id} className="flex justify-between items-center text-[10px] font-bold bg-sky-50 px-3 py-2 rounded-xl border border-sky-100 shadow-sm transition-transform hover:scale-[1.02]">
                                                  <span className="text-gray-700 truncate mr-2 flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                                                    {bid.workerName}
                                                  </span>
                                                  <span className="text-sky-600 font-black">₹{bid.amount.toLocaleString()}</span>
                                                </div>
                                              ))}
                                              {job.bids.length > 3 && (
                                                <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest mt-1">+{job.bids.length - 3} more professionals waiting</p>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      )}
                                      <div className="flex gap-3 w-full">
                                        <Button className="flex-1 text-xs font-black uppercase tracking-widest py-3" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>View Contract</Button>
                                        {job.status === 'In Progress' && currentUser?.id && (
                                          <Button className="flex-1 text-xs font-black uppercase tracking-widest py-3" variant="secondary" onClick={() => handleMarkCompleted(job)}>Complete</Button>
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
                    } />

                    <Route path="/analytics" element={
                      currentUser?.role === 'Admin' ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                              { label: 'Platform Professionals', value: users.filter(u => u.role === 'Worker').length, change: '+12%', icon: UserIcon },
                              { label: 'Active Clients', value: users.filter(u => u.role === 'Client').length, change: '+5%', icon: ThumbsUp },
                              { label: 'Market Liquidity', value: `${Math.round((jobs.filter(j => j.status === 'Completed').length / (jobs.length || 1)) * 100)}%`, change: 'Optimal', icon: Zap },
                              { label: 'Project Volume', value: jobs.length, change: '+18%', icon: TrendingUp },
                            ].map((stat, i) => (
                              <div key={i}>
                                <Card className="p-8 border-none shadow-sm">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                                    <p className={cn(
                                      "text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-0.5 rounded-full inline-block",
                                      stat.change.includes('+') || stat.change === 'Optimal' ? "bg-green-50 text-green-600" : "bg-sky-50 text-sky-500"
                                    )}>{stat.change}</p>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-2xl">
                                    <stat.icon className="w-7 h-7 text-sky-500" />
                                  </div>
                                </div>
                              </Card>
                            </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                              <Card className="p-8 border-none shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                  <div>
                                    <h3 className="text-xl font-black text-gray-900">User Management</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Verification and Activity Audit</p>
                                  </div>
                                  <div className="flex gap-2">
                                     <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">{users.length} Registered</span>
                                  </div>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="border-b border-gray-50">
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Identity</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Designation</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Impact</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Score</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {users.map(user => {
                                        return (
                                          <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="py-6">
                                              <div className="flex items-center gap-4">
                                                <img src={user.avatar} className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm" />
                                                <div>
                                                  <p className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{user.name}</p>
                                                  <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                user.role === 'Worker' ? "bg-sky-50 text-sky-600" : "bg-blue-50 text-blue-600"
                                              )}>
                                                {user.role}
                                              </span>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className="text-xs font-black text-gray-700">
                                                {user.role === 'Worker' ? `${user.completedJobs || 0} Jobs` : `${jobs.filter(j => j.clientId === user.id).length} Posts`}
                                              </span>
                                            </td>
                                            <td className="py-6 text-center">
                                              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg inline-flex">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                {user.rating || '0.0'}
                                              </div>
                                            </td>
                                            <td className="py-6">
                                              <div className="flex items-center gap-3">
                                                <div className={cn("w-2.5 h-2.5 rounded-full shadow-inner", user.verified ? "bg-green-500 shadow-green-200" : "bg-gray-200 shadow-gray-100")} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.verified ? 'Verified' : 'Review'}</span>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </Card>

                              {/* Global Marketplace Feed */}
                              <Card className="p-8 border-none shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                  <div>
                                    <h3 className="text-xl font-black text-gray-900">Global Marketplace Feed</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Platform-wide Project Activity</p>
                                  </div>
                                  <div className="flex gap-2">
                                     <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">{jobs.length} Total Posts</span>
                                  </div>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="border-b border-gray-50">
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Project Details</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Category</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Budget</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Status</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Posted By</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {jobs.slice().reverse().map(job => {
                                        const client = users.find(u => u.id === job.clientId);
                                        return (
                                          <tr key={job.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="py-6">
                                              <div>
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{job.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{formatDate(job.createdAt)}</p>
                                              </div>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                {job.category}
                                              </span>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className="text-xs font-black text-gray-700">${job.budget}</span>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                job.status === 'Completed' ? "bg-green-50 text-green-600" :
                                                job.status === 'In Progress' ? "bg-sky-50 text-sky-600" :
                                                job.status === 'Cancelled' ? "bg-red-50 text-red-600" :
                                                "bg-yellow-50 text-yellow-600"
                                              )}>
                                                {job.status}
                                              </span>
                                            </td>
                                            <td className="py-6">
                                              <div className="flex items-center gap-3">
                                                <img src={client?.avatar} className="w-6 h-6 rounded-lg object-cover" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{client?.name}</span>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </Card>

                              {/* Completed Deliveries */}
                              <Card className="p-8 border-none shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                  <div>
                                    <h3 className="text-xl font-black text-gray-900">Completed Deliveries</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Worker Success Logs</p>
                                  </div>
                                  <div className="flex gap-2">
                                     <span className="px-4 py-2 bg-green-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600 border border-green-100">{jobs.filter(j => j.status === 'Completed').length} Finalized</span>
                                  </div>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="border-b border-gray-50">
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Project</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Expert</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Revenue</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Satisfaction</th>
                                        <th className="pb-6 text-[10px] uppercase font-black tracking-widest text-gray-400">Client</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {jobs.filter(j => j.status === 'Completed').slice().reverse().map(job => {
                                        const worker = users.find(u => u.id === job.assignedWorkerId);
                                        const client = users.find(u => u.id === job.clientId);
                                        const review = reviews.find(r => r.jobId === job.id);
                                        return (
                                          <tr key={job.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="py-6">
                                              <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{job.title}</p>
                                            </td>
                                            <td className="py-6 text-center">
                                              <div className="flex items-center justify-center gap-2">
                                                <img src={worker?.avatar} className="w-6 h-6 rounded-lg object-cover" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">{worker?.name}</span>
                                              </div>
                                            </td>
                                            <td className="py-6 text-center">
                                              <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">${job.budget}</span>
                                            </td>
                                            <td className="py-6 text-center">
                                              <div className="flex items-center justify-center gap-1 text-xs font-black text-yellow-600">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                {review?.rating || 'N/A'}
                                              </div>
                                            </td>
                                            <td className="py-6">
                                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{client?.name}</span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </Card>

                              {/* Recent Reviews for Admin Visibility */}
                              <Card className="p-8 border-none shadow-sm">
                                <h3 className="text-xl font-black text-gray-900 mb-8">Platform Feedback Feed</h3>
                                <div className="space-y-4">
                                  {reviews.length === 0 ? (
                                    <p className="text-center py-12 text-gray-400 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-gray-50 rounded-3xl">No feedback records found</p>
                                  ) : (
                                    reviews.slice().reverse().map(review => {
                                      const from = users.find(u => u.id === review.fromId);
                                      const to = users.find(u => u.id === review.toId);
                                      const job = jobs.find(j => j.id === review.jobId);
                                      return (
                                        <div key={review.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                                          <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                              <div className="flex -space-x-3">
                                                <img src={from?.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                                                <img src={to?.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                                              </div>
                                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="text-gray-900">{from?.name}</span> rated <span className="text-gray-900">{to?.name}</span>
                                              </div>
                                            </div>
                                            <div className="flex text-yellow-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                              {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-current" : "text-gray-100")} />)}
                                            </div>
                                          </div>
                                          <p className="text-sm font-bold text-gray-900 mb-1 truncate">{job?.title}</p>
                                          <p className="text-sm text-gray-500 italic leading-relaxed">"{review.comment}"</p>
                                          <p className="text-[9px] text-gray-300 font-black uppercase tracking-widest mt-3">{formatDate(review.createdAt)}</p>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </Card>
                            </div>

                            <div className="space-y-8">
                              <Card className="p-10 border-none shadow-sm bg-sky-600 text-white overflow-hidden relative">
                                <Zap className="absolute -bottom-8 -right-8 w-48 h-48 text-sky-500/20 rotate-12" fill="currentColor" />
                                <div className="relative z-10">
                                  <h3 className="text-2xl font-black mb-8 leading-tight">System Distribution</h3>
                                  <div className="space-y-8">
                                    {[
                                      { label: 'Market Velocity', value: jobs.filter(j => ['Open', 'Bidding', 'In Progress'].includes(j.status)).length, total: jobs.length, color: 'bg-sky-400' },
                                      { label: 'Bidding Intensity', value: jobs.reduce((acc, curr) => acc + curr.bids.length, 0), total: users.length * 5, color: 'bg-white' },
                                      { label: 'Trust Index (Reviews)', value: reviews.length, total: jobs.filter(j => j.status === 'Completed').length || 1, color: 'bg-yellow-400' },
                                    ].map(stat => (
                                      <div key={stat.label} className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                          <span className="opacity-80">{stat.label}</span>
                                          <span>{stat.value}</span>
                                        </div>
                                        <div className="h-2 bg-sky-700/50 rounded-full overflow-hidden border border-sky-400/20">
                                          <div 
                                            className={cn("h-full transition-all duration-1000", stat.color)} 
                                            style={{ width: `${Math.min(100, (stat.value / stat.total) * 100)}%` }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Card>

                              <Card className="p-10 bg-white border-none shadow-sm text-center">
                                 <TrendingUp className="w-12 h-12 mx-auto mb-6 text-sky-500 bg-sky-50 p-3 rounded-2xl" />
                                 <h4 className="text-xl font-black text-gray-900 mb-3">Exponential Growth</h4>
                                 <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">Platform matching efficiency has increased by 34% this month. Keep monitoring the trust index.</p>
                                 <Button className="w-full py-4 text-xs font-black uppercase tracking-widest" variant="outline">Generate Audit Report</Button>
                              </Card>

                              <Card className="p-8 bg-gray-900 text-white rounded-[40px] border-none shadow-2xl">
                                <h3 className="text-lg font-black mb-4">Quick Audit</h3>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                                    <span className="text-xs font-bold text-gray-400">Flagged Jobs</span>
                                    <span className="text-lg font-black text-red-400">0</span>
                                  </div>
                                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                                    <span className="text-xs font-bold text-gray-400">Pending KYC</span>
                                    <span className="text-lg font-black text-yellow-400">3</span>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Navigate to="/" />
                      )
                    } />
                  </Routes>
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
