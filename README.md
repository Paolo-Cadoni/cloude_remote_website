# Cloude Remote Website

This repository contains the marketing website for Cloude Remote.

## What Is In This Project

- A React + Vite frontend for the public website
- A waitlist form on the website
- Supabase storage for waitlist signups
- A Supabase Edge Function that sends confirmation emails through Resend

## Current Status

The code on `main` builds successfully and passes linting.

The waitlist experience only works fully when all of these are configured:

1. Supabase project
2. `waitlist_signups` table in Supabase
3. Browser environment variables for Supabase
4. Supabase Edge Function deployment
5. Resend API key and sender email configured as Supabase secrets

If any of those pieces are missing, the site can still load, but waitlist submissions or confirmation emails may not work.

## Local Environment Variables

Create a `.env.local` file with:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## Supabase Setup

Run the SQL in [supabase/waitlist.sql](/Users/paolocadoni/Documents/Tech%20(local)/cloude_remote_website/supabase/waitlist.sql) inside the Supabase SQL editor.

That script creates the `waitlist_signups` table and allows public website visitors to insert new rows.

## Confirmation Email Setup

Deploy the Edge Function in [supabase/functions/send-waitlist-thanks/index.ts](/Users/paolocadoni/Documents/Tech%20(local)/cloude_remote_website/supabase/functions/send-waitlist-thanks/index.ts).

Add these secrets to the Supabase function environment:

```bash
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Cloude Remote <your-verified-sender@yourdomain.com>
```

If `RESEND_API_KEY` is missing or the sender email is not properly set up, signups can still be saved in Supabase but confirmation emails will fail.

## Local Development

```bash
npm install
npm run dev
```

## Production Check Before Launch

Before sending real users to the site, verify:

1. The website is deployed from `main`
2. The live deployment has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. The Supabase SQL has been run
4. The `send-waitlist-thanks` Edge Function is deployed
5. Supabase function secrets include `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
6. A real test signup stores the email and sends the confirmation message
