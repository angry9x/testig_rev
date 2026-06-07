from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify, flash
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def index():
    return render_template('index.html')

@public_bp.route('/produk')
def produk():
    category_id = request.args.get('category')
    search = request.args.get('search')
    
    products = Product.get_all(category_id=category_id, search=search)
    categories = Category.get_all()
    all_out_of_stock = Product.all_out_of_stock()
    
    return render_template('produk.html', products=products, categories=categories, all_out_of_stock=all_out_of_stock)

@public_bp.route('/produk/<int:product_id>')
def detail_produk(product_id):
    product = Product.get_by_id(product_id)
    if not product:
        return redirect(url_for('public.produk'))
    
    return render_template('detail.html', product=product)

@public_bp.route('/keranjang')
def keranjang():
    return render_template('keranjang.html')

@public_bp.route('/checkout', methods=['GET', 'POST'])
def checkout():
    # WAJIB LOGIN - tidak ada guest checkout
    if 'user_id' not in session:
        flash('Anda harus login terlebih dahulu untuk melakukan pembelian', 'error')
        return redirect(url_for('auth.login'))
    
    if request.method == 'POST':
        # Get form data
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        address = request.form.get('address')
        city = request.form.get('city')
        postal_code = request.form.get('postal_code')
        payment_method = request.form.get('payment_method')
        
        # Get cart from localStorage (via JS)
        cart_json = request.form.get('cart_data')
        if cart_json:
            cart_items = json.loads(cart_json)
        else:
            cart_items = []
        
        if not cart_items:
            flash('Keranjang kosong', 'error')
            return redirect(url_for('public.keranjang'))
        
        # Calculate total
        total = sum(item['price'] * item['quantity'] for item in cart_items) + 15000
        
        # Create order (status: pending)
        user_id = session.get('user_id')
        order_id = Order.create(
            user_id, full_name, email, phone, address, city, postal_code,
            total, payment_method, cart_items
        )
        
        # Redirect to payment confirmation
        return redirect(url_for('public.payment_confirmation', order_id=order_id))
    
    # Auto-fill data if logged in
    user_data = {}
    if 'user_id' in session:
        user_data = {
            'full_name': session.get('user_name'),
            'email': session.get('user_email')
        }
    
    all_out_of_stock = Product.all_out_of_stock()
    return render_template('checkout.html', user_data=user_data, all_out_of_stock=all_out_of_stock)

@public_bp.route('/order/success/<int:order_id>')
def order_success(order_id):
    order = Order.get_by_id(order_id)
    return render_template('order_success.html', order=order)

@public_bp.route('/payment/confirm/<int:order_id>')
def payment_confirmation(order_id):
    order = Order.get_by_id(order_id)
    if not order:
        flash('Pesanan tidak ditemukan', 'error')
        return redirect(url_for('public.index'))
    
    # Check if user owns this order
    if order['user_id'] != session.get('user_id'):
        flash('Akses ditolak', 'error')
        return redirect(url_for('public.index'))
    
    return render_template('payment_confirmation.html', order=order)

@public_bp.route('/payment/upload/<int:order_id>', methods=['POST'])
def upload_payment_proof(order_id):
    order = Order.get_by_id(order_id)
    if not order:
        flash('Pesanan tidak ditemukan', 'error')
        return redirect(url_for('public.index'))
    
    # Check if user owns this order
    if order['user_id'] != session.get('user_id'):
        flash('Akses ditolak', 'error')
        return redirect(url_for('public.index'))
    
    # Handle file upload
    if 'payment_proof' not in request.files:
        flash('Tidak ada file yang diupload', 'error')
        return redirect(url_for('public.payment_confirmation', order_id=order_id))
    
    file = request.files['payment_proof']
    if file.filename == '':
        flash('Tidak ada file yang dipilih', 'error')
        return redirect(url_for('public.payment_confirmation', order_id=order_id))
    
    if file:
        # Generate filename
        filename = secure_filename(f"payment_{order_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
        upload_path = os.path.join('app/static/images/bukti_pembayaran', filename)
        
        # Create folder if not exists
        os.makedirs(os.path.dirname(upload_path), exist_ok=True)
        
        # Save file
        file.save(upload_path)
        
        # Update order notes with payment proof path
        payment_proof_path = f"/static/images/bukti_pembayaran/{filename}"
        user_notes = request.form.get('notes', '')
        
        # Format: PAYMENT_PROOF:path|NOTE:notes
        notes_data = f"PAYMENT_PROOF:{payment_proof_path}"
        if user_notes:
            notes_data += f"|NOTE:{user_notes}"
        
        Order.update_notes(order_id, notes_data)
        
        flash('Bukti pembayaran berhasil diupload! Pesanan Anda sedang diverifikasi.', 'success')
        
        # Clear guest session if guest
        if session.get('is_guest'):
            session.pop('is_guest', None)
        
        return redirect(url_for('public.order_success', order_id=order_id))
    
    flash('Gagal mengupload file', 'error')
    return redirect(url_for('public.payment_confirmation', order_id=order_id))

@public_bp.route('/riwayat')
def riwayat():
    if 'user_id' not in session:
        flash('Silakan login untuk melihat riwayat pembelian', 'error')
        return redirect(url_for('auth.login'))
    orders = Order.get_by_user(session['user_id'])
    return render_template('riwayat.html', orders=orders)

@public_bp.route('/tentang')
def tentang():
    return render_template('tentang.html')

@public_bp.route('/kontak')
def kontak():
    return render_template('kontak.html')

# API endpoints for cart management
@public_bp.route('/api/cart', methods=['POST'])
def api_add_to_cart():
    data = request.get_json()
    cart = session.get('cart', [])
    
    # Add or update item
    product_id = data.get('id')
    existing_item = next((item for item in cart if item['id'] == product_id), None)
    
    if existing_item:
        existing_item['quantity'] += data.get('quantity', 1)
    else:
        cart.append(data)
    
    session['cart'] = cart
    return jsonify({'success': True, 'cart_count': len(cart)})

@public_bp.route('/api/cart/<int:product_id>', methods=['DELETE'])
def api_remove_from_cart(product_id):
    cart = session.get('cart', [])
    cart = [item for item in cart if item['id'] != product_id]
    session['cart'] = cart
    return jsonify({'success': True})
