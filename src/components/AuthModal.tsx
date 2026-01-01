import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { haptics } from '../utils/haptics';
import { DEFAULT_AVATAR } from '../utils/avatars';

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
        // Use the default custom avatar from our avatar set
        const avatarUrl = DEFAULT_AVATAR;
        
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
        haptics.success();
        
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
        haptics.success();
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Auth Error:", err);
      haptics.error();
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
        className="bg-card dark:bg-card rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-hover-background dark:hover:bg-hover-background rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            {view === 'forgot-password' && (
                <button 
                    onClick={() => setView('login')}
                    className="absolute top-4 left-4 p-2 text-muted-foreground hover:bg-hover-background dark:hover:bg-hover-background rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            )}
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary mb-2">
              {view === 'signup' ? 'Create Account' : view === 'forgot-password' ? 'Reset Password' : 'Welcome Back'}
            </h2>
            <p className="text-text-secondary dark:text-text-secondary">
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
                      <div className="w-16 h-16 bg-info-light dark:bg-info-light rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-text-primary dark:text-text-primary font-bold">Check your email</p>
                      <p className="text-text-secondary dark:text-text-secondary text-sm">We've sent you a password reset link.</p>
                      <button 
                        onClick={() => setView('login')}
                        className="text-secondary font-bold text-sm hover:underline mt-4"
                      >
                          Back to Log In
                      </button>
                  </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border dark:border-border bg-input-background dark:bg-input-background focus:border-primary focus:outline-none transition-colors font-bold text-text-primary dark:text-text-primary"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-destructive text-sm font-bold text-center bg-error-light dark:bg-error-light p-2 rounded-lg border border-destructive">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-wider shadow-[0_4px_0] shadow-primary-shadow hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0] active:shadow-primary-shadow transition-all flex items-center justify-center gap-2"
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
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={view === 'signup'}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border dark:border-border bg-input-background dark:bg-input-background focus:border-primary focus:outline-none transition-colors font-bold text-text-primary dark:text-text-primary"
                    />
                    </div>
                </div>
                )}

                <div className="space-y-1">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border dark:border-border bg-input-background dark:bg-input-background focus:border-primary focus:outline-none transition-colors font-bold text-text-primary dark:text-text-primary"
                    />
                </div>
                </div>

                <div className="space-y-1">
                  <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full h-12 pl-12 pr-12 rounded-xl border-2 focus:outline-none transition-colors font-bold ${
                            error && error.toLowerCase().includes('password') 
                                ? 'border-destructive bg-error-light dark:bg-error-light text-text-primary dark:text-text-primary' 
                                : 'border-border dark:border-border bg-input-background dark:bg-input-background focus:border-primary text-text-primary dark:text-text-primary'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-text-secondary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                  </div>
                  
                  {/* Password Requirements (Signup Only) */}
                  {view === 'signup' && (
                      <div className="pt-2 pl-1">
                          <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                              password.length === 0 
                                  ? 'text-muted-foreground' 
                                  : isLengthValid 
                                      ? 'text-success' 
                                      : 'text-destructive'
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
                            className="text-secondary font-bold text-xs hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                )}

                {error && (
                <div className="flex items-start gap-2 text-destructive text-sm font-bold bg-error-light dark:bg-error-light p-3 rounded-xl border border-destructive">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
                )}

                <button
                type="submit"
                disabled={loading || (view === 'signup' && !isPasswordValid)}
                className={`w-full h-12 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    loading || (view === 'signup' && !isPasswordValid)
                        ? 'bg-muted dark:bg-muted text-muted-foreground shadow-none cursor-not-allowed'
                        : 'bg-primary text-primary-foreground shadow-[0_4px_0] shadow-primary-shadow hover:brightness-105 active:translate-y-[4px] active:shadow-[0_2px_0] active:shadow-primary-shadow'
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
                className="text-secondary font-bold text-sm hover:underline uppercase tracking-wide"
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