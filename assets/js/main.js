/* =========================================================
   Мелкая логика страницы:
   - копирование ника Discord
   - появление блоков при скролле
   - актуальный год в футере
   ========================================================= */

(function () {
  "use strict";

  /* ---------- год ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- тост ---------- */

  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 1800);
  }

  /* ---------- копирование ---------- */

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }

    document.body.removeChild(area);
    return ok;
  }

  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", async function () {
      const text = el.getAttribute("data-copy") || "";
      if (!text) return;

      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch (error) {
          copied = fallbackCopy(text);
        }
      } else {
        copied = fallbackCopy(text);
      }

      toast(copied ? "ник скопирован" : "не получилось скопировать");
    });
  });

  /* ---------- появление при скролле ---------- */

  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const siblings = Array.from(el.parentElement.children).filter(function (node) {
        return node.classList && node.classList.contains("reveal");
      });
      const index = Math.max(0, siblings.indexOf(el));

      el.style.transitionDelay = Math.min(index * 70, 280) + "ms";
      el.classList.add("is-in");
      observer.unobserve(el);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach(function (el) { observer.observe(el); });
})();
