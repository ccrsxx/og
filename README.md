# OG

This repository now contains only the Open Graph (OG) image generation service. Other endpoints were migrated to Go, this project focuses solely on generating PNG OG images used across sites and social previews.

## What it does

- Exposes a single endpoint: `GET /og` which returns a generated PNG image (image/png).
- Produces shareable, dynamic OG images using server-side rendering (Satori + Resvg).

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
