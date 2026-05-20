import React, { useState } from 'react';
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
  UserCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { store } from '../lib/store';

type AuthMode = 'login' | 'signup';
type UserRole = 'Client' | 'Worker';

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Client');

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
          toast.success('Signup successful! Please check your email for verification.');
          // Auto-login or wait for verification depends on Supabase config
          // For now, we'll try to load the profile
          await store.load();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success('Welcome back!');
        await store.load();
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
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-sky-900/10 overflow-hidden relative z-10 border border-sky-100"
      >
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-500/30">
              <img src="https://lovi.life/Favicon.png" alt="Lovi Icon" className="h-10 w-10 brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Join Lovi'}
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
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
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">I want to...</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('Client')}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                          role === 'Client' 
                            ? "border-sky-500 bg-sky-50 text-sky-600" 
                            : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
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
                            ? "border-sky-500 bg-sky-50 text-sky-600" 
                            : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                        )}
                      >
                        <Hammer className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Provide Work</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-500/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
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
              className="text-sm font-bold text-gray-400 hover:text-sky-500 transition-colors"
            >
              {mode === 'login' 
                ? "Don't have an account? Create one" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex items-center justify-center gap-2 border-t border-gray-100">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure AES-256 Encryption</span>
        </div>
      </motion.div>
    </div>
  );
};
