# LinkedIn OAuth Setup Guide

This guide explains how to set up LinkedIn OAuth authentication for Opportunity.ai.

## Prerequisites

1. A Supabase project (create at https://supabase.com)
2. A LinkedIn Developer account
3. Environment variables configured

## Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in the app details:
   - **App name**: Opportunity.ai (or your preferred name)
   - **Company**: Your company name
   - **App logo**: Upload a logo (optional)
   - **Privacy policy URL**: Your privacy policy URL
   - **App usage**: Select "Sign In with LinkedIn using OpenID Connect"
4. Click **Create app**

## Step 2: Configure LinkedIn App

1. In your LinkedIn app, go to **Auth** tab
2. Under **Redirect URLs**, add:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   Replace `your-project-ref` with your Supabase project reference (found in Supabase dashboard URL)
3. Under **Products**, request access to:
   - **Sign In with LinkedIn using OpenID Connect** (should be enabled by default)
4. Note down your **Client ID** and **Client Secret**

## Step 3: Configure Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **LinkedIn** in the list and click to configure
4. Enable LinkedIn provider
5. Enter your LinkedIn **Client ID** and **Client Secret**
6. Click **Save**

## Step 4: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI API Key (for AI features, optional for now)
OPENAI_API_KEY=your-openai-api-key-here
```

You can find these values in:
- **Supabase Dashboard** → **Settings** → **API**
  - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY`: service_role key (keep secret!)

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/login`
3. Click "Sign in with LinkedIn"
4. You should be redirected to LinkedIn for authentication
5. After authorizing, you'll be redirected back to the app

## Troubleshooting

### "Redirect URI mismatch" Error

- Ensure the redirect URI in LinkedIn app matches exactly:
  `https://your-project-ref.supabase.co/auth/v1/callback`
- Check that there are no trailing slashes or extra characters

### "Invalid client" Error

- Verify your LinkedIn Client ID and Client Secret are correct in Supabase
- Make sure LinkedIn app is approved (may take a few minutes)

### "Configuration error" on Login Page

- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify these values are correct from your Supabase dashboard

### Profile Not Created

- Check Supabase logs for errors
- Verify the `profiles` table exists and has the correct schema
- Ensure RLS policies allow profile creation

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code
- Use environment variables for all sensitive configuration
- LinkedIn Client Secret should only be stored in Supabase dashboard, not in your code

## Next Steps

After successful setup:
1. Test the full authentication flow
2. Verify profile creation on first login
3. Test protected routes (dashboard should require authentication)
4. Test logout functionality

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [Project Setup Guide](./SETUP.md)
