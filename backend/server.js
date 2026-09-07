// ==========================================
// SKILLSWAP EXPRESS BACKEND SERVER
// ==========================================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from workspace root
app.use(express.static(path.join(__dirname, "..")));

// ==========================================
// MONGODB CONNECTION WITH FALLBACK
// ==========================================
let isMongoConnected = false;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://pranith_26:suba2610@cluster007.dbjkvjf.mongodb.net/skillswap?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    isMongoConnected = true;
    console.log("✅ MongoDB Connected successfully");
  })
  .catch(err => {
    console.warn("⚠️ Mongo Connection Warning (Running smoothly in In-Memory Local mode):", err.message);
  });

// ==========================================
// IN-MEMORY FALLBACK STORE & SEED DATA
// ==========================================
const inMemoryStore = {
  users: {
    "Naveen": {
      username: "Naveen",
      email: "naveen@skillswap.io",
      points: 120,
      avatar: "N",
      role: "Pro Skill Swapper",
      unlockedCourses: ["java", "python", "react"]
    },
    "Ananya": {
      username: "Ananya",
      email: "ananya@skillswap.io",
      points: 250,
      avatar: "A",
      role: "React & UI Mentor",
      unlockedCourses: ["react", "jsc", "figma"]
    }
  },
  skills: [
    { id: 1, title: "Machine Learning & AI", description: "Neural Networks, PyTorch & Supervised Learning algorithms", category: "Tech", shareType: "Teach", partner: "Swetha", rating: 4.9, views: "4.5k", aiPoints: 40, createdAt: new Date() },
    { id: 2, title: "React.js Mastery", description: "Component Architecture, Hooks & Next.js fullstack", category: "Web", shareType: "Mentor", partner: "Ananya", rating: 4.9, views: "4.2k", aiPoints: 35, createdAt: new Date() },
    { id: 3, title: "Data Structures & Algorithms", description: "Big-O, Graph algorithms & FAANG interview prep", category: "Tech", shareType: "Teach", partner: "Vikram", rating: 4.9, views: "3.8k", aiPoints: 45, createdAt: new Date() },
    { id: 4, title: "Java Enterprise Backend", description: "OOPs, Spring Boot & Microservices architecture", category: "Tech", shareType: "Teach", partner: "Pranith", rating: 4.6, views: "2.4k", aiPoints: 30, createdAt: new Date() },
    { id: 5, title: "Python Data Science", description: "Pandas, NumPy, EDA & Automated pipelines", category: "Tech", shareType: "Mentor", partner: "Subashini", rating: 4.8, views: "3.1k", aiPoints: 35, createdAt: new Date() },
    { id: 6, title: "Figma UI/UX Design", description: "Design systems, Auto-layout & Interactive prototyping", category: "Design", shareType: "Share Notes", partner: "Kavya", rating: 4.9, views: "2.8k", aiPoints: 25, createdAt: new Date() },
    { id: 7, title: "Docker & Kubernetes", description: "Containerization, Helm charts & CI/CD deployment", category: "Tools", shareType: "Teach", partner: "Harish", rating: 4.8, views: "2.1k", aiPoints: 40, createdAt: new Date() },
    { id: 8, title: "Cyber Security & Pentesting", description: "OWASP Top 10, Network packet analysis & Ethical hacking", category: "Tools", shareType: "Mentor", partner: "Arjun", rating: 4.8, views: "2.3k", aiPoints: 45, createdAt: new Date() }
  ],
  projects: [
    { id: 1, title: "AI Code Review Bot", points: 120, description: "Build a GitHub bot using LLM API to analyze PRs and suggest code optimizations.", category: "AI/ML", partner: "Swetha", members: ["Swetha", "Vikram"] },
    { id: 2, title: "Modern Portfolio Website", points: 50, description: "Build sleek responsive developer portfolio using HTML5, CSS Glassmorphism & JavaScript.", category: "Web", partner: "Pranith", members: ["Pranith"] },
    { id: 3, title: "Expense Tracker & Analytics App", points: 80, description: "Create financial dashboard with dynamic charts and localStorage persistence.", category: "App", partner: "Zahira Shirin", members: ["Zahira Shirin", "Naveen"] },
    { id: 4, title: "Mobile Education App UI Redesign", points: 150, description: "Design high-fidelity Figma mobile user interface for peer-to-peer tutoring.", category: "Design", partner: "Subashini", members: ["Subashini"] },
    { id: 5, title: "Countries Encyclopedia Web App", points: 60, description: "Build interactive global stats explorer consuming REST Countries & Leaflet Maps API.", category: "Web", partner: "Naveen", members: ["Naveen"] },
    { id: 6, title: "OAuth & JWT Security Portal", points: 100, description: "Implement robust authentication pipeline with Refresh Tokens and Role-based Access.", category: "Backend", partner: "Ranjith", members: ["Ranjith"] }
  ],
  tickets: [],
  activityFeed: [
    { id: 1, user: "Swetha", action: "published a new course", target: "Machine Learning & AI", time: "5 mins ago", icon: "" },
    { id: 2, user: "Naveen", action: "unlocked study notes for", target: "React.js Mastery", time: "12 mins ago", icon: "" },
    { id: 3, user: "Vikram", action: "posted a collaboration project", target: "AI Code Review Bot", time: "25 mins ago", icon: "" },
    { id: 4, user: "Ananya", action: "earned +50 instructor points from", target: "React.js Mastery", time: "40 mins ago", icon: "" },
    { id: 5, user: "Subashini", action: "swapped notes with", target: "Python Data Science", time: "1 hour ago", icon: "" }
  ]
};

