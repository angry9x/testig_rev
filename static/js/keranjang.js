function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartContent.classList.add('hidden');
        if (clearCartBtn) clearCartBtn.classList.add('hidden');
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartContent.classList.remove('hidden');
    if (clearCartBtn) clearCartBtn.classList.remove('hidden');
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-md hover:shadow-xl hover:border-green-200 transition-all duration-300">
                <div class="flex flex-col sm:flex-row gap-6">
                    <!-- Image -->
                    <div class="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 group">
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                             onerror="this.src='/static/images/home.png'"/>
                        <div class="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ${item.quantity}x
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-2xl font-bold text-gray-900 hover:text-green-700 transition-colors">
                                    ${item.name}
                                </h3>
                                <button onclick="removeFromCart(${index})" 
                                        class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            <p class="text-green-700 text-xl font-bold mb-3">
                                Rp ${item.price.toLocaleString('id-ID')} <span class="text-sm text-gray-500">/ item</span>
                            </p>
                        </div>
                        
                        <!-- Quantity Controls & Total -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-sm">
                                <button onclick="updateQuantity(${index}, -1)" 
                                        class="px-4 py-3 hover:bg-red-100 hover:text-red-600 transition-all rounded-l-xl font-bold text-lg"
                                        ${item.quantity <= 1 ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
                                    <span class="material-symbols-outlined">remove</span>
                                </button>
                                <span class="w-16 text-center font-bold text-xl text-gray-900">${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)" 
                                        class="px-4 py-3 hover:bg-green-100 hover:text-green-600 transition-all rounded-r-xl font-bold text-lg"
                                        ${item.quantity >= (item.stock || 100) ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
                                    <span class="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            <div class="text-right">
                                <p class="text-sm text-gray-500 mb-1">Subtotal</p>
                                <p class="text-2xl font-bold text-green-700">Rp ${itemTotal.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    
    // Update summary
    const serviceCharge = 15000;
    const total = subtotal + serviceCharge;
    
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('total-items').textContent = totalItemsCount;
    document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('total-price').textContent = 'Rp ' + total.toLocaleString('id-ID');
    
    // Update navbar cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart[index]) {
        const newQuantity = cart[index].quantity + change;
        
        // Validation
        if (newQuantity < 1) {
            // Don't allow less than 1, show confirmation to remove
            removeFromCart(index);
            return;
        }
        
        if (newQuantity > (cart[index].stock || 100)) {
            if (typeof showToast === 'function') {
                showToast('Stok tidak mencukupi!', 'error');
            } else {
                alert('Stok tidak mencukupi!');
            }
            return;
        }
        
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show feedback
        if (typeof showToast === 'function') {
            showToast(`Quantity updated: ${cart[index].name}`, 'success');
        }
        
        loadCart();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart[index]) {
        const productName = cart[index].name;
        
        if (confirm(`Hapus "${productName}" dari keranjang?`)) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show feedback
            if (typeof showToast === 'function') {
                showToast(`${productName} dihapus dari keranjang`, 'success');
            }
            
            loadCart();
        }
    }
}

function clearAllCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) return;
    
    if (confirm(`Hapus semua ${cart.length} produk dari keranjang?`)) {
        localStorage.removeItem('cart');
        
        // Show feedback
        if (typeof showToast === 'function') {
            showToast('Keranjang dikosongkan', 'success');
        }
        
        loadCart();
    }
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Keranjang Anda kosong!', 'error');
        } else {
            alert('Keranjang Anda kosong!');
        }
        return;
    }
    
    // Save cart to session/backend before checkout
    window.location.href = "/checkout";
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadCart);
