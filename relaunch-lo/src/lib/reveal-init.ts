// This script initializes the intersection observer for reveal animations
// It's similar to what was in the HTML prototype

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all elements with the .reveal class
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

export {};
