"use client";

import React, { ReactElement } from 'react';
import { useAuth } from "react-oidc-context";

export default function AuthControls() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const logoutUri = process.env.NEXT_PUBLIC_LOGOUT_URI || window.location.origin;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    // Remove user from oidc storage first
    auth.removeUser();
    // Then redirect to Cognito logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Handle loading state
  if (auth.isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  // Handle error state
  if (auth.error) {
    return <div className="text-white">Oops... {auth.error.message}</div>;
  }

  // Display user info and sign-out button if authenticated
  if (auth.isAuthenticated) {
    return (
      <div className="text-white">
        <p>Hello, <strong>{auth.user?.profile.email}</strong></p>
        <button onClick={() => signOutRedirect()}>Sign Out</button>
      </div>
    )  as ReactElement;
  }

  // Display sign-in button if not authenticated
  return <button className="text-white" onClick={() => auth.signinRedirect()}>Log In | Sign Up</button>;
}