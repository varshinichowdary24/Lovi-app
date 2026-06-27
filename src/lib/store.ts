import { supabase } from './supabase';
import { Job, User, Bid, Review, JobCategory, Location, Notification, Message } from '../types';
import { Database } from '../database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'] & { client_marked_completed?: boolean, worker_marked_completed?: boolean };
type BidRow = Database['public']['Tables']['bids']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

function getGenderAvatarSeed(gender: string | null | undefined, id: string): string {
  if (gender === 'male') return `male-${id}`;
  if (gender === 'female') return `female-${id}`;
  return id;
}

class LoviStore {
  public readonly supabase = supabase;
  private users: User[] = [];
  private jobs: Job[] = [];
  private reviews: Review[] = [];
  private notifications: Notification[] = [];
  private messages: Message[] = [];
  private currentUser: User | null = null;
  private initialized = false;
  private initializing = false;

  constructor() {
    // Auth state change listener - Optimized for instant transition
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          // 1. Optimistic Update: Set basic user info immediately to trigger UI transition
          const isNewUser = !this.currentUser || this.currentUser.id !== session.user.id;
          if (isNewUser) {
            const metadataGender = session.user.user_metadata?.gender as string | undefined;
            this.currentUser = {
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Lovi User',
              email: session.user.email || '',
              role: session.user.user_metadata?.role || 'Client',
              gender: metadataGender as 'male' | 'female' | 'other' | undefined,
              avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${getGenderAvatarSeed(metadataGender, session.user.id)}`,
            };
            this.notify();
          }

          // 2. Background Update: Fetch full profile silently
          this.refreshProfile(session.user.id);
          
          // 3. Background Load: Ensure marketplace data is loading
          this.load();
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.notify();
      }
    });
  }

  private async refreshProfile(userId: string) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, email, role, avatar_url, gender, bio, skills, rating, completed_jobs, verified')
        .eq('id', userId)
        .single();
      
      if (profile) {
        this.currentUser = this.mapProfileToUser(profile as ProfileRow);
        this.notify();
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.notify();
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'bio' | 'skills' | 'avatar'>>) {
    if (!this.currentUser) return;

    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', this.currentUser.id);

    if (error) throw error;

    this.currentUser = { ...this.currentUser, ...updates };
    this.notify();
  }

  getJobs() {
    return this.jobs;
  }

  getUsers() {
    return this.users;
  }

  getReviews() {
    return this.reviews;
  }

  getNotifications() {
    return this.notifications;
  }

  getMessages() {
    return this.messages;
  }

  getUnreadMessageCount() {
    if (!this.currentUser) return 0;
    return this.messages.filter(m => m.receiverId === this.currentUser!.id && !m.isRead).length;
  }

  getUnreadNotificationCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  private mapProfileToUser(profile: ProfileRow): User {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as 'Client' | 'Worker' | 'Admin',
      gender: (profile.gender as 'male' | 'female' | 'other') || undefined,
      avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${getGenderAvatarSeed(profile.gender, profile.id)}`,
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

    if (error) throw error;

    const workers = this.users.filter(u => u.role === 'Worker');
    const notificationInserts = workers.map(w => ({
      user_id: w.id,
      type: 'new_job',
      title: `New Job: ${jobData.title}`,
      message: `A new ${jobData.category} job has been posted in ${jobData.location.address}`,
      related_job_id: data?.[0]?.id,
      related_user_id: jobData.clientId,
    }));
    if (notificationInserts.length > 0) {
      await supabase.from('notifications').insert(notificationInserts);
    }

    await this.fetchJobs();
    await this.fetchNotifications();
    this.notify();
    return data?.[0];
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

    if (error) throw error;
    await supabase.from('jobs').update({ status: 'Bidding' }).eq('id', jobId).eq('status', 'Open');

    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      await supabase.from('notifications').insert({
        user_id: job.clientId,
        type: 'new_bid',
        title: `New Bid on ${job.title}`,
        message: `${bidData.workerName} bid ₹${bidData.amount} on your job`,
        related_job_id: jobId,
        related_user_id: bidData.workerId,
      });
    }

    await this.fetchJobs();
    await this.fetchNotifications();
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

    if (error) throw error;

    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      await supabase.from('notifications').insert({
        user_id: bid.workerId,
        type: 'bid_accepted',
        title: `Bid Accepted for ${job.title}`,
        message: `Your bid of ₹${bid.amount} was accepted! The job is now in progress.`,
        related_job_id: jobId,
        related_user_id: job.clientId,
      });
    }

    await this.fetchJobs();
    await this.fetchNotifications();
    this.notify();
  }

