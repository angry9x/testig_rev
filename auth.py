from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.find_by_email(email)
        
        if user and User.verify_password(password, user['password_hash']):
            session['user_id'] = user['id']
            session['user_name'] = user['full_name']
            session['user_email'] = user['email']
            session['user_role'] = user['role']
            session['clear_cart'] = True  # Flag untuk clear cart di client
            
            if user['role'] == 'admin':
                return redirect(url_for('admin.dashboard'))
            else:
                return redirect(url_for('public.index'))
        else:
            flash('Email atau password salah', 'error')
    
    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        
        # Check if email already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            flash('Email sudah terdaftar', 'error')
            return redirect(url_for('auth.register'))
        
        # Create new user
        User.create(full_name, email, phone, password)
        
        # Auto login after register
        user = User.find_by_email(email)
        session['user_id'] = user['id']
        session['user_name'] = user['full_name']
        session['user_email'] = user['email']
        session['user_role'] = user['role']
        session['clear_cart'] = True  # Flag untuk clear cart di client
        
        flash('Registrasi berhasil!', 'success')
        return redirect(url_for('public.index'))
    
    return render_template('register.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('Anda telah logout', 'success')
    return redirect(url_for('public.index'))

@auth_bp.route('/guest-checkout')
def guest_checkout():
    # Guest checkout dihapus, redirect ke login
    flash('Silakan login atau daftar terlebih dahulu untuk melakukan pembelian', 'error')
    return redirect(url_for('auth.login'))
