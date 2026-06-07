from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from functools import wraps
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order
from app.models.user import User
import os
import pandas as pd
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from io import BytesIO
from flask import send_file

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_role' not in session or session['user_role'] != 'admin':
            flash('Anda harus login sebagai admin', 'error')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/')
@admin_required
def dashboard():
    stats = {
        'total_products': Product.count_all(),
        'total_orders': Order.count_all(),
        'total_customers': User.count_customers(),
        'total_revenue': Order.get_total_revenue(),
        'pending_orders': Order.count_all('pending')
    }
    
    recent_orders = Order.get_recent_orders(5)
    low_stock_products = Product.get_low_stock(10)
    
    return render_template('admin/dashboard.html', 
                         stats=stats,
                         recent_orders=recent_orders,
                         low_stock_products=low_stock_products)

# Product Management
@admin_bp.route('/products')
@admin_required
def products():
    products = Product.get_all_admin()
    return render_template('admin/products.html', products=products)

@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required
def add_product():
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        stock = request.form.get('stock')
        image_url = ''
        category_ids = request.form.getlist('category_ids')

        # Handle image upload
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '':
                filename = secure_filename(f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
                upload_path = os.path.join('app/static/images', filename)
                file.save(upload_path)
                image_url = f"/static/images/{filename}"

        if not image_url:
            flash('Gambar produk harus diupload', 'error')
            categories = Category.get_all()
            return render_template('admin/product_form.html', categories=categories)

        Product.create(name, description, price, stock, image_url, category_ids)
        flash('Produk berhasil ditambahkan', 'success')
        return redirect(url_for('admin.products'))

    categories = Category.get_all()
    return render_template('admin/product_form.html', categories=categories)

@admin_bp.route('/products/edit/<int:product_id>', methods=['GET', 'POST'])
@admin_required
def edit_product(product_id):
    product = Product.get_by_id(product_id)

    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        stock = request.form.get('stock')
        image_url = product['image_url']  # Keep existing image
        category_ids = request.form.getlist('category_ids')

        # Handle image upload
        if 'image_file' in request.files:
            file = request.files['image_file']
            if file and file.filename != '':
                filename = secure_filename(f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
                upload_path = os.path.join('app/static/images', filename)
                file.save(upload_path)
                image_url = f"/static/images/{filename}"

        Product.update(product_id, name, description, price, stock, image_url, category_ids)
        flash('Produk berhasil diupdate', 'success')
        return redirect(url_for('admin.products'))

    categories = Category.get_all()
    # Build list of currently assigned category ids
    selected_ids = [int(i) for i in product['category_ids'].split(',')] if product and product.get('category_ids') else []
    return render_template('admin/product_form.html', product=product, categories=categories, selected_ids=selected_ids)

@admin_bp.route('/products/delete/<int:product_id>')
@admin_required
def delete_product(product_id):
    Product.delete(product_id)
    flash('Produk berhasil dihapus', 'success')
    return redirect(url_for('admin.products'))

# Order Management
@admin_bp.route('/orders')
@admin_required
def orders():
    status_filter = request.args.get('status')
    orders = Order.get_all(status=status_filter)
    return render_template('admin/orders.html', orders=orders)

@admin_bp.route('/orders/<int:order_id>')
@admin_required
def order_detail(order_id):
    order = Order.get_by_id(order_id)
    
    # Get payment proof and user notes
    payment_proof = Order.get_payment_proof(order)
    user_notes = Order.get_user_notes(order)
    cancel_reason = Order.get_cancel_reason(order)
    
    return render_template('admin/order_detail.html', 
                         order=order, 
                         payment_proof=payment_proof,
                         user_notes=user_notes,
                         cancel_reason=cancel_reason)

@admin_bp.route('/orders/<int:order_id>/update-status', methods=['POST'])
@admin_required
def update_order_status(order_id):
    status = request.form.get('status')
    cancel_reason = request.form.get('cancel_reason') if status == 'cancelled' else None
    Order.update_status(order_id, status, cancel_reason)
    flash('Status pesanan berhasil diupdate', 'success')
    
    if request.referrer and 'orders' in request.referrer and str(order_id) not in request.referrer:
        return redirect(url_for('admin.orders'))
    
    return redirect(url_for('admin.order_detail', order_id=order_id))

# Category Management
@admin_bp.route('/categories')
@admin_required
def categories():
    categories = Category.get_all()
    return render_template('admin/categories.html', categories=categories)

@admin_bp.route('/categories/add', methods=['POST'])
@admin_required
def add_category():
    name = request.form.get('name')
    description = request.form.get('description', '')
    Category.create(name, description)
    flash('Kategori berhasil ditambahkan', 'success')
    return redirect(url_for('admin.categories'))

@admin_bp.route('/categories/delete/<int:category_id>')
@admin_required
def delete_category(category_id):
    Category.delete(category_id)
    flash('Kategori berhasil dihapus', 'success')
    return redirect(url_for('admin.categories'))

# Reports & Analytics
@admin_bp.route('/reports')
@admin_required
def reports():
    # Basic statistics for reports
    total_sales = Order.get_total_revenue()
    orders_count = Order.count_all()
    completed_orders = Order.count_all('completed')
    pending_orders = Order.count_all('pending')
    
    # Get sales data for the last 7 days for a simple chart
    all_orders = Order.get_all()
    
    return render_template('admin/reports.html',
                         total_sales=total_sales,
                         orders_count=orders_count,
                         completed_orders=completed_orders,
                         pending_orders=pending_orders,
                         all_orders=all_orders)

@admin_bp.route('/reports/export')
@admin_required
def export_reports():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    orders = Order.get_all(start_date=start_date, end_date=end_date)
    
    if not orders:
        flash('Tidak ada data untuk periode ini', 'error')
        return redirect(url_for('admin.reports'))
        
    # Create DataFrame
    df = pd.DataFrame(orders)
    
    # Select and rename columns for better Excel output
    columns_to_export = {
        'id': 'Order ID',
        'full_name': 'Nama Customer',
        'email': 'Email',
        'phone': 'Telepon',
        'total_amount': 'Total (Rp)',
        'payment_method': 'Metode Pembayaran',
        'status': 'Status',
        'created_at': 'Tanggal'
    }
    
    df_export = df[list(columns_to_export.keys())].rename(columns=columns_to_export)
    
    # Format date
    df_export['Tanggal'] = df_export['Tanggal'].dt.strftime('%Y-%m-%d %H:%M:%S')
    
    # Create Excel in memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df_export.to_excel(writer, index=False, sheet_name='Laporan Pesanan')
    
    output.seek(0)
    
    return send_file(output, 
                     as_attachment=True, 
                     download_name=f"Laporan_Penjualan_{datetime.now().strftime('%Y%m%d')}.xlsx",
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
