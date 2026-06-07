window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 500);
});

const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        hamburgerIcon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
        badge.classList.add('badge-pulse');
        setTimeout(() => badge.classList.remove('badge-pulse'), 400);
    } else {
        badge.classList.add('hidden');
    }
}
updateCartCount();

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    toast.className = `toast px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] ${type === 'success' ? 'bg-green-700' : 'bg-red-600'} text-white`;
    toastIcon.textContent = type === 'success' ? 'check_circle' : 'error';
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

const alerts = document.querySelectorAll('[role="alert"]');
alerts.forEach(alert => {
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 4000);
});
