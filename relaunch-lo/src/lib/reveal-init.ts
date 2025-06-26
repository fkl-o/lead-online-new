// src/lib/reveal-init.ts

export function revealInit() {
  // Intersection Observer für .reveal-Elemente
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.05, rootMargin: '50px' } // Erweiterte Einstellungen für bessere Erkennung
  );

  // Alle .reveal-Elemente beobachten
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    // Elemente, die bereits im Viewport sind, sofort als sichtbar markieren
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
    observer.observe(el);
  });
}
