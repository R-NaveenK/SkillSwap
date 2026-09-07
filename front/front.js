/**
 * SkillSwap Main Dashboard Logic
 */

// Global State & Data Definitions
let activeCategoryFilter = "all";
let activeSearchQuery = "";
let selectedCourseForModal = null;
let selectedPartnerForConnect = null;

// View Count Numerical Parser
function parseViewCount(str) {
    if (!str) return 0;
    const num = parseFloat(str);
    if (str.toLowerCase().includes("k")) return num * 1000;
    if (str.toLowerCase().includes("m")) return num * 1000000;
    return num;
}

const SKILL_CATALOG = [
    {
        id: "note-ml",
        courseKey: "ml",
        title: "Machine Learning & AI",
        subtitle: "Neural Networks & Supervised Learning",
        category: "Tech",
        partner: "Swetha",
        rating: "4.9",
        views: "4.5k",
        tag: "ML",
        type: "mostly_viewed",
        link: "../notes/ml.html"
    },
    {
        id: "note-react",
        courseKey: "react",
        title: "React.js Mastery",
        subtitle: "Component Architecture & Hooks",
        category: "Web",
        partner: "Ananya",
        rating: "4.9",
        views: "4.2k",
        tag: "REACT",
        type: "mostly_viewed",
        link: "../notes/react.html"
    },
    {
        id: "note-dsa",
        courseKey: "dsa",
        title: "Data Structures & Algo",
        subtitle: "Big-O & Coding Interview Mastery",
        category: "Tech",
        partner: "Vikram",
        rating: "4.9",
        views: "3.8k",
        tag: "DSA",
        type: "mostly_viewed",
        link: "../notes/dsa.html"
    },
    {
        id: "note-js",
        courseKey: "jsc",
        title: "JavaScript Mastery",
        subtitle: "Dynamic Web Scripting & DOM",
        category: "Web",
        partner: "Zahira Shirin",
        rating: "4.7",
        views: "3.5k",
        tag: "JS",
        type: "mostly_viewed",
        link: "../notes/jsc.html"
    },
    {
        id: "note-python",
        courseKey: "python",
        title: "Python Data",
        subtitle: "AI, ML & High-level Scripting",
        category: "Tech",
        partner: "Subashini",
        rating: "4.8",
        views: "3.1k",
        tag: "PYTHON",
        type: "mostly_viewed",
        link: "../notes/python.html"
    },
    {
        id: "note-node",
        courseKey: "node",
        title: "Node.js & Express",
        subtitle: "Scalable Non-blocking Backend REST APIs",
        category: "Web",
        partner: "Karthik",
        rating: "4.8",
        views: "2.9k",
        tag: "NODE",
        type: "mostly_viewed",
        link: "../notes/node.html"
    },
    {
        id: "note-figma",
        courseKey: "figma",
        title: "Figma UI/UX Design",
        subtitle: "Prototyping & Component Systems",
        category: "Design",
        partner: "Kavya",
        rating: "4.9",
        views: "2.8k",
        tag: "UI/UX",
        type: "mostly_viewed",
        link: "../notes/figma.html"
    },
    {
        id: "note-java",
        courseKey: "java",
        title: "Java Backend",
        subtitle: "Enterprise & Backend Powerhouse",
        category: "Tech",
        partner: "Pranith",
        rating: "4.6",
        views: "2.4k",
        tag: "JAVA",
        type: "mostly_viewed",
        link: "../notes/java.html"
    },
    {
        id: "note-security",
        courseKey: "security",
        title: "Cyber Security",
        subtitle: "Web Vulnerabilities & Pentesting",
        category: "Tools",
        partner: "Arjun",
        rating: "4.8",
        views: "2.3k",
        tag: "SECURITY",
        type: "top_course",
        link: "../notes/security.html"
    },
    {
        id: "note-docker",
        courseKey: "docker",
        title: "Docker & Containerization",
        subtitle: "DevOps & Cloud Deployments",
        category: "Tools",
        partner: "Suresh",
        rating: "4.8",
        views: "2.2k",
        tag: "DOCKER",
        type: "top_course",
        link: "../notes/docker.html"
    },
    {
        id: "note-cpp",
        courseKey: "cpp",
        title: "C++ Programming",
        subtitle: "STL, Memory & Low-level Systems",
        category: "Tech",
        partner: "Dinesh",
        rating: "4.7",
        views: "2.1k",
        tag: "C++",
        type: "top_course",
        link: "../notes/cpp.html"
    },
    {
        id: "note-sql",
        courseKey: "sql",
        title: "SQL & Databases",
        subtitle: "Queries, Indexes & Relational DBs",
        category: "Database",
        partner: "Monika",
        rating: "4.7",
        views: "1.9k",
        tag: "SQL",
        type: "top_course",
        link: "../notes/sql.html"
    },
    {
        id: "note-html",
        courseKey: "html",
        title: "HTML5 Semantic Web",
        subtitle: "Modern Layouts & Accessibility",
        category: "Web",
        partner: "Naveen",
        rating: "4.6",
        views: "1.8k",
        tag: "HTML5",
        type: "top_course",
        link: "../notes/html.html"
    },
    {
        id: "note-mongodb",
        courseKey: "mongodb",
        title: "MongoDB & NoSQL",
        partner: "Deepak",
        rating: "4.8",
        views: "1.6k",
        icon: "📘",
        type: "top_course",
        link: "../notes/typescript.html"
    },
    {
        id: "note-cpp",
        courseKey: "cpp",
        title: "C++ Systems",
        subtitle: "High Performance & Pointer OOP",
        category: "Tech",
        partner: "Shamini",
        rating: "4.4",
        views: "1.5k",
        icon: "⚡",
        type: "top_course",
        link: "../notes/cpp.html"
    },
    {
        id: "note-flutter",
        courseKey: "flutter",
        title: "Flutter & Dart App Dev",
        subtitle: "Cross-Platform Mobile Applications",
        category: "Web",
        partner: "Rahul",
        rating: "4.8",
        views: "1.4k",
        icon: "📱",
        type: "top_course",
        link: "../notes/flutter.html"
    },
    {
        id: "note-c",
        courseKey: "c",
        title: "C Programming",
        subtitle: "Core System Fundamentals",
        category: "Tech",
        partner: "Ranjith",
        rating: "4.3",
        views: "1.1k",
        icon: "💻",
        type: "top_course",
        link: "../notes/c.html"
    }
];

