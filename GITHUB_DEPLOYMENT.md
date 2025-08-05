# GitHub Deployment Setup Guide

This guide explains how to set up automatic deployment to GitHub Pages with secure environment variable handling.

## GitHub Secrets Setup

1. Go to your GitHub repository: https://github.com/traderkev/TraderKev
2. Click on **Settings** (in the repository menu)
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret** and add each of the following:

### Required Secrets:

| Secret Name | Description |
|-------------|-------------|
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (starts with pk_live_) |
| `REACT_APP_STRIPE_SECRET_KEY` | Your Stripe secret key (starts with sk_live_) |
| `REACT_APP_EMAILJS_SERVICE_ID` | Your EmailJS service ID |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | Your EmailJS template ID |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |

**Note**: Use the actual API keys you currently have configured in your local .env.local file.

## How Automatic Deployment Works

1. **Push to Master**: When you push changes to the `master` branch, GitHub Actions automatically:
   - Builds your React application
   - Injects the secret environment variables
   - Deploys to GitHub Pages

2. **Live URL**: Your site will be available at: https://traderkev.github.io/TraderKev

3. **Build Status**: Check the **Actions** tab in your GitHub repository to see deployment status

## Local Development

For local development with live Stripe keys:
1. Copy `.env.example` to `.env.local`
2. Fill in your actual API keys
3. The `.env.local` file is gitignored and won't be committed

## Security Features

- ✅ API keys are stored securely as GitHub Secrets
- ✅ Keys are never exposed in your repository code
- ✅ GitHub push protection prevents accidental key commits
- ✅ Environment variables are injected only during build process

## Manual Deployment (if needed)

If you need to deploy manually:
```bash
npm run build
npm run deploy
```

Note: Manual deployment requires your API keys to be in `.env.local`
