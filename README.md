<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14Ez2MnDAfDBx4T4KqXRRPVPukedhNNXh

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Project: eSIM Myanmar website

Overview
--------
This repository contains the frontend application for the eSIM Myanmar website. It is a Vite + React application.

Deployment
----------
This project uses GitHub Actions to build and deploy the site to GitHub Pages (branch: gh-pages). The workflow file is at `.github/workflows/deploy.yml`.

Local build
-----------
Requirements:
- Node.js LTS (install from https://nodejs.org)

Steps:
1. Install dependencies: `npm ci`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

CI/CD
-----
The CI workflow will run on pushes to `main` and `nexorasim/patch-52082`. It installs dependencies, runs optional validations, builds the site, and deploys the `dist` folder to `gh-pages` using the `GITHUB_TOKEN`.

Notes
-----
- Maintain plain text, professional formatting. No emojis are used in this README.
