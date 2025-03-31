# Trello Dashboard Visualizer

A lightweight web-based dashboard for visualizing the progress of a Trello board used in project management. Each Trello card represents a task, and labels denote departments (e.g., Art, Programming). Custom fields provide estimated hours and system/module information.

## Features

- Centralized progress overview (aggregate data only, not task-by-task)
- Visualized project health per department
- Secure and sanitized data flow from Trello to frontend
- Privacy-focused approach (no specific task names or descriptions)

## Technology Stack

- **Framework:** Static HTML/CSS/JS with TypeScript compilation
- **Programming Language:** TypeScript (Frontend and Backend)
- **Build Tool:** esbuild for bundling
- **Styling/CSS Solution:** Tailwind CSS
- **Deployment Platform:** GitHub Pages (Frontend), Firebase Functions (Backend)

## Project Structure

The project is organized into frontend and backend components:

- **Frontend:** Static site deployed to GitHub Pages
- **Backend:** Firebase Cloud Functions serving as a secure proxy to Trello API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account
- Trello account with API key and token

### Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/trello-dashboard-visualizer.git
cd trello-dashboard-visualizer
```

2. **Install dependencies**

```bash
npm install
cd backend/functions
npm install
cd ../..
```

3. **Set up environment variables**

Copy the example environment files and fill in your values:

```bash
# Frontend environment variables
cp frontend/.env.example frontend/.env

# Backend environment variables
cp backend/functions/.env.example backend/functions/.env
```

You'll need to fill in:
- Your Firebase project details in `frontend/.env`
- Your Trello API credentials in `backend/functions/.env`

4. **Build the project**

```bash
npm run build
```

5. **Run locally**

```bash
# Start the Firebase emulator for backend functions
npm run serve:functions

# In a separate terminal, start the frontend development server
npm run serve:frontend
```

## Deployment

### GitHub Pages Deployment (Frontend)

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

1. **Set up GitHub Secrets**

In your GitHub repository:
1. Go to Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `TRELLO_BOARD_ID`

2. **Push to main branch**

The GitHub Actions workflow will automatically:
- Build the project with your environment variables
- Deploy the built files to GitHub Pages

3. **Manual deployment**

You can also trigger a manual deployment:
- Go to Actions tab in your GitHub repository
- Select the "Build and Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Firebase Functions Deployment (Backend)

For the backend API:

```bash
# Set environment variables in Firebase
firebase functions:config:set trello.apikey="YOUR_API_KEY" trello.token="YOUR_TOKEN"

# Deploy functions
npm run deploy:functions
```

## Security Considerations

- Environment variables are stored as GitHub Secrets and never committed to the repository
- Sensitive Trello API credentials are only used on the backend
- The frontend only receives sanitized data without task-specific details
- All API requests are proxied through Firebase Functions for security

## License

MIT License
