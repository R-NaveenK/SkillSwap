/**
 * SkillSwap Courses Module Logic
 * Includes Learn Mode & Teach Mode with Instructor Point Economy
 */

let activeMode = "learn";
let searchQuery = "";
let selectedCourseForTeach = null;
let activeCategoryFilter = "all";

const COURSES_DATA = [
    { key: "react", title: "React.js Mastery", desc: "Component Architecture, Hooks & Virtual DOM", partner: "Ananya", views: "4.2k", tag: "REACT", category: "Web", link: "../notes/react.html" },
    { key: "node", title: "Node.js & Express", desc: "Scalable Non-blocking Backend REST APIs", partner: "Karthik", views: "2.9k", tag: "NODE", category: "Web", link: "../notes/node.html" },
    { key: "dsa", title: "Data Structures & Algorithms", desc: "Big-O Analysis & Coding Interview Mastery", partner: "Vikram", views: "3.8k", tag: "DSA", category: "Tech", link: "../notes/dsa.html" },
    { key: "typescript", title: "TypeScript Essentials", desc: "Strongly Typed Static Analysis for JS", partner: "Deepak", views: "1.6k", tag: "TS", category: "Web", link: "../notes/typescript.html" },
    { key: "ml", title: "Machine Learning & AI", desc: "Supervised Learning, Neural Networks & Models", partner: "Swetha", views: "4.5k", tag: "AI/ML", category: "Tech", link: "../notes/ml.html" },
    { key: "docker", title: "Docker & Kubernetes", desc: "Containerization Images & DevOps Workflows", partner: "Harish", views: "2.1k", tag: "DOCKER", category: "Tools", link: "../notes/docker.html" },
    { key: "security", title: "Cyber Security", desc: "OWASP Web Pentesting & Network Defense", partner: "Arjun", views: "2.3k", tag: "SECURITY", category: "Tools", link: "../notes/security.html" },
    { key: "figma", title: "Figma UI/UX Design", desc: "Auto-Layout, Component Systems & Prototypes", partner: "Kavya", views: "2.8k", tag: "UI/UX", category: "Design", link: "../notes/figma.html" },
    { key: "flutter", title: "Flutter & Dart App Dev", desc: "Cross-Platform iOS & Android Mobile Apps", partner: "Rahul", views: "1.4k", tag: "MOBILE", category: "Web", link: "../notes/flutter.html" },
    { key: "mongodb", title: "MongoDB & NoSQL", desc: "BSON Document Store & Mongoose ORM", partner: "Priyanka", views: "1.7k", tag: "NOSQL", category: "Database", link: "../notes/mongodb.html" },
    { key: "jsc", title: "JavaScript Mastery", desc: "Basics to Dynamic Web scripting & DOM manipulation", partner: "Zahira Shirin", views: "3.5k", tag: "JS", category: "Web", link: "../notes/jsc.html" },
    { key: "python", title: "Python Programming", desc: "High-level language for automation & data analysis", partner: "Subashini", views: "3.1k", tag: "PYTHON", category: "Tech", link: "../notes/python.html" },
    { key: "java", title: "Java Development", desc: "Object-oriented programming & enterprise backend", partner: "Pranith", views: "2.4k", tag: "JAVA", category: "Tech", link: "../notes/java.html" },
    { key: "sql", title: "SQL Databases", desc: "Data Querying & Schema Foundations", partner: "Pranesh", views: "2.0k", tag: "SQL", category: "Database", link: "../notes/sql.html" },
    { key: "git", title: "Git & Version Control", desc: "Distributed code management & GitHub workflows", partner: "Naveen", views: "1.9k", tag: "GIT", category: "Tools", link: "../notes/git.html" },
    { key: "cpp", title: "C++ Systems", desc: "Advanced Object-Oriented & Memory Management", partner: "Shamini", views: "1.5k", tag: "C++", category: "Tech", link: "../notes/cpp.html" },
    { key: "casss", title: "CSS & Web Styling", desc: "Responsive layout & modern UI design", partner: "Subasri", views: "1.8k", tag: "CSS", category: "Web", link: "../notes/casss.html" },
    { key: "c", title: "C Programming", desc: "Low-level system architecture & pointer logic", partner: "Ranjith", views: "1.1k", tag: "C", category: "Tech", link: "../notes/c.html" }
];

