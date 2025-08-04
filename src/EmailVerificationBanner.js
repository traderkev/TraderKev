import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle, X } from 'lucide-react';
import { useAuth } from './useAuth';

export const EmailVerificationBanner = ({ user, onDismiss }) => {
  const [isResending, setIsResending] = useState(false);
  const [resentMessage, setResentMessage] = useState(false);
  const { resendEmailVerification, refreshUser, error } = useAuth();

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await resendEmailVerification();
      setResentMessage(true);
      setTimeout(() => setResentMessage(false), 5000);
    } catch (err) {
      console.error('Error resending verification email:', err);
    } finally {
      setIsResending(false);
    }
  };

  const handleRefreshStatus = async () => {
    await refreshUser();
    // The auth state will automatically update if verification status changed
  };

  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Mail className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Please verify your email address</strong>
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            We've sent a verification email to <strong>{user.email}</strong>. 
            Please check your inbox and click the verification link.
          </p>
          
          {error && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}
          
          {resentMessage && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <CheckCircle size={16} className="mr-1" />
              Verification email sent successfully!
            </div>
          )}
          
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="text-sm bg-yellow-200 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isResending ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Email'
              )}
            </button>
            
            <button
              onClick={handleRefreshStatus}
              className="text-sm bg-blue-200 text-blue-800 px-3 py-1 rounded hover:bg-blue-300 transition-colors flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              I've Verified
            </button>
          </div>
        </div>
        {onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onDismiss}
              className="text-yellow-400 hover:text-yellow-600"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
