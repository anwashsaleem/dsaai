import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Password Validation
  const isLengthValid = password.length >= 6;
  const isPasswordValid = isLengthValid;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'signup') {
        if (!isPasswordValid) {
            throw new Error("Password must be at least 6 characters long");
        }

        // Use server-side signup to bypass email confirmation
        // Encode the name for the URL to avoid issues with special characters
        const safeName = encodeURIComponent(name);
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeName}`;
        
        const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-2ba06582/signup`;
        
        let res;
        try {
            res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: name,
                    avatar_url: avatarUrl
                })
            });
        } catch (netErr) {
            throw new Error("Network error. Please check your connection.");
        }

        let data;
        try {
            data = await res.json();
        } catch (parseErr) {
            throw new Error("Server response invalid. Please try again later.");
        }
        
        if (!res.ok) {
            const errorMessage = data.error || 'Signup failed';
            
            // Handle duplicate user error from Supabase
            if (errorMessage.toLowerCase().includes('already registered') || 
                errorMessage.toLowerCase().includes('unique constraint')) {
                throw new Error("This email is already registered. Please log in instead.");
            }
            
            throw new Error(errorMessage);
        }

        // After successful creation, sign in to get the session
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (signInError) throw signInError;

        // Give the database trigger a moment to create the user_profiles row
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Signup successful! User profile should be created by database trigger.');
        
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
            if (error.message === "Invalid login credentials") {
                throw new Error("Incorrect email or password.");
            }
            if (error.message.includes("Email not confirmed")) {
                throw new Error("Please check your email to confirm your account before logging in.");
            }
            throw error;
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
        setResetSent(true);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#AFAFAF] hover:bg-[#F7F7F7] rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            {view === 'forgot-password' && (
                <button 
                    onClick={() => setView('login')}
                    className="absolute top-4 left-4 p-2 text-[#AFAFAF] hover:bg-[#F7F7F7] rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            )}
            <h2 className="text-2xl font-bold text-[#4B4B4B] mb-2">
              {view === 'signup' ? 'Create Account' : view === 'forgot-password' ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-[#777]">
              {view === 'signup' 
                ? 'Start your learning journey today' 
                : view === 'forgot-password' 
                    ? 'Enter your email to receive a reset link'
                    : 'Continue where you left off'}
            </p>
          </div>

          {/* View: Forgot Password */}
          {view === 'forgot-password' ? (
              resetSent ? (
                  <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-[#D7FFB8] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-8 h-8 text-[#58CC02]" />
                      </div>
                      <p className="text-[#4B4B4B] font-bold">Check your email</p>
                      <p className="text-[#777] text-sm">We've sent you a password reset link.</p>
                      <button 
                        onClick={() => setView('login')}
                        className="text-[#1CB0F6] font-bold text-sm hover:underline mt-4"
                      >
                          Back to Log In
                      </button>
                  </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                            <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#288CFF] focus:outline-none transition-colors font-bold text-[#4B4B4B]"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-[#FF4B4B] text-sm font-bold text-center bg-[#FFF4F4] p-2 rounded-lg border border-[#FF4B4B]">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#288CFF] text-white rounded-xl font-bold uppercase tracking-wider shadow-[0_4px_0_#46A302] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302] transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        Send Reset Link
                    </button>
                </form>
              )
          ) : (
          /* View: Login / Signup */
          <>
            <form onSubmit={handleEmailAuth} className="space-y-4">
                {view === 'signup' && (
                <div className="space-y-1">
                    <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={view === 'signup'}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#288CFF] focus:outline-none transition-colors font-bold text-[#4B4B4B]"
                    />
                    </div>
                </div>
                )}

                <div className="space-y-1">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-[#E5E5E5] focus:border-[#288CFF] focus:outline-none transition-colors font-bold text-[#4B4B4B]"
                    />
                </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AFAFAF]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-12 rounded-xl border-2 focus:outline-none transition-colors font-bold text-[#4B4B4B] ${
                            error && error.toLowerCase().includes('password') 
                                ? 'border-[#FF4B4B] bg-[#FFF4F4]' 
                                : 'border-[#E5E5E5] focus:border-[#288CFF]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AFAFAF] hover:text-[#777] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                  </div>
                  
                  {/* Password Requirements (Signup Only) */}
                  {view === 'signup' && (
                      <div className="pt-2 pl-1">
                          <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                              password.length === 0 
                                  ? 'text-[#AFAFAF]' 
                                  : isLengthValid 
                                      ? 'text-[#58CC02]' 
                                      : 'text-[#FF4B4B]'
                          }`}>
                              {isLengthValid ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                              At least 6 characters
                          </div>
                      </div>
                  )}
                </div>

                {view === 'login' && (
                    <div className="text-right">
                        <button 
                            type="button"
                            onClick={() => setView('forgot-password')}
                            className="text-[#1CB0F6] font-bold text-xs hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                )}

                {error && (
                <div className="flex items-start gap-2 text-[#FF4B4B] text-sm font-bold bg-[#FFF4F4] p-3 rounded-xl border border-[#FF4B4B]">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
                )}

                <button
                type="submit"
                disabled={loading || (view === 'signup' && !isPasswordValid)}
                className={`w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-[0_4px_0_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-2 ${
                    loading || (view === 'signup' && !isPasswordValid)
                        ? 'bg-[#E5E5E5] text-[#AFAFAF] shadow-none cursor-not-allowed'
                        : 'bg-[#288CFF] text-white shadow-[0_4px_0_#2563EB] hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0_#46A302]'
                }`}
                >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {view === 'signup' ? 'Create Account' : 'Log In'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                onClick={() => {
                    setView(view === 'login' ? 'signup' : 'login');
                    setError(null);
                    setPassword('');
                    setEmail('');
                }}
                className="text-[#1CB0F6] font-bold text-sm hover:underline uppercase tracking-wide"
                >
                {view === 'login' ? 'New here? Create Account' : 'Already have an account? Log In'}
                </button>
            </div>
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}