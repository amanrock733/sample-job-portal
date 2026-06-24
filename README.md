# 🚀 JobPortal — Where Talent Meets Opportunity

> Launch faster, hire smarter, and discover your next big move in one polished platform.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?logo=githubactions)](https://github.com/amanrock733/sample-job-portal)
[![Version](https://img.shields.io/badge/version-0.2.0-blue)](https://github.com/amanrock733/sample-job-portal)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Prisma%20%7C%20Tailwind-5A67D8)](https://github.com/amanrock733/sample-job-portal)

## 📚 Table of Contents

- [Project Overview](#-project-overview)
- [Demo & Screenshots](#-demo--screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Project Overview

JobPortal is a modern full-stack job portal designed to connect candidates with opportunities and help employers manage hiring with ease. It blends a smooth applicant experience with a powerful admin dashboard, making it ideal for startups, recruiters, and fast-growing teams.

### Why it stands out

- 🧭 Clean, intuitive navigation for both job seekers and recruiters
- 💼 Seamless job discovery, application flow, and applicant tracking
- 🧠 Admin-first workflow for posting jobs and reviewing candidates
- ⚡ Built with a modern stack for speed, scalability, and maintainability

---

## 🖼️ Demo & Screenshots

### Live Demo
- [Open the app](#)
- [View design preview](#)

### Screenshot placeholders
- ![Homepage Preview](https://via.placeholder.com/1200x700?text=JobPortal+Homepage)
- ![Admin Dashboard Preview](https://via.placeholder.com/1200x700?text=Admin+Dashboard)

---

## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| ⚡ Frontend | Next.js + React + TypeScript |
| 🎨 Styling | Tailwind CSS + shadcn/ui |
| 🗄️ Database | Prisma + SQLite |
| 🔐 Auth | NextAuth + JWT |
| 📦 State & Data | Zustand + TanStack Query |
| 🧪 Linting | ESLint |

---

## ⚙️ Installation

### 1) Clone the repository

```bash
git clone https://github.com/amanrock733/sample-job-portal.git
cd sample-job-portal
```

### 2) Install dependencies

```bash
npm install
```

### 3) Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

### 4) Generate Prisma client and initialize the database

```bash
npx prisma generate
npx prisma db push
```

### 5) Run the app locally

```bash
npm run dev
```

Open http://localhost:3000 to explore the experience.

---

## 🚀 Usage

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Example flow

1. Sign up as a candidate or admin
2. Browse featured jobs
3. Apply with a single click
4. Track applications from your dashboard

---

## ✅ Features

- ✔️ Modern job listing and filtering experience
- ✔️ Candidate authentication and profile management
- ✔️ One-click job applications
- ✔️ Admin dashboard with analytics and recent activity
- ✔️ Job posting, editing, and applicant oversight
- ✔️ Responsive UI polished for desktop and mobile

---

## 📁 Folder Structure

```text
sample-job-portal/
├── prisma/
├── public/
├── scripts/
├── src/
│   ├── app/
│   │   ├── api/
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── jobs/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── store/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions are welcome. If you'd like to help improve JobPortal:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear description

### Suggested contribution ideas

- Improve the UI/UX
- Add new filters or search logic
- Expand admin analytics
- Strengthen authentication and validation

---

## 📄 License

This project is licensed under the MIT License.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📬 Contact

Built with ❤️ by Aman

- GitHub: [@amanrock733](https://github.com/amanrock733)
- LinkedIn: [Your Profile](https://linkedin.com/in/your-profile)
- Website: [yourdomain.com](https://yourdomain.com)

If you like this project, star the repo and share it with your network.
