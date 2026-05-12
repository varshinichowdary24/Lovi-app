import { useState, useEffect } from 'react';
import { store } from './store';
import { Job, User } from '../types';

export function useStore() {
  const [jobs, setJobs] = useState<Job[]>(store.getJobs());
  const [users, setUsers] = useState<User[]>(store.getUsers());
  const [reviews, setReviews] = useState(store.getReviews());
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());

  useEffect(() => {
    return store.subscribe(() => {
      setJobs([...store.getJobs()]);
      setUsers([...store.getUsers()]);
      setReviews([...store.getReviews()]);
      setCurrentUser(store.getCurrentUser());
    });
  }, []);

  return {
    jobs,
    users,
    reviews,
    currentUser,
    addJob: store.addJob.bind(store),
    addBid: store.addBid.bind(store),
    acceptBid: store.acceptBid.bind(store),
    completeJob: store.completeJob.bind(store),
    addReview: store.addReview.bind(store),
    setCurrentUser: store.setCurrentUser.bind(store),
  };
}
