"use client";

import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

// It's recommended to use environment variables for these settings
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_Uu8mUX2F6",
  client_id: "6tie9nelelglhhi6polah5ruhc",
  redirect_uri: typeof window !== 'undefined' ? window.location.origin : '', // Use dynamic redirect URI
  response_type: "code",
  scope: "email openid phone",
  // This function is triggered after a user is successfully signed in
  onSigninCallback: (_user: User | void): void => {
    // Redirect user to the home page after login
    window.history.replaceState({}, document.title, window.location.pathname);
  },
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