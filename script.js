(() => {
  "use strict";
  const data = window.portfolioData;
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("#nav-links");
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  };
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("is-open", open);
  });
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) closeMenu();
  });
  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });

  // All editable content is inserted as text, never interpreted as HTML.
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  document.querySelector("#project-title").textContent = data.project.title;
  data.project.description.forEach((text) =>
    document
      .querySelector("#project-description")
      .append(element("p", "", text)),
  );
  data.project.objectives.forEach((text) =>
    document
      .querySelector("#project-objectives")
      .append(element("li", "", text)),
  );

  const grid = document.querySelector("#certificate-grid");
  const filters = document.querySelector("#certificate-filters");
  const dialog = document.querySelector("#certificate-dialog");
  const previewImage = document.querySelector("#preview-image");
  const previewError = document.querySelector("#preview-error");
  let previewTrigger = null;
  let previewToken = 0;

  function openPreview(record, trigger) {
    previewTrigger = trigger;
    const token = ++previewToken;
    document.querySelector("#preview-title").textContent = record.title;
    previewImage.hidden = false;
    previewError.hidden = true;
    previewImage.alt = record.imageAlt || `${record.title} — ${record.issuer}`;
    previewImage.onerror = () => {
      if (token !== previewToken) return;
      previewImage.hidden = true;
      previewError.hidden = false;
    };
    previewImage.src = record.image;
    dialog.showModal();
    document.body.classList.add("preview-open");
    document.querySelector("#close-preview").focus();
  }
  document
    .querySelector("#close-preview")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [
      ...dialog.querySelectorAll('button, a[href], [tabindex="0"]'),
    ].filter((node) => !node.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("close", () => {
    previewToken++;
    document.body.classList.remove("preview-open");
    previewImage.removeAttribute("src");
    previewTrigger?.focus();
  });

  function renderCertificates(category = "all") {
    grid.replaceChildren();
    const records = data.certificates.filter(
      (record) => category === "all" || record.category === category,
    );
    records.forEach((record) => {
      const card = element("article", "certificate-card");
      const top = element("div", "certificate-card-top");
      const icon = element("span", "certificate-icon", "▤");
      icon.setAttribute("aria-hidden", "true");
      const categoryName =
        data.categories.find((item) => item.id === record.category)?.label ||
        record.category;
      top.append(icon, element("span", "certificate-category", categoryName));
      card.append(top);
      const bottom = element("div", "certificate-card-bottom");
      if (record.image) {
        const thumbnail = element("img", "certificate-thumbnail");
        thumbnail.alt = record.imageAlt || `${record.title} certificate`;
        thumbnail.loading = "lazy";
        const button = element(
          "button",
          "preview-button",
          "View certificate →",
        );
        button.type = "button";
        button.setAttribute("aria-label", `View certificate: ${record.title}`);
        button.setAttribute("aria-haspopup", "dialog");
        button.addEventListener("click", () => openPreview(record, button));
        thumbnail.addEventListener(
          "error",
          () => {
            thumbnail.remove();
            button.remove();
            bottom.replaceChildren(element("span", "", "Preview unavailable"));
          },
          { once: true },
        );
        thumbnail.src = record.image;
        card.append(thumbnail);
        bottom.append(button);
      } else {
        bottom.append(element("span", "", "Certificate image to follow"));
      }
      card.append(
        element("h3", "", record.title),
        element("p", "certificate-issuer", record.issuer),
      );
      // Dates are optional; only render well-formed calendar dates without timezone shifts.
      if (record.date && /^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
        const date = new Date(`${record.date}T00:00:00Z`);
        if (
          !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === record.date
        ) {
          const time = element(
            "time",
            "",
            new Intl.DateTimeFormat("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }).format(date),
          );
          time.dateTime = record.date;
          card.append(time);
        }
      }
      card.append(bottom);
      grid.append(card);
    });
    const label = data.categories.find((item) => item.id === category)?.label;
    document.querySelector("#results-count").textContent =
      `${records.length} ${records.length === 1 ? "record" : "records"}${category === "all" ? " across 5 learning providers" : ` · ${label}`}`;
  }
  data.categories.forEach((category) => {
    const button = element("button", "filter-button", category.label);
    button.type = "button";
    button.setAttribute("aria-controls", "certificate-grid");
    button.setAttribute("aria-pressed", String(category.id === "all"));
    button.addEventListener("click", () => {
      filters
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      renderCertificates(category.id);
    });
    filters.append(button);
  });
  renderCertificates();

  if ("IntersectionObserver" in window) {
    const sections = [...document.querySelectorAll("main > section[id]")];
    const links = [...navLinks.querySelectorAll("a")];
    const updateActiveLink = () => {
      const current =
        [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= 150) ||
        sections[0];
      links.forEach((link) => {
        if (link.hash === `#${current.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    let scheduled = false;
    window.addEventListener(
      "scroll",
      () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(() => {
          updateActiveLink();
          scheduled = false;
        });
      },
      { passive: true },
    );
    updateActiveLink();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("js-motion");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.05 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((node) => observer.observe(node));
    }
  }
})();