// ==========================================
// SCHEMAS & MODELS (For MongoDB if active)
// ==========================================
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  points: { type: Number, default: 100 },
  avatar: { type: String, default: "J" },
  role: { type: String, default: "Skill Swapper" },
  unlockedCourses: [String]
});

const skillSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  shareType: String,
  partner: String,
  rating: { type: Number, default: 4.8 },
  views: { type: String, default: "1.0k" },
  aiPoints: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  points: Number,
  category: String,
  partner: String,
  members: [String],
  createdAt: { type: Date, default: Date.now }
});

let User, Skill, Project;
try {
  User = mongoose.model("User", userSchema);
  Skill = mongoose.model("Skill", skillSchema);
  Project = mongoose.model("Project", projectSchema);
} catch (e) {}

// ==========================================
// API ROUTES
// ==========================================

// Health / Status
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    dbConnected: isMongoConnected,
    platform: "SkillSwap Peer-to-Peer Hub",
    timestamp: new Date()
  });
});

// GET / CREATE USER
app.post("/api/user", async (req, res) => {
  const { username, email } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });

  if (isMongoConnected && User) {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({
          username,
          email: email || `${username.toLowerCase()}@skillswap.io`,
          points: 120,
          unlockedCourses: ["java", "python", "react"]
        });
        await user.save();
      }
      return res.json(user);
    } catch (e) {
      console.error("Mongo user fetch error:", e);
    }
  }

  // Fallback In-Memory Store
  if (!inMemoryStore.users[username]) {
    inMemoryStore.users[username] = {
      username,
      email: email || `${username.toLowerCase()}@skillswap.io`,
      points: 120,
      avatar: username.charAt(0).toUpperCase(),
      role: "Skill Swapper",
      unlockedCourses: ["java", "python", "react"]
    };
  }
  res.json(inMemoryStore.users[username]);
});

// GET USER DETAILS
app.get("/api/user/:username", (req, res) => {
  const username = req.params.username;
  const user = inMemoryStore.users[username] || {
    username,
    points: 120,
    avatar: username.charAt(0).toUpperCase(),
    unlockedCourses: ["java", "python"]
  };
  res.json(user);
});

// GET ALL SKILLS
app.get("/api/skills", async (req, res) => {
  if (isMongoConnected && Skill) {
    try {
      const skills = await Skill.find().sort({ createdAt: -1 });
      if (skills && skills.length > 0) return res.json(skills);
    } catch (e) {
      console.error(e);
    }
  }
  res.json(inMemoryStore.skills);
});

// POST A SKILL
app.post("/api/post-skill", async (req, res) => {
  const { title, description, category, shareType, author, aiPoints, customTags } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Missing title or description" });
  }

  const newSkill = {
    id: Date.now(),
    title,
    description,
    category: category || "Tech",
    shareType: shareType || "Teach",
    partner: author || "Peer",
    rating: 4.9,
    views: "1.2k",
    aiPoints: aiPoints || 30,
    customTags: customTags || "",
    createdAt: new Date()
  };

  inMemoryStore.skills.unshift(newSkill);

  // Add to Activity Feed
  inMemoryStore.activityFeed.unshift({
    id: Date.now(),
    user: author || "Peer",
    action: "shared a new skill",
    target: title,
    time: "Just now",
    icon: "🚀"
  });

  if (isMongoConnected && Skill) {
    try {
      const dbSkill = new Skill(newSkill);
      await dbSkill.save();
    } catch (e) {}
  }

  res.json({ message: "Skill posted successfully", skill: newSkill });
});

