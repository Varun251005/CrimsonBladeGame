# Firebase Hosting Deployment Guide

## Prerequisites
1. Install Node.js from https://nodejs.org/
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

## Setup Steps

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase Project
```bash
firebase init hosting
```
- Select "Use an existing project" or "Create a new project"
- Set public directory to: `.` (current directory)
- Configure as single-page app: `Yes`
- Don't overwrite index.html: `No`

### 3. Update .firebaserc
Replace `your-project-id` in `.firebaserc` with your actual Firebase project ID

### 4. Deploy to Firebase
```bash
firebase deploy
```

## Quick Deploy (After Initial Setup)
```bash
firebase deploy
```

## View Your Site
After deployment, your game will be live at:
```
https://your-project-id.web.app
```

## Local Testing
Test locally before deploying:
```bash
firebase serve
```
Then open: http://localhost:5000

## Project Structure
```
game/
├── index.html          # Main game file
├── css/               # Styles
├── js/                # Game logic
├── assets/            # Images & sounds
├── firebase.json      # Firebase config
└── .firebaserc        # Project settings
```

## Notes
- All files in the game folder will be deployed
- The .gitignore and documentation files are excluded
- Your game will be served over HTTPS automatically
- Firebase provides free hosting for static sites
