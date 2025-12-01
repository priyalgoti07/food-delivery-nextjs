# Google Sign-In Integration

This document explains the Google Sign-In integration that has been implemented in the application.

## Overview

Google Sign-In has been integrated into the `CommonDrawer` component, allowing users to sign in or sign up using their Google account. The implementation uses Google Identity Services (GSI) for the frontend and a custom API route for backend authentication.

## Files Modified/Created

### 1. API Routes
- **`/src/app/api/auth/google/route.js`** - Custom Google OAuth callback handler
  - Verifies Google ID tokens
  - Creates new users or logs in existing users
  - Returns user data compatible with existing authentication flow

- **`/src/app/api/auth/[...nextauth]/route.js`** - NextAuth.js configuration (optional)
  - Can be used for full NextAuth.js session management if needed
  - Currently configured with Google provider

### 2. Frontend Components
- **`/src/app/_components/CommonDrawer.js`** - Updated with Google Sign-In button
  - Google Sign-In button appears in both login and signup modes
  - Button is hidden when OTP verification is in progress
  - Handles Google authentication callback

### 3. Database Schema
- **`/src/app/lib/usersModel.js`** - Updated user schema
  - Added `authProvider` field (enum: "email" | "google")
  - Added `googleId` field to store Google user ID

## Environment Variables Required

You need to set the following environment variables:

```env
# Google OAuth Client ID (for frontend Google Sign-In button)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google OAuth credentials (for NextAuth.js - optional but recommended)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth.js secret (required if using NextAuth)
NEXTAUTH_SECRET=your_random_secret_here
```

**Note:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` should be the same value - your Google OAuth Client ID.

## How It Works

### Sign-In Flow (Login Mode)
1. User clicks the Google Sign-In button
2. Google OAuth popup appears
3. User selects their Google account
4. Google returns an ID token
5. Frontend sends the token to `/api/auth/google`
6. Backend verifies the token with Google
7. Backend checks if user exists in database:
   - If exists: Updates auth provider and logs them in
   - If new: Creates new user account
8. User data is stored in localStorage (matching existing auth pattern)
9. `onUserAuthenticated` callback is triggered
10. Drawer closes and user is logged in

### Sign-Up Flow (Signup Mode)
The same flow applies, but:
- If email exists: User is automatically logged in (no new account created)
- If email is new: New account is created and user is logged in

## Features

✅ Works in both login and signup modes  
✅ Automatically creates account if email doesn't exist  
✅ Automatically logs in if email already exists  
✅ Updates existing users to track Google auth provider  
✅ Compatible with existing localStorage-based auth  
✅ No phone number required for Google users  
✅ Proper error handling and user feedback  

## Testing

1. Make sure all environment variables are set
2. Start your development server
3. Open the login/signup drawer
4. Click the Google Sign-In button
5. Select your Google account
6. Verify that you're logged in and user data is in localStorage

## Troubleshooting

### Google Sign-In button doesn't appear
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Verify that the Google OAuth consent screen is configured in Google Cloud Console

### Authentication fails
- Verify that your Google OAuth Client ID and Secret are correct
- Check that authorized JavaScript origins include your domain (localhost for dev)
- Check that authorized redirect URIs are configured correctly

### User not found errors
- Check database connection
- Verify MongoDB connection string is correct
- Check server logs for detailed error messages

