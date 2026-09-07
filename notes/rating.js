/**
 * SkillSwap Learning Reader Engine (Code Copy, Ratings, Scroll Progress & Quiz)
 */

document.addEventListener("DOMContentLoaded", () => {
    initScrollProgress();
    initCodeBlocks();
    initRatingWidget();
    initKnowledgeQuiz();
});

// Scroll Progress Tracker
function initScrollProgress() {
    let bar = document.querySelector(".reading-progress-bar");
    if (!bar) {
        const container = document.createElement("div");
        container.className = "reading-progress-container";
        bar = document.createElement("div");
        bar.className = "reading-progress-bar";
        container.appendChild(bar);
        document.body.appendChild(container);
    }

    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

// Convert <code> blocks into copyable snippet boxes
function initCodeBlocks() {
    document.querySelectorAll("code").forEach((codeEl, index) => {
        if (codeEl.parentElement.tagName === "PRE" || codeEl.classList.contains("processed")) return;
        
        const text = codeEl.textContent;
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";

        wrapper.innerHTML = `
            <div class="code-header">
                <span>Code Snippet</span>
                <button class="copy-code-btn">Copy Code</button>
            </div>
            <pre><code>${escapeHTML(text)}</code></pre>
        `;

        const copyBtn = wrapper.querySelector(".copy-code-btn");
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = "Copied";
            setTimeout(() => copyBtn.textContent = "Copy Code", 2000);
        });

        codeEl.parentNode.replaceChild(wrapper, codeEl);
    });
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Rating System Widget
function initRatingWidget() {
    const stars = document.querySelectorAll(".rating-stars .rating-star, .stars span");
    const ratingText = document.getElementById("ratingText");

    stars.forEach((star, idx) => {
        star.addEventListener("click", () => {
            stars.forEach((s, i) => {
                if (i <= idx) s.classList.add("selected");
                else s.classList.remove("selected");
            });

            const score = idx + 1;
            if (ratingText) ratingText.textContent = `You rated this content ${score} / 5 Stars`;
            if (window.AppState) {
                AppState.showToast(`Thank you for rating (${score}/5 Stars).`);
            }
        });
    });
}

// Knowledge Quiz System
function initKnowledgeQuiz() {
    const quizOptions = document.querySelectorAll(".quiz-option-btn");
    quizOptions.forEach(option => {
        option.addEventListener("click", () => {
            const isCorrect = option.dataset.correct === "true";
            quizOptions.forEach(opt => opt.disabled = true);

            if (isCorrect) {
                option.classList.add("correct");
                if (window.AppState) {
                    AppState.updatePoints(10, "Quiz Completed Correctly!");
                }
            } else {
                option.classList.add("wrong");
                if (window.AppState) {
                    AppState.showToast("Incorrect choice. Try reviewing the notes above.", "error");
                }
            }
        });
    });
}
