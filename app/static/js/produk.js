const cards = document.querySelectorAll('.product-card');
cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('in'), 80 * i);
});

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

const searchInput = document.getElementById('search-input');
let searchTimer;
searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        document.getElementById('search-form').submit();
    }, 600);
});