// Initialization
function startDashboard() {
    renderDashboard();
    renderActivityFeed();
    setupEventListeners();
    initHeroTyping();
    updateUserDisplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startDashboard);
} else {
    startDashboard();
}

window.addEventListener("skillswap:statechange", () => {
    updateUserDisplay();
    renderDashboard();
    renderActivityFeed();
});

// Render Dashboard Cards
function renderDashboard() {
    const mostlyContainer = document.getElementById("mostlyViewedGrid");
    const topCoursesContainer = document.getElementById("topCoursesGrid");
    if (!mostlyContainer || !topCoursesContainer) return;

    mostlyContainer.innerHTML = "";
    topCoursesContainer.innerHTML = "";

    const mostlySection = mostlyContainer.closest(".section");
    const topSection = topCoursesContainer.closest(".section");

    const pinnedItems = (window.AppState && AppState.getPinnedItems) ? AppState.getPinnedItems() : [];
    const pinCountBadge = document.getElementById("sidebarPinCount");
    if (pinCountBadge) pinCountBadge.textContent = pinnedItems.length;

    let mostlyCount = 0;
    let topCount = 0;

    // Render User-Posted Custom Skills
    const postedSkills = (window.AppState && AppState.getState) ? AppState.getState().postedSkills || [] : [];
    postedSkills.forEach(skill => {
        try {
            const matchesCategory = activeCategoryFilter === "all" ||
                activeCategoryFilter === "Community" ||
                (skill.category || "").toLowerCase().includes(activeCategoryFilter.toLowerCase());
            const matchesSearch = !activeSearchQuery ||
                skill.title.toLowerCase().includes(activeSearchQuery) ||
                skill.description.toLowerCase().includes(activeSearchQuery) ||
                (skill.category || "").toLowerCase().includes(activeSearchQuery);

            if (!matchesCategory || !matchesSearch) return;

            const userCard = document.createElement("div");
            userCard.className = "card";
            userCard.style.borderColor = "var(--border-highlight)";

            userCard.innerHTML = `
                <div class="card-top">
                    <div class="card-badge-group">
                        <span style="font-size: 11px; font-weight: 800; background: #C4E1E6; color: #1E2D33; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;">COMMUNITY</span>
                        <div class="card-title-area">
                            <h3>${skill.title}</h3>
                            <p>${skill.description}</p>
                            ${skill.customTags ? `<span style="font-size: 11px; background: #F4FAF8; color: var(--text-secondary); padding: 3px 10px; border-radius: 12px; font-weight: 700; margin-top: 6px; display: inline-block; border: 1px solid var(--border-color);">${skill.customTags}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="partner-info">
                        <span class="partner-label">${skill.category || 'Specialization'}</span>
                        <span class="partner-name">By ${skill.author || 'Peer'}</span>
                    </div>
                    <div class="card-actions" style="display: flex; gap: 8px; align-items: center;">
                        <span style="font-size: 13px; color: var(--text-primary); font-weight: 700;">+${skill.aiPoints || 30} Pts</span>
                        <button class="action-btn connect-btn" style="padding: 8px 14px; font-size: 13px; font-weight: 800;">
                            Connect
                        </button>
                    </div>
                </div>
            `;

            const connectBtn = userCard.querySelector(".connect-btn");
            if (connectBtn) {
                connectBtn.addEventListener("click", () => {
                    openConnectModal(skill.author || 'Peer', skill.title);
                });
            }

            mostlyContainer.appendChild(userCard);
            mostlyCount++;
        } catch (e) {
            console.error("Error rendering user posted skill", e);
        }
    });

    // Sort Catalog by Views (Highest First)
    const sortedCatalog = [...SKILL_CATALOG].sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views));

    sortedCatalog.forEach(item => {
        try {
            const catLower = (item.category || "").toLowerCase();
            const filterLower = activeCategoryFilter.toLowerCase();

            let matchesCategory = false;
            if (filterLower === "all") {
                matchesCategory = true;
            } else if (filterLower === "tech") {
                matchesCategory = catLower === "tech";
            } else if (filterLower === "web") {
                matchesCategory = catLower === "web";
            } else if (filterLower === "design") {
                matchesCategory = catLower === "design";
            } else if (filterLower === "database") {
                matchesCategory = catLower === "database";
            } else if (filterLower === "tools") {
                matchesCategory = catLower === "tools";
            } else if (filterLower === "community") {
                matchesCategory = false;
            } else {
                matchesCategory = catLower.includes(filterLower);
            }

            const matchesSearch = !activeSearchQuery ||
                item.title.toLowerCase().includes(activeSearchQuery) ||
                item.subtitle.toLowerCase().includes(activeSearchQuery) ||
                item.partner.toLowerCase().includes(activeSearchQuery) ||
                item.category.toLowerCase().includes(activeSearchQuery);

            if (!matchesCategory || !matchesSearch) return;

            const isPinned = (window.AppState && AppState.isPinned) ? AppState.isPinned(item.id) : false;
            const isUnlocked = (window.AppState && AppState.isCourseUnlocked) ? AppState.isCourseUnlocked(item.courseKey) : false;
            const cardHTML = createCardHTML(item, isPinned, isUnlocked);

            if (activeCategoryFilter !== "all") {
                mostlyContainer.appendChild(cardHTML);
                mostlyCount++;
            } else if (item.type === "mostly_viewed") {
                mostlyContainer.appendChild(cardHTML);
                mostlyCount++;
            } else {
                topCoursesContainer.appendChild(cardHTML);
                topCount++;
            }
        } catch (err) {
            console.error("Error rendering course card", item, err);
        }
    });

    // Dynamic Section Titles & Visibility Handler
    const mostlyTitle = mostlySection ? mostlySection.querySelector(".section-title") : null;
    const topTitle = topSection ? topSection.querySelector(".section-title") : null;

    if (activeCategoryFilter === "all") {
        if (mostlyTitle) mostlyTitle.textContent = "Featured Skill Listings";
        if (topTitle) topTitle.textContent = "Top Peer Courses";
        if (mostlySection) mostlySection.style.display = mostlyCount > 0 ? "block" : "none";
        if (topSection) topSection.style.display = topCount > 0 ? "block" : "none";
    } else {
        const catName = activeCategoryFilter === "Tech" ? "Programming & CS" :
                        activeCategoryFilter === "Web" ? "Web Engineering" :
                        activeCategoryFilter === "Design" ? "UI/UX Design" :
                        activeCategoryFilter === "Database" ? "Database Systems" :
                        activeCategoryFilter === "Tools" ? "Cloud & DevOps" :
                        activeCategoryFilter === "Community" ? "Community Skill Listings" : activeCategoryFilter;
        if (mostlyTitle) mostlyTitle.textContent = `Filtered Category: ${catName}`;
        if (mostlySection) mostlySection.style.display = mostlyCount > 0 ? "block" : "none";
        if (topSection) topSection.style.display = "none";
    }

    if (mostlyCount === 0 && topCount === 0) {
        if (mostlySection) mostlySection.style.display = "block";
        mostlyContainer.innerHTML = `
            <div style="grid-column: 1/-1; color: var(--text-secondary); padding: 36px; text-align: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                No skill listings found matching <strong>"${activeSearchQuery || activeCategoryFilter}"</strong>. Please select another filter option.
            </div>
        `;
    }
}

// Card HTML Generator
function createCardHTML(item, isPinned, isUnlocked) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = item.id;

    const aiCost = (window.AppState && AppState.calculateAIPointValue)
        ? AppState.calculateAIPointValue(item.courseKey, item.rating, item.category)
        : 20;

    card.innerHTML = `
        <div class="card-top">
            <div class="card-badge-group">
                <span style="font-size: 11px; font-weight: 800; background: #C4E1E6; color: #1E2D33; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px;">${item.tag || 'TECH'}</span>
                <div class="card-title-area">
                    <h3>${item.title}</h3>
                    <p>${item.subtitle}</p>
                </div>
            </div>
            <button class="pin-toggle-btn ${isPinned ? 'pinned' : ''}" style="font-size: 12px; font-weight: 700; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 6px; background: transparent; cursor: pointer;">
                ${isPinned ? 'Saved' : 'Save'}
            </button>
        </div>

        <div class="card-footer">
            <div class="partner-info">
                <span class="partner-label">Instructor</span>
                <span class="partner-name">${item.partner}</span>
            </div>
            <div class="card-actions" style="display: flex; gap: 8px; align-items: center;">
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">${item.views} Views</span>
                <span class="rating-badge">Rating: ${item.rating}</span>
                <button class="action-btn open-modal-btn">
                    ${isUnlocked ? 'View Notes' : `Unlock (${aiCost} Pts)`}
                </button>
            </div>
        </div>
    `;

    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
        if (!e.target.closest(".pin-toggle-btn")) {
            openCourseModal(item);
        }
    });

    const pinBtn = card.querySelector(".pin-toggle-btn");
    if (pinBtn) {
        pinBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.AppState) {
                AppState.togglePin({
                    id: item.id,
                    type: "note",
                    title: item.title,
                    description: item.subtitle,
                    partner: item.partner,
                    link: item.link
                });
            }
            renderDashboard();
        });
    }

    return card;
}

// Activity Feed Generator
function renderActivityFeed() {
    const list = document.getElementById("activityFeedList");
    if (!list) return;

    const state = (window.AppState && AppState.getState) ? AppState.getState() : {};
    const feed = state.activityFeed || [];

    if (feed.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); font-size: 14px;">No recent activity recorded yet.</p>`;
        return;
    }

    list.innerHTML = feed.slice(0, 6).map(item => `
        <div class="activity-item">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--border-highlight); flex-shrink: 0;"></div>
            <div class="activity-text">
                <strong>${item.user}</strong> ${item.action} <span style="color: var(--text-primary); font-weight: 700;">${item.target}</span>
            </div>
            <span class="activity-time">${item.time}</span>
        </div>
    `).join("");
}

// Open Course Unlock Modal
function openCourseModal(item) {
    selectedCourseForModal = item;
    const modal = document.getElementById("skillModal");
    if (!modal) return;

    const isUnlocked = (window.AppState && AppState.isCourseUnlocked) ? AppState.isCourseUnlocked(item.courseKey) : false;
    const aiCost = (window.AppState && AppState.calculateAIPointValue) ? AppState.calculateAIPointValue(item.courseKey, item.rating, item.category) : 20;

    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalPartner = document.getElementById("modalPartner");
    const modalRating = document.getElementById("modalRating");
    const modalViews = document.getElementById("modalViews");
    const modalCostDisplay = document.getElementById("modalCostDisplay");

    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDescription) modalDescription.textContent = `${item.subtitle}. Learn directly with interactive study notes provided by ${item.partner}.`;
    if (modalPartner) modalPartner.textContent = item.partner;
    if (modalRating) modalRating.textContent = `Rating: ${item.rating} / 5.0`;
    if (modalViews) modalViews.textContent = `${item.views} Views`;
    if (modalCostDisplay) modalCostDisplay.textContent = `${aiCost} Points`;

    const statusEl = document.getElementById("modalUnlockStatus");
    const actionBtn = document.getElementById("modalActionBtn");

    if (statusEl && actionBtn) {
        if (isUnlocked) {
            statusEl.textContent = "Already Enrolled";
            actionBtn.textContent = "Open Course Notes";
            actionBtn.className = "action-btn";
        } else {
            statusEl.textContent = `Cost: ${aiCost} Points`;
            actionBtn.textContent = `Unlock Course (${aiCost} Pts)`;
        }
    }

    modal.classList.add("active");
}

// Open Peer Connect Modal
function openConnectModal(partnerName, skillTitle) {
    selectedPartnerForConnect = { partnerName, skillTitle };
    const modal = document.getElementById("connectModal");
    const info = document.getElementById("connectPartnerInfo");
    if (!modal) return;

    if (info) info.innerHTML = `Send an inquiry to <strong>${partnerName}</strong> to schedule a technical peer consultation for <strong>${skillTitle}</strong>.`;
    modal.classList.add("active");
}

// Modal Action Handlers & Event Setup
function setupEventListeners() {
    // Modal Close
    const closeBtn = document.getElementById("modalCloseBtn");
    const modal = document.getElementById("skillModal");
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active");
        });
    }

    // Connect Modal Close
    const closeConnect = document.getElementById("closeConnectModal");
    const connectModal = document.getElementById("connectModal");
    if (closeConnect && connectModal) {
        closeConnect.addEventListener("click", () => connectModal.classList.remove("active"));
        connectModal.addEventListener("click", (e) => {
            if (e.target === connectModal) connectModal.classList.remove("active");
        });
    }

    // Send Connect Invitation
    const sendConnectBtn = document.getElementById("sendConnectRequestBtn");
    if (sendConnectBtn && connectModal) {
        sendConnectBtn.addEventListener("click", () => {
            const msgInput = document.getElementById("connectMessageInput");
            const msg = msgInput ? msgInput.value.trim() : "";
            const partner = selectedPartnerForConnect ? selectedPartnerForConnect.partnerName : "Peer";
            
            if (window.AppState) {
                AppState.showToast(`Connection request dispatched to ${partner}.`);
            }
            if (msgInput) msgInput.value = "";
            connectModal.classList.remove("active");
        });
    }

    // Daily Bonus Button Handler
    const dailyBonusBtn = document.getElementById("dailyBonusBtn");
    if (dailyBonusBtn) {
        dailyBonusBtn.addEventListener("click", () => {
            if (window.AppState) {
                AppState.claimDailyBonus();
                updateUserDisplay();
            }
        });
    }

    // Modal Action Unlock Button
    const actionBtn = document.getElementById("modalActionBtn");
    if (actionBtn) {
        actionBtn.addEventListener("click", () => {
            if (!selectedCourseForModal) return;
            const isUnlocked = (window.AppState && AppState.isCourseUnlocked) ? AppState.isCourseUnlocked(selectedCourseForModal.courseKey) : false;

            if (isUnlocked) {
                window.location.href = selectedCourseForModal.link;
            } else {
                const aiCost = (window.AppState && AppState.calculateAIPointValue)
                    ? AppState.calculateAIPointValue(selectedCourseForModal.courseKey, selectedCourseForModal.rating, selectedCourseForModal.category)
                    : 20;

                const success = (window.AppState && AppState.unlockCourse) ? AppState.unlockCourse(selectedCourseForModal.courseKey, aiCost) : true;
                if (success) {
                    modal.classList.remove("active");
                    setTimeout(() => {
                        window.location.href = selectedCourseForModal.link;
                    }, 500);
                }
            }
        });
    }

    // Search Input
    const searchInput = document.getElementById("skillSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value.toLowerCase().trim();
            renderDashboard();
        });
    }

    // Category Filter Pills
    const pills = document.querySelectorAll(".category-pills .category-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeCategoryFilter = pill.dataset.category;
            renderDashboard();
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            if (window.AppState) AppState.toggleTheme();
        });
    }
}

