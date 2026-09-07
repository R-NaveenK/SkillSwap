/**
 * SkillSwap Help & Support Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    setupHelpEvents();
    updateUserDisplay();

    window.addEventListener("skillswap:statechange", () => {
        updateUserDisplay();
    });
});

const SOLUTIONS = {
    login: {
        title: "Login & Account Troubleshooting",
        html: "<p>1. Ensure browser LocalStorage is enabled.</p><p>2. Verify backend connection at http://localhost:3000/api.</p><p>3. Reset profile state or re-enter credentials on the signup/login pages.</p>"
    },
    points: {
        title: "Points Balance Not Updating",
        html: "<p>1. Points are awarded automatically when joining projects (+50-150 pts) or posting skills (+30 pts).</p><p>2. If points desynchronize, reload the page to re-trigger local state sync.</p>"
    },
    course: {
        title: "Course Unlock Issues",
        html: "<p>1. Unlocking a course costs 20 Points.</p><p>2. Once unlocked, the course notes remain permanently accessible in your account.</p>"
    },
    project: {
        title: "Project Reward Payouts",
        html: "<p>1. Claim points rewards immediately by clicking 'Join Team' on available projects.</p><p>2. Create new projects to earn bonus posting points.</p>"
    },
    upload: {
        title: "Note & Resource Submission",
        html: "<p>1. Submit course notes using the 'Post Skill' interface.</p><p>2. Your submissions will be pinned to your dashboard and visible to peer learners.</p>"
    }
};

function setupHelpEvents() {
    const pinnedItems = AppState.getPinnedItems();
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    const issueBtns = document.querySelectorAll("#issueButtons .issue-btn");
    const solTitle = document.getElementById("solutionTitle");
    const solContent = document.getElementById("solutionContent");

    issueBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            issueBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const issueKey = btn.dataset.issue;
            if (SOLUTIONS[issueKey]) {
                solTitle.textContent = SOLUTIONS[issueKey].title;
                solContent.innerHTML = SOLUTIONS[issueKey].html;
            }
        });
    });

    const form = document.getElementById("supportForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            AppState.showToast("Support Ticket Submitted. Our team will contact you shortly.");
            form.reset();
        });
    }

    // GROQ AI TUTOR FORM HANDLER
    const aiForm = document.getElementById("aiTutorForm");
    const aiInput = document.getElementById("aiTutorInput");
    const aiSubmitBtn = document.getElementById("aiSubmitBtn");
    const aiBox = document.getElementById("aiResponseBox");
    const aiContent = document.getElementById("aiResponseContent");

    if (aiForm) {
        aiForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const prompt = aiInput.value.trim();
            if (!prompt) return;

            aiSubmitBtn.disabled = true;
            aiSubmitBtn.textContent = "Processing...";
            aiBox.style.display = "block";
            aiContent.textContent = "AI Assistant is analyzing your request...";

            try {
                const reply = await AppState.askGroqAI(
                    prompt,
                    "You are SkillSwap AI Assistant, a helpful and expert peer-learning AI tutor. Provide clean, clear, structured responses with markdown syntax."
                );
                aiContent.textContent = reply;
            } catch (err) {
                console.error(err);
                aiContent.textContent = `Error querying AI Assistant: ${err.message}. Please try again.`;
            } finally {
                aiSubmitBtn.disabled = false;
                aiSubmitBtn.textContent = "Ask AI Assistant";
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
