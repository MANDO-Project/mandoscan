"use client";

import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

// It's recommended to use environment variables for these settings
const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_LOGOUT_URI!,
  response_type: "code",
  scope: "email openid phone",

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

console.log("Cognito Auth Config:", {
    authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY,
    client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_LOGOUT_URI,
  });

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