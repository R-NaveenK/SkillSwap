/**
 * SkillSwap Dedicated AI Tutor Page Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    setupAiPageEvents();
    updateUserDisplay();

    window.addEventListener("skillswap:statechange", () => {
        updateUserDisplay();
    });
});

function setupAiPageEvents() {
    const pinnedItems = AppState.getPinnedItems();
    const pinBadge = document.getElementById("sidebarPinCount");
    if (pinBadge) pinBadge.textContent = pinnedItems.length;

    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("aiChatForm");
    const chatInput = document.getElementById("aiChatInput");
    const sendBtn = document.getElementById("aiSendBtn");
    const clearBtn = document.getElementById("clearChatBtn");
    const exportBtn = document.getElementById("exportChatBtn");
    const promptChips = document.querySelectorAll(".prompt-chip");

    // Handle Quick Prompt Clicks
    promptChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.dataset.prompt;
            if (promptText && chatInput) {
                chatInput.value = promptText;
                chatInput.focus();
            }
        });
    });

    // Handle Clear Chat
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="message ai-message">
                        <div class="message-avatar">AI</div>
                        <div class="message-content">
                            <strong>SkillSwap AI Assistant</strong>
                            <p>Chat history cleared. Ask any technical question to begin a new session.</p>
                        </div>
                    </div>
                `;
            }
        });
    }

    // Handle Export Chat Transcript
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const messages = document.querySelectorAll(".chat-messages .message");
            let transcript = "=== SkillSwap AI Learning Transcript ===\n\n";
            messages.forEach(m => {
                const author = m.querySelector("strong")?.textContent || "User";
                const body = m.querySelector("p")?.innerText || "";
                transcript += `[${author}]\n${body}\n\n`;
            });

            const blob = new Blob([transcript], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `SkillSwap_Transcript_${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            if (window.AppState) AppState.showToast("Chat transcript exported successfully.");
        });
    }

    // Handle Chat Form Submission
    if (chatForm) {
        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userPrompt = chatInput.value.trim();
            if (!userPrompt) return;

            const user = AppState.getUser();

            // Append User Message to Chat
            appendMessage("user", user.username, userPrompt);
            chatInput.value = "";

            // Show Loading Indicator
            const loadingMsg = appendMessage("ai", "SkillSwap AI Assistant", "Generating technical response...");
            sendBtn.disabled = true;
            sendBtn.textContent = "Processing...";

            try {
                const aiReply = await AppState.askGroqAI(
                    userPrompt,
                    "You are SkillSwap AI Assistant, a professional and expert software engineering tutor. Provide clean, clear, well-structured responses with code snippets when appropriate."
                );

                // Update Loading Message with AI Reply
                if (loadingMsg) {
                    const contentElement = loadingMsg.querySelector("p");
                    if (contentElement) {
                        contentElement.innerHTML = formatMarkdownResponse(aiReply);
                        attachCopyListeners(loadingMsg);
                    }
                }
            } catch (err) {
                console.error(err);
                if (loadingMsg) {
                    const contentElement = loadingMsg.querySelector("p");
                    if (contentElement) {
                        contentElement.textContent = `Error querying AI Assistant: ${err.message}. Please try again.`;
                    }
                }
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send Question";
                scrollToBottom();
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

function appendMessage(sender, senderName, text) {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return null;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const avatarSymbol = sender === 'user' ? (AppState.getUser().username.charAt(0).toUpperCase()) : 'AI';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarSymbol}</div>
        <div class="message-content">
            <strong>${senderName}</strong>
            <p>${formatMarkdownResponse(text)}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    attachCopyListeners(messageDiv);
    scrollToBottom();
    return messageDiv;
}

function formatMarkdownResponse(text) {
    if (!text) return "";
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Convert ```code``` blocks
    formatted = formatted.replace(/```(?:([a-zA-Z0-9]+)\n)?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || "code";
        return `
            <div class="code-block-wrapper" style="margin: 12px 0; background: #0f172a; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden;">
                <div class="code-header" style="background: rgba(30,41,59,0.9); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8;">
                    <span>${language}</span>
                    <button class="chat-copy-code-btn" style="background: rgba(255,255,255,0.15); border: none; color: #fff; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 700;">Copy Code</button>
                </div>
                <pre style="margin: 0; padding: 14px; overflow-x: auto;"><code style="font-family: 'Fira Code', monospace; color: #38bdf8; font-size: 13px;">${code.trim()}</code></pre>
            </div>
        `;
    });

    // Convert `code` inline
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: #38bdf8; font-family: monospace;">$1</code>');

    // Convert bullet lists
    formatted = formatted.replace(/^\s*[\-\*]\s+(.*)$/gm, '• $1');

    // Convert newlines
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

function attachCopyListeners(container) {
    const copyBtns = container.querySelectorAll(".chat-copy-code-btn");
    copyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const pre = btn.closest(".code-block-wrapper")?.querySelector("pre code");
            if (pre) {
                navigator.clipboard.writeText(pre.innerText);
                btn.textContent = "Copied";
                setTimeout(() => btn.textContent = "Copy Code", 2000);
            }
        });
    });
}

function scrollToBottom() {
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function updateUserDisplay() {
    const user = AppState.getUser();
    const points = AppState.getPoints();

    const userName = document.getElementById("userName");
    const chatUser = document.getElementById("chatUserName");
    const userAvatar = document.getElementById("userAvatar");
    const pointsVal = document.getElementById("pointsValue");
    const sidebarPts = document.getElementById("sidebarPoints");

    if (userName) userName.textContent = user.username;
    if (chatUser) chatUser.textContent = user.username;
    if (userAvatar) userAvatar.textContent = user.avatar || user.username.charAt(0);
    if (pointsVal) pointsVal.textContent = `${points} Points`;
    if (sidebarPts) sidebarPts.textContent = points;
}

