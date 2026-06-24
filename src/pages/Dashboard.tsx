import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Briefcase, CheckCircle2, MessageSquare, DollarSign, Clock, Activity, ChevronRight, Star
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { useStore } from '../lib/useStore';

export function Dashboard() {
  const { currentUser, jobs, reviews } = useStore();
  const navigate = useNavigate();

  const myJobs = jobs.filter(j =>
    currentUser?.role === 'Worker'
      ? j.assignedWorkerId === currentUser?.id
      : j.clientId === currentUser?.id
  );
  const activeJobs = myJobs.filter(j => j.status === 'In Progress');
  const completedJobs = myJobs.filter(j => j.status === 'Completed');
  const openJobs = myJobs.filter(j => j.status === 'Open' || j.status === 'Bidding');
  const totalBids = myJobs.reduce((sum, j) => sum + j.bids.length, 0);
  const totalEarnings = completedJobs.reduce((sum, j) => sum + j.budget, 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const kpiCards = [
    { label: 'Active Projects', value: activeJobs.length, icon: Briefcase, bg: 'bg-[#0EA5E9]/10', trend: '+12%' },
    { label: 'Completed', value: completedJobs.length, icon: CheckCircle2, bg: 'bg-[#10B981]/10', trend: '+8%' },
    { label: currentUser?.role === 'Worker' ? 'Proposals Sent' : 'Proposals Received', value: totalBids, icon: MessageSquare, bg: 'bg-[#8B5CF6]/10', trend: '+24%' },
    { label: currentUser?.role === 'Worker' ? 'Earnings' : 'Spent', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, bg: 'bg-[#F59E0B]/10', trend: '+18%' },
  ];

  const recentActivity = [
    ...completedJobs.slice(0, 2).map(j => ({ type: 'completed' as const, job: j })),
    ...activeJobs.slice(0, 2).map(j => ({ type: 'in_progress' as const, job: j })),
    ...openJobs.slice(0, 1).map(j => ({ type: 'open' as const, job: j })),
  ].slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0EA5E9]/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">Online</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}
            <span className="inline-block ml-2">👋</span>
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {currentUser?.role === 'Worker'
              ? `${openJobs.length} jobs available near you. Ready to earn?`
              : `You have ${activeJobs.length} active project${activeJobs.length !== 1 ? 's' : ''} in progress.`}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/marketplace')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] text-white text-sm font-semibold rounded-lg hover:bg-[#0284C7] transition-colors shadow-lg shadow-[#0EA5E9]/20"
            >
              <Search className="w-4 h-4" />
              Browse Marketplace
            </motion.button>
            {currentUser?.role === 'Client' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/post-job')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/10"
              >
                <Plus className="w-4 h-4" />
                Post a Job
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 transition-shadow hover:shadow-lg hover:shadow-[#0F172A]/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", kpi.bg)}>
                  <Icon className="w-5 h-5 text-[#0EA5E9]" />
                </div>
                <span className={cn("text-[9px] font-bold px-2 py-1 rounded-full", i % 2 === 0 ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" : "bg-[#10B981]/10 text-[#10B981]")}>
                  {kpi.trend}
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-[#0F172A]">{kpi.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Search, label: 'Browse Marketplace', color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10', onClick: () => navigate('/marketplace') },
                ...(currentUser?.role === 'Client' ? [{ icon: Plus, label: 'Post a New Job', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', onClick: () => navigate('/post-job') }] : []),
                { icon: Briefcase, label: 'View My Projects', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/10', onClick: () => navigate('/my-jobs') },
                { icon: MessageSquare, label: 'Check Messages', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', onClick: () => navigate('/messages') },
              ].map(action => {
                const ActionIcon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", action.bg)}>
                      <ActionIcon className={cn("w-4 h-4", action.color)} />
                    </div>
                    <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] ml-auto" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Recent Activity</h3>
              <button onClick={() => navigate('/my-jobs')} className="text-[11px] font-semibold text-[#0EA5E9] hover:text-[#0284C7] transition-colors">View All</button>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item, i) => {
                  const j = item.job;
                  const activityConfig = item.type === 'completed'
                    ? { icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', label: 'Completed' }
                    : item.type === 'in_progress'
                    ? { icon: Briefcase, color: 'text-[#0EA5E9]', bg: 'bg-[#0EA5E9]/10', label: 'In Progress' }
                    : { icon: Clock, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', label: 'Open' };
                  const ActIcon = activityConfig.icon;
                  return (
                    <motion.div
                      key={j.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/job/${j.id}`)}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", activityConfig.bg)}>
                        <ActIcon className={cn("w-4 h-4", activityConfig.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors truncate">{j.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={cn("text-[10px] font-semibold", activityConfig.color)}>{activityConfig.label}</span>
                          <span className="text-[10px] text-[#94A3B8]">₹{j.budget.toLocaleString()}</span>
                          <span className="text-[10px] text-[#94A3B8]">{formatDate(j.createdAt)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#0EA5E9] transition-colors flex-shrink-0 mt-1" />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 text-[#CBD5E1] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#64748B]">No activity yet</p>
                <p className="text-[11px] text-[#94A3B8] mt-1">Start by browsing the marketplace</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
