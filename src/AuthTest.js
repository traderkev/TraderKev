import React from 'react';
import { auth } from './firebase';
import { useAuth } from './useAuth';

const AuthTest = () => {
  const { user, loading, error } = useAuth();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
      {loading && <p className="text-blue-600">Loading auth state...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {user ? (
        <div className="text-green-600">
          <p>✅ User authenticated</p>
          <p>Email: {user.email}</p>
          <p>UID: {user.uid}</p>
        </div>
      ) : (
        <p className="text-gray-600">❌ No user authenticated</p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        Firebase App ID: {auth.app.options.appId || 'Not configured'}
      </p>
    </div>
  );
};

export default AuthTest;
