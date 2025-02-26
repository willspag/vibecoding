# SoundScape - Setup and Deployment Instructions

This document provides instructions for setting up, running, and deploying the SoundScape application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher) or [Yarn](https://yarnpkg.com/) (v1.22.x or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Git (for version control)

## Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/soundscape.git
cd soundscape
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using Yarn:
```bash
yarn install
```

3. **Environment Variables (if needed)**

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_VERSION=$npm_package_version
```

Note: For local development, you typically don't need to set any environment variables as the application uses browser APIs and local storage.

## Running Locally

1. **Start the development server**

Using npm:
```bash
npm start
```

Or using Yarn:
```bash
yarn start
```

2. **Access the application**

Open your browser and navigate to:
```
http://localhost:3000
```

The application should now be running in development mode with hot reloading enabled.

## Testing

### Running Tests

To run the test suite:

Using npm:
```bash
npm test
```

Or using Yarn:
```bash
yarn test
```

### Running End-to-End Tests (if implemented)

Using npm:
```bash
npm run test:e2e
```

Or using Yarn:
```bash
yarn test:e2e
```

## Deployment

SoundScape can be deployed to various platforms. Here are instructions for the most common ones:

### Building for Production

First, create a production build:

Using npm:
```bash
npm run build
```

Or using Yarn:
```bash
yarn build
```

This will create a `build` directory with optimized production files.

### Deploying to GitHub Pages

1. Install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

2. Add the following to your `package.json`:
```json
"homepage": "https://yourusername.github.io/soundscape",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

### Deploying to Netlify

1. Install the Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build your project:
```bash
npm run build
```

3. Deploy to Netlify:
```bash
netlify deploy
```

Follow the prompts to complete the deployment.

### Deploying to Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

Follow the prompts to complete the deployment.

## Troubleshooting

### Common Issues

1. **Audio not playing**
   - Check if your browser supports the Web Audio API
   - Ensure your browser's audio is not muted
   - Try clicking anywhere on the page (some browsers require user interaction before playing audio)

2. **Visualizations not showing**
   - Ensure WebGL is enabled in your browser
   - Try a different browser if issues persist

3. **Local storage issues**
   - Check if your browser has cookies and local storage enabled
   - Clear browser cache and try again

### Getting Help

If you encounter any issues not covered here:
1. Check the [GitHub Issues](https://github.com/yourusername/soundscape/issues) page
2. Create a new issue with detailed information about your problem
3. Contact the maintainers at [your-email@example.com]

## License

SoundScape is licensed under the MIT License. See the LICENSE file for details. 