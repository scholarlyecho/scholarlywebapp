# ScholarlyEcho Web Platform

[![Deploy to Firebase](https://github.com/scholarlyecho/scholarlywebapp/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/scholarlyecho/scholarlywebapp/actions/workflows/firebase-deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=white)](https://scholarly-echo.web.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0050?logo=framer&logoColor=white)](https://www.framer.com/motion)

A premium Next.js 14 web platform for ScholarlyEcho — a global youth empowerment ecosystem built around three pillars: **Learn**, **Inspire**, and **Engage**.

**Live:** [scholarly-echo.web.app](https://scholarly-echo.web.app)

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS with custom brand design system
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Analytics, Hosting)
- **CI/CD:** GitHub Actions → Firebase Hosting auto-deploy on push

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build     # Static export to /out
```

Pushing to `master` auto-deploys to Firebase Hosting via GitHub Actions.

## Environment

No `.env` required — Firebase config is embedded for this public web app.
