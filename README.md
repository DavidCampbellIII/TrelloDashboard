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

### Deployment

1. **Deploy the backend**

```bash
npm run deploy:functions
```

2. **Deploy the frontend**

```bash
npm run deploy:frontend
```

## License

MIT License