  async markJobCompleted(jobId: string, role: 'Client' | 'Worker') {
    const { data: latestJob, error: fetchError } = await supabase
      .from('jobs')
      .select('client_marked_completed, worker_marked_completed, assigned_worker_id')
      .eq('id', jobId)
      .single();

    if (fetchError || !latestJob) throw fetchError;

    const update: any = {};
    if (role === 'Client') update.client_marked_completed = true;
    if (role === 'Worker') update.worker_marked_completed = true;

    const isBothMarked = (role === 'Client' && latestJob.worker_marked_completed) || 
                         (role === 'Worker' && latestJob.client_marked_completed);
    
    if (isBothMarked) update.status = 'Completed';

    const { error: updateError } = await supabase.from('jobs').update(update).eq('id', jobId);
    if (updateError) throw updateError;

    if (isBothMarked && latestJob.assigned_worker_id) {
      const { data: profile } = await supabase.from('profiles').select('completed_jobs').eq('id', latestJob.assigned_worker_id).single();
      if (profile) {
        await supabase.from('profiles').update({ completed_jobs: (profile.completed_jobs || 0) + 1 }).eq('id', latestJob.assigned_worker_id);
      }
    }

    await Promise.all([this.fetchJobs(), this.loadUsers()]);
    if (isBothMarked) {
      const completedJob = this.jobs.find(j => j.id === jobId);
      this.emit('job_completed', completedJob);
      if (completedJob) {
        const notificationEntries = [
          { user_id: completedJob.clientId, related_user_id: completedJob.assignedWorkerId },
          { user_id: completedJob.assignedWorkerId, related_user_id: completedJob.clientId },
        ].filter(n => n.user_id).map(n => ({
          user_id: n.user_id!,
          type: 'job_completed',
          title: `Job Completed: ${completedJob.title}`,
          message: `${completedJob.title} has been marked as complete by both parties.`,
          related_job_id: jobId,
          related_user_id: n.related_user_id,
        }));
        if (notificationEntries.length > 0) {
          await supabase.from('notifications').insert(notificationEntries);
        }
      }
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

    if (error) throw error;

    const { data: reviews } = await supabase.from('reviews').select('rating').eq('to_id', reviewData.toId);
    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase.from('profiles').update({ rating: Number(avgRating.toFixed(1)) }).eq('id', reviewData.toId);
    }

    const job = this.jobs.find(j => j.id === reviewData.jobId);
    const fromUser = this.users.find(u => u.id === reviewData.fromId);
    if (job && fromUser) {
      await supabase.from('notifications').insert({
        user_id: reviewData.toId,
        type: 'new_review',
        title: `New Review from ${fromUser.name}`,
        message: `${fromUser.name} left you a ${reviewData.rating}-star review for "${job.title}"`,
        related_job_id: reviewData.jobId,
        related_user_id: reviewData.fromId,
      });
    }

    await Promise.all([this.loadReviews(), this.loadUsers()]);
    await this.fetchNotifications();
    this.notify();
    return data;
  }

  async fetchNotifications() {
    if (!this.currentUser) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    this.notifications = (data || []).map(r => this.mapNotification(r as NotificationRow));
    this.notify();
  }

  async markNotificationRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
    this.notify();
  }

  async markAllNotificationsRead() {
    if (!this.currentUser) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', this.currentUser.id).eq('is_read', false);
    this.notifications.forEach(n => n.isRead = true);
    this.notify();
  }

  async fetchMessages() {
    if (!this.currentUser) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${this.currentUser.id},receiver_id.eq.${this.currentUser.id}`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    this.messages = (data || []).map(r => ({
      id: r.id,
      senderId: r.sender_id,
      receiverId: r.receiver_id,
      content: r.content,
      isRead: r.is_read || false,
      createdAt: r.created_at || new Date().toISOString(),
    }));
    this.notify();
  }

  async sendMessage(receiverId: string, content: string) {
    if (!this.currentUser) return;
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: this.currentUser.id,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();

    if (error) throw error;

    await this.fetchMessages();
    return data;
  }

  async markMessageRead(messageId: string) {
    await supabase.from('messages').update({ is_read: true }).eq('id', messageId);
    const msg = this.messages.find(m => m.id === messageId);
    if (msg) msg.isRead = true;
    this.notify();
  }

  private mapNotification(row: NotificationRow): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type as any,
      title: row.title,
      message: row.message,
      relatedJobId: row.related_job_id || undefined,
      relatedUserId: row.related_user_id || undefined,
      isRead: row.is_read || false,
      createdAt: row.created_at || new Date().toISOString(),
    };
  }

  private listeners: (() => void)[] = [];
  private eventListeners: ((event: { type: string, payload: any }) => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  onEvent(listener: (event: { type: string, payload: any }) => void) {
    this.eventListeners.push(listener);
    return () => { this.eventListeners = this.eventListeners.filter(l => l !== listener); };
  }

  private notify() { this.listeners.forEach(l => l()); }
  private emit(type: string, payload: any) { this.eventListeners.forEach(l => l({ type, payload })); }

  private async loadUsers() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return;
    this.users = (data || []).map(this.mapProfileToUser);
  }

  private async loadReviews() {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error) return;
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
    if (this.initializing || this.initialized) return;
    this.initializing = true;
    
    try {
      // Parallelize all marketplace data fetching
      await Promise.all([
        this.loadUsers(),
        this.fetchJobs(),
        this.loadReviews(),
        this.fetchNotifications(),
        this.fetchMessages()
      ]);
      
      this.initialized = true;
      this.notify();

      // Setup real-time subscriptions (silent background process)
      this.setupSubscriptions();
    } catch (err) {
      console.error('Store load error:', err);
    } finally {
      this.initializing = false;
    }
  }

  private setupSubscriptions() {
    supabase
      .channel('public:changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        if (payload.eventType === 'INSERT') this.emit('new_job', payload.new);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.eventType === 'INSERT' && this.currentUser && payload.new.user_id === this.currentUser.id) {
          this.notifications.unshift(this.mapNotification(payload.new as NotificationRow));
          this.notify();
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT' && this.currentUser) {
          const msg = payload.new as any;
          if (msg.sender_id === this.currentUser.id || msg.receiver_id === this.currentUser.id) {
            this.messages.unshift({
              id: msg.id,
              senderId: msg.sender_id,
              receiverId: msg.receiver_id,
              content: msg.content,
              isRead: msg.is_read || false,
              createdAt: msg.created_at || new Date().toISOString(),
            });
            this.notify();
          }
        }
        if (payload.eventType === 'UPDATE' && this.currentUser) {
          const msg = payload.new as any;
          const existing = this.messages.find(m => m.id === msg.id);
          if (existing) {
            existing.isRead = msg.is_read || false;
            this.notify();
          }
        }
      })
      .subscribe();
  }
}

export const store = new LoviStore();
