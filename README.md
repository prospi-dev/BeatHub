# 🎧 BeatHub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![.NET](https://img.shields.io/badge/.NET_8-5C2D91?style=for-the-badge&logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Spotify API](https://img.shields.io/badge/Spotify_API-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://developer.spotify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](./LICENSE)


> **BeatHub** is a full-stack, community-driven platform built for music lovers to discover, rate, and discuss their favorite albums, tracks, and artists. Think of it as "Letterboxd for Music", powered by the vast Spotify catalog.

🌐 **Live Demo:** [beathub-prospi.netlify.app](https://beathub-prospi.netlify.app)

Want to try it without registering? Log in with:
```
Email:    demo@beathub.dev
Password: Demo12345!
```

---

## ✨ Features

- 🔍 **Spotify Integration**: Search and explore almost any track, album, or artist ever released using the official Spotify Web API.
- ⭐ **Reviews & Ratings**: Share your thoughts on music, give 1-5 star ratings, and read what the community thinks.
- ❤️ **Favorites**: Curate your own personal library by saving tracks, albums, and artists.
- 👥 **Social Connectivity**: Follow other users, build a network, and see a dynamic feed of their latest reviews and favorites.
- 🖼️ **User Profiles**: Fully customizable profiles with avatar image uploads powered by Cloudinary.
- 🔒 **Secure Authentication**: Custom JWT-based authentication with BCrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** (Bootstrapped with Vite for fast dev/build)
- **Tailwind CSS v4** (Utility-first, fully responsive UI)
- **React Router DOM** (Client-side routing)
- **Axios** (Centralized API client with request/response interceptors)

### Backend
- **C# / .NET 8 Web API** (RESTful, layered architecture — Controllers / Services / DTOs / Data)
- **Entity Framework Core 9** (Code-first ORM, migrations applied automatically on startup)
- **PostgreSQL** (via Npgsql)
- **JWT (JSON Web Tokens)** (Stateless authentication)

### Infrastructure
- **Netlify** — Frontend hosting
- **Render** — Backend hosting (Docker)
- **Neon** — Serverless PostgreSQL (production database)
- **Spotify Web API** — Music metadata source of truth
- **Cloudinary** — Avatar image hosting and optimization

---

## 💡 Architecture Highlights

- **Separation of Concerns:** Strict decoupling between the React frontend and the .NET backend, communicating over a versioned REST API.
- **Interceptor Pattern:** Axios interceptors handle automatic injection of JWTs and intercept 401 responses to log users out gracefully.
- **Cached External Auth:** The Spotify client-credentials token is cached in memory until just before expiry instead of being re-requested on every call, avoiding unnecessary round-trips and rate-limiting under load.
- **Global Error Handling:** A single exception-handling middleware logs unhandled errors server-side and returns a generic `ProblemDetails`-shaped response, so internal exception details are never leaked to clients.
- **Debounced Searching:** Custom React hooks debounce input to avoid spamming the Spotify API while typing.
- **Hydrated Feeds:** The backend handles social logic (who follows who), while the frontend dynamically "hydrates" raw activity IDs with rich Spotify metadata, keeping the database lightweight.
- **Idempotent Startup Seeding:** A known demo user is seeded on boot (skipped if it already exists) so the live demo is always explorable without registering.

---

## 📁 Project Structure

This is a monorepo with two independent apps:

```
BeatHub/
├── Backend/BeatHub/     # ASP.NET Core 8 Web API
│   ├── Controllers/     # HTTP endpoints
│   ├── Services/        # Spotify, JWT, Cloudinary
│   ├── Models/          # EF Core entities
│   ├── DTOs/             # Request/response contracts
│   ├── Data/             # AppDbContext
│   └── Migrations/       # EF Core migrations
└── Frontend/BeatHub/    # React 19 + Vite SPA
    └── src/
        ├── api/           # Axios client + per-resource API modules
        ├── components/    # Reusable UI, layout, reviews, cards
        ├── context/       # Auth & Favorites providers
        ├── hooks/         # Data-fetching and UI hooks
        └── pages/         # Route-level views
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm
- A PostgreSQL database (local, or a free [Neon](https://neon.tech/) project)
- Spotify API credentials ([developer.spotify.com](https://developer.spotify.com/dashboard))
- (Optional) Cloudinary credentials for avatar uploads

### Backend setup
```bash
cd Backend/BeatHub
```
Create a `.env` file (gitignored) in `Backend/BeatHub/` with:
```env
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=BeatHubDb;Username=postgres;Password=yourpassword;
Jwt__Key=a-long-random-secret
Jwt__Issuer=BeatHubApi
Jwt__Audience=BeatHubClient
Spotify__ClientId=your-spotify-client-id
Spotify__ClientSecret=your-spotify-client-secret
Cloudinary__CloudName=your-cloud-name
Cloudinary__ApiKey=your-api-key
Cloudinary__ApiSecret=your-api-secret
```
Then run:
```bash
dotnet run
```
Migrations apply automatically on startup, along with the demo user seed. Swagger UI is available at `/swagger` in development.

### Frontend setup
```bash
cd Frontend/BeatHub
npm install
```
Create a `.env` file with:
```env
VITE_API_URL=https://localhost:7117/api
```
Then run:
```bash
npm run dev
```

---

## 🔐 Security Notes

- Never commit `.env`, `appsettings.Development.json`, or build output (`bin/`, `obj/`) — all are gitignored. If you fork this repo, rotate any credentials before deploying.
- The demo login above is intentionally public and unprivileged — there is no admin/role system in this app.
