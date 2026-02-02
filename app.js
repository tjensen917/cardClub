const authModal = document.getElementById("auth-modal");
const openAuthButtons = [document.getElementById("open-auth"), document.getElementById("hero-cta")];
const closeAuthButton = document.getElementById("close-auth");
const tourButton = document.getElementById("tour-cta");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".auth-panel");
const recipientForm = document.getElementById("recipient-form");
const recipientList = document.getElementById("recipient-list");
const recipientCount = document.getElementById("recipient-count");

const storageKey = "cardclub_recipients";
const userKey = "cardclub_user";

const openAuthModal = () => {
  authModal.classList.add("active");
  authModal.setAttribute("aria-hidden", "false");
};

const closeAuthModal = () => {
  authModal.classList.remove("active");
  authModal.setAttribute("aria-hidden", "true");
};

openAuthButtons.forEach((button) => button.addEventListener("click", openAuthModal));
closeAuthButton.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

tourButton.addEventListener("click", () => {
  document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add("active");
  });
});

const loadRecipients = () => {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  renderRecipients(saved);
};

const renderRecipients = (recipients) => {
  recipientList.innerHTML = "";
  if (recipients.length === 0) {
    recipientList.innerHTML = '<p class="empty-state">Your saved recipients will appear here.</p>';
  } else {
    recipients
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((recipient) => {
        const card = document.createElement("div");
        card.className = "recipient-card";
        card.innerHTML = `
          <strong>${recipient.name}</strong>
          <span>${recipient.occasion} · ${recipient.tone}</span>
          <span>${recipient.sentiment}</span>
          <span>${recipient.colors}</span>
          <span>Occasion date: ${recipient.date}</span>
        `;
        recipientList.appendChild(card);
      });
  }
  recipientCount.textContent = `${recipients.length} recipient${recipients.length === 1 ? "" : "s"} saved`;
};

recipientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(recipientForm);
  const recipient = Object.fromEntries(formData.entries());
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  saved.push(recipient);
  localStorage.setItem(storageKey, JSON.stringify(saved));
  recipientForm.reset();
  renderRecipients(saved);
});

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const user = Object.fromEntries(formData.entries());
  localStorage.setItem(userKey, JSON.stringify(user));
  closeAuthModal();
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const user = Object.fromEntries(formData.entries());
  localStorage.setItem(userKey, JSON.stringify(user));
  closeAuthModal();
});

loadRecipients();
