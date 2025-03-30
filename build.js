#!/usr/bin/env node
/**
 * Build script for Trello Dashboard Visualizer
 * This script handles environment variable replacement during the build process
 */

const esbuild = require('esbuild');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
const envFile = path.resolve(__dirname, 'frontend', '.env');
let envVars = {};

if (fs.existsSync(envFile)) {
  console.log('Loading environment variables from:', envFile);
  envVars = dotenv.config({ path: envFile }).parsed || {};
} else {
  console.warn('Warning: No .env file found. Using default values for development only!');
}

// Define our esbuild configuration
const buildOptions = {
  entryPoints: ['frontend/ts/main.ts'],
  bundle: true,
  outfile: 'frontend/dist/bundle.js',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  define: {
    // Define process.env variables that will be replaced at build time
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    
    // Firebase configuration
    '__FIREBASE_API_KEY__': JSON.stringify(envVars.FIREBASE_API_KEY || ''),
    '__FIREBASE_AUTH_DOMAIN__': JSON.stringify(envVars.FIREBASE_AUTH_DOMAIN || ''),
    '__FIREBASE_PROJECT_ID__': JSON.stringify(envVars.FIREBASE_PROJECT_ID || ''),
    '__FIREBASE_STORAGE_BUCKET__': JSON.stringify(envVars.FIREBASE_STORAGE_BUCKET || ''),
    '__FIREBASE_MESSAGING_SENDER_ID__': JSON.stringify(envVars.FIREBASE_MESSAGING_SENDER_ID || ''),
    '__FIREBASE_APP_ID__': JSON.stringify(envVars.FIREBASE_APP_ID || '')
  }
};

// Build function
async function build() {
  try {
    // Ensure the dist directory exists
    const distDir = path.resolve(__dirname, 'frontend', 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Build the project
    console.log('Building with esbuild...');
    const result = await esbuild.build(buildOptions);
    console.log('Build complete!');
    
    // Show any warnings
    if (result.warnings.length > 0) {
      console.warn('Build warnings:', result.warnings);
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Watch function
async function watch() {
  try {
    const ctx = await esbuild.context(buildOptions);
    console.log('Watching for changes...');
    await ctx.watch();
  } catch (error) {
    console.error('Watch setup failed:', error);
    process.exit(1);
  }
}

// Execute the appropriate command
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  watch();
} else {
  build();
}
