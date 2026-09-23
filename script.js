// 1. Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// 2. Mobile menu
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// 3. Highlight the nav link for the section on screen
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => observer.observe(s));

// 4. Hero pipeline: runs once on page load
const stages = document.querySelectorAll("#pipeline li");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentStage = 2; // Docker is where I'm working now (0 = Linux)

if (reduceMotion) {
  stages.forEach((li, i) => {
    if (i < currentStage) li.classList.add("done");
    if (i === currentStage) li.classList.add("current");
  });
} else {
  stages.forEach((li, i) => {
    if (i > currentStage) return;
    setTimeout(() => {
      li.classList.add(i === currentStage ? "current" : "done");
    }, 500 + i * 450);
  });
}

// 5. Learning steps: click to show details
const stepButtons = document.querySelectorAll(".step");
const stepInfo = document.getElementById("stepInfo");

stepButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    stepButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    stepInfo.textContent = btn.dataset.info;
  });
});

// 6. Contact form: check the fields, then open the visitor's email app
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const MY_EMAIL = "youremail@example.com"; // change this to your real email

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = ["name", "email", "message"].map((id) => document.getElementById(id));
  fields.forEach((f) => f.classList.remove("invalid"));
  statusEl.className = "form-status";

  const [nameEl, emailEl, messageEl] = fields;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());

  if (!nameEl.value.trim()) {
    nameEl.classList.add("invalid");
    statusEl.textContent = "Enter your name.";
    statusEl.classList.add("error");
    nameEl.focus();
    return;
  }
  if (!emailOk) {
    emailEl.classList.add("invalid");
    statusEl.textContent = "Enter a valid email address, like name@example.com.";
    statusEl.classList.add("error");
    emailEl.focus();
    return;
  }
  if (!messageEl.value.trim()) {
    messageEl.classList.add("invalid");
    statusEl.textContent = "Write a message before sending.";
    statusEl.classList.add("error");
    messageEl.focus();
    return;
  }

  const subject = encodeURIComponent("Portfolio message from " + nameEl.value.trim());
  const body = encodeURIComponent(messageEl.value.trim() + "\n\nReply to: " + emailEl.value.trim());
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;

  statusEl.textContent = "Opening your email app to send the message.";
  statusEl.classList.add("ok");
  form.reset();
});
