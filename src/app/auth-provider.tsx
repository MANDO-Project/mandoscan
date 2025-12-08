"use client";

import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

// It's recommended to use environment variables for these settings
const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY! || "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_Uu8mUX2F6",
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID! || "6tie9nelelglhhi6polah5ruhc",
  // redirect_uri: typeof window !== 'undefined' ? window.location.origin : '', // Use dynamic redirect URI
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  response_type: "code",
  scope: "email openid phone",
  // // Disable automatic token validation that can cause issues with Cognito
  // automaticSilentRenew: false,
  // validateSubOnSilentRenew: false,
  // // Load user info from the ID token instead of making a separate request
  // loadUserInfo: false,
  // This function is triggered after a user is successfully signed in
  onSigninCallback: (_user: User | void): void => {
    // Redirect user to the home page after login
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  onSignoutCallback: (): void => {
    // Redirect user to the home page after logout
    window.location.href = "/";
  }
};

export default function CognitoAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      {children}
    </AuthProvider>
  );
}