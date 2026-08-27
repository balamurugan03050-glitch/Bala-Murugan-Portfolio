/* ============================================================
   Bala Murugan — Portfolio script
   Vanilla JS: nav toggle, smooth scroll, reveal, back-to-top,
   loader, contact form validation + mailto, active nav state.
   ============================================================ */

(function () {
  "use strict";

  console.log("%cBala Murugan", "color:#00d4ff;font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;");
  console.log("%cElectrical & Electronics Engineering Portfolio", "color:#8a97b3;font-size:12px;");

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", function () {
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add("hidden");
    }, 600);
  });
  // Safety: hide loader even if 'load' already fired
  setTimeout(function () {
    if (loader && !loader.classList.contains("hidden")) {
      loader.classList.add("hidden");
    }
  }, 2500);

  /* ---------- Mobile navigation toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after clicking a nav link (not the resume button)
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Smooth scrolling for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", targetId);
    });
  });

  /* ---------- Header scroll state + back-to-top ---------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (backToTop) backToTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Active navigation state while scrolling ---------- */
  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (link) {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === id);
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "-20% 0px -40% 0px" }
    );
    sections.forEach(function (sec) {
      spy.observe(sec);
    });
  }

  /* ---------- Contact form validation + mailto ---------- */
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const TO_EMAIL = "balamurugan03050@gmail.com";

  if (form) {
    const fields = {
      cName: {
        el: form.querySelector("#cName"),
        validate: function (v) {
          return v.trim().length >= 2 ? "" : "Please enter your name.";
        },
      },
      cEmail: {
        el: form.querySelector("#cEmail"),
        validate: function (v) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(v.trim()) ? "" : "Please enter a valid email address.";
        },
      },
      cSubject: {
        el: form.querySelector("#cSubject"),
        validate: function (v) {
          return v.trim().length >= 2 ? "" : "Please enter a subject.";
        },
      },
      cMessage: {
        el: form.querySelector("#cMessage"),
        validate: function (v) {
          return v.trim().length >= 10 ? "" : "Please enter a message (10+ characters).";
        },
      },
    };

    function setError(key, msg) {
      const field = fields[key];
      if (!field || !field.el) return;
      const wrapper = field.el.closest(".form-field");
      const errEl = form.querySelector('.form-error[data-for="' + key + '"]');
      if (wrapper) wrapper.classList.toggle("invalid", !!msg);
      if (errEl) errEl.textContent = msg;
    }

    // Live clear on input
    Object.keys(fields).forEach(function (key) {
      const f = fields[key];
      if (f.el) {
        f.el.addEventListener("input", function () {
          if (f.validate(f.el.value) === "") setError(key, "");
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;

      Object.keys(fields).forEach(function (key) {
        const f = fields[key];
        const msg = f.validate(f.el ? f.el.value : "");
        setError(key, msg);
        if (msg) valid = false;
      });

      if (!valid) {
        const firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = fields.cName.el.value.trim();
      const email = fields.cEmail.el.value.trim();
      const subject = fields.cSubject.el.value.trim();
      const message = fields.cMessage.el.value.trim();

      const body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;

      const mailto =
        "mailto:" + TO_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      if (formSuccess) {
        formSuccess.hidden = false;
        form.reset();
        setTimeout(function () {
          formSuccess.hidden = true;
        }, 6000);
      }
    });
  }
})();
