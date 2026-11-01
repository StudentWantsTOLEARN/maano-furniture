import React, { useState } from 'react';
import { X, User, Mail, Lock, UserCheck } from 'lucide-react';
import TermsModal from './TermsModal';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onGoogleSignIn, 
  onFacebookSignIn,
  onEmailSignUp,
  onEmailSignIn 
}) {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Helper to format raw Firebase Auth errors cleanly into user-friendly messages
  const formatAuthError = (err) => {
    const message = err?.message || err?.code || '';
    if (
      message.includes('invalid-credential') || 
      message.includes('wrong-password') || 
      message.includes('user-not-found')
    ) {
      return 'Wrong password or email, try again';
    }
    if (message.includes('email-already-in-use')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (message.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (message.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    return message.replace(/^Firebase:\s*/, '') || 'Wrong password or email, try again';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('You must accept the Terms & Conditions to proceed.');
      return;
    }

    if (!email || !password || (isRegisterMode && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isRegisterMode) {
        if (typeof onEmailSignUp === 'function') {
          await onEmailSignUp(email, password, name);
        }
      } else {
        if (typeof onEmailSignIn === 'function') {
          await onEmailSignIn(email, password);
        }
      }
      onClose();
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = async (authFn) => {
    if (!agreedToTerms) {
      setError('You must accept the Terms & Conditions to proceed.');
      return;
    }
    setError('');
    if (typeof authFn === 'function') {
      try {
        await authFn();
      } catch (err) {
        setError(formatAuthError(err));
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-ios max-w-md w-full p-6 md:p-8 shadow-2xl border border-woody-200 relative max-h-[90vh] overflow-y-auto">
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-woody-100 text-woody-600 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-woody-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-woody-900">Welcome to Maano Furniture</h3>
            <p className="text-xs text-woody-500 mt-1">Register or sign in to connect with furniture shops in real-time.</p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex bg-woody-100 p-1 rounded-xl mb-5 border border-woody-200">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                isRegisterMode ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                !isRegisterMode ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegisterMode && (
              <div>
                <label className="block text-[11px] font-bold text-woody-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-woody-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Kusinagi Minato"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-woody-50/80 border border-woody-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-woody-800 focus:outline-none focus:ring-2 focus:ring-woody-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-woody-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-woody-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-woody-50/80 border border-woody-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-woody-800 focus:outline-none focus:ring-2 focus:ring-woody-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-woody-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-woody-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-woody-50/80 border border-woody-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-woody-800 focus:outline-none focus:ring-2 focus:ring-woody-500"
                />
              </div>
            </div>

            {/* Mandatory Terms & Conditions Checkbox with Pop-up Trigger */}
            <div className="flex items-start gap-2 bg-woody-50 p-2.5 rounded-xl border border-woody-200 mt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-woody-300 text-woody-600 focus:ring-woody-500 w-4 h-4 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-[11px] text-woody-700 leading-tight select-none">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsTermsOpen(true);
                  }}
                  className="font-bold underline text-woody-800 hover:text-rose-600 transition"
                >
                  Terms & Conditions
                </button>
                {' '}and Privacy Policy.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-woody-700 hover:bg-woody-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : isRegisterMode ? 'Create Free Account' : 'Sign In to Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-woody-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-woody-400"><span className="bg-white px-2">Or quick continue with</span></div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOAuthClick(onGoogleSignIn)}
              className="w-full bg-white hover:bg-woody-50 text-woody-800 font-bold py-2.5 px-4 rounded-xl text-xs border border-woody-300 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Account</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthClick(onFacebookSignIn)}
              className="w-full bg-[#1877F2] hover:bg-[#165EBF] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook Account</span>
            </button>
          </div>

        </div>
      </div>

      {/* Pop-up Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}