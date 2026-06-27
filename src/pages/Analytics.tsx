import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, DollarSign, Star, TrendingUp, UserCheck, ThumbsUp, Zap,
  ChevronDown, ChevronRight, CheckCircle2, Clock, AlertCircle, Activity,
  UserIcon, BarChart3, PieChart, CalendarDays, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { cn, formatDate } from '../lib/utils';
import { useStore } from '../lib/useStore';
import { Card, Button } from '../components/ui';

const CHART_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-50 text-green-600',
  'In Progress': 'bg-sky-50 text-sky-600',
  Cancelled: 'bg-red-50 text-red-600',
  Open: 'bg-yellow-50 text-yellow-600',
  Bidding: 'bg-purple-50 text-purple-600',
};

export function Analytics() {
  const { users, jobs, reviews, currentUser } = useStore();
  const navigate = useNavigate();
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const clients = useMemo(() => users.filter(u => u.role === 'Client'), [users]);
  const workers = useMemo(() => users.filter(u => u.role === 'Worker'), [users]);
  const completed = useMemo(() => jobs.filter(j => j.status === 'Completed'), [jobs]);
  const activeJobs = useMemo(() => jobs.filter(j => j.status === 'Open' || j.status === 'Bidding' || j.status === 'In Progress'), [jobs]);
  const totalRevenue = useMemo(() => completed.reduce((s, j) => s + j.budget, 0), [completed]);
  const avgRating = useMemo(() =>
    reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
  [reviews]);

  const monthlyData = useMemo(() => {
    const months: Record<string, { users: number; clients: number; workers: number; jobs: number; completed: number; revenue: number }> = {};
    const getKey = (d: string) => d.slice(0, 7);

    users.forEach(u => {
      const key = getKey(u.id); if (!months[key]) months[key] = { users: 0, clients: 0, workers: 0, jobs: 0, completed: 0, revenue: 0 };
      months[key].users++;
      if (u.role === 'Client') months[key].clients++;
      if (u.role === 'Worker') months[key].workers++;
    });
    jobs.forEach(j => {
      const key = getKey(j.createdAt); if (!months[key]) months[key] = { users: 0, clients: 0, workers: 0, jobs: 0, completed: 0, revenue: 0 };
      months[key].jobs++;
    });
    completed.forEach(j => {
      const key = getKey(j.createdAt); if (!months[key]) months[key] = { users: 0, clients: 0, workers: 0, jobs: 0, completed: 0, revenue: 0 };
      months[key].completed++;
      months[key].revenue += j.budget;
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, data]) => ({ month, ...data }));
  }, [users, jobs, completed]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    jobs.forEach(j => { cats[j.category] = (cats[j.category] || 0) + 1; });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const statusData = useMemo(() => {
    const st: Record<string, number> = {};
    jobs.forEach(j => { st[j.status] = (st[j.status] || 0) + 1; });
    return Object.entries(st).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const ratingDist = useMemo(() => {
    const r: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(rev => { r[rev.rating]++; });
    return Object.entries(r).map(([name, value]) => ({ name: `${name} Star`, value }));
  }, [reviews]);

  const userAnalytics = useMemo(() => users.map(user => {
    const userJobs = jobs.filter(j => j.clientId === user.id);
    const userCompleted = jobs.filter(j => j.assignedWorkerId === user.id && j.status === 'Completed');
    const userReviews = reviews.filter(r => r.toId === user.id);
    const totalSpent = userJobs.reduce((s, j) => s + j.budget, 0);
    const totalEarned = userCompleted.reduce((s, j) => s + j.budget, 0);
    const assignedWorkers = [...new Set(userJobs.filter(j => j.assignedWorkerId).map(j => j.assignedWorkerId!))];
    return {
      ...user,
      jobsPosted: userJobs.length,
      jobsCompleted: userCompleted.length,
      totalSpent,
      totalEarned,
      avgRating: userReviews.length ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1) : '—',
      assignedWorkers: assignedWorkers.map(id => users.find(u => u.id === id)).filter(Boolean),
      reviewCount: userReviews.length,
    };
  }), [users, jobs, reviews]);

  const monthlyAnalysis = useMemo(() => {
    if (selectedMonth === 'all') return null;
    const data = monthlyData.find(m => m.month === selectedMonth);
    return data || null;
  }, [selectedMonth, monthlyData]);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, icon: Users, change: `${clients.length}C / ${workers.length}W`, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Projects', value: activeJobs.length, icon: Briefcase, change: `${((activeJobs.length / (jobs.length || 1)) * 100).toFixed(0)}% of total`, color: 'bg-sky-50 text-sky-600' },
          { label: 'Completed Jobs', value: completed.length, icon: CheckCircle2, change: `₹${totalRevenue.toLocaleString()} revenue`, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Rating', value: avgRating, icon: Star, change: `${reviews.length} reviews`, color: 'bg-yellow-50 text-yellow-600' },
        ].map((stat, i) => (
          <div key={i}>
            <Card className="p-8 border-none shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-2">{stat.change}</p>
                </div>
                <div className={cn("p-4 rounded-2xl", stat.color.split(' ').slice(0, 2).join(' '))}>
                  <stat.icon className={cn("w-7 h-7", stat.color.split(' ').slice(2).join(' '))} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Monthly Signups Chart */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Monthly Growth</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Users & Jobs Over Time</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-blue-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> Users
                </span>
                <span className="px-3 py-1.5 bg-sky-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Jobs
                </span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="jobGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="url(#userGrad)" strokeWidth={3} />
                  <Area type="monotone" dataKey="jobs" stroke="#0EA5E9" fill="url(#jobGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category & Status Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Jobs by Category</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Distribution</p>
                </div>
                <div className="p-2.5 bg-purple-50 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 700 }} tickLine={false} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0', fontSize: 12 }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-8 border-none shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Job Status</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Pipeline</p>
                </div>
                <div className="p-2.5 bg-orange-50 rounded-xl">
                  <PieChart className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Revenue Over Time */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Revenue Over Time</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Completed Job Revenue by Month</p>
              </div>
              <div className="px-4 py-2 bg-green-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600">
                Total: ₹{totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0', fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Rating Distribution */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">Rating Distribution</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{reviews.length} Total Reviews</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 rounded-lg">
                <Star className="w-4 h-4 fill-current text-yellow-600" />
                <span className="text-xs font-black text-yellow-600">{avgRating}</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {ratingDist.map((_, i) => <Cell key={i} fill={['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#10B981'][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Analysis Table */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Monthly Breakdown</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Month-over-month platform metrics</p>
              </div>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100 outline-none cursor-pointer"
              >
                <option value="all">All Months</option>
                {monthlyData.map(m => (
                  <option key={m.month} value={m.month}>{m.month}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400">Month</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">New Users</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">New Jobs</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Completed</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(monthlyAnalysis ? [monthlyAnalysis] : monthlyData).map((row, i) => (
                    <tr key={row.month} className="hover:bg-gray-50/50 transition-all">
                      <td className="py-4">
                        <span className="text-sm font-bold text-gray-900">{row.month}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black text-gray-700">{row.users}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black text-gray-700">{row.jobs}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black text-green-600">{row.completed}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-xs font-black text-gray-900">₹{row.revenue.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* User Management with Per-User Analytics */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">User Analytics</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Per-user breakdown: jobs, earnings, reviews</p>
              </div>
              <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">{users.length} Users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400">User</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Role</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Jobs Posted</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Completed</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Spent</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Earned</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Rating</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Workers Hired</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {userAnalytics.map(user => {
                    const isExpanded = expandedUserId === user.id;
                    return (
                      <>
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                          onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-sky-500 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              )}
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm" />
                              <div>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{user.name}</p>
                                <p className="text-[9px] text-gray-400 font-bold">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                              user.role === 'Worker' ? "bg-sky-50 text-sky-600" :
                              user.role === 'Admin' ? "bg-purple-50 text-purple-600" :
                              "bg-blue-50 text-blue-600"
                            )}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-xs font-black text-gray-700">{user.jobsPosted}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-xs font-black text-green-600">{user.jobsCompleted}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-xs font-black text-gray-700">₹{user.totalSpent.toLocaleString()}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-xs font-black text-green-600">₹{user.totalEarned.toLocaleString()}</span>
                          </td>
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-1 text-xs font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg inline-flex">
                              <Star className="w-3 h-3 fill-current" />
                              {user.avgRating}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className="text-[10px] font-black text-gray-600">
                              {user.assignedWorkers.length > 0
                                ? user.assignedWorkers.map((w: any) => w?.name).join(', ')
                                : '—'}
                            </span>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${user.id}-detail`}>
                            <td colSpan={8} className="px-6 pb-6">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-gray-50 rounded-2xl p-6"
                              >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Jobs Posted</p>
                                    <p className="text-2xl font-black text-gray-900">{user.jobsPosted}</p>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Jobs Completed</p>
                                    <p className="text-2xl font-black text-green-600">{user.jobsCompleted}</p>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Spent</p>
                                    <p className="text-2xl font-black text-gray-900">₹{user.totalSpent.toLocaleString()}</p>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Reviews Received</p>
                                    <p className="text-2xl font-black text-yellow-600">{user.reviewCount}</p>
                                  </div>
                                </div>

                                {/* Show jobs this user posted */}
                                {user.jobsPosted > 0 && (
                                  <div>
                                    <p className="text-xs font-black text-gray-700 mb-3 uppercase tracking-wider">Jobs Posted by {user.name}</p>
                                    <div className="space-y-2">
                                      {jobs.filter(j => j.clientId === user.id).slice(0, 10).map(job => {
                                        const worker = job.assignedWorkerId ? users.find(u => u.id === job.assignedWorkerId) : null;
                                        const review = reviews.find(r => r.jobId === job.id);
                                        return (
                                          <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900 truncate">{job.title}</p>
                                                <span className={cn(
                                                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                  STATUS_COLORS[job.status] || 'bg-gray-50 text-gray-600'
                                                )}>
                                                  {job.status}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[10px] font-bold text-gray-400">₹{job.budget.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{job.category}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{formatDate(job.createdAt)}</span>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                              {worker ? (
                                                <div className="flex items-center gap-1.5">
                                                  <span className="text-[9px] font-bold text-gray-500">Worker:</span>
                                                  <img src={worker.avatar} alt={worker.name} className="w-6 h-6 rounded-lg object-cover" />
                                                  <span className="text-[10px] font-black text-sky-600">{worker.name}</span>
                                                </div>
                                              ) : (
                                                <span className="text-[10px] font-bold text-gray-400">No worker assigned</span>
                                              )}
                                              {review && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                                                  <Star className="w-3 h-3 fill-current" />
                                                  {review.rating}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Worker Performance */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Worker Performance</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Completion rates, earnings & ratings</p>
              </div>
              <span className="px-4 py-2 bg-green-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600 border border-green-100">{workers.length} Workers</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400">Worker</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Jobs Completed</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Total Earned</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Avg Rating</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Clients Served</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Skills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {workers.map(worker => {
                    const workerCompleted = jobs.filter(j => j.assignedWorkerId === worker.id && j.status === 'Completed');
                    const workerJobs = jobs.filter(j => j.assignedWorkerId === worker.id);
                    const workerReviews = reviews.filter(r => r.toId === worker.id);
                    const totalEarned = workerCompleted.reduce((s, j) => s + j.budget, 0);
                    const clients = [...new Set(workerJobs.map(j => j.clientId))];
                    const completionRate = workerJobs.length ? Math.round((workerCompleted.length / workerJobs.length) * 100) : 0;
                    return (
                      <tr key={worker.id} className="hover:bg-gray-50/50 transition-all group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={worker.avatar} alt={worker.name} className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm" />
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">{worker.name}</p>
                              <p className="text-[9px] text-gray-400 font-bold">{worker.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-xs font-black text-green-600">{workerCompleted.length}</span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-xs font-black text-gray-900">₹{totalEarned.toLocaleString()}</span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-xs font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg inline-flex">
                            <Star className="w-3 h-3 fill-current" />
                            {workerReviews.length ? (workerReviews.reduce((s, r) => s + r.rating, 0) / workerReviews.length).toFixed(1) : '—'}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-xs font-black text-gray-700">{clients.length}</span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {worker.skills?.slice(0, 3).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-bold text-gray-600 uppercase tracking-wider">{skill}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {workers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">No workers registered yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Completed Deliveries */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Completed Deliveries</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Worker Success Logs</p>
              </div>
              <span className="px-4 py-2 bg-green-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600 border border-green-100">{completed.length} Finalized</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400">Project</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Client</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Worker</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Revenue</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Rating</th>
                    <th className="pb-4 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {completed.slice().reverse().map(job => {
                    const client = users.find(u => u.id === job.clientId);
                    const worker = users.find(u => u.id === job.assignedWorkerId);
                    const review = reviews.find(r => r.jobId === job.id);
                    return (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-all group">
                        <td className="py-4">
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[180px]">{job.title}</p>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <img src={client?.avatar} alt={client?.name || ''} className="w-5 h-5 rounded-lg object-cover" />
                            <span className="text-[10px] font-bold text-gray-600">{client?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <img src={worker?.avatar} alt={worker?.name || ''} className="w-5 h-5 rounded-lg object-cover" />
                            <span className="text-[10px] font-black text-sky-600">{worker?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">₹{job.budget.toLocaleString()}</span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-xs font-black text-yellow-600">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {review?.rating || '—'}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="text-[10px] font-bold text-gray-400">{formatDate(job.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {completed.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">No completed jobs yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Reviews Feed */}
          <Card className="p-8 border-none shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900">Platform Feedback Feed</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">All Reviews & Ratings</p>
              </div>
              <span className="px-4 py-2 bg-yellow-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-yellow-600 border border-yellow-100">{reviews.length} Reviews</span>
            </div>
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
                            <img src={from?.avatar} alt={from?.name || 'From'} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                            <img src={to?.avatar} alt={to?.name || 'To'} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="text-gray-900">{from?.name}</span> rated <span className="text-gray-900">{to?.name}</span>
                          </div>
                        </div>
                        <div className="flex text-yellow-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-current" : "text-gray-100")} />)}
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

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* System Distribution */}
          <Card className="p-10 border-none shadow-sm bg-sky-600 text-white overflow-hidden relative">
            <Zap className="absolute -bottom-8 -right-8 w-48 h-48 text-sky-500/20 rotate-12" fill="currentColor" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 leading-tight">System Distribution</h3>
              <div className="space-y-8">
                {[
                  { label: 'Market Velocity', value: activeJobs.length, total: jobs.length || 1, color: 'bg-sky-400' },
                  { label: 'Bidding Intensity', value: jobs.reduce((a, c) => a + c.bids.length, 0), total: users.length * 5 || 1, color: 'bg-white' },
                  { label: 'Trust Index (Reviews)', value: reviews.length, total: completed.length || 1, color: 'bg-yellow-400' },
                ].map(stat => (
                  <div key={stat.label} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="opacity-80">{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="h-2 bg-sky-700/50 rounded-full overflow-hidden border border-sky-400/20">
                      <div
                        className={cn("h-full transition-all duration-1000 rounded-full", stat.color)}
                        style={{ width: `${Math.min(100, (stat.value / stat.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Platform Stats */}
          <Card className="p-8 border-none shadow-sm">
            <h3 className="text-lg font-black text-gray-900 mb-6">Platform Summary</h3>
            <div className="space-y-5">
              {[
                { label: 'Total Users', value: users.length, sub: `${clients.length} Clients · ${workers.length} Workers`, icon: Users, color: 'text-blue-600' },
                { label: 'Total Jobs', value: jobs.length, sub: `${completed.length} Completed · ${activeJobs.length} Active`, icon: Briefcase, color: 'text-sky-600' },
                { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `Avg ₹${completed.length ? Math.round(totalRevenue / completed.length).toLocaleString() : 0}/job`, icon: DollarSign, color: 'text-green-600' },
                { label: 'Total Reviews', value: reviews.length, sub: `Avg ${avgRating} stars`, icon: Star, color: 'text-yellow-600' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 bg-white rounded-xl shadow-sm", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{stat.sub}</p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Metrics */}
          <Card className="p-8 bg-gray-900 text-white rounded-[40px] border-none shadow-2xl">
            <h3 className="text-lg font-black mb-6">Quick Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                <span className="text-xs font-bold text-gray-400">Avg Budget</span>
                <span className="text-lg font-black text-white">₹{jobs.length ? Math.round(jobs.reduce((s, j) => s + j.budget, 0) / jobs.length).toLocaleString() : 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                <span className="text-xs font-bold text-gray-400">Bids per Job</span>
                <span className="text-lg font-black text-sky-400">{(jobs.length ? (jobs.reduce((s, j) => s + j.bids.length, 0) / jobs.length) : 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                <span className="text-xs font-bold text-gray-400">Completion Rate</span>
                <span className="text-lg font-black text-green-400">{jobs.length ? Math.round((completed.length / jobs.length) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-3xl">
                <span className="text-xs font-bold text-gray-400">Worker Utilization</span>
                <span className="text-lg font-black text-yellow-400">{workers.length ? Math.round(([...new Set(jobs.filter(j => j.assignedWorkerId).map(j => j.assignedWorkerId))].length / workers.length) * 100) : 0}%</span>
              </div>
            </div>
          </Card>

          {/* Growth Card */}
          <Card className="p-10 bg-white border-none shadow-sm text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-6 text-sky-500 bg-sky-50 p-3 rounded-2xl" />
            <h4 className="text-xl font-black text-gray-900 mb-3">Exponential Growth</h4>
            <p className="text-sm text-gray-400 leading-relaxed font-medium mb-8">
              Platform is growing steadily. {monthlyData.length > 1
                ? `Last month saw ${monthlyData[monthlyData.length - 1].users} new users and ${monthlyData[monthlyData.length - 1].jobs} new jobs.`
                : 'Start posting jobs to grow the platform.'}
            </p>
            <Button className="w-full py-4 text-xs font-black uppercase tracking-widest" variant="outline">Generate Audit Report</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