// Dynamic Typing Effect
function initHeroTyping() {
    const textArray = [
        "Peer Skill Exchange & Knowledge Economy",
        "Teach Skills, Share Notes & Gain Points",
        "Collaborate on Real-World Team Projects"
    ];
    const typingEl = document.getElementById("typingHeroTitle");
    if (!typingEl) return;

    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIdx];
        if (isDeleting) {
            typingEl.textContent = currentText.substring(0, charIdx--);
        } else {
            typingEl.textContent = currentText.substring(0, charIdx++);
        }

        let speed = isDeleting ? 25 : 55;
        if (!isDeleting && charIdx === currentText.length + 1) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx = (textIdx + 1) % textArray.length;
            speed = 400;
        }
        setTimeout(type, speed);
    }
    type();
}

// User Info Sync
function updateUserDisplay() {
    if (!window.AppState) return;
    const user = AppState.getUser();
    const points = AppState.getPoints();

    const userNameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");
    const pointsVal = document.getElementById("pointsValue");
    const sidebarPts = document.getElementById("sidebarPoints");

    if (userNameEl) userNameEl.textContent = user.username;
    if (avatarEl) avatarEl.textContent = user.avatar || user.username.charAt(0);
    if (pointsVal) pointsVal.textContent = `${points} Points`;
    if (sidebarPts) sidebarPts.textContent = points;
}

