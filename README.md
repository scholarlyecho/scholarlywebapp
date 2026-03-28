# ScholarlyEcho Web Platform

A premium Next.js 14 web platform for ScholarlyEcho — a global youth empowerment ecosystem built around three pillars: **Learn**, **Inspire**, and **Engage**.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS with custom brand design system
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Analytics, Hosting)
- **CI/CD:** GitHub Actions → Firebase Hosting auto-deploy on push

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, branches, AI tracks, testimonials, events |
| Learning Hub | `/learning-hub` | 5-level Coders Ladder curriculum |
| Code Prodigy | `/learning-hub/code-prodigy` | Elite program application |
| Spotlight Media | `/spotlight-media` | Podcast & success stories |
| Thesis Spotlight | `/spotlight-media/thesis` | Research-to-impact series |
| Edutainment | `/edutainment` | Game shows, Sezwor, Flag Challenge |
| Events | `/events` | Hackathons, bootcamps, summits |
| Impact | `/impact` | Global reach & outcomes |
| About | `/about` | Mission, team, timeline |
| Pricing | `/pricing` | Plans & packages |
| Blog | `/blog` | Articles & resources |
| Enroll | `/enroll` | 4 enrollment forms (Learning Hub, Inspire Media, AI Assessment, Code Prodigy) |
| Contact | `/contact` | Contact form & office info |
| Admin Login | `/admin/login` | Firebase Auth admin sign-in |
| Admin Dashboard | `/admin/dashboard` | Real-time form submissions portal |
| Privacy / Terms / Child Safety / Cookies | `/privacy` `/terms` `/child-safety` `/cookies` | Legal pages |

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

## Firebase Setup

- **Hosting:** `scholarly-echo.web.app`
- **Auth:** Email/Password (admin access)
- **Firestore:** `submissions` collection for all form data
- **Analytics:** Google Analytics via Firebase SDK

## Environment

No `.env` required — Firebase config is embedded for this public web app. Admin credentials are managed via Firebase Auth.
