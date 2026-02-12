# GitHub Pages Hosting Guide

## Quick Setup (3 Steps)

### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/Varun251005/CrimsonBladeGame
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source", select **main** branch
5. Click **Save**

### Step 2: Wait for Deployment
- GitHub will automatically build and deploy your site
- Wait 1-2 minutes for the first deployment
- You'll see a green checkmark when ready

### Step 3: Access Your Game
Your game will be live at:
```
https://varun251005.github.io/CrimsonBladeGame/
```

## That's It!
Your game is now hosted for FREE on GitHub Pages!

## Updating Your Game
Whenever you push changes to GitHub, the site updates automatically:
```bash
git add .
git commit -m "Update game"
git push
```

## Custom Domain (Optional)
To use your own domain:
1. Go to Settings → Pages
2. Enter your custom domain
3. Add DNS records as instructed

## Troubleshooting
- **404 Error**: Wait a few minutes, GitHub Pages takes time to deploy
- **Styles not loading**: Check that paths in HTML are relative (no leading /)
- **Game not working**: Open browser console (F12) to check for errors

## Features
✅ Free hosting
✅ HTTPS enabled automatically
✅ Auto-deploys on push
✅ Fast CDN delivery
✅ No server management needed
