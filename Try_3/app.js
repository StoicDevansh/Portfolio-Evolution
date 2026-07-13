const body = document.body;
const pageTransition = document.getElementById("pageTransition");
const cursorGlow = document.getElementById("cursorGlow");
const scrollProgress = document.getElementById("scrollProgress");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

window.addEventListener("load", () => {
  requestAnimationFrame(() => body.classList.add("page-entered"));
});

window.addEventListener("beforeunload", () => {
  body.classList.add("is-exiting");
});

for (const link of document.querySelectorAll(".exit-link")) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    pageTransition.classList.add("active");
    setTimeout(() => {
      pageTransition.classList.remove("active");
      window.alert("Case study navigation is a demo in this template.");
    }, 520);
  });
}

for (const navLink of document.querySelectorAll(".nav-link")) {
  navLink.addEventListener("click", (event) => {
    event.preventDefault();
    const href = navLink.getAttribute("href");
    if (!href) {
      return;
    }
    const target = document.querySelector(href);
    if (!target) {
      return;
    }
    pageTransition.classList.add("active");
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      pageTransition.classList.remove("active");
    }, 260);
  });
}

window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    }
  },
  { threshold: 0.22 }
);

for (const item of document.querySelectorAll(".reveal")) {
  revealObserver.observe(item);
}

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;

  for (const layer of document.querySelectorAll(".parallax")) {
    const speed = Number(layer.dataset.speed || 0.1);
    const y = window.scrollY * speed;
    layer.style.transform = `translate3d(0, ${y}px, 0)`;
  }
});

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());

  if (!payload.name || !payload.email || !payload.budget || !payload.message) {
    formMessage.textContent = "Please fill all fields before sending.";
    return;
  }

  formMessage.textContent = "Sending...";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    form.reset();
    formMessage.textContent = "Inquiry sent successfully. Thank you.";
  } catch (error) {
    formMessage.textContent = "Could not send right now. Try again shortly.";
  }
});
