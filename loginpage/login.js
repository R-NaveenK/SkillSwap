/**
 * SkillSwap Login Logic
 */

document.addEventListener("DOMContentLoaded", () => {
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

    // Demo user buttons
    document.querySelectorAll(".demo-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const user = btn.getAttribute("data-user");
            const avatar = btn.getAttribute("data-avatar");
            const state = AppState.getState();
            state.user.username = user;
            state.user.avatar = avatar;
            AppState.saveState(state);
            AppState.showToast(`Logged in as ${user}.`);
            setTimeout(() => {
                window.location.href = "../front/front.html";
            }, 500);
        });
    });

    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("email").value.trim();
            if (!usernameInput) return;

            const name = usernameInput.includes("@") ? usernameInput.split("@")[0] : usernameInput;
            const state = AppState.getState();
            state.user.username = name;
            state.user.avatar = name.charAt(0).toUpperCase();
            AppState.saveState(state);

            AppState.showToast(`Welcome back, ${name}.`);
            setTimeout(() => {
                window.location.href = "../front/front.html";
            }, 600);
        });
    }
});
