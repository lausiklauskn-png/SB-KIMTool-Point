// fx.js — gemeinsame Optik-Effekte fuer alle Seiten. Pure Browser, keine
// Abhaengigkeiten, offline. Aktuell: Scroll-Reveal (Elemente mit [data-reveal]
// blenden beim Sichtbarwerden ein). Respektiert prefers-reduced-motion und
// degradiert ohne IntersectionObserver sauber (alles sofort sichtbar).
(function () {
  const reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((e) => io.observe(e));
})();
