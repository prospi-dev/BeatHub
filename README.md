# 🎧 BeatHub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![.NET](https://img.shields.io/badge/.NET_8-5C2D91?style=for-the-badge&logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Spotify API](https://img.shields.io/badge/Spotify_API-1DB954?style=for-the-badge&logo=spotify&logoColor=white)](https://developer.spotify.com/)

> **BeatHub** is a full-stack, community-driven platform built for music lovers to discover, rate, and discuss their favorite albums, tracks, and artists. Think of it as "Letterboxd for Music", powered by the vast Spotify catalog.

🌐 **Live Demo:** [beathub-prospi.netlify.app](https://beathub-prospi.netlify.app)

---

## ✨ Features

- 🔍 **Spotify Integration**: Search and explore almost any track, album, or artist ever released using the official Spotify Web API.
- ⭐ **Reviews & Ratings**: Share your thoughts on music, give 1-5 star ratings, and read what the community thinks.
- ❤️ **Favorites**: Curate your own personal library by saving tracks, albums, and artists.
- 👥 **Social Connectivity**: Follow other users, build a network, and see a dynamic feed of their latest reviews and favorites.
- 🖼️ **User Profiles**: Fully customizable profiles with avatar image uploads powered by Cloudinary.
- 🔒 **Secure Authentication**: Robust custom JWT-based authentication system.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Bootstrapped with Vite for extreme performance)
- **Tailwind CSS** (For a modern, fully responsive UI)
- **React Router DOM** (Client-side routing)
- **Axios** (API requests & interceptors)

### Backend
- **C# / .NET 8 Web API** (Robust, scalable RESTful architecture)
- **Entity Framework Core** (Code-first ORM)
- **PostgreSQL** (Production database)
- **JWT (JSON Web Tokens)** (Stateless secure authentication)

### External Services & Infrastructure
- **Spotify Web API** (Music metadata source of truth)
- **Cloudinary API** (Image hosting and optimization)
- **Netlify** (Frontend Hosting)
- **Render** (Backend & Database Hosting via Docker)

## 💡 Architecture Highlights
- **Separation of Concerns:** Strict decoupling between the React frontend and the .NET backend.
- **Interceptor Pattern:** Axios interceptors handle automatic injection of JWTs and intercept 401 Unauthorized responses to log users out gracefully.
- **Debounced Searching:** Custom React hooks implement debouncing to prevent spamming the Spotify API while typing.
- **Hydrated Feeds:** The backend handles social logic (who follows who), but the frontend dynamically "hydrates" raw activity IDs with rich Spotify metadata to keep the database lightweight.
