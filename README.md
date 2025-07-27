# 🪐 Mind Universe

> A compassionate digital platform for mood journaling and community reflection.

## 🚀 Live Demo

- **Deployed App**: [https://startup-system-final-project.vercel.app/](https://startup-system-final-project.vercel.app/)

---

## 📘 Table of Contents

- [🪐 Mind Universe](#-mind-universe)
  - [🚀 Live Demo](#-live-demo)
  - [📘 Table of Contents](#-table-of-contents)
  - [🧠 Overview](#-overview)
  - [✨ Features](#-features)
  - [🧪 Tech Stack](#-tech-stack)
  - [🖼 UI Design](#-ui-design)
  - [📦 Project Structure](#-project-structure)
  - [🧩 Challenges \& Learnings](#-challenges--learnings)
  - [👨‍👩‍👧‍👦 Team](#-team)

---

## 🧠 Overview

Mind Universe is a digital journaling platform where users can privately record thoughts, track emotional patterns, and optionally share reflections with a supportive community. Each user has a personalized account with synced data, making it easy to revisit and reflect on their mood over time.

Whether you're documenting personal milestones or processing daily emotions, Mind Universe offers a secure, expressive, and community-driven journaling experience.

---

## ✨ Features

- 📝 Create mood-tagged blog entries with optional tags (#Work, #Personal, #Health, etc.)
- 🔐 Toggle blog post visibility: **Public** (community shared) or **Private** (personal only)
- 📆 View journal entries with timestamps and emojis representing mood (1–5 scale)
- 🌍 Discover community posts by category, tag, and mood
- ❤️ Like public posts to support others
- 📂 Filter posts by tag using dropdown in Discover tab

---

## 🧪 Tech Stack

| Category     | Technologies                               |
|--------------|---------------------------------------------|
| Frontend     | Next.js, React, Tailwind CSS               |
| Backend      | PostgreSQL, Drizzle ORM, Better Auth       |
| DevOps       | Vercel (deployment), Neon (PostgreSQL), Docker (local dev) |

---

## 🖼 UI Design

The web app consists of two primary tabs:

- **Blogs Tab**: Users can write journal entries, tag them, assign mood scores, and set visibility.
- **Discover Tab**: A community feed showing public posts with mood emojis, tags, timestamps, and like counts. Includes filtering options for exploring content by topic.

Initial designs were sketched and then converted to wireframes. Final UI adjustments were made to align with Tailwind CSS and React conventions.

---

## 📦 Project Structure

This app was built using starter code from the `better-auth-nextjs-starter` repository (HW6), which included:

- 🔑 Authentication (NextAuth + custom setup)
- 🗄 PostgreSQL setup via Neon and Docker
- 🧩 Drizzle ORM for type-safe DB schema and migrations
- 📁 Modular components and folder structure using Next.js App Router

Blog-related data was originally planned in normalized tables with foreign keys. Due to complexity and time constraints, the final implementation uses a simplified single-table design to store mood, tags, content, status, and metadata.

---

## 🧩 Challenges & Learnings

- 🎨 **Tailwind CSS**: Utility-first styling was powerful but required frequent documentation checks and design iteration for responsiveness.
- 🛢 **Database Modeling**: Initially used normalized multi-table schema, but switched to single-table to resolve query/update bugs under deadline pressure.
- 🔖 **Status & Tag Logic**: Designing toggle-based tag selection and visibility switching required complex state syncing across frontend and backend.
- 🧠 **Discover Filtering**: Mapping public/private logic correctly while displaying filtered posts required careful alignment of UI state and DB queries.

---

## 👨‍👩‍👧‍👦 Team

CS 5356 – Building Startup Systems (Spring 2025)  

- 👩‍💻 Susan Wu
- 👨‍💻 Xizhe Jiang
- 👨‍💻 Yu Zhang