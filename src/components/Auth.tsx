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
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[120px] opacity-50" />
      
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-sky-900/10 overflow-hidden relative z-10 border border-sky-100"
      >
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-sky-500/30">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAbCAMAAAAqGX2oAAAAilBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////8AAAD8/P0WFhaLi4vk5ur19fXc3NxYWFikpKStra2RkZG3t7cxMTHGxsYlJSXs7OzQ0NB9fX1mZmY7Ozs/Pz++vr5oiuhJSUnmDoC6AAAAFXRSTlMAxtSZ6ms3YM/3HorcFXdTCp/gRKSeo9f0AAABOklEQVQokX2T2XaDMAxETSHs2TMyi9khkLT9/9+rgcQxWTovtufqSDIWjN20PpquhUmWYW599qTgCwsdgrWOHQsvspwHX73iUas737znwOaW/xMHpir+oj7n+mqNne51/k2UdXIt6TKdTZngoPGuLpOoACrKk/m2/qIDnrdAW0CMQfcuTlpA+lviHJ2Rk7JOTP+CghL0A3hUKStknhYQZ2lSV6jqRFke0+/Q5mgI6aXUPD1D0wrEAwrqHp736IHLCmOVKorBVcAXM+fN+UpXSSCyugT/UU2YbDtvrr3oKeoFeIc0T1SKLfPDaXOJG2qagaK4KmlIVQX5GMFcoqZC2iLP2qxQHIF8rF2IjwqnebA/Bxz/nTht5hzvHfa0qbXdV+7ai//CMRZZPMNhT9rZm73hTjL2K3t39/8ArBs8+rwjYq0AAAAASUVORK5CYII=" alt="Lovi Icon" className="h-10 w-10 brightness-0 invert" />
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
                    <div className={cn("grid gap-4", showAdmin ? "grid-cols-3" : "grid-cols-2")}>
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
                      {showAdmin && (
                        <button
                          type="button"
                          onClick={() => setRole('Admin')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                            role === 'Admin' 
                              ? "border-sky-500 bg-sky-50 text-sky-600" 
                              : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
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
                        className="text-[10px] text-gray-400 hover:text-sky-500 font-bold uppercase tracking-wider mt-2 transition-colors"
                      >
                        Admin? Register here
                      </button>
                    )}
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
