/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type JobCategory = 'Electrical' | 'Plumbing' | 'Carpentry' | 'Painting' | 'General Handyman' | 'Cleaning' | 'Smart Home' | 'Other';

export type JobStatus = 'Open' | 'Bidding' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Client' | 'Worker' | 'Admin';
  avatar?: string;
  bio?: string;
  skills?: JobCategory[];
  rating?: number;
  completedJobs?: number;
  verified?: boolean;
}

export interface Bid {
  id: string;
  workerId: string;
  workerName: string;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  location: Location;
  clientId: string;
  clientName: string;
  status: JobStatus;
  createdAt: string;
  urgency: 'Low' | 'Medium' | 'High';
  photos?: string[];
  bids: Bid[];
  assignedWorkerId?: string;
  selectedBidId?: string;
}

export interface Review {
  id: string;
  jobId: string;
  fromId: string;
  toId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