function startCoursesPage() {
    renderCourses();
    setupCoursesEvents();
    updateUserDisplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCoursesPage);
} else {
    startCoursesPage();
}

window.addEventListener("skillswap:statechange", () => {
    updateUserDisplay();
    renderCourses();
});

function renderCourses() {
    const grid = document.getElementById("coursesGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const teachBanner = document.getElementById("teachModeBanner");
    if (teachBanner) {
        teachBanner.style.display = activeMode === "teach" ? "flex" : "none";
    }

    const pinnedItems = (window.AppState && AppState.getPinnedItems) ? AppState.getPinnedItems() : [];
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    // Render User Posted Custom Skills First
    const postedSkills = (window.AppState && AppState.getState) ? AppState.getState().postedSkills || [] : [];
    postedSkills.forEach(skill => {
        try {
            const matchesCat = activeCategoryFilter === "all" ||
                skill.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()) ||
                (activeCategoryFilter === "Community");
            const matchesQuery = !searchQuery ||
                skill.title.toLowerCase().includes(searchQuery) ||
                skill.description.toLowerCase().includes(searchQuery) ||
                skill.category.toLowerCase().includes(searchQuery);

            if (!matchesCat || !matchesQuery) return;

            const card = document.createElement("div");
            card.className = "card";
            card.style.borderColor = "var(--border-highlight)";

            card.innerHTML = `
                <div class="card-top">
                    <div class="card-badge-group">
                        <span style="font-size: 11px; font-weight: 800; background: #C4E1E6; color: #1E2D33; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;">COMMUNITY</span>
                        <div class="card-title-area">
                            <h3>${skill.title}</h3>
                            <p>${skill.description}</p>
                            <span style="display: inline-block; font-size: 11px; font-weight: 800; background: #F4FAF8; color: var(--text-primary); padding: 3px 8px; border-radius: 10px; margin-top: 6px; border: 1px solid var(--border-color);">Value: ${skill.aiPoints || 30} Pts</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="partner-info">
                        <span class="partner-label">${skill.category || 'Specialization'}</span>
                        <span class="partner-name">By ${skill.author || 'Peer'}</span>
                    </div>
                    <div class="course-actions">
                        <button class="action-btn connect-btn" style="padding: 8px 14px; font-size: 13px;">
                            Connect
                        </button>
                    </div>
                </div>
            `;
            const connectBtn = card.querySelector(".connect-btn");
            if (connectBtn) {
                connectBtn.addEventListener("click", () => {
                    if (window.AppState) AppState.showToast(`Connected with ${skill.author || 'Peer'} for "${skill.title}".`);
                });
            }
            grid.appendChild(card);
        } catch (e) {
            console.error("Error rendering user skill", e);
        }
    });

    COURSES_DATA.forEach(course => {
        try {
            const matchesCat = activeCategoryFilter === "all" ||
                course.category === activeCategoryFilter;

            const matches = course.title.toLowerCase().includes(searchQuery) ||
                course.desc.toLowerCase().includes(searchQuery) ||
                course.partner.toLowerCase().includes(searchQuery);

            if (!matchesCat || !matches) return;

            const isUnlocked = (window.AppState && AppState.isCourseUnlocked) ? AppState.isCourseUnlocked(course.key) : false;
            const aiCost = (window.AppState && AppState.calculateAIPointValue) ? AppState.calculateAIPointValue(course.key, "4.8", course.category) : 20;
            const card = document.createElement("div");
            card.className = "card";

            const isTeachMode = activeMode === "teach";
            const partnerLabel = isTeachMode ? "Instructor Bounty" : "Instructor";
            const partnerValue = isTeachMode ? "+50 Pts / Student" : course.partner;
            const buttonText = isTeachMode ? "Teach Course (+50 Pts)" : (isUnlocked ? "View Notes" : `Unlock (${aiCost} Pts)`);
            const buttonClass = "action-btn";

            card.innerHTML = `
                <div class="card-top">
                    <div class="card-badge-group">
                        <span style="font-size: 11px; font-weight: 800; background: #C4E1E6; color: #1E2D33; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;">${course.tag || 'TECH'}</span>
                        <div class="card-title-area">
                            <h3>${course.title}</h3>
                            <p>${course.desc}</p>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="partner-info">
                        <span class="partner-label">${partnerLabel}</span>
                        <span class="partner-name">${partnerValue}</span>
                    </div>
                    <div class="course-actions" style="display: flex; gap: 10px; align-items: center;">
                        <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">${course.views} Views</span>
                        <button class="${buttonClass}">
                            ${buttonText}
                        </button>
                    </div>
                </div>
            `;

            const btn = card.querySelector(".action-btn");
            btn.addEventListener("click", () => {
                if (isTeachMode) {
                    openTeachModal(course);
                } else {
                    if (isUnlocked) {
                        window.location.href = course.link;
                    } else {
                        const ok = (window.AppState && AppState.unlockCourse) ? AppState.unlockCourse(course.key, aiCost) : true;
                        if (ok) {
                            setTimeout(() => window.location.href = course.link, 400);
                        }
                    }
                }
            });

            grid.appendChild(card);
        } catch (err) {
            console.error("Error rendering course card", course, err);
        }
    });
}

