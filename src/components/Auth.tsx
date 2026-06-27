import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Hammer, 
  UserCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { store } from '../lib/store';

type AuthMode = 'login' | 'signup';
type UserRole = 'Client' | 'Worker' | 'Admin';

interface AuthProps {
  onBack?: () => void;
}

export const Auth = ({ onBack }: AuthProps) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Client');
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            },
          },
        });

        if (error) throw error;
        
        if (data.user) {
          if (data.session) {
            toast.success('Account created! Welcome to Lovi.');
            store.load();
            navigate('/dashboard');
          } else {
            toast.success('Signup successful! Please check your email for a verification link.', {
              duration: 10000,
            });
            setMode('login');
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px]" />
      
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-navy-800/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-blue-500/5 overflow-hidden relative z-10 border border-white/10"
      >
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                <img src="/Lovi-app/icon.svg" alt="Lovi Icon" className="h-8 w-8" />
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase">LOVI WORKS</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {mode === 'login' ? 'Welcome Back' : 'Join Lovi'}
            </h1>
            <p className="text-navy-700 font-medium text-sm mt-2">
              {mode === 'login' 
                ? 'Access your micro-job marketplace' 
                : 'Start hiring or earning today'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 bg-navy-900/50 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">I want to...</label>
                    <div className={cn("grid gap-4", showAdmin ? "grid-cols-3" : "grid-cols-2")}>
                      <button
                        type="button"
                        onClick={() => setRole('Client')}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                          role === 'Client'
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-white/5 bg-navy-900/50 text-white/30 hover:border-white/20"
                        )}
                      >
                        <UserCircle className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Hire Help</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('Worker')}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                          role === 'Worker'
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-white/5 bg-navy-900/50 text-white/30 hover:border-white/20"
                        )}
                      >
                        <Hammer className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Provide Work</span>
                      </button>
                      {showAdmin && (
                        <button
                          type="button"
                          onClick={() => setRole('Admin')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                            role === 'Admin'
                              ? "border-blue-500 bg-blue-500/10 text-blue-400"
                              : "border-white/5 bg-navy-900/50 text-white/30 hover:border-white/20"
                          )}
                        >
                          <ShieldCheck className="w-6 h-6" />
                          <span className="text-xs font-bold uppercase tracking-widest">Admin</span>
                        </button>
                      )}
                    </div>
                    {!showAdmin && (
                      <button
                        type="button"
                        onClick={() => { setShowAdmin(true); setRole('Admin'); }}
                        className="text-[10px] text-white/20 hover:text-blue-400 font-bold uppercase tracking-wider mt-2 transition-colors"
                      >
                        Admin? Register here
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-navy-900/50 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-navy-900/50 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/30 outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-bold text-white/30 hover:text-blue-400 transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="bg-navy-900/50 p-6 flex items-center justify-center gap-2 border-t border-white/5">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Secure AES-256 Encryption</span>
        </div>
      </motion.div>
    </div>
  );
};
