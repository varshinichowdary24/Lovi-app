import { Job, User, Bid, Review, JobCategory } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'Worker',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&h=400&fit=crop',
    bio: 'Expert electrician with 10 years experience in residential wiring and smart home setups.',
    skills: ['Electrical', 'Smart Home'],
    rating: 4.8,
    completedJobs: 124,
    verified: true,
  },
  {
    id: 'w2',
    name: 'Anita Sharma',
    email: 'anita@example.com',
    role: 'Worker',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Professional carpenter specializing in bespoke furniture and modern kitchen fittings.',
    skills: ['Carpentry', 'Woodwork' as any],
    rating: 4.9,
    completedJobs: 89,
    verified: true,
  },
  {
    id: 'c1',
    name: 'Varshini Chowdary',
    email: 'varshini@example.com',
    role: 'Client',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
  },
  {
    id: 'admin',
    name: 'Lovi Admin',
    role: 'Admin',
    email: 'admin@lovi.works',
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Install 3 Smart Switches',
    description: 'Need someone to replace standard switches with Lovi Smart Switches in the living room.',
    category: 'Smart Home',
    budget: 1500,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Indiranagar, Bangalore',
    },
    clientId: 'c1',
    clientName: 'Varshini Chowdary',
    status: 'Bidding',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    urgency: 'High',
    bids: [
      {
        id: 'b1',
        workerId: 'w1',
        workerName: 'Rajesh Kumar',
        amount: 1400,
        message: 'I can do this today evening. I have installed 50+ Lovi switches.',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      }
    ],
  },
  {
    id: 'j2',
    title: 'Kitchen Cabinet Hinge Repair',
    description: 'Two hinges are loose and one is broken. Need replacement.',
    category: 'Carpentry',
    budget: 800,
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: 'Koramangala, Bangalore',
    },
    clientId: 'c1',
    clientName: 'Varshini Chowdary',
    status: 'Open',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    urgency: 'Medium',
    bids: [],
  }
];

class LoviStore {
  private users: User[] = [...MOCK_USERS];
  private jobs: Job[] = [...MOCK_JOBS];
  private reviews: Review[] = [];
  private currentUser: User | null = MOCK_USERS[2]; // Defaulting to Client Varshini for demo

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.notify();
  }

  getJobs() {
    return this.jobs;
  }

  getJobById(id: string) {
    return this.jobs.find(j => j.id === id);
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  getReviews() {
    return this.reviews;
  }

  addJob(jobData: Omit<Job, 'id' | 'createdAt' | 'bids' | 'status'>) {
    const newJob: Job = {
      ...jobData,
      id: `j${this.jobs.length + 1}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      bids: [],
    };
    this.jobs = [newJob, ...this.jobs];
    this.notify();
    return newJob;
  }

  addBid(jobId: string, bidData: Omit<Bid, 'id' | 'createdAt'>) {
    const job = this.getJobById(jobId);
    if (!job) return;

    // Check if worker already bid
    const existingBid = job.bids.find(b => b.workerId === bidData.workerId);
    if (existingBid) return;

    const newBid: Bid = {
      ...bidData,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    job.bids = [...job.bids, newBid];
    job.status = 'Bidding';
    this.notify();
  }

  acceptBid(jobId: string, bidId: string) {
    const job = this.getJobById(jobId);
    if (!job) return;

    const bid = job.bids.find(b => b.id === bidId);
    if (!bid) return;

    job.selectedBidId = bidId;
    job.assignedWorkerId = bid.workerId;
    job.status = 'In Progress';
    this.notify();
  }

  completeJob(jobId: string) {
    const job = this.getJobById(jobId);
    if (!job) return;

    job.status = 'Completed';
    
    // Update worker's completed jobs count
    if (job.assignedWorkerId) {
      const worker = this.getUserById(job.assignedWorkerId);
      if (worker) {
        worker.completedJobs = (worker.completedJobs || 0) + 1;
      }
    }
    
    this.notify();
  }

  addReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const newReview: Review = {
      ...reviewData,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    this.reviews = [newReview, ...this.reviews];

    // Update worker rating (simplified)
    const worker = this.getUserById(reviewData.toId);
    if (worker) {
      const currentRating = worker.rating || 0;
      const count = worker.completedJobs || 1;
      worker.rating = Number(((currentRating * (count - 1) + reviewData.rating) / count).toFixed(1));
    }

    this.notify();
    return newReview;
  }

  // Simple listener pattern for React reactivity
  private listeners: (() => void)[] = [];
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  private notify() {
    this.listeners.forEach(l => l());
    // Persist to local storage
    localStorage.setItem('lovi_jobs', JSON.stringify(this.jobs));
    localStorage.setItem('lovi_users', JSON.stringify(this.users));
    localStorage.setItem('lovi_reviews', JSON.stringify(this.reviews));
  }

  load() {
    const storedJobs = localStorage.getItem('lovi_jobs');
    const storedUsers = localStorage.getItem('lovi_users');
    const storedReviews = localStorage.getItem('lovi_reviews');
    if (storedJobs) this.jobs = JSON.parse(storedJobs);
    if (storedUsers) this.users = JSON.parse(storedUsers);
    if (storedReviews) this.reviews = JSON.parse(storedReviews);
  }
}

export const store = new LoviStore();
store.load();
