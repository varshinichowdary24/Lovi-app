import { useState, useEffect } from 'react';
import { store } from './store';
import { Job, User, Notification, Message } from '../types';

export function useStore() {
  const [jobs, setJobs] = useState<Job[]>(store.getJobs());
  const [users, setUsers] = useState<User[]>(store.getUsers());
  const [reviews, setReviews] = useState(store.getReviews());
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [notifications, setNotifications] = useState<Notification[]>(store.getNotifications());
  const [messages, setMessages] = useState<Message[]>(store.getMessages());
  const [unreadCount, setUnreadCount] = useState(store.getUnreadNotificationCount());

  useEffect(() => {
    return store.subscribe(() => {
      setJobs([...store.getJobs()]);
      setUsers([...store.getUsers()]);
      setReviews([...store.getReviews()]);
      setCurrentUser(store.getCurrentUser());
      setNotifications([...store.getNotifications()]);
      setMessages([...store.getMessages()]);
      setUnreadCount(store.getUnreadNotificationCount());
    });
  }, []);

  return {
    jobs,
    users,
    reviews,
    currentUser,
    notifications,
    messages,
    unreadCount,
    getUnreadMessageCount: store.getUnreadMessageCount.bind(store),
    addJob: store.addJob.bind(store),
    addBid: store.addBid.bind(store),
    acceptBid: store.acceptBid.bind(store),
    markJobCompleted: store.markJobCompleted.bind(store),
    addReview: store.addReview.bind(store),
    setCurrentUser: store.setCurrentUser.bind(store),
    markNotificationRead: store.markNotificationRead.bind(store),
    markAllNotificationsRead: store.markAllNotificationsRead.bind(store),
    sendMessage: store.sendMessage.bind(store),
    markMessageRead: store.markMessageRead.bind(store),
  };
}
