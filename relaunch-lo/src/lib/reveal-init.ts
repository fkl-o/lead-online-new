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
    { threshold: 0.1 }
  );

  // Alle .reveal-Elemente beobachten
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
