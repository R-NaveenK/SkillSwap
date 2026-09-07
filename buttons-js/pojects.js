/**
 * SkillSwap Projects Module Logic
 */

let activeCategory = "all";
let selectedProjectForContribution = null;

const DEFAULT_PROJECTS = [
    { id: 1, title: "AI Code Review Bot", desc: "Build a GitHub bot using LLM API to analyze PRs and suggest code optimizations.", points: 120, category: "AI/ML", partner: "Swetha" },
    { id: 2, title: "Portfolio Website", desc: "Build a sleek developer portfolio using HTML5 & CSS Glassmorphism.", points: 50, category: "Web", partner: "Pranith" },
    { id: 3, title: "Expense Tracker & Analytics App", desc: "Create a modern financial tracker app with charts & local storage sync.", points: 80, category: "App", partner: "Zahira Shirin" },
    { id: 4, title: "Mobile Education App UI Redesign", desc: "Redesign a mobile education application interface with high-fidelity Figma components.", points: 150, category: "Design", partner: "Subashini" },
    { id: 5, title: "Countries Encyclopedia Web App", desc: "Build an interactive global stats explorer consuming REST Countries APIs.", points: 60, category: "Web", partner: "Naveen" },
    { id: 6, title: "Auth & JWT Security Portal", desc: "Implement secure JWT login, refresh tokens & role-based route guard.", points: 100, category: "Backend", partner: "Ranjith" }
];

function startProjectsPage() {
    renderProjects();
    setupProjectsEvents();
    updateUserDisplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startProjectsPage);
} else {
    startProjectsPage();
}

window.addEventListener("skillswap:statechange", () => {
    updateUserDisplay();
    renderProjects();
});

function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const pinnedItems = AppState.getPinnedItems();
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    const state = AppState.getState();
    const joinedProjects = state.joinedProjects || [];

    const filtered = DEFAULT_PROJECTS.filter(p => activeCategory === "all" || p.category === activeCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                No projects found in category <strong>${activeCategory}</strong>.
            </div>
        `;
        return;
    }

    filtered.forEach(proj => {
        const isJoined = joinedProjects.includes(proj.title);
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-area">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-size: 11px; font-weight: 800; background: #F7D6D0; color: #4A4A4A; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;">${proj.category}</span>
                        <span class="project-reward-badge" style="font-size: 13px; color: var(--text-primary); font-weight: 800;">Bounty: +${proj.points} Pts</span>
                    </div>
                    <h3>${proj.title}</h3>
                    <p style="margin-top: 6px;">${proj.desc}</p>
                </div>
            </div>

            <div class="card-footer">
                <div class="partner-info">
                    <span class="partner-label">Lead Maintainer</span>
                    <span class="partner-name">${proj.partner}</span>
                </div>
                <div class="card-actions" style="display: flex; gap: 8px;">
                    ${isJoined ? `
                        <button class="action-btn submit-work-btn" style="font-size: 12px; padding: 7px 12px;">
                            Submit Work
                        </button>
                    ` : `
                        <button class="action-btn join-proj-btn" style="font-size: 12px; padding: 7px 12px;">
                            Join Team
                        </button>
                    `}
                </div>
            </div>
        `;

        const joinBtn = card.querySelector(".join-proj-btn");
        if (joinBtn) {
            joinBtn.addEventListener("click", () => {
                AppState.joinProject(proj.title, proj.points);
                renderProjects();
            });
        }

        const submitWorkBtn = card.querySelector(".submit-work-btn");
        if (submitWorkBtn) {
            submitWorkBtn.addEventListener("click", () => {
                openContributeModal(proj);
            });
        }

        grid.appendChild(card);
    });
}

function openContributeModal(proj) {
    selectedProjectForContribution = proj;
    const modal = document.getElementById("contributeModal");
    const titleEl = document.getElementById("contributeProjectTitle");
    if (!modal) return;

    if (titleEl) titleEl.textContent = `Submit Deliverables for "${proj.title}"`;
    modal.classList.add("active");
}

function setupProjectsEvents() {
    const modal = document.getElementById("projectModal");
    const openBtn = document.getElementById("postProjectModalBtn");
    const closeBtn = document.getElementById("closeProjectModal");
    const form = document.getElementById("createProjectForm");

    // Scroll button
    const browseBtn = document.getElementById("browseScrollBtn");
    if (browseBtn) {
        browseBtn.addEventListener("click", () => {
            const grid = document.getElementById("projectsGrid");
            if (grid) grid.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Category Filter Pills
    const pills = document.querySelectorAll("#projectCategoryPills .category-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeCategory = pill.dataset.category;
            renderProjects();
        });
    });

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.add("active"));
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });
    }

    // Contribution Modal Handlers
    const contribModal = document.getElementById("contributeModal");
    const closeContrib = document.getElementById("closeContributeModal");
    const submitBtn = document.getElementById("submitContribBtn");

    if (closeContrib && contribModal) {
        closeContrib.addEventListener("click", () => contribModal.classList.remove("active"));
        contribModal.addEventListener("click", (e) => {
            if (e.target === contribModal) contribModal.classList.remove("active");
        });
    }

    if (submitBtn && contribModal) {
        submitBtn.addEventListener("click", () => {
            const linkInput = document.getElementById("contribRepoLink");
            const notesInput = document.getElementById("contribNotes");
            const link = linkInput ? linkInput.value.trim() : "";

            if (!link) {
                if (window.AppState) AppState.showToast("Please enter a valid repository or work link.", "error");
                return;
            }

            const points = selectedProjectForContribution ? selectedProjectForContribution.points : 50;
            if (window.AppState) {
                AppState.updatePoints(points, `Completed milestone for "${selectedProjectForContribution ? selectedProjectForContribution.title : 'Project'}"!`);
                AppState.logActivity("completed project milestone for", selectedProjectForContribution ? selectedProjectForContribution.title : "Project");
            }

            if (linkInput) linkInput.value = "";
            if (notesInput) notesInput.value = "";
            contribModal.classList.remove("active");
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("newProjTitle").value.trim();
            const desc = document.getElementById("newProjDesc").value.trim();
            const category = document.getElementById("newProjCategory") ? document.getElementById("newProjCategory").value : "Custom";
            const points = parseInt(document.getElementById("newProjPoints").value) || 50;

            if (title && desc) {
                DEFAULT_PROJECTS.unshift({
                    id: Date.now(),
                    title,
                    desc,
                    points,
                    category,
                    partner: AppState.getUser().username
                });
                AppState.updatePoints(20, "Bonus for launching a new project!");
                modal.classList.remove("active");
                form.reset();
                renderProjects();
            }
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