// BUY / UNLOCK COURSE WITH POINTS
app.post("/api/buy-course", async (req, res) => {
  const { username, course, cost } = req.body;
  const actualCost = cost || 20;

  if (isMongoConnected && User) {
    try {
      const user = await User.findOne({ username });
      if (user) {
        if (user.points < actualCost && !user.unlockedCourses.includes(course)) {
          return res.status(400).json({ message: "Not enough points" });
        }
        if (!user.unlockedCourses.includes(course)) {
          user.points = Math.max(0, user.points - actualCost);
          user.unlockedCourses.push(course);
          await user.save();
        }
        return res.json(user);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Memory fallback
  const user = inMemoryStore.users[username] || { username, points: 120, unlockedCourses: [] };
  if (!user.unlockedCourses.includes(course)) {
    if (user.points >= actualCost) {
      user.points -= actualCost;
      user.unlockedCourses.push(course);

      // Add to Activity Feed
      inMemoryStore.activityFeed.unshift({
        id: Date.now(),
        user: username || "Learner",
        action: "unlocked study notes for",
        target: course.toUpperCase(),
        time: "Just now",
        icon: "🔓"
      });
    } else {
      return res.status(400).json({ message: "Not enough points" });
    }
  }
  inMemoryStore.users[username] = user;
  res.json(user);
});

// GET PROJECTS
app.get("/api/projects", (req, res) => {
  res.json(inMemoryStore.projects);
});

// POST PROJECT
app.post("/api/projects", (req, res) => {
  const { title, description, points, category, partner } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Missing required fields" });

  const project = {
    id: Date.now(),
    title,
    description,
    points: parseInt(points) || 50,
    category: category || "Custom",
    partner: partner || "Skill Partner",
    members: [partner || "Skill Partner"],
    createdAt: new Date()
  };

  inMemoryStore.projects.unshift(project);
  res.json({ message: "Project created successfully", project });
});

// JOIN PROJECT
app.post("/api/projects/join", (req, res) => {
  const { projectId, username, rewardPoints } = req.body;
  const project = inMemoryStore.projects.find(p => p.id === projectId || p.title === projectId);

  if (project) {
    if (!project.members.includes(username)) {
      project.members.push(username);
    }
  }

  const user = inMemoryStore.users[username] || { username, points: 120, unlockedCourses: [] };
  user.points += (rewardPoints || 50);
  inMemoryStore.users[username] = user;

  res.json({ message: "Joined project successfully", user, project });
});

// GET ACTIVITY FEED
app.get("/api/activity-feed", (req, res) => {
  res.json(inMemoryStore.activityFeed.slice(0, 10));
});

// SUBMIT SUPPORT TICKET
app.post("/api/support-ticket", (req, res) => {
  const { name, email, message } = req.body;
  const ticket = {
    id: "TICK-" + Math.floor(100000 + Math.random() * 900000),
    name,
    email,
    message,
    status: "Received",
    createdAt: new Date()
  };
  inMemoryStore.tickets.push(ticket);
  res.json({ message: "Ticket received successfully", ticket });
});

// ==========================================
// GROQ AI TUTOR & ASSISTANT ENDPOINT
// ==========================================
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

app.post("/api/ai-chat", (req, res) => {
  const { prompt, systemPrompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const https = require("https");
  const payload = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemPrompt || "You are SkillSwap AI Assistant, a friendly, expert, and encouraging peer-learning AI tutor for the SkillSwap platform. Give clear, structured answers with formatted code snippets, best practices, and learning tips."
      },
      { role: "user", content: prompt }
    ]
  });

  const options = {
    hostname: "api.groq.com",
    port: 443,
    path: "/openai/v1/chat/completions",
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  const groqReq = https.request(options, (groqRes) => {
    let body = "";
    groqRes.on("data", chunk => body += chunk);
    groqRes.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const reply = parsed.choices?.[0]?.message?.content || "No response received from Groq AI.";
        res.json({ reply, raw: parsed });
      } catch (err) {
        res.status(500).json({ error: "Failed to parse Groq AI response", raw: body });
      }
    });
  });

  groqReq.on("error", (err) => {
    console.warn("Groq AI API call error:", err.message);
    res.status(500).json({ error: "Groq AI Request Error: " + err.message });
  });

  groqReq.write(payload);
  groqReq.end();
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 SkillSwap High-Performance Server running at http://localhost:${PORT}`);
  console.log(`🤖 Groq AI Tutor Endpoint online at http://localhost:${PORT}/api/ai-chat`);
});

