import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, CheckCircle2, Loader2, Lock, Save, Upload, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStore } from '../lib/useStore';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { JobCategory } from '../types';

const CATEGORIES: JobCategory[] = [
  'Electrical', 'Plumbing', 'Carpentry', 'Painting',
  'General Handyman', 'Cleaning', 'Smart Home', 'Other'
];

export function Settings() {
  const { currentUser, updateProfile } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState<JobCategory[]>(currentUser?.skills || []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, bio, skills });
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `avatars/${currentUser.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('job-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('job-photos')
        .getPublicUrl(filePath);

      await updateProfile({ avatar: publicUrl });
      toast.success('Profile photo updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated!');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const toggleSkill = (cat: JobCategory) => {
    setSkills(prev => prev.includes(cat) ? prev.filter(s => s !== cat) : [...prev, cat]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 font-bold mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Profile</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Your personal information</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 transition-all active:scale-90 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div>
              <p className="font-bold text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-400 font-bold">{currentUser?.email}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 px-2.5 py-1 bg-sky-50 text-sky-600 rounded-lg inline-block">{currentUser?.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-300 outline-none transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Tell clients about yourself..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-300 outline-none transition-all resize-none"
              />
            </div>

            {/* Skills */}
            {currentUser?.role === 'Worker' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleSkill(cat)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border-2 transition-all",
                        skills.includes(cat)
                          ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-200"
                          : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold flex items-center gap-2.5 transition-all shadow-lg shadow-sky-200 active:scale-95 disabled:opacity-70"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Password</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Change your login password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-300 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold flex items-center gap-2.5 transition-all active:scale-95 disabled:opacity-70"
            >
              {changingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Account Info</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Your account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</p>
              <p className="text-sm font-bold text-gray-900">{currentUser?.email || '—'}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Account Type</p>
              <span className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block",
                currentUser?.role === 'Worker' ? "bg-sky-50 text-sky-600" :
                currentUser?.role === 'Admin' ? "bg-purple-50 text-purple-600" :
                "bg-blue-50 text-blue-600"
              )}>{currentUser?.role}</span>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">User ID</p>
              <p className="text-xs font-bold text-gray-400 font-mono">{currentUser?.id?.slice(0, 16)}...</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Gender</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{currentUser?.gender || 'Not set'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
