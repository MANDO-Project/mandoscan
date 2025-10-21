'use client';

import React, { ReactElement } from 'react';
import { useAuth } from 'react-oidc-context';

export default function AuthControls() {
  const auth = useAuth();

  // Handle loading state
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  // Display user info and sign-out button if authenticated
  if (auth.isAuthenticated) {
    return (
      <div>
        <p>
          Hello, <strong>{auth.user?.profile.email}</strong>
        </p>
        <button onClick={() => auth.signoutRedirect()}>Sign Out</button>
      </div>
    ) as ReactElement;
  }

  // Display sign-in button if not authenticated
  return (
    <button onClick={() => auth.signinRedirect()}>Log In | Sign Up</button>
  );
}
