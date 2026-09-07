/**
 * SkillSwap Centralized App State & Service Engine
 * Handles local storage persistence, points economy, user session,
 * pinned items, unlocked courses, daily rewards, activity feeds,
 * and Groq AI tutor synchronization.
 */

const API_BASE_URL = "http://localhost:3000/api";

const AppState = {
    // Initial State Defaults
    defaultState: {
        user: {
            username: "Naveen",
            email: "naveen@skillswap.io",
            points: 120,
            avatar: "N",
            role: "Pro Skill Swapper"
        },
        theme: "light",
        lastDailyBonusClaim: null,
        unlockedCourses: ["java", "python", "react"],
        joinedProjects: ["AI Code Review Bot"],
        pinnedItems: [
            { id: "note-ml", type: "note", title: "Machine Learning & AI", description: "Neural Networks & Supervised Learning", partner: "Swetha", link: "../notes/ml.html" },
            { id: "note-react", type: "note", title: "React.js Mastery", description: "Component Architecture & Hooks", partner: "Ananya", link: "../notes/react.html" },
            { id: "course-js", type: "course", title: "JavaScript Mastery", description: "Dynamic Web Scripting & DOM", partner: "Zahira Shirin", link: "../notes/jsc.html" }
        ],
        postedSkills: [
            { id: 1, title: "Fullstack Web Dev", description: "React, Node.js & MongoDB architecture", category: "Web", shareType: "Mentor", author: "Naveen", aiPoints: 35, customTags: "MERN, Beginners Welcome", createdAt: new Date().toLocaleDateString() }
        ],
        skills: [
            { id: 1, title: "Fullstack Web Dev", description: "React, Node.js & MongoDB architecture", category: "Web", shareType: "Mentor", author: "Naveen", aiPoints: 35, customTags: "MERN, Beginners Welcome", createdAt: new Date().toLocaleDateString() },
            { id: 2, title: "Data Structures & Algos", description: "Binary Trees, Graphs & DP walkthroughs", category: "DSA", shareType: "Peer", author: "Karthik", aiPoints: 45, customTags: "LeetCode, Competitive", createdAt: new Date().toLocaleDateString() },
            { id: 3, title: "Figma UI/UX Prototyping", description: "Auto-layout, modern design systems & tokens", category: "Design", shareType: "Group", author: "Ananya", aiPoints: 30, customTags: "Wireframes, Modern UI", createdAt: new Date().toLocaleDateString() }
        ],
        activityFeed: [
            { id: 1, user: "Karthik", action: "earned 45 Pts by posting", target: "Data Structures & Algos", time: "2 mins ago", icon: "" },
            { id: 2, user: "Naveen", action: "unlocked study notes for", target: "React.js Mastery", time: "12 mins ago", icon: "" },
            { id: 3, user: "Ananya", action: "joined collaboration team for", target: "AI Agent Project", time: "45 mins ago", icon: "" }
        ],
        recentActivities: [
            { id: 1, user: "Karthik", action: "earned 45 Pts by posting", target: "Data Structures & Algos", time: "2 mins ago", icon: "" },
            { id: 2, user: "Naveen", action: "unlocked study notes for", target: "React.js Mastery", time: "12 mins ago", icon: "" },
            { id: 3, user: "Ananya", action: "joined collaboration team for", target: "AI Agent Project", time: "45 mins ago", icon: "" }
        ],
        notifications: []
    },

    // Initialize State
    init() {
        if (!localStorage.getItem("skillswap_state")) {
            this.saveState(this.defaultState);
        }
        this.applyTheme(this.getTheme());
        this.updateUserUI();
        this.bindEvents();
        this.syncWithBackend();
    },

    bindEvents() {
        if (typeof document !== "undefined" && !this._eventsBound) {
            this._eventsBound = true;
            document.addEventListener("click", (e) => {
                const btn = e.target.closest("#themeToggleBtn, .theme-toggle-btn");
                if (btn) {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    },

    // Get Full State
    getState() {
        try {
            const data = localStorage.getItem("skillswap_state");
            if (!data) return this.defaultState;
            const parsed = JSON.parse(data);
            return {
                ...this.defaultState,
                ...parsed,
                user: { ...this.defaultState.user, ...(parsed.user || {}) },
                unlockedCourses: Array.isArray(parsed.unlockedCourses) ? parsed.unlockedCourses : this.defaultState.unlockedCourses,
                pinnedItems: Array.isArray(parsed.pinnedItems) ? parsed.pinnedItems : this.defaultState.pinnedItems,
                postedSkills: Array.isArray(parsed.postedSkills) ? parsed.postedSkills : this.defaultState.postedSkills,
                joinedProjects: Array.isArray(parsed.joinedProjects) ? parsed.joinedProjects : this.defaultState.joinedProjects,
                activityFeed: Array.isArray(parsed.activityFeed) ? parsed.activityFeed : this.defaultState.activityFeed
            };
        } catch (e) {
            console.error("Error parsing local state", e);
            return this.defaultState;
        }
    },

    // Save State
    saveState(state) {
        localStorage.setItem("skillswap_state", JSON.stringify(state));
        this.notifyStateChange();
    },

    // State Change Event Trigger
    notifyStateChange() {
        this.updateUserUI();
        this.applyTheme(this.getTheme());
        window.dispatchEvent(new CustomEvent("skillswap:statechange", { detail: this.getState() }));
    },

    // Keep Username in Document Title & Update UI Elements
    updateUserUI() {
        if (typeof document === "undefined") return;
        const user = this.getUser();
        const username = (user && user.username) ? user.username : "Naveen";
        const avatar = (user && user.avatar) ? user.avatar : username.charAt(0).toUpperCase();
        const points = user && user.points !== undefined ? user.points : 120;

        // Update Document Title with User Name
        this.updateDocumentTitle(username);

        // Update Sidebar & UI User Elements
        const userNameEls = document.querySelectorAll("#userName, .user-name");
        userNameEls.forEach(el => el.textContent = username);

        const userAvatarEls = document.querySelectorAll("#userAvatar, .user-avatar");
        userAvatarEls.forEach(el => el.textContent = avatar);

        const bannerUserEls = document.querySelectorAll("#bannerUserName");
        bannerUserEls.forEach(el => el.textContent = username);

        const pointsEls = document.querySelectorAll("#sidebarPoints, #pointsValue, .points-display");
        pointsEls.forEach(el => {
            if (el.id === "pointsValue") {
                el.textContent = `${points} Points`;
            } else {
                el.textContent = points;
            }
        });

        const pinCountEls = document.querySelectorAll("#sidebarPinCount");
        const pinCount = this.getPinnedItems().length;
        pinCountEls.forEach(el => el.textContent = pinCount);
    },

    updateDocumentTitle(username) {
        if (typeof document === "undefined") return;
        const name = username || (this.getUser() && this.getUser().username) || "Naveen";
        let currentTitle = document.title || "SkillSwap";

        // Clean any existing repeated prefixes
        currentTitle = currentTitle.replace(/^[^|]+\|\s*SkillSwap\s*-?\s*/i, "");
        currentTitle = currentTitle.replace(/^SkillSwap\s*-\s*[^|]+\|\s*/i, "");
        currentTitle = currentTitle.replace(/^SkillSwap\s*-\s*/i, "");
        currentTitle = currentTitle.replace(/\|\s*SkillSwap$/i, "").trim();

        if (!currentTitle || currentTitle.toLowerCase() === "skillswap") {
            document.title = `${name} | SkillSwap`;
        } else {
            document.title = `${name} | SkillSwap - ${currentTitle}`;
        }
    },

    // User & Points Management
    getUser() {
        return this.getState().user;
    },

    getPoints() {
        return this.getUser().points || 0;
    },

    updatePoints(delta, reason = "") {
        const state = this.getState();
        const currentPoints = state.user.points || 0;
        const newPoints = Math.max(0, currentPoints + delta);
        state.user.points = newPoints;
        this.saveState(state);

        if (delta > 0) {
            this.showToast(`🎉 +${delta} Points! ${reason}`);
        } else if (delta < 0) {
            this.showToast(`🪙 ${delta} Points. ${reason}`);
        }
        return newPoints;
    },

    // Daily Bonus Claim (+15 Pts)
    canClaimDailyBonus() {
        const state = this.getState();
        if (!state.lastDailyBonusClaim) return true;
        const last = new Date(state.lastDailyBonusClaim).getTime();
        const now = Date.now();
        // 20 hours cooldown for generous daily reward
        return (now - last) >= (20 * 60 * 60 * 1000);
    },

    claimDailyBonus() {
        if (!this.canClaimDailyBonus()) {
            this.showToast("⏳ Daily bonus already claimed today! Check back tomorrow.");
            return false;
        }
        const state = this.getState();
        state.lastDailyBonusClaim = new Date().toISOString();
        state.user.points = (state.user.points || 0) + 15;
        this.saveState(state);
        this.showToast("🎁 Daily Login Bonus: Claimed +15 Free Points!");
        return true;
    },

    // Unlocked Courses
    isCourseUnlocked(courseId) {
        const state = this.getState();
        return state.unlockedCourses.includes(courseId.toLowerCase());
    },

    // AI Point Valuation Engine
    calculateAIPointValue(courseKey, rating = "4.8", category = "Tech") {
        let basePoints = 15;
        const key = (courseKey || "").toLowerCase();

        // Advanced AI Complexity Weighting
        const highComplexityKeys = ["ml", "dsa", "security", "docker", "cpp", "ai", "cyber", "kubernetes", "deep"];
        const midComplexityKeys = ["react", "node", "typescript", "flutter", "mongodb", "python", "java", "sql", "web", "design", "figma"];

        if (highComplexityKeys.includes(key)) {
            basePoints += 20;
        } else if (midComplexityKeys.includes(key)) {
            basePoints += 12;
        } else {
            basePoints += 5;
        }

        // Instructor Rating Bonus Weighting
        const r = parseFloat(rating);
        if (r >= 4.9) basePoints += 10;
        else if (r >= 4.7) basePoints += 5;

        // Category Adjustment
        if (category === "Tools" || category === "Database") basePoints += 3;

        return basePoints; // Calculated dynamically between 20 to 45 Pts by AI algorithm
    },

    unlockCourse(courseId, cost) {
        const state = this.getState();
        const currentPoints = state.user.points || 0;
        const actualCost = cost || this.calculateAIPointValue(courseId);

        if (currentPoints < actualCost && !state.unlockedCourses.includes(courseId.toLowerCase())) {
            this.showToast(`❌ Insufficient points! Need ${actualCost} pts. (You have ${currentPoints} pts)`, "error");
            return false;
        }

        if (!state.unlockedCourses.includes(courseId.toLowerCase())) {
            state.unlockedCourses.push(courseId.toLowerCase());
            state.user.points -= actualCost;
            
            // Add to activity feed
            state.activityFeed.unshift({
                id: Date.now(),
                user: state.user.username,
                action: "unlocked study notes for",
                target: courseId.toUpperCase(),
                time: "Just now",
                icon: "🔓"
            });

            this.saveState(state);
            this.showToast(`🔓 Unlocked ${courseId.toUpperCase()}! (-${actualCost} pts calculated by AI)`);

            // Backend Sync
            fetch(`${API_BASE_URL}/buy-course`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: state.user.username, course: courseId, cost: actualCost })
            }).catch(() => { });
            return true;
        }
        return true;
    },

    // Pinned Items
    getPinnedItems() {
        return this.getState().pinnedItems || [];
    },

    isPinned(itemId) {
        return this.getPinnedItems().some(item => item.id === itemId);
    },

    togglePin(item) {
        const state = this.getState();
        const index = state.pinnedItems.findIndex(i => i.id === item.id);
        if (index > -1) {
            state.pinnedItems.splice(index, 1);
            this.showToast(`📌 Removed from Pinned Favorites`);
        } else {
            state.pinnedItems.push(item);
            this.showToast(`📌 Pinned to Favorites!`);
        }
        this.saveState(state);
    },

    // Post Skill
    addSkill(skill) {
        const state = this.getState();
        const earnedPoints = skill.aiPoints || 30;
        const newSkill = {
            id: Date.now(),
            ...skill,
            createdAt: new Date().toLocaleDateString()
        };
        state.postedSkills.unshift(newSkill);
        state.user.points += earnedPoints; // Bonus points calculated by AI Valuation

        state.activityFeed.unshift({
            id: Date.now(),
            user: state.user.username,
            action: "shared a new skill",
            target: skill.title,
            time: "Just now",
            icon: "🚀"
        });

        this.saveState(state);
        this.showToast(`🚀 Skill Posted! Earned +${earnedPoints} Points (AI Valued)!`);

        fetch(`${API_BASE_URL}/post-skill`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...skill, author: state.user.username, aiPoints: earnedPoints })
        }).catch(() => { });
    },

    // AI Point Valuation Engine
    calculateAIPointValue(skillKey = "", rating = "4.8", category = "Tech") {
        let base = 20;
        const key = String(skillKey).toLowerCase().trim();
        const cat = String(category).toLowerCase();

        const highDemand = ["ml", "dsa", "security", "docker", "cpp", "ai", "cyber", "kubernetes", "deep", "pytorch", "tensorflow", "cloud"];
        const midDemand = ["react", "node", "typescript", "flutter", "mongodb", "python", "java", "sql", "web", "design", "figma", "devops"];

        if (highDemand.some(k => key.includes(k))) base += 20;
        else if (midDemand.some(k => key.includes(k))) base += 12;
        else base += 5;

        if (cat.includes("ai") || cat.includes("data") || cat.includes("backend")) base += 8;
        else if (cat.includes("web") || cat.includes("app")) base += 5;

        const numRating = parseFloat(rating) || 4.5;
        if (numRating >= 4.8) base += 5;
        else if (numRating >= 4.0) base += 2;

        return Math.min(65, Math.max(15, base));
    },

    calculateAiSkillPoints(title = "", category = "Tech", tags = "") {
        const combined = `${title} ${category} ${tags}`.toLowerCase();
        return this.calculateAIPointValue(combined, "4.8", category);
    },

    // Activity Feed Logger
    logActivity(action, target, icon = "⚡") {
        const state = this.getState();
        state.activityFeed.unshift({
            id: Date.now(),
            user: state.user.username,
            action,
            target,
            time: "Just now",
            icon
        });
        if (state.activityFeed.length > 20) state.activityFeed.pop();
        this.saveState(state);
    },

    // Projects
    joinProject(projectName, rewardPoints = 50) {
        const state = this.getState();
        if (!state.joinedProjects.includes(projectName)) {
            state.joinedProjects.push(projectName);
            state.user.points += rewardPoints;

            state.activityFeed.unshift({
                id: Date.now(),
                user: state.user.username,
                action: "joined project team for",
                target: projectName,
                time: "Just now",
                icon: "💼"
            });

            this.saveState(state);
            this.showToast(`💼 Joined "${projectName}"! Claimed +${rewardPoints} pts reward!`);

            fetch(`${API_BASE_URL}/projects/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId: projectName, username: state.user.username, rewardPoints })
            }).catch(() => { });

            return true;
        }
        this.showToast(`ℹ️ You are already participating in this project.`);
        return false;
    },

    // Real-Time Fair AI Point Valuation Engine
    calculateAIPointValue(title = "", description = "", category = "Tech", tags = "") {
        const titleStr = (title || "").toLowerCase();
        const descStr = (description || "").toLowerCase();
        const tagsStr = (tags || "").toLowerCase();
        const combined = `${titleStr} ${descStr} ${tagsStr}`;

        // Pillar 1: Domain Complexity & Depth (Base 20 + up to 25 pts)
        let complexityScore = 5;
        const tier1Advanced = ["ml", "ai", "machine learning", "deep learning", "neural", "security", "cyber", "pentest", "cryptography", "distributed", "kubernetes", "microservices", "compiler", "kernel", "systems", "blockchain", "concurrency", "dsa", "algorithms", "graph", "dynamic programming"];
        const tier2Mid = ["react", "node", "typescript", "python", "java", "golang", "rust", "c++", "cpp", "docker", "sql", "nosql", "mongodb", "postgresql", "flutter", "next.js", "nextjs", "aws", "devops", "cloud", "rest api", "backend", "fullstack"];
        const tier3Standard = ["html", "css", "javascript", "web", "figma", "ui", "ux", "git", "github", "linux", "database"];

        let matchedTier = "Standard";
        if (tier1Advanced.some(k => combined.includes(k))) {
            complexityScore = 25;
            matchedTier = "Advanced Tech";
        } else if (tier2Mid.some(k => combined.includes(k))) {
            complexityScore = 15;
            matchedTier = "Intermediate Engineering";
        } else if (tier3Standard.some(k => combined.includes(k))) {
            complexityScore = 8;
            matchedTier = "Core Foundational";
        }

        // Pillar 2: Content Completeness & Educational Clarity (up to 15 pts)
        let clarityScore = 2;
        const descLength = descStr.trim().length;
        if (descLength > 120) clarityScore += 8;
        else if (descLength > 50) clarityScore += 5;
        else if (descLength > 20) clarityScore += 3;

        const qualityKeywords = ["architecture", "step by step", "hands-on", "project", "best practices", "roadmap", "debug", "notes", "quiz", "beginners", "advanced", "full guide"];
        if (qualityKeywords.some(q => combined.includes(q))) clarityScore += 4;
        if (tagsStr.trim().length > 0) clarityScore += 3;
        clarityScore = Math.min(15, clarityScore);

        // Pillar 3: Category Multiplier & Peer Exchange Demand (up to 15 pts)
        let demandScore = 5;
        const catNorm = (category || "").toLowerCase();
        if (catNorm.includes("tech") || catNorm.includes("computer") || catNorm.includes("ai") || catNorm.includes("security")) {
            demandScore = 15;
        } else if (catNorm.includes("web") || catNorm.includes("database") || catNorm.includes("backend")) {
            demandScore = 12;
        } else if (catNorm.includes("design") || catNorm.includes("product") || catNorm.includes("ui")) {
            demandScore = 10;
        } else {
            demandScore = 7;
        }

        // Total Fair Value = Base 15 + Subscores (Capped between 20 and 75 pts)
        const baseFloor = 15;
        const totalPoints = Math.min(75, Math.max(20, baseFloor + complexityScore + clarityScore + demandScore));

        // Rating Level Badge & Transparent Reasoning
        let levelBadge = "Standard Listing";
        if (totalPoints >= 55) levelBadge = "Exceptional Deep Dive";
        else if (totalPoints >= 42) levelBadge = "High Value Technical";
        else if (totalPoints >= 30) levelBadge = "Quality Peer Resource";

        let tips = "Tip: Add prerequisites, key code topics or hands-on projects in description for +10 Pts.";
        if (descLength > 80 && complexityScore >= 15) {
            tips = "Excellent details provided. Listing is optimized for maximum peer discovery.";
        }

        return {
            points: totalPoints,
            complexityScore,
            clarityScore,
            demandScore,
            matchedTier,
            levelBadge,
            tips,
            reasoning: `${matchedTier} (+${complexityScore} Pts) • ${category} Demand (+${demandScore} Pts) • Clarity & Scope (+${clarityScore} Pts)`
        };
    },

    calculateAiSkillPoints(title = "", category = "Tech", tags = "") {
        const res = this.calculateAIPointValue(title, "", category, tags);
        return res.points;
    },

    // GROQ AI TUTOR INTEGRATION
    async askGroqAI(prompt, systemPrompt) {
        const apiKey = "";

        try {
            const backendRes = await fetch(`${API_BASE_URL}/ai-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, systemPrompt })
            });

            if (backendRes.ok) {
                const data = await backendRes.json();
                if (data.reply) return data.reply;
            }
        } catch (e) {
            console.warn("Backend AI route offline, querying Groq API directly...");
        }

        // Direct fetch to Groq API Cloud
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt || "You are SkillSwap AI Assistant, an expert peer-learning AI tutor for the SkillSwap platform. Give structured, helpful responses with clean code blocks."
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Request Error (${response.status})`);
        }

        const json = await response.json();
        return json.choices?.[0]?.message?.content || "No response received from Groq AI.";
    },

    // Theme Switcher
    getTheme() {
        return this.getState().theme || "light";
    },

    toggleTheme() {
        const current = this.getTheme();
        const next = current === "dark" ? "light" : "dark";
        const state = this.getState();
        state.theme = next;
        this.saveState(state);
        this.applyTheme(next);
    },

    applyTheme(theme) {
        const currentTheme = theme || this.getTheme();
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (typeof document !== "undefined" && document.body) {
            if (currentTheme === "dark") {
                document.body.classList.add("dark-mode");
                document.body.classList.remove("light-mode");
            } else {
                document.body.classList.add("light-mode");
                document.body.classList.remove("dark-mode");
            }
        }

        // Update all theme toggle buttons across the page
        const themeBtns = document.querySelectorAll("#themeToggleBtn, .theme-toggle-btn");
        themeBtns.forEach(btn => {
            btn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
            btn.title = currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Night Mode";
        });
    },

    // Sync Backend
    async syncWithBackend() {
        try {
            const user = this.getUser();
            const res = await fetch(`${API_BASE_URL}/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, email: user.email })
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.points !== undefined) {
                    const state = this.getState();
                    state.user.points = data.points;
                    if (data.unlockedCourses) {
                        state.unlockedCourses = Array.from(new Set([...state.unlockedCourses, ...data.unlockedCourses]));
                    }
                    this.saveState(state);
                }
            }
        } catch (e) {
            // Backend offline, fallback seamlessly to localStorage
        }
    },

    // Theme Management (Signature Single-Mode Palette)
    getTheme() {
        return "signature-palette";
    },

    applyTheme(theme) {
        if (typeof document === "undefined") return;
        document.documentElement.setAttribute("data-theme", "signature");
        document.body.classList.remove("dark-mode");
        document.body.classList.add("signature-mode");
    },

    toggleTheme() {
        this.applyTheme("signature-palette");
        this.showToast("✨ Displaying Signature Rose Quartz & Charcoal Palette");
    },

    // Toast UI Component
    showToast(message, type = "info") {
        let toastContainer = document.getElementById("skillswap-toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "skillswap-toast-container";
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `skillswap-toast ${type}`;
        toast.innerHTML = message;
        toast.style.cssText = `
            background: #FFFFFF;
            color: #4A4A4A;
            backdrop-filter: blur(16px);
            border: 1px solid #E2B4BD;
            box-shadow: 0 10px 30px rgba(74, 74, 74, 0.12);
            padding: 14px 22px;
            border-radius: 14px;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        if (type === "error") {
            toast.style.borderColor = "#E2B4BD";
            toast.style.background = "#FFF5F5";
        }

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = "translateY(0)";
            toast.style.opacity = "1";
        });

        setTimeout(() => {
            toast.style.transform = "translateY(10px)";
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }
};

// Auto Init on DOM Load
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => AppState.init());
    } else {
        AppState.init();
    }
}

