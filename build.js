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
    '__FIREBASE_APP_ID__': JSON.stringify(envVars.FIREBASE_APP_ID || ''),
    
    // Trello configuration
    'process.env.TRELLO_BOARD_ID': JSON.stringify(envVars.TRELLO_BOARD_ID || '')
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
    
    // Copy index.html to dist folder
    const indexFile = path.resolve(__dirname, 'frontend', 'index.html');
    const distIndexFile = path.resolve(__dirname, 'frontend', 'dist', 'index.html');
    
    if (fs.existsSync(indexFile)) {
      // Read the index.html content
      let indexContent = fs.readFileSync(indexFile, 'utf8');
      
      // Remove the dynamic script and CSS loading logic as we're standardizing the paths
      indexContent = indexContent.replace(/<!-- Dynamic script path.*?<\/script>/s, '');
      indexContent = indexContent.replace(/<!-- Dynamic CSS paths.*?<\/script>/s, '');
      
      // Add our standardized CSS and script references
      indexContent = indexContent.replace('</head>', '    <link rel="stylesheet" href="tailwind.css">\n</head>');
      indexContent = indexContent.replace('</body>', '    <script src="bundle.js"></script>\n</body>');
      
      // Write the modified index.html to the dist folder
      // Replace any references to "dist/bundle.js" with "bundle.js"
      indexContent = indexContent.replace(/dist\/bundle\.js/g, 'bundle.js');
      
      // Replace any references to "dist/tailwind.css" with "tailwind.css"
      indexContent = indexContent.replace(/dist\/tailwind\.css/g, 'tailwind.css');
      
      fs.writeFileSync(distIndexFile, indexContent);
      console.log('Created optimized index.html in dist folder');
    } else {
      console.warn('Warning: index.html not found in frontend folder');
    }
    
    // Copy any CSS files that might be needed
    const stylesDir = path.resolve(__dirname, 'frontend', 'styles');
    const distStylesDir = path.resolve(__dirname, 'frontend', 'dist', 'styles');
    
    if (fs.existsSync(stylesDir)) {
      if (!fs.existsSync(distStylesDir)) {
        fs.mkdirSync(distStylesDir, { recursive: true });
      }
      
      // Copy all CSS files
      const cssFiles = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));
      cssFiles.forEach(file => {
        const srcFile = path.resolve(stylesDir, file);
        const destFile = path.resolve(distStylesDir, file);
        const destRootFile = path.resolve(distDir, file); // Also copy to root
        
        fs.copyFileSync(srcFile, destFile);
        fs.copyFileSync(srcFile, destRootFile); // Copy to dist root for flat structure - this is crucial for both local and production
        
        console.log(`Copied ${file} to dist/styles folder and dist root`);
      });
      
      // Copy index.css explicitly as tailwind.css to dist root if it doesn't exist
      const tailwindCssFile = path.resolve(stylesDir, 'tailwind.css');
      const destTailwindCssFile = path.resolve(distDir, 'tailwind.css');
      if (fs.existsSync(tailwindCssFile)) {
        fs.copyFileSync(tailwindCssFile, destTailwindCssFile);
        console.log('Copied tailwind.css to dist root');
      }
    }
    
    // Check if there are other assets that need to be copied (images, fonts, etc.)
    const assetsDir = path.resolve(__dirname, 'frontend', 'assets');
    const distAssetsDir = path.resolve(__dirname, 'frontend', 'dist', 'assets');
    
    if (fs.existsSync(assetsDir)) {
      if (!fs.existsSync(distAssetsDir)) {
        fs.mkdirSync(distAssetsDir, { recursive: true });
      }
      
      // Copy all asset files (recursive)
      const copyAssets = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = path.resolve(src, entry.name);
          const destPath = path.resolve(dest, entry.name);
          
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true });
            }
            copyAssets(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied asset: ${entry.name}`);
          }
        }
      };
      
      copyAssets(assetsDir, distAssetsDir);
    }
    
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
