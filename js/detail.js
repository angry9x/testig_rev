let product = {};
let qty = 1;

function initProduct(productData) {
    product = productData;
}

function changeQty(delta) {
    const newQty = qty + delta;
    if (newQty < 1 || newQty > Math.min(product.stock, 20)) return;
    qty = newQty;
    const el = document.getElementById('qty-value');
    el.textContent = qty;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    const subtotal = product.price * qty;
    document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID', {maximumFractionDigits:0});
}

function addToCart() {
    // Check if user is logged in
    const isLoggedIn = document.body.dataset.userLoggedIn === 'true';
    
    if (!isLoggedIn) {
        if (typeof showToast === 'function') {
            showToast('Silakan login terlebih dahulu untuk menambahkan produk ke keranjang', 'error');
        }
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }
    
    const btn = document.getElementById('cart-btn');
    const btnText = document.getElementById('cart-btn-text');
    const icon = document.getElementById('cart-icon');

    btn.classList.add('loading');
    icon.textContent = 'hourglass_top';
    btnText.textContent = 'Menambahkan...';

    setTimeout(() => {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(i => i.id === product.id);
        if (existing) existing.quantity += qty;
        else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty, stock: product.stock });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        btn.style.background = 'linear-gradient(135deg, #15803d, #16a34a)';
        icon.textContent = 'check_circle';
        btnText.textContent = 'Ditambahkan!';
        btn.classList.remove('loading');

        if (typeof showToast === 'function') {
            showToast(`${qty}x ${product.name} ditambahkan ke keranjang!`);
        }

        setTimeout(() => {
            window.location.href = "/keranjang";
        }, 1200);
    }, 700);
}

function openImgModal() {
    const modal = document.getElementById('img-modal');
    modal.classList.remove('hidden');
    modal.style.opacity = '0';
    setTimeout(() => modal.style.opacity = '1', 10);
}

function closeImgModal() {
    const modal = document.getElementById('img-modal');
    modal.style.opacity = '0';
    setTimeout(() => modal.classList.add('hidden'), 300);
}

window.addEventListener('load', () => {
    const bar = document.getElementById('stock-bar');
    if (bar) {
        const pct = Math.min((bar.dataset.stock / bar.dataset.max) * 100, 100);
        setTimeout(() => bar.style.width = pct + '%', 300);
    }
});

document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeImgModal(); 
});
