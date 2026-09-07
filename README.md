<div align="center">

# SkillSwap

### *The Peer-to-Peer Skill Exchange & AI-Powered Learning Platform*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

> **Democratize knowledge. Learn from peers. Teach what you know. Grow together.**

</div>

---

## Overview

**SkillSwap** is an enterprise-grade peer-to-peer skill exchange platform where students and professionals swap knowledge using a **points-based economy**. Learn courses from peers, teach what you know, collaborate on projects, and let our **AI Valuation Engine** fairly price every skill posted — no fixed costs, only intelligent rewards.

Whether you're a beginner wanting to learn React.js or an expert ready to teach Machine Learning — SkillSwap connects you with the right peers and rewards you fairly.

---

## Points Economy Model

| Action | Points |
|---|---|
| Unlock a peer course | **AI-valued** (15–75 Pts deducted) |
| Post & share a skill | **AI-valued** (15–75 Pts earned) |
| Peer teaches you 1-on-1 | AI rewards both parties |
| Join a project collaboration | **+50 to +150 Pts** |
| Complete a knowledge quiz | **+10 Pts** |

> Points are evaluated dynamically in real time based on complexity and market demand.

---

## AI Point Valuation Engine

The core differentiator of SkillSwap is its **AI-powered point valuation system** — when a user posts a skill, the AI analyzes:

```
Input Factors:
  ├── Topic Complexity       → Rare/advanced skills = more points
  ├── Description Quality    → Detailed & clear posts = higher reward
  ├── Market Demand Index    → In-demand tech skills score higher
  └── Category Weight        → Tech & Security > Business > General

Output:
  ├── AI-assigned point reward (15 – 75 Pts)
  ├── Quality badge: Needs Detail → Standard → High → Exceptional
  ├── Reasoning breakdown from AI
  └── Real-time score telemetry
```

Live evaluation happens as the user **types** — no submission required to preview the valuation.

---

## Key Modules

### AI Technical Assistant
- Conversational technical tutor powered by Groq Llama 3.3 70B
- Preset prompt accelerators: Code Review, Architecture, Roadmap Planning
- Markdown + syntax-highlighted code blocks
- Session export & transcript management

### 18 Interactive Course Note Modules
Every course includes:
- Copyable code snippets with syntax highlighting
- Real-time scroll reading progress bar
- 5-star peer rating widget
- Knowledge assessment quizzes (+10 Pts)

| ID | Course Track | Path |
|---|---|---|
| 1 | Java Backend | `notes/java.html` |
| 2 | Python Programming | `notes/python.html` |
| 3 | React.js Mastery | `notes/react.html` |
| 4 | Data Structures & Algorithms | `notes/dsa.html` |
| 5 | Node.js & Express | `notes/node.html` |
| 6 | Machine Learning & AI | `notes/ml.html` |
| 7 | Docker & Kubernetes | `notes/docker.html` |
| 8 | TypeScript Essentials | `notes/typescript.html` |
| 9 | Cyber Security | `notes/security.html` |
| 10 | Figma UI/UX Design | `notes/figma.html` |
| 11 | Flutter & Dart | `notes/flutter.html` |
| 12 | MongoDB & NoSQL | `notes/mongodb.html` |
| 13 | C++ Systems | `notes/cpp.html` |
| 14 | C Programming | `notes/c.html` |
| 15 | JavaScript Mastery | `notes/jsc.html` |
| 16 | SQL Databases | `notes/sql.html` |
| 17 | Git & Version Control | `notes/git.html` |
| 18 | CSS & Web Styling | `notes/casss.html` |

### Application Views

| Module | Route | Description |
|---|---|---|
| Dashboard | `front/front.html` | Skill marketplace feed, real-time search, category filters, course unlock modal |
| Courses Hub | `buttons/courses.html` | Learn / Teach mode selector, all 18 courses + community posts |
| Post Skill | `buttons/post.html` | Live AI valuation telemetry, publish & earn |
| Projects | `buttons/projects.html` | Peer collaboration bounties, team milestones |
| Bookmarks | `buttons/pin.html` | Bookmarked courses, notes & posts |
| AI Assistant | `buttons/ai.html` | Interactive AI learning assistant |
| Support | `buttons/help.html` | Knowledge base & support ticket desk |

---

## Project Structure

```
SkillSwap/
│
├── front/
│   ├── front.html          # Main Dashboard
│   ├── front.js            # Card Rendering, Search & Filter Logic
│   ├── front.css           # Design System & Palette Tokens
│   └── app-state.js        # Centralized State Engine + AI Valuation
│
├── backend/
│   ├── server.js           # Express REST API (With Memory Fallback)
│   └── package.json
│
├── buttons/                # App View Pages
│   ├── courses.html        # Courses Hub
│   ├── post.html           # Post Skill (with Live AI Valuation)
│   ├── projects.html       # Peer Projects
│   ├── pin.html            # Pinned Bookmarks
│   ├── ai.html             # AI Assistant Chat
│   └── help.html           # Support
│
├── buttons-css/            # Per-page Stylesheets
├── buttons-js/             # Per-page Logic Engines
│   ├── courses.js          # Courses rendering & filters
│   ├── post.js             # AI Valuation live preview
│   ├── projects.js         # Project join & bounty logic
│   └── ai.js               # AI chat interface
│
├── notes/                  # 18 Interactive Course Note Pages
│   ├── notes.css           # Notes reader styling
│   ├── rating.js           # Interactive rating & quiz engine
│   └── *.html              # Course documentation modules
│
├── loginpage/              # Authentication Portal
└── signup/                 # Registration Portal
```

---

## Getting Started

### Prerequisites
- **Node.js** v14+
- Any modern web browser

### 1. Clone or Extract
```bash
git clone <repo-url>
cd SkillSwap
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Start the Backend Server
```bash
node backend/server.js
```
> Server runs at `http://localhost:3000`

> **Note:** The platform functions autonomously with full client-side state persistence in `localStorage`.

### 4. Launch Application
Open `front/front.html` in your browser or navigate to:
```
http://localhost:3000/front/front.html
```

---

## Design System & Typography

- **Signature Palette**: 
  - Canvas Background: `#FFF5F5`
  - Container / Border / Badges: `#F7D6D0`
  - Accent / Buttons / Highlights: `#E2B4BD`
  - Typography / High Contrast Text: `#4A4A4A`
- **Typography**: Inter & Outfit font stacks with precise mathematical scale
- **Architecture**: Modular vanilla CSS tokens, zero external framework overhead, full accessibility compliance

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai-chat` | Proxy AI chat requests |
| `POST` | `/api/post-skill` | Save a new skill post |
| `POST` | `/api/buy-course` | Record a course unlock |
| `GET` | `/api/health` | Server health check |

## 📜 License

**ISC License** — Built for SkillSwap Learning Platform Hackathon.

---

<div align="center">

**⚡ SkillSwap — Learn More. Teach More. Earn More.**

*Knowledge is the only currency that multiplies when shared.*

</div>
