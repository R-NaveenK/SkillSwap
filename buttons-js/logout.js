/**
 * SkillSwap Logout Module Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    const cancelBtn = document.getElementById("cancelLogout");
    const confirmBtn = document.getElementById("confirmLogout");

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "../front/front.html";
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            AppState.showToast("Signed out successfully.");
            setTimeout(() => {
                window.location.href = "../loginpage/login.html";
            }, 600);
        });
    }
});