function openTeachModal(course) {
    selectedCourseForTeach = course;
    const modal = document.getElementById("teachModal");
    const title = document.getElementById("modalTeachTitle");
    const icon = document.getElementById("modalTeachIcon");
    const desc = document.getElementById("modalTeachDesc");

    if (title) title.textContent = `Teach ${course.title}`;
    if (icon) icon.textContent = course.icon;
    if (desc) desc.textContent = `Become an official Skill Instructor for ${course.title}! Share your expertise, guide peer swappers, and publish study materials to earn +50 Points bonus for every enrolled learner.`;

    if (modal) modal.classList.add("active");
}

function closeTeachModal() {
    const modal = document.getElementById("teachModal");
    if (modal) modal.classList.remove("active");
}

function setupCoursesEvents() {
    const learnBtn = document.getElementById("learnBtn");
    const teachBtn = document.getElementById("teachBtn");

    if (learnBtn && teachBtn) {
        learnBtn.addEventListener("click", () => {
            learnBtn.classList.add("active");
            teachBtn.classList.remove("active");
            activeMode = "learn";
            renderCourses();
        });

        teachBtn.addEventListener("click", () => {
            teachBtn.classList.add("active");
            learnBtn.classList.remove("active");
            activeMode = "teach";
            if (window.AppState) AppState.showToast("🧑‍🏫 Teach Mode Activated! Teach courses to earn +50 Points per student.");
            renderCourses();
        });
    }

    const search = document.getElementById("courseSearchInput");
    if (search) {
        search.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderCourses();
        });
    }

    const coursePills = document.querySelectorAll("#courseCategoryPills .category-pill");
    coursePills.forEach(pill => {
        pill.addEventListener("click", () => {
            coursePills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeCategoryFilter = pill.dataset.category;
            renderCourses();
        });
    });

    const closeBtn = document.getElementById("closeTeachModal");
    if (closeBtn) closeBtn.addEventListener("click", closeTeachModal);

    const modal = document.getElementById("teachModal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeTeachModal();
        });
    }

    const startTeachingBtn = document.getElementById("startTeachingBtn");
    if (startTeachingBtn) {
        startTeachingBtn.addEventListener("click", () => {
            if (selectedCourseForTeach && window.AppState) {
                AppState.updatePoints(50, `Registered as Instructor for ${selectedCourseForTeach.title}`);
                AppState.showToast(`🎉 You are now an active Instructor for ${selectedCourseForTeach.title}! Earned +50 Bonus Points!`);
            }
            closeTeachModal();
        });
    }

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            if (window.AppState) AppState.toggleTheme();
        });
    }
}

function updateUserDisplay() {
    if (!window.AppState) return;
    const user = AppState.getUser();
    const points = AppState.getPoints();

    const userName = document.getElementById("userName");
    const userAvatar = document.getElementById("userAvatar");
    const pointsVal = document.getElementById("pointsValue");
    const sidebarPts = document.getElementById("sidebarPoints");

    if (userName) userName.textContent = user.username;
    if (userAvatar) userAvatar.textContent = user.avatar || user.username.charAt(0);
    if (pointsVal) pointsVal.textContent = `${points} Points`;
    if (sidebarPts) sidebarPts.textContent = points;
}

