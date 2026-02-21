#!/bin/bash
# Deploy script for Michael Simoneau's portfolio (Expo web export)

echo "Building the project with Expo..."
yarn build

echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo "Deployment complete! Your site is now live at https://michaelsimoneau.com"
