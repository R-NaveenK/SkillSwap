/**
 * SkillSwap Signup Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    let selectedAvatar = "DEV";

    // Avatar selector
    const avatarBtns = document.querySelectorAll(".avatar-opt");
    avatarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            avatarBtns.forEach(b => {
                b.classList.remove("active");
            });
            btn.classList.add("active");
            selectedAvatar = btn.getAttribute("data-avatar") || "DEV";
        });
    });

    // Password visibility toggle
    const pwdInput = document.getElementById("password");
    const toggleBtn = document.getElementById("togglePwd");
    if (toggleBtn && pwdInput) {
        toggleBtn.addEventListener("click", () => {
            const isPassword = pwdInput.type === "password";
            pwdInput.type = isPassword ? "text" : "password";
            toggleBtn.textContent = isPassword ? "HIDE" : "SHOW";
        });
    }

    const form = document.getElementById("signupForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();

            if (!name || !email) return;

            const state = AppState.getState();
            state.user.username = name;
            state.user.email = email;
            state.user.points = 120; // 100 base + 20 signup bonus
            state.user.avatar = name.charAt(0).toUpperCase();
            AppState.saveState(state);

            AppState.showToast(`Welcome to SkillSwap, ${name}. 120 points bonus granted.`);
            setTimeout(() => {
                window.location.href = "../front/front.html";
            }, 800);
        });
    }
});
