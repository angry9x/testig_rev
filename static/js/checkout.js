function loadCheckoutSummary() {
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
                <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover" onerror="this.src='/static/images/home.webp'"/>
                <div class="flex-1">
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <span class="font-semibold">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });
    
    document.getElementById('order-summary').innerHTML = html;
    document.getElementById('checkout-subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('checkout-total').textContent = 'Rp ' + (subtotal + 15000).toLocaleString('id-ID');
}

document.addEventListener('DOMContentLoaded', loadCheckoutSummary);
