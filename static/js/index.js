// Typing animation
const phrases = ['Petik Melon Segar', 'Rasa Premium', 'Langsung dari Kebun'];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typing-text');
function type() {
    const word = phrases[pi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);
    if (!deleting && ci === word.length) { setTimeout(() => deleting = true, 1800); }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    setTimeout(type, deleting ? 60 : 100);
}
type();

// Parallax hero
window.addEventListener('scroll', () => {
    const bg = document.getElementById('hero-bg');
    if (bg) bg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.2}px)`;
});

// Animated counter
const counters = document.querySelectorAll('.counter-num');
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + (el.dataset.suffix || (el.nextElementSibling?.textContent.includes('%') ? '' : '+'));
            if (current >= target) { el.textContent = target + (el.nextElementSibling?.textContent.includes('%') ? '' : '+'); clearInterval(timer); }
        }, 20);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));
