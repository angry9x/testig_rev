// ============================================
// GLOBAL FUNCTIONS (dari main.js)
// ============================================

// Page loader
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hide');
        setTimeout(() => loader.remove(), 500);
    }
    
    // Clear cart if flag is set (after login/register)
    if (document.body.dataset.clearCart === 'true') {
        localStorage.removeItem('cart');
        updateCartCount();
    }
});

// Cursor glow
const glow = document.getElementById('cursor-glow');
if (glow) {
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Navbar scroll effect
const navbar = document.querySelector('nav');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
if (hamburger && mobileMenu && hamburgerIcon) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        hamburgerIcon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
    });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
            badge.classList.add('badge-pulse');
            setTimeout(() => badge.classList.remove('badge-pulse'), 400);
        } else {
            badge.classList.add('hidden');
        }
    }
}
updateCartCount();

// Toast notification
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');
    if (toast && toastMsg && toastIcon) {
        toast.className = `toast px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] ${type === 'success' ? 'bg-green-700' : 'bg-red-600'} text-white`;
        toastIcon.textContent = type === 'success' ? 'check_circle' : 'error';
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

// Auto hide flash messages
const alerts = document.querySelectorAll('[role="alert"]');
alerts.forEach(alert => {
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 4000);
});

// ============================================
// INDEX PAGE (dari index.js)
// ============================================

if (document.getElementById('typing-text')) {
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
}

// Parallax hero
if (document.getElementById('hero-bg')) {
    window.addEventListener('scroll', () => {
        const bg = document.getElementById('hero-bg');
        if (bg) bg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.2}px)`;
    });
}

// Animated counter
const counters = document.querySelectorAll('.counter-num');
if (counters.length > 0) {
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
}

// ============================================
// PRODUK PAGE (dari produk.js)
// ============================================

const productCards = document.querySelectorAll('.product-card');
if (productCards.length > 0) {
    // Stagger card entrance
    productCards.forEach((card, i) => {
        setTimeout(() => card.classList.add('in'), 80 * i);
    });

    // 3D tilt on mouse move
    productCards.forEach(card => {
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
}

// Search with debounce
const searchInput = document.getElementById('search-input');
if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            document.getElementById('search-form').submit();
        }, 600);
    });
}

// ============================================
// DETAIL PAGE (dari detail.js)
// ============================================

let productDetail = {};
let qty = 1;

function initProduct(productData) {
    productDetail = productData;
}

function changeQty(delta) {
    const newQty = qty + delta;
    if (newQty < 1 || newQty > Math.min(productDetail.stock, 20)) return;
    qty = newQty;
    const el = document.getElementById('qty-value');
    if (el) {
        el.textContent = qty;
        el.classList.remove('bump');
        void el.offsetWidth;
        el.classList.add('bump');
        const subtotal = productDetail.price * qty;
        const subtotalEl = document.getElementById('subtotal');
        if (subtotalEl) {
            subtotalEl.textContent = 'Rp ' + subtotal.toLocaleString('id-ID', {maximumFractionDigits:0});
        }
    }
}

function addToCart() {
    const btn = document.getElementById('cart-btn');
    const btnText = document.getElementById('cart-btn-text');
    const icon = document.getElementById('cart-icon');

    if (btn && btnText && icon) {
        btn.classList.add('loading');
        icon.textContent = 'hourglass_top';
        btnText.textContent = 'Menambahkan...';

        setTimeout(() => {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(i => i.id === productDetail.id);
            if (existing) existing.quantity += qty;
            else cart.push({ id: productDetail.id, name: productDetail.name, price: productDetail.price, image: productDetail.image, quantity: qty });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            btn.style.background = 'linear-gradient(135deg, #15803d, #16a34a)';
            icon.textContent = 'check_circle';
            btnText.textContent = 'Ditambahkan!';
            btn.classList.remove('loading');

            if (typeof showToast === 'function') {
                showToast(`${qty}x ${productDetail.name} ditambahkan ke keranjang!`);
            }

            setTimeout(() => {
                window.location.href = "/keranjang";
            }, 1200);
        }, 700);
    }
}

function openImgModal() {
    const modal = document.getElementById('img-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.opacity = '0';
        setTimeout(() => modal.style.opacity = '1', 10);
    }
}

function closeImgModal() {
    const modal = document.getElementById('img-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// Stock bar animation
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

// ============================================
// KERANJANG PAGE (dari keranjang.js)
// ============================================

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        if (emptyCart) emptyCart.classList.remove('hidden');
        if (cartContent) cartContent.classList.add('hidden');
        return;
    }
    
    if (emptyCart) emptyCart.classList.add('hidden');
    if (cartContent) cartContent.classList.remove('hidden');
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:border-green-200 transition-colors">
                <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150'"/>
                </div>
                
                <div class="flex-1 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900">${item.name}</h3>
                            <p class="text-green-700 text-xl font-bold mt-1">Rp ${item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                            <button onclick="updateQuantity(${index}, -1)" class="px-3 py-2 hover:bg-gray-200 transition-colors">
                                <span class="material-symbols-outlined text-xl">remove</span>
                            </button>
                            <span class="w-12 text-center font-semibold">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" class="px-3 py-2 hover:bg-gray-200 transition-colors">
                                <span class="material-symbols-outlined text-xl">add</span>
                            </button>
                        </div>
                        <span class="font-semibold text-gray-900">Total: Rp ${itemTotal.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    
    const serviceCharge = 15000;
    const total = subtotal + serviceCharge;
    
    const totalItemsEl = document.getElementById('total-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalPriceEl = document.getElementById('total-price');
    
    if (totalItemsEl) totalItemsEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (subtotalEl) subtotalEl.textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    if (totalPriceEl) totalPriceEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    
    updateCartCount();
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function removeFromCart(index) {
    if (confirm('Hapus produk ini dari keranjang?')) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    window.location.href = "/checkout";
}

// Load cart on page load
if (document.getElementById('cart-items')) {
    document.addEventListener('DOMContentLoaded', loadCart);
}

// ============================================
// CHECKOUT PAGE (dari checkout.js)
// ============================================

function loadCheckoutSummary() {
    const orderSummary = document.getElementById('order-summary');
    if (!orderSummary) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        window.location.href = "/keranjang";
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="flex gap-3">
                <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/64'"/>
                <div class="flex-1">
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <span class="font-semibold">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });
    
    orderSummary.innerHTML = html;
    
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    if (totalEl) totalEl.textContent = 'Rp ' + (subtotal + 15000).toLocaleString('id-ID');
}

if (document.getElementById('order-summary')) {
    document.addEventListener('DOMContentLoaded', loadCheckoutSummary);
}

// ============================================
// LOGIN PAGE (dari login.js)
// ============================================

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.textContent = 'visibility_off';
        } else {
            passwordInput.type = 'password';
            toggleIcon.textContent = 'visibility';
        }
    }
}
