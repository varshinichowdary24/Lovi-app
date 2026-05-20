import { supabase } from './supabase';
import { Job, User, Bid, Review, JobCategory, Location } from '../types';
import { Database } from '../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'] & { client_marked_completed?: boolean, worker_marked_completed?: boolean };
type BidRow = Database['public']['Tables']['bids']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

class LoviStore {
  public readonly supabase = supabase;
  private users: User[] = [];
  private jobs: Job[] = [];
  private reviews: Review[] = [];
  private currentUser: User | null = null;
  private initialized = false;

  constructor() {
    // Auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
            this.currentUser = this.mapProfileToUser(profile);
            this.notify();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.notify();
      }
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async setCurrentUser(user: User | null) {
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

  private mapProfileToUser(profile: ProfileRow): User {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as 'Client' | 'Worker' | 'Admin',
      avatar: profile.avatar_url || undefined,
      bio: profile.bio || undefined,
      skills: (profile.skills as JobCategory[]) || undefined,
      rating: profile.rating || undefined,
      completedJobs: profile.completed_jobs || undefined,
      verified: profile.verified || undefined,
    };
  }

  private async fetchJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        client:profiles!jobs_client_id_fkey(name),
        bids(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }

    this.jobs = (data || []).map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category as JobCategory,
      budget: job.budget,
      location: job.location as unknown as Location,
      clientId: job.client_id,
      clientName: (job.client as any)?.name || 'Unknown',
      status: job.status as any,
      createdAt: job.created_at || new Date().toISOString(),
      urgency: job.urgency as any,
      photos: job.photos || undefined,
      bids: (job.bids || []).map((bid: any) => {
        const worker = this.users.find(u => u.id === bid.worker_id);
        return {
          id: bid.id,
          workerId: bid.worker_id,
          workerName: worker?.name || 'Professional Worker',
          amount: bid.amount || 0,
          message: bid.message || '',
          createdAt: bid.created_at || new Date().toISOString(),
        };
      }),
      assignedWorkerId: job.assigned_worker_id || undefined,
      selectedBidId: job.selected_bid_id || undefined,
      clientMarkedCompleted: (job as any).client_marked_completed || false,
      workerMarkedCompleted: (job as any).worker_marked_completed || false,
    }));
  }

  async addJob(jobData: Omit<Job, 'id' | 'createdAt' | 'bids' | 'status'>) {
    const insertData = {
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      budget: jobData.budget,
      location: jobData.location as any,
      client_id: jobData.clientId,
      urgency: jobData.urgency,
      status: 'Open',
      photos: jobData.photos || [],
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Error adding job:', error);
      throw error;
    }

    await this.fetchJobs();
    this.notify();
    
    const newJobId = data?.[0]?.id;
    return (newJobId ? this.jobs.find(j => j.id === newJobId) : null) || this.jobs[0];
  }

  async addBid(jobId: string, bidData: Omit<Bid, 'id' | 'createdAt'>) {
    const { error } = await supabase
      .from('bids')
      .insert({
        job_id: jobId,
        worker_id: bidData.workerId,
        amount: bidData.amount,
        message: bidData.message,
      });

    if (error) {
      console.error('Error adding bid:', error);
      throw error;
    }

    // Update job status to Bidding if it was Open
    await supabase.from('jobs').update({ status: 'Bidding' }).eq('id', jobId).eq('status', 'Open');

    await this.fetchJobs();
    this.notify();
  }

  async acceptBid(jobId: string, bidId: string) {
    const bid = this.jobs.flatMap(j => j.bids).find(b => b.id === bidId);
    if (!bid) return;

    const { error } = await supabase
      .from('jobs')
      .update({
        selected_bid_id: bidId,
        assigned_worker_id: bid.workerId,
        status: 'In Progress',
      })
      .eq('id', jobId);

    if (error) {
      console.error('Error accepting bid:', error);
      throw error;
    }

    await this.fetchJobs();
    this.notify();
  }

  async markJobCompleted(jobId: string, role: 'Client' | 'Worker') {
    // 1. Fetch latest state from DB to avoid race conditions with local state
    const { data: latestJob, error: fetchError } = await supabase
      .from('jobs')
      .select('client_marked_completed, worker_marked_completed, assigned_worker_id')
      .eq('id', jobId)
      .single();

    if (fetchError || !latestJob) {
      console.error('Error fetching latest job state:', fetchError);
      return;
    }

    const update: any = {};
    if (role === 'Client') update.client_marked_completed = true;
    if (role === 'Worker') update.worker_marked_completed = true;

    // 2. Determine if this action completes the job
    const isBothMarked = (role === 'Client' && latestJob.worker_marked_completed) || 
                         (role === 'Worker' && latestJob.client_marked_completed);
    
    if (isBothMarked) {
      update.status = 'Completed';
    }

    // 3. Apply the update
    const { error: updateError } = await supabase
      .from('jobs')
      .update(update)
      .eq('id', jobId);

    if (updateError) {
      console.error('Error marking job completed:', updateError);
      throw updateError;
    }

    // 4. Update worker profile statistics if completed
    if (isBothMarked && latestJob.assigned_worker_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('completed_jobs')
        .eq('id', latestJob.assigned_worker_id)
        .single();
        
      if (profile) {
        await supabase
          .from('profiles')
          .update({ completed_jobs: (profile.completed_jobs || 0) + 1 })
          .eq('id', latestJob.assigned_worker_id);
      }
    }

    await this.fetchJobs();
    await this.loadUsers();
    
    if (isBothMarked) {
      const job = this.getJobById(jobId);
      this.emit('job_completed', job);
    }
    
    this.notify();
    return isBothMarked;
  }

  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        job_id: reviewData.jobId,
        from_id: reviewData.fromId,
        to_id: reviewData.toId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      throw error;
    }

    // Update worker rating
    const { data: reviews } = await supabase.from('reviews').select('rating').eq('to_id', reviewData.toId);
    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase.from('profiles').update({ rating: Number(avgRating.toFixed(1)) }).eq('id', reviewData.toId);
    }

    await this.loadReviews();
    await this.loadUsers();
    this.notify();
    
    return {
      id: data.id,
      jobId: data.job_id,
      fromId: data.from_id,
      toId: data.to_id,
      rating: data.rating,
      comment: data.comment || '',
      createdAt: data.created_at || new Date().toISOString(),
    };
  }

  private listeners: (() => void)[] = [];
  private eventListeners: ((event: { type: string, payload: any }) => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  onEvent(listener: (event: { type: string, payload: any }) => void) {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private emit(type: string, payload: any) {
    this.eventListeners.forEach(l => l({ type, payload }));
  }

  private async loadUsers() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Error loading users:', error);
      return;
    }
    this.users = (data || []).map(this.mapProfileToUser);
  }

  private async loadReviews() {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }
    this.reviews = (data || []).map(r => ({
      id: r.id,
      jobId: r.job_id,
      fromId: r.from_id,
      toId: r.to_id,
      rating: r.rating,
      comment: r.comment || '',
      createdAt: r.created_at || new Date().toISOString(),
    }));
  }

  async signOut() {
    await supabase.auth.signOut();
    this.currentUser = null;
    this.notify();
  }

  async load() {
    if (this.initialized) return;
    
    console.log('Initializing Lovi Store...');

    // Check for existing session
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Authenticated user found:', user.id);
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (profile) {
        console.log('Existing profile found for user:', profile.name);
        this.currentUser = this.mapProfileToUser(profile);
      } else {
        console.log('No profile found for authenticated user, creating one...');
        // Try to create a profile if it doesn't exist (common for new signups)
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'New User',
            email: user.email || '',
            role: user.user_metadata?.role || 'Client',
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile for user:', createError);
        } else if (newProfile) {
          console.log('Successfully created profile:', newProfile.name);
          this.currentUser = this.mapProfileToUser(newProfile);
        }
      }
    }

    await this.loadUsers();
    console.log('Loaded users:', this.users.length);
    
    await this.fetchJobs();
    console.log('Loaded jobs:', this.jobs.length);
    
    await this.loadReviews();
    
    this.initialized = true;
    this.notify();

    // Setup real-time subscriptions
    supabase
      .channel('public:changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          this.emit('new_job', payload.new);
        }
        this.fetchJobs().then(() => this.notify());
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const job = this.jobs.find(j => j.id === payload.new.job_id);
          this.emit('new_bid', { bid: payload.new, job });
        }
        this.fetchJobs().then(() => this.notify());
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => this.loadUsers().then(() => this.notify()))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => this.loadReviews().then(() => this.notify()))
      .subscribe();
  }
}

export const store = new LoviStore();
