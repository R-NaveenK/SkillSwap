/**
 * SkillSwap Pin Hub Logic
 */

let activeFilter = "all";
let pinSearchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    renderPinnedItems();
    setupPinEvents();
    updateUserDisplay();

    window.addEventListener("skillswap:statechange", () => {
        updateUserDisplay();
        renderPinnedItems();
    });
});

function renderPinnedItems() {
    const grid = document.getElementById("pinnedGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const pinnedItems = AppState.getPinnedItems();
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    const filtered = pinnedItems.filter(item => {
        const matchesFilter = activeFilter === "all" || item.type === activeFilter;
        const matchesSearch = !pinSearchQuery ||
            item.title.toLowerCase().includes(pinSearchQuery) ||
            (item.description && item.description.toLowerCase().includes(pinSearchQuery)) ||
            (item.partner && item.partner.toLowerCase().includes(pinSearchQuery));
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <span class="category-tag" style="margin-bottom: 12px; display: inline-block;">EMPTY BOOKMARKS</span>
                <h3 style="color: var(--text-primary); font-size: 20px;">No Pinned Favorites Found</h3>
                <p style="margin-top: 8px;">Explore skills on the Dashboard or Courses page and save items to access them here.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-area">
                    <span class="pin-type-badge">${(item.type || 'NOTE').toUpperCase()}</span>
                    <h3 style="margin-top: 8px;">${item.title}</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${item.description || "Saved skill item"}</p>
                </div>
                <button class="pin-toggle-btn pinned" title="Unpin item">Saved</button>
            </div>

            <div class="card-footer">
                <div class="partner-info">
                    <span class="partner-label">Partner</span>
                    <span class="partner-name">${item.partner || "SkillSwap Peer"}</span>
                </div>
                <div class="card-actions">
                    <a href="${item.link || '../front/front.html'}" class="action-btn" style="text-decoration: none; padding: 8px 14px; font-size: 13px;">
                        Open Item
                    </a>
                </div>
            </div>
        `;

        const unpinBtn = card.querySelector(".pin-toggle-btn");
        unpinBtn.addEventListener("click", () => {
            AppState.togglePin(item);
            renderPinnedItems();
        });

        grid.appendChild(card);
    });
}

function setupPinEvents() {
    const pills = document.querySelectorAll("#pinFilterPills .category-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            activeFilter = pill.dataset.filter;
            renderPinnedItems();
        });
    });

    const search = document.getElementById("pinSearchInput");
    if (search) {
        search.addEventListener("input", (e) => {
            pinSearchQuery = e.target.value.toLowerCase().trim();
            renderPinnedItems();
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

