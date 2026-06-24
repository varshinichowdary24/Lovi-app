import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, MapPin, Calendar, User as UserIcon
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { useStore } from '../lib/useStore';
import { Job } from '../types';
import { Button, Card } from '../components/ui';

export function MyProjects({ onMarkCompleted }: { onMarkCompleted: (job: Job) => void }) {
  const { currentUser, jobs, users } = useStore();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const myJobs = jobs.filter(j =>
    currentUser?.role === 'Worker'
      ? j.assignedWorkerId === currentUser?.id
      : j.clientId === currentUser?.id
  );

  const filteredJobs = statusFilter === 'All'
    ? myJobs
    : myJobs.filter(j => j.status === statusFilter);

  const tabs = [
    { label: 'All', count: myJobs.length, key: 'All' },
    { label: 'Open', count: myJobs.filter(j => j.status === 'Open' || j.status === 'Bidding').length, key: 'Open' },
    { label: 'In Progress', count: myJobs.filter(j => j.status === 'In Progress').length, key: 'In Progress' },
    { label: 'Completed', count: myJobs.filter(j => j.status === 'Completed').length, key: 'Completed' },
  ];

  const getProgress = (job: Job) => {
    switch (job.status) {
      case 'Open': return 10;
      case 'Bidding': return 25;
      case 'In Progress': return 60;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-[#F59E0B]';
      case 'Bidding': return 'bg-[#0EA5E9]';
      case 'In Progress': return 'bg-[#8B5CF6]';
      case 'Completed': return 'bg-[#10B981]';
      default: return 'bg-[#94A3B8]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Open': return 'Bidding Open';
      case 'Bidding': return 'Reviewing Bids';
      case 'In Progress': return 'Active';
      case 'Completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              statusFilter === tab.key
                ? "bg-[#0EA5E9]/10 text-[#0EA5E9]"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              statusFilter === tab.key ? "bg-[#0EA5E9]/20 text-[#0EA5E9]" : "bg-[#F1F5F9] text-[#94A3B8]"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-[#E2E8F0]">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-8 h-8 text-[#CBD5E1]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A]">
            {statusFilter === 'All' ? 'No projects yet' : `No ${statusFilter.toLowerCase()} projects`}
          </h3>
          <p className="text-sm text-[#64748B] mt-1 mb-6 max-w-sm mx-auto">
            {statusFilter === 'All'
              ? 'Start by posting a job or browsing the marketplace.'
              : `You don't have any projects with status "${statusFilter}".`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/marketplace')}>Browse Marketplace</Button>
            {currentUser?.role === 'Client' && (
              <Button variant="outline" onClick={() => navigate('/post-job')}>Post a Job</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="border border-[#E2E8F0] hover:border-[#0EA5E9]/30 hover:shadow-lg transition-all rounded-xl overflow-hidden">
                <div className="p-5 lg:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={cn("w-2 h-2 rounded-full", getStatusColor(job.status))} />
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          job.status === 'Open' ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                          job.status === 'Bidding' ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" :
                          job.status === 'In Progress' ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                          "bg-[#10B981]/10 text-[#10B981]"
                        )}>
                          {getStatusLabel(job.status)}
                        </span>
                        <span className="text-[9px] text-[#94A3B8] font-mono">#{job.id.slice(0, 6)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#0F172A] mb-1">{job.title}</h3>
                      <p className="text-sm text-[#64748B] line-clamp-2 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                          {job.location?.address?.split(',')[0] || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
                          {formatDate(job.createdAt)}
                        </span>
                        {job.assignedWorkerId && (
                          <span className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                            {users.find(u => u.id === job.assignedWorkerId)?.name || 'Assigned'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-row lg:flex-col items-center lg:items-stretch gap-4 lg:gap-4 lg:border-l border-[#E2E8F0] lg:pl-6">
                      <div className="flex-1 lg:text-right">
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Budget</p>
                        <p className="text-2xl font-bold text-[#0F172A]">₹{job.budget.toLocaleString()}</p>
                      </div>

                      <div className="flex-1 lg:w-full">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Progress</span>
                          <span className="text-[10px] font-bold text-[#0F172A]">{getProgress(job)}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgress(job)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn("h-full rounded-full", getStatusColor(job.status))}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 lg:w-full">
                        <Button className="flex-1 text-[10px] py-2 h-auto font-semibold" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>
                          View
                        </Button>
                        {job.status === 'In Progress' && currentUser?.id && (
                          <Button className="flex-1 text-[10px] py-2 h-auto font-semibold" variant="secondary" onClick={() => onMarkCompleted(job)}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
