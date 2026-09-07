/**
 * SkillSwap Post Skill Logic
 */

function startPostPage() {
    setupPostEvents();
    updateUserDisplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startPostPage);
} else {
    startPostPage();
}

window.addEventListener("skillswap:statechange", () => {
    updateUserDisplay();
});

let selectedCategory = "Tech";
let selectedShareType = "Teach";

function setupPostEvents() {
    const pinnedItems = AppState.getPinnedItems();
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    // Category Selector
    const catButtons = document.querySelectorAll("#categoryGroup .pill-option");
    const customContainer = document.getElementById("customCategoryContainer");
    const customInput = document.getElementById("customCategoryInput");

    catButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            catButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedCategory = btn.dataset.val;

            if (selectedCategory === "Other") {
                if (customContainer) customContainer.style.display = "block";
                if (customInput) customInput.focus();
            } else {
                if (customContainer) customContainer.style.display = "none";
            }
            updateLiveAIValuation();
        });
    });

    // Tag Chips
    const tagChips = document.querySelectorAll(".tag-chip");
    const tagsInput = document.getElementById("customTagsInput");
    tagChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const tag = chip.dataset.tag;
            if (!tagsInput) return;
            const current = tagsInput.value.trim();
            if (!current) {
                tagsInput.value = tag;
            } else if (!current.includes(tag)) {
                tagsInput.value = `${current}, ${tag}`;
            }
            updateLiveAIValuation();
        });
    });

    // Real-Time Typing Listeners for AI Valuation Engine & Preview
    const titleInput = document.getElementById("skillTitle");
    const descInput = document.getElementById("skillDesc");

    if (titleInput) {
        titleInput.addEventListener("input", updateLiveAIValuation);
    }
    if (descInput) {
        descInput.addEventListener("input", updateLiveAIValuation);
    }
    if (customInput) {
        customInput.addEventListener("input", updateLiveAIValuation);
    }
    if (tagsInput) {
        tagsInput.addEventListener("input", updateLiveAIValuation);
    }

    // Initial calculation on page load
    updateLiveAIValuation();

    // Clear Form
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.getElementById("skillTitle").value = "";
            document.getElementById("skillDesc").value = "";
            if (customInput) customInput.value = "";
            if (tagsInput) tagsInput.value = "";
            if (customContainer) customContainer.style.display = "none";
            updateLiveAIValuation();
        });
    }

    // Submit Skill
    const form = document.getElementById("skillPostForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("skillTitle").value.trim();
            const description = document.getElementById("skillDesc").value.trim();
            const customCat = customInput ? customInput.value.trim() : "";
            const tags = tagsInput ? tagsInput.value.trim() : "";

            if (!title || !description) return;

            let finalCategory = selectedCategory;
            if (selectedCategory === "Other") {
                finalCategory = customCat ? customCat : "Custom Skill";
            }

            const valResult = AppState.calculateAIPointValue(title, description, finalCategory, tags);
            const aiPoints = valResult.points;

            AppState.addSkill({
                title,
                description,
                category: finalCategory,
                customTags: tags,
                shareType: selectedShareType,
                author: AppState.getUser().username,
                aiPoints
            });

            setTimeout(() => {
                window.location.href = "../front/front.html";
            }, 700);
        });
    }

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            if (window.AppState) AppState.toggleTheme();
        });
    }
}

function updateLiveAIValuation() {
    const titleInput = document.getElementById("skillTitle");
    const descInput = document.getElementById("skillDesc");
    const customInput = document.getElementById("customCategoryInput");
    const tagsInput = document.getElementById("customTagsInput");

    const liveScoreEl = document.getElementById("aiLiveScore");
    const tierBadgeEl = document.getElementById("aiTierBadge");
    const subComplexityEl = document.getElementById("subComplexity");
    const subClarityEl = document.getElementById("subClarity");
    const subDemandEl = document.getElementById("subDemand");
    const reasoningEl = document.getElementById("aiReasoning");
    const tipsEl = document.getElementById("aiTips");
    const meterFillEl = document.getElementById("aiMeterFill");
    const btnPointValEl = document.getElementById("btnPointVal");

    // Live Preview elements
    const prevTitle = document.getElementById("prevTitle");
    const prevDesc = document.getElementById("prevDesc");
    const prevCat = document.getElementById("prevCat");
    const prevTag = document.getElementById("prevTag");
    const prevPoints = document.getElementById("prevPoints");

    const titleText = titleInput ? titleInput.value.trim() : "";
    const descText = descInput ? descInput.value.trim() : "";
    const customCatText = customInput ? customInput.value.trim() : "";
    const tagsText = tagsInput ? tagsInput.value.trim() : "";

    let category = selectedCategory === "Other" ? (customCatText || "Tools") : selectedCategory;

    // Update Live Preview
    if (prevTitle) prevTitle.textContent = titleText || "Your Skill Title";
    if (prevDesc) prevDesc.textContent = descText || "Description will appear here as you type...";
    if (prevCat) prevCat.textContent = category;
    if (prevTag) prevTag.textContent = tagsText ? tagsText : "Community Listing";

    const val = AppState.calculateAIPointValue(titleText, descText, category, tagsText);

    if (liveScoreEl) liveScoreEl.textContent = val.points;
    if (btnPointValEl) btnPointValEl.textContent = val.points;
    if (prevPoints) prevPoints.textContent = `+ ${val.points} Pts`;
    if (tierBadgeEl) tierBadgeEl.textContent = val.levelBadge;

    if (subComplexityEl) subComplexityEl.textContent = `Depth: ${val.complexityScore}/25`;
    if (subClarityEl) subClarityEl.textContent = `Clarity: ${val.clarityScore}/15`;
    if (subDemandEl) subDemandEl.textContent = `Demand: ${val.demandScore}/15`;

    if (reasoningEl) {
        if (!titleText) {
            reasoningEl.textContent = "Type a skill title and clear description to calculate verified reward points...";
        } else {
            reasoningEl.textContent = val.reasoning;
        }
    }

    if (tipsEl) {
        tipsEl.textContent = val.tips;
    }

    // Progress width: 20 pts (25%) -> 75 pts (100%)
    const pct = Math.min(100, Math.max(25, ((val.points - 20) / 55) * 75 + 25));
    if (meterFillEl) meterFillEl.style.width = `${pct}%`;
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

