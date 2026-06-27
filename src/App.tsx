/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
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
  LayoutDashboard,
  LogOut,
  Star,
  CheckCircle2,
  TrendingUp,
  Map as MapIcon,
  Camera,
  ThumbsUp,
  MessageSquare,
  Clock,
  ChevronRight,
  ChevronDown,
  Home,
  Bookmark,
  Mail,
  Settings,
  Users,
  Shield,
  Activity,
  Briefcase,
  ArrowRight,
  ChevronUp,
  ChevronLeft,
  Filter,
  RefreshCw,
  Award,
  Globe,
  Heart,
  Share2,
  MoreHorizontal,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { APIProvider, Map as GoogleMap, AdvancedMarker } from '@vis.gl/react-google-maps';

import { useStore } from './lib/useStore';
import { cn, formatDate, calculateDistance, formatDistance } from './lib/utils';
import { Job, JobCategory, Bid, Notification, User, Review } from './types';
import { store } from './lib/store';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { Layout } from './components/Layout';
import { ProfileModal } from './components/ProfileModal';
import { Button, Card } from './components/ui';
import { Dashboard } from './pages/Dashboard';
import { Marketplace } from './pages/Marketplace';
import { MyProjects } from './pages/MyProjects';
import { Professionals } from './pages/Professionals';
import { Messages } from './components/Messages';
import { Analytics } from './pages/Analytics';
import { Settings as SettingsPage } from './pages/Settings';

