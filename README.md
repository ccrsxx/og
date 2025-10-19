# API

Personal API for my projects and services. Built with Node.js and Express. It provides small utility endpoints and integrations used across my projects.

## Features

Currently available features/endpoints:

- Open Graph image generation (OG images).
- Spotify endpoints (currently-playing, top tracks, etc.).
- Tools endpoints (quick diagnostics for headers, IP info, user-agent parsing, etc.).

## Development

Steps to run the project locally:

1. Clone the repository

   ```bash
   git clone https://github.com/ccrsxx/api.git
   ```

1. Change directory to the project

   ```bash
   cd api
   ```

1. Install dependencies

   ```bash
   npm install
   ```

1. Set up environment variables

   Create a copy of the `.env.example` file and name it `.env.local`. Fill in credentials as needed.

   ```bash
   copy .env.example .env.local
   ```

1. Run the app in development

   ```bash
   npm run dev
   ```
