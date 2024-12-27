import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Invalid password. Please try again.',
  'auth/email-already-in-use': 'An account already exists with this email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Try signing in with a different method.',
  'auth/popup-closed-by-user': 'Sign in was cancelled.',
  'auth/popup-blocked': 'Sign in popup was blocked by your browser.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-token-expired': 'Your session has expired. Please sign in again.',
  'auth/invalid-action-code': 'The action code is invalid. This can happen if the code is malformed or has already been used.',
  'auth/expired-action-code': 'The action code has expired.',

  // Account linking errors
  'auth/credential-already-in-use': 'This account is already linked to another user. Please sign in with a different method.',
  'auth/provider-already-linked': 'This authentication provider is already linked to your account.',
  'auth/no-such-provider': 'This authentication provider is not linked to your account.',
  'auth/invalid-credential': 'The authentication credential is invalid. Please try again.',
  'auth/email-already-exists': 'The email address is already in use by another account.',

  // Environment and configuration errors
  'auth/operation-not-supported-in-this-environment': 'This operation is not supported in the current environment.',
  'auth/operation-not-allowed': 'The provided sign-in provider is disabled for your Firebase project.',
  'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
  'auth/invalid-api-key': 'Your API key is invalid, please check you have copied it correctly.',
  'auth/invalid-tenant-id': 'The Auth instance\'s tenant ID is invalid.',
  'auth/web-storage-unsupported': 'This browser is not supported or 3rd party cookies and data may be disabled.',
  'auth/cors-unsupported': 'This browser is not supported.',

  // Network and timeout errors
  'auth/timeout': 'The operation has timed out. Please try again.',
  'auth/network-request-failed': 'A network error occurred. Please check your connection.',
  'auth/too-many-requests': 'We have blocked all requests from this device due to unusual activity. Try again later.',

  // OAuth errors
  'auth/invalid-oauth-provider': 'EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.',
  'auth/invalid-oauth-client-id': 'The OAuth client ID provided is either invalid or does not match the specified API key.',
  'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
  'auth/popup-already-closed-by-user': 'The popup has been closed by the user before finalizing the operation.',

  // Verification errors
  'auth/invalid-verification-code': 'The verification code is invalid. Please try again.',
  'auth/invalid-verification-id': 'The verification ID is invalid. Please try again.',
  'auth/missing-verification-code': 'The phone auth credential was created with an empty SMS verification code.',
  'auth/missing-verification-id': 'The phone auth credential was created with an empty verification ID.',
  'auth/captcha-check-failed': 'The reCAPTCHA response is invalid. Please try again.',

  // Phone number errors
  'auth/invalid-phone-number': 'The phone number is invalid. Please enter a valid phone number.',
  'auth/missing-phone-number': 'Please enter a phone number.',
  'auth/quota-exceeded': 'The SMS quota for this project has been exceeded.',

  // Multi-factor authentication errors
  'auth/missing-multi-factor-info': 'No second factor identifier is provided.',
  'auth/missing-multi-factor-session': 'The request is missing proof of first factor successful sign-in.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again.',

  // Other errors
  'auth/argument-error': 'An invalid argument was provided to an Authentication method.',
  'auth/invalid-persistence-type': 'The specified persistence type is invalid.',
  'auth/unsupported-persistence-type': 'The current environment does not support the specified persistence type.',
  'auth/invalid-provider-id': 'The authentication provider ID is invalid.',
  'auth/null-user': 'A null user object was provided as the argument for an operation which requires a non-null user object.',
  'auth/app-deleted': 'This instance of FirebaseApp has been deleted.',
  'auth/app-not-authorized': 'This app is not authorized to use Firebase Authentication with the provided API key.'
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] || error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}; 