const WorkerProfileModal = ({ worker, isOpen, onClose, reviews, users }: {
  worker: User | null;
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  users: User[];
}) => {
  if (!isOpen || !worker) return null;

  const workerReviews = reviews.filter(r => r.toId === worker.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="fixed inset-0 bg-sky-500/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative h-32 bg-gradient-to-r from-sky-500 to-sky-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <img src={worker.avatar} alt={worker.name} className="w-24 h-24 rounded-full object-cover border-4 border-white" />
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{worker.name}</h2>
                {worker.verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-gray-500">{worker.email}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {worker.role}
              </span>
              <div className="flex items-center gap-1 justify-end mt-2 text-yellow-600 font-bold">
                <Star className="w-4 h-4 fill-current" />
                {worker.rating || 'N/A'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
              <p className="font-bold">{worker.completedJobs || 0} Jobs</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reviews</p>
              <p className="font-bold">{workerReviews.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-green-600 font-bold">Verified</p>
            </div>
          </div>

          {worker.bio && (
            <div className="mb-8">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{worker.bio}</p>
            </div>
          )}

          {worker.skills && worker.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              Customer Reviews ({workerReviews.length})
            </h3>

            {workerReviews.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">No reviews yet for this professional</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workerReviews.map(review => {
                  const customer = users.find(u => u.id === review.fromId);
                  return (
                    <div key={review.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer?.avatar}
                            alt={customer?.name || 'Customer'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{customer?.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{customer?.role}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={cn("w-3.5 h-3.5", i <= review.rating ? "fill-current" : "text-gray-200")} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 italic leading-relaxed text-sm mb-2">"{review.comment}"</p>
                      )}
                      <p className="text-[10px] text-gray-400 font-medium">{formatDate(review.createdAt)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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

const JobDetailsView = ({ job, onClose, onAcceptBid, onBid, onMarkCompleted, onViewWorkerProfile, userLocation }: { 
  job: Job, 
  onClose: () => void, 
  onAcceptBid: (bid: Bid) => void,
  onBid: (amount: number, message: string) => void,
  onMarkCompleted: (job: Job) => void,
  onViewWorkerProfile: (worker: User) => void,
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
                    <img key={i} src={p} alt="Job photo" className="w-full h-48 object-cover rounded-2xl shadow-sm hover:shadow-md transition-shadow" />
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
                                <img src={fromUser?.avatar} alt={fromUser?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
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
                                <div
                                  className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-lg font-bold overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-sky-300 transition-all"
                                  onClick={(e) => { e.stopPropagation(); if (worker) onViewWorkerProfile(worker); }}
                                >
                                  {worker?.avatar ? <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" /> : bid.workerName.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p
                                      className="font-bold text-lg cursor-pointer hover:text-sky-600 transition-colors"
                                      onClick={(e) => { e.stopPropagation(); if (worker) onViewWorkerProfile(worker); }}
                                    >{bid.workerName}</p>
                                    {worker?.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-yellow-600 font-bold text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); if (worker) onViewWorkerProfile(worker); }}>
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

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const icons: Record<Notification['type'], React.ReactNode> = {
    new_job: <Bell className="w-5 h-5" />,
    new_bid: <MessageSquare className="w-5 h-5" />,
    bid_accepted: <CheckCircle2 className="w-5 h-5" />,
    new_review: <Star className="w-5 h-5" />,
    job_completed: <CheckCircle2 className="w-5 h-5" />,
  };
  return icons[type] || <Bell className="w-5 h-5" />;
};

const NotificationPanel = ({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onClose,
  onNavigate 
}: { 
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
  onNavigate: (jobId: string) => void
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={panelRef}
      className="absolute top-16 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-lg">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs font-bold text-sky-500 hover:text-sky-600 uppercase tracking-wider"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) onMarkRead(notification.id);
                  if (notification.relatedJobId) onNavigate(notification.relatedJobId);
                  onClose();
                }}
                className={cn(
                  "w-full text-left p-4 flex gap-3 hover:bg-gray-50 transition-colors",
                  !notification.isRead && "bg-sky-50/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  notification.type === 'new_job' ? "bg-blue-100 text-blue-600" :
                  notification.type === 'new_bid' ? "bg-green-100 text-green-600" :
                  notification.type === 'bid_accepted' ? "bg-sky-100 text-sky-600" :
                  notification.type === 'new_review' ? "bg-yellow-100 text-yellow-600" :
                  "bg-emerald-100 text-emerald-600"
                )}>
                  <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm", !notification.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = ({ onMenuClick, onToggleNotifications, onProfileClick, onLogoClick, unreadCount }: { 
  onMenuClick: () => void, 
  onToggleNotifications: () => void, 
  onProfileClick: () => void,
  onLogoClick: () => void,
  unreadCount: number
}) => {
  const { currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-16 border-b border-[#E2E8F0] bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-[#64748B]" />
        </button>
        <div 
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0" 
          onClick={onLogoClick}
        >
          <div className="w-7 h-7 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-sm shadow-[#0EA5E9]/20 group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight hidden sm:inline">Lovi</span>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs, professionals, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#94A3B8] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded font-mono hidden lg:inline">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Messages */}
        <button className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors group">
          <Mail className="w-5 h-5 text-[#64748B] group-hover:text-[#0EA5E9] transition-colors" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#0EA5E9] text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">3</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors group" onClick={onToggleNotifications}>
          <Bell className="w-5 h-5 text-[#64748B] group-hover:text-[#0EA5E9] transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#F59E0B] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1 border border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-[#E2E8F0] mx-1" />

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 hover:bg-[#F8FAFC] p-1.5 pr-3 rounded-lg transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                currentUser?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#0F172A] leading-tight">{currentUser?.name?.split(' ')[0] || 'User'}</p>
              <p className="text-[9px] text-[#94A3B8] font-medium">{currentUser?.role || 'Member'}</p>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-[#94A3B8] transition-transform", showUserMenu && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[#E2E8F0] shadow-xl shadow-[#0F172A]/5 overflow-hidden"
              >
                <div className="p-3 border-b border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#0F172A]">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#64748B]">{currentUser?.email}</p>
                </div>
                <div className="p-1.5">
                  {[
                    { icon: UserIcon, label: 'Profile', onClick: () => onProfileClick() },
                    { icon: Settings, label: 'Settings', onClick: () => {} },
                    { icon: Award, label: 'Badges & Achievements', onClick: () => {} },
                  ].map((item, i) => (
                    <motion.button
                      key={item.label}
                      whileHover={{ x: 2 }}
                      onClick={() => { item.onClick(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                <div className="p-1.5 border-t border-[#E2E8F0]">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
  
  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['Client', 'Worker', 'Admin'], path: '/dashboard' },
    { id: 'marketplace', label: 'Marketplace', icon: Search, roles: ['Client', 'Worker', 'Admin'], path: '/marketplace' },
    { id: 'my-jobs', label: 'My Projects', icon: Briefcase, roles: ['Client', 'Worker', 'Admin'], path: '/my-jobs' },
    { id: 'saved', label: 'Saved Professionals', icon: Bookmark, roles: ['Client'], path: '/saved' },
    { id: 'nearby', label: 'Nearby Experts', icon: MapPin, roles: ['Client', 'Worker'], path: '/nearby' },
  ];

  const supportItems = [
    { id: 'messages', label: 'Messages', icon: Mail, roles: ['Client', 'Worker', 'Admin'], path: '/messages' },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['Client', 'Worker', 'Admin'], path: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Client', 'Worker', 'Admin'], path: '/settings' },
  ];

  const filteredMain = mainItems.filter(item => item.roles.includes(currentUser?.role || ''));
  const filteredSupport = supportItems.filter(item => item.roles.includes(currentUser?.role || ''));

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[260px] bg-white border-r border-[#E2E8F0] z-50 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
            <Zap className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">Lovi</span>
          <span className="text-[9px] font-bold text-[#0EA5E9] bg-[#0EA5E9]/10 px-2 py-0.5 rounded-full ml-auto">BETA</span>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Main</p>
          {filteredMain.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate(item.path); onClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group relative",
                isActive(item.path)
                  ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" 
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              {isActive(item.path) && (
                <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 h-5 bg-[#0EA5E9] rounded-r-full" />
              )}
              <item.icon className={cn("w-4.5 h-4.5", isActive(item.path) ? "text-[#0EA5E9]" : "text-[#94A3B8] group-hover:text-[#0EA5E9]")} />
              <span>{item.label}</span>
              {item.id === 'messages' && (
                <span className="ml-auto w-5 h-5 bg-[#0EA5E9] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
              )}
            </motion.button>
          ))}

          <div className="my-4 border-t border-[#E2E8F0]" />

          <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Support</p>
          {filteredSupport.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { navigate(item.path); onClose(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group",
                isActive(item.path)
                  ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" 
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5", isActive(item.path) ? "text-[#0EA5E9]" : "text-[#94A3B8] group-hover:text-[#0EA5E9]")} />
              <span>{item.label}</span>
            </motion.button>
          ))}

          {currentUser?.role === 'Admin' && (
            <>
              <div className="my-4 border-t border-[#E2E8F0]" />
              <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Admin</p>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate('/analytics'); onClose(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group",
                  location.pathname === '/analytics'
                    ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" 
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                )}
              >
                {location.pathname === '/analytics' && (
                  <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 h-5 bg-[#0EA5E9] rounded-r-full" />
                )}
                <Shield className={cn("w-4.5 h-4.5", location.pathname === '/analytics' ? "text-[#0EA5E9]" : "text-[#94A3B8] group-hover:text-[#0EA5E9]")} />
                <span>Admin Panel</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#E2E8F0] flex-shrink-0">
          <div className="p-4 bg-gradient-to-br from-[#0EA5E9]/5 to-[#0EA5E9]/10 rounded-xl border border-[#0EA5E9]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#0EA5E9] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">Need help?</p>
                <p className="text-[9px] text-[#64748B]">We're here 24/7</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-[11px] font-bold text-[#0EA5E9] rounded-lg border border-[#0EA5E9]/20 hover:bg-[#0EA5E9]/5 transition-colors">
              Contact Support
            </button>
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
  onViewWorkerProfile,
  userLocation 
}: { 
  onAcceptBid: (jobId: string, bid: Bid) => void,
  onBid: (jobId: string, amount: number, message: string) => void,
  onMarkCompleted: (job: Job) => void,
  onViewWorkerProfile: (worker: User) => void,
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
      onViewWorkerProfile={onViewWorkerProfile}
      userLocation={userLocation}
    />
  );
};

// --- Page Fragments ---

const categoryIcons: Record<string, React.ElementType> = {
  Electrical: Zap,
  Plumbing: Droplets,
  Carpentry: Hammer,
  'Smart Home': Camera,
  Other: Wrench,
};

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
                  {/* Top Accent */}
                  <div className="h-1 bg-gradient-to-r from-[#0EA5E9]/0 via-[#0EA5E9]/20 to-[#0EA5E9]/0 group-hover:from-[#0EA5E9]/40 group-hover:via-[#0EA5E9]/60 group-hover:to-[#0EA5E9]/40 transition-all" />

                  <div className="p-5 flex-1" onClick={() => navigate(`/job/${job.id}`)}>
                    {/* Header Row */}
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

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-[#0F172A] mb-1 group-hover:text-[#0EA5E9] transition-colors leading-snug">{job.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">{job.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                        {job.location?.address?.split(',')[0] || 'Remote'}
                      </span>
                      <span className="text-[10px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                        Posted {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Owner Proposals Preview */}
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

                  {/* Footer */}
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
};

const PostJobWizard = ({ onPost }: { onPost: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electrical' as JobCategory,
    budget: 500,
    address: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
    photos: [] as string[]
  });

  const next = () => { setShowPhotoPicker(false); setStep(s => s + 1); };
  const prev = () => { setShowPhotoPicker(false); setStep(s => s - 1); };

  const uploadToSupabase = async (file: File) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast.error('You must be signed in to upload photos');
      return;
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `public/${fileName}`;

    setUploading(true);
    const { data, error } = await supabase.storage
      .from('job-photos')
      .upload(filePath, file, { upsert: false });

    if (error) {
      toast.error('Failed to upload photo: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('job-photos')
      .getPublicUrl(filePath);

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, publicUrl]
    }));
    setUploading(false);
    toast.success('Photo added!');
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToSupabase(file);
    }
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadToSupabase(file);
    }
    if (galleryInputRef.current) galleryInputRef.current.value = '';
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
                    <img src={p} alt="Uploaded photo" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => setFormData(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))}
                      className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.photos.length < 4 && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowPhotoPicker(true)}
                      disabled={uploading}
                      className="aspect-square w-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-sky-500 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        {uploading ? 'Uploading...' : 'Add Photo'}
                      </span>
                    </button>

                    {showPhotoPicker && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowPhotoPicker(false)} />
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                          <button
                            onClick={() => { cameraInputRef.current?.click(); setShowPhotoPicker(false); }}
                            className="w-full px-4 py-3 text-sm font-medium text-left hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Camera className="w-4 h-4 text-sky-500" />
                            Take Photo
                          </button>
                          <button
                            onClick={() => { galleryInputRef.current?.click(); setShowPhotoPicker(false); }}
                            className="w-full px-4 py-3 text-sm font-medium text-left hover:bg-gray-50 flex items-center gap-3 border-t border-gray-100"
                          >
                            <span className="w-4 h-4 flex items-center justify-center text-sky-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </span>
                            Upload from Gallery
                          </button>
                        </div>
                      </>
                    )}

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleCameraCapture}
                    />
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryPick}
                    />
                  </div>
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
  const { jobs, users, reviews, currentUser, notifications, unreadCount, addJob, addBid, acceptBid, markJobCompleted, addReview, markNotificationRead, markAllNotificationsRead } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [_showPostModal, setShowPostModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [jobToReview, setJobToReview] = useState<Job | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWorkerProfile, setShowWorkerProfile] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const performInit = async () => {
    setInitError(null);
    setIsInitializing(true);
    
    // Safety timeout: force loading to false after 4 seconds
    const timeout = setTimeout(() => {
      console.warn('Initialization timed out, forcing UI to load');
      setIsInitializing(false);
    }, 4000);

    try {
      // If store is already initialized, we can skip the wait
      if ((store as any).initialized) {
        setIsInitializing(false);
        clearTimeout(timeout);
        return;
      }
      await store.load();
    } catch (err: any) {
      console.error('Initialization error:', err);
      setInitError(err.message || 'Connection failed.');
    } finally {
      clearTimeout(timeout);
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
          setUserLocation(prev => prev || { lat: 12.9716, lng: 77.5946 });
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
    performInit();
  }, []);



  const MAP_KEY = (import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || (import.meta.env as any).GOOGLE_MAPS_PLATFORM_KEY || '')
    .replace('PASTE_YOUR_GOOGLE_MAPS_KEY_HERE', '');

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 max-w-xs text-center">
          <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-500/30 animate-pulse">
            <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-10 w-10" />
          </div>
          <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Initializing Lovi...</p>
      </div>
    </div>
  );
};




  if (!currentUser) {
    return (
      <>
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => navigate('/auth')} />} />
          <Route path="/auth" element={<Auth onBack={() => navigate('/')} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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

  if (location.pathname === '/') {
    return <LandingPage onGetStarted={() => navigate('/marketplace')} />;
  }
  return (
    <Layout>
      {showNotifications && (
        <NotificationPanel 
          notifications={notifications}
          onMarkRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
          onClose={() => setShowNotifications(false)}
          onNavigate={(jobId) => navigate(`/job/${jobId}`)}
        />
      )}
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
                      {location.pathname === '/dashboard' && "Dashboard"}
                      {location.pathname === '/marketplace' && "Marketplace"}
                      {location.pathname === '/radar' && "Maps"}
                      {location.pathname === '/my-jobs' && "My Project Portfolio"}
                      {location.pathname === '/analytics' && "Platform Insights"}
                    </h1>
                    <p className="text-gray-500 font-medium">
                      {location.pathname === '/dashboard' && "Welcome back! Here's your business overview."}
                      {location.pathname === '/marketplace' && "Connect with top-rated local professionals for any task."}
                      {location.pathname === '/radar' && "Scanning for micro-jobs in your area."}
                      {location.pathname === '/my-jobs' && "Manage your active contracts and work history."}
                      {location.pathname === '/analytics' && "Comprehensive overview of Lovi system performance."}
                    </p>
                  </div>
                  
                  {currentUser?.role === 'Client' && location.pathname !== '/analytics' && location.pathname !== '/dashboard' && (
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
                    {showWorkerProfile && (
                      <WorkerProfileModal
                        worker={selectedWorker}
                        isOpen={showWorkerProfile}
                        onClose={() => setShowWorkerProfile(false)}
                        reviews={reviews}
                        users={users}
                      />
                    )}
                  </AnimatePresence>

                  <Routes>
                    <Route path="/job/:id" element={
                      <JobDetailsRoute 
                        onAcceptBid={handleAcceptBid}
                        onBid={handleBid}
                        onMarkCompleted={handleMarkCompleted}
                        onViewWorkerProfile={(worker) => { setSelectedWorker(worker); setShowWorkerProfile(true); }}
                        userLocation={userLocation}
                      />
                    } />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/marketplace" element={
                      <Marketplace
                        userLocation={userLocation}
                        onViewWorkerProfile={(worker) => { setSelectedWorker(worker); setShowWorkerProfile(true); }}
                      />
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

                    <Route path="/my-jobs" element={<MyProjects onMarkCompleted={handleMarkCompleted} />} />

                    <Route path="/analytics" element={
                      currentUser?.role === 'Admin' ? (
                        <Analytics />
                      ) : (
                        <Navigate to="/" />
                      )
                    } />
                    <Route path="/saved" element={
                      <Professionals onViewWorkerProfile={(worker) => { setSelectedWorker(worker); setShowWorkerProfile(true); }} />
                    } />
                    <Route path="/professionals" element={
                      <Professionals onViewWorkerProfile={(worker) => { setSelectedWorker(worker); setShowWorkerProfile(true); }} />
                    } />
                    <Route path="/nearby" element={
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
                                      <MapPin className="w-6 h-6 text-white" />
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
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Nearby Experts Map</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                  Add your Google Maps API Key to VITE_GOOGLE_MAPS_PLATFORM_KEY in .env to enable the nearby experts map.
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-3xl border border-gray-100 z-10 shadow-xl flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-sky-600 mb-0.5">
                                <Zap className="w-3 h-3 fill-current" />
                                Nearby Experts
                              </p>
                              <h4 className="text-sm font-black text-gray-900">Professionals around you</h4>
                            </div>
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                              {store.getUsers().filter(u => u.role === 'Worker').length} Available
                            </div>
                          </div>
                        </Card>
                      </div>
                    } />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/notifications" element={
                      <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-[#E2E8F0]">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto mb-5">
                          <Bell className="w-8 h-8 text-[#CBD5E1]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F172A]">Notifications</h3>
                        <p className="text-sm text-[#64748B] mt-1 mb-6 max-w-sm mx-auto">Stay updated with job alerts, bid responses, and platform announcements.</p>
                        <Button variant="secondary" onClick={() => navigate('/marketplace')}>Browse Jobs</Button>
                      </div>
                    } />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
    </Layout>
  );
}
