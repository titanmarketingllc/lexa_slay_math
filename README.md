# Lexa Slay Math Quest

A playful Next.js study game built for quick math practice, rewards, and confidence-building.

## Local Development

Run the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before deploying, you can run a full check:

```bash
npm run check
```

## Vercel Deploy Flow

This project now includes a local Vercel CLI and ready-to-use npm scripts.

Important:
- Run these commands from this folder: `Lexa Math App/lexa-math-app-temp`
- The first deploy will ask you to log in and link the project
- The `.vercel` folder is gitignored, so local project linking stays out of source control

### First-Time Setup

Log into Vercel:

```bash
npm run vercel:login
```

Link this folder to a Vercel project:

```bash
npm run vercel:link
```

If you want local Vercel environment variables after linking:

```bash
npm run vercel:pull
```

### Deploy Commands

Preview deployment:

```bash
npm run vercel:preview
```

Production deployment:

```bash
npm run vercel:prod
```

### Optional Prebuilt Flow

If you want to build locally first and then deploy the build output:

```bash
npm run vercel:build
npm run vercel:deploy-prebuilt
```

Production prebuilt deploy:

```bash
npm run vercel:build:prod
npm run vercel:deploy-prebuilt:prod
```

## Handy Scripts

- `npm run dev` starts the app locally
- `npm run check` runs lint and production build
- `npm run vercel:preview` creates a preview deployment
- `npm run vercel:prod` deploys directly to production
- `npm run vercel:pull` pulls Vercel project settings and env vars

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide React
