from app.models.database import execute_query

class Order:
    @staticmethod
    def create(user_id, full_name, email, phone, address, city, postal_code, 
               total_amount, payment_method, cart_items):
        """Create new order with items"""
        # Insert order
        order_query = """
            INSERT INTO orders 
            (user_id, full_name, email, phone, shipping_address, city, postal_code, 
             total_amount, payment_method, status) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
        """
        order_id = execute_query(order_query, 
            (user_id, full_name, email, phone, address, city, postal_code, 
             total_amount, payment_method))
        
        # Insert order items
        for item in cart_items:
            # Calculate subtotal if not exists
            subtotal = item.get('subtotal', item['price'] * item['quantity'])
            
            item_query = """
                INSERT INTO order_items 
                (order_id, product_id, product_name, quantity, price, subtotal) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            execute_query(item_query, 
                (order_id, item['id'], item['name'], item['quantity'], 
                 item['price'], subtotal))
            
            # Update product stock
            from app.models.product import Product
            Product.update_stock(item['id'], item['quantity'])
        
        return order_id
    
    @staticmethod
    def get_all(status=None, start_date=None, end_date=None):
        """Get all orders with optional filtering"""
        query = """
            SELECT o.*, 
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o
            WHERE 1=1
        """
        params = []
        
        if status:
            query += " AND o.status = %s"
            params.append(status)
            
        if start_date:
            query += " AND DATE(o.created_at) >= %s"
            params.append(start_date)
            
        if end_date:
            query += " AND DATE(o.created_at) <= %s"
            params.append(end_date)
        
        query += " ORDER BY o.created_at DESC"
        
        return execute_query(query, tuple(params) if params else None, fetch_all=True)
    
    @staticmethod
    def get_by_id(order_id):
        """Get order by ID with items"""
        order_query = "SELECT * FROM orders WHERE id = %s"
        order = execute_query(order_query, (order_id,), fetch_one=True)
        
        if order:
            items_query = """
                SELECT oi.*, p.image_url 
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = %s
            """
            order['items'] = execute_query(items_query, (order_id,), fetch_all=True)
        
        return order
    
    @staticmethod
    def get_by_user(user_id):
        """Get orders by user ID"""
        query = """
            SELECT o.*,
                   (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o
            WHERE o.user_id = %s
            ORDER BY o.created_at DESC
        """
        return execute_query(query, (user_id,), fetch_all=True)
    
    @staticmethod
    def update_status(order_id, status, cancel_reason=None):
        """Update order status with optional cancel reason"""
        if status == 'cancelled' and cancel_reason:
            # Append cancel reason to existing notes
            order = execute_query("SELECT notes FROM orders WHERE id = %s", (order_id,), fetch_one=True)
            existing_notes = order['notes'] if order and order['notes'] else ''
            separator = '|' if existing_notes else ''
            new_notes = existing_notes + separator + f"CANCEL_REASON:{cancel_reason}"
            execute_query("UPDATE orders SET status = %s, notes = %s WHERE id = %s", (status, new_notes, order_id))
        else:
            execute_query("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
        return True

    @staticmethod
    def get_cancel_reason(order):
        """Extract cancel reason from notes"""
        if not order or not order.get('notes'):
            return None
        for part in order['notes'].split('|'):
            if part.startswith('CANCEL_REASON:'):
                return part.replace('CANCEL_REASON:', '')
        return None
    
    @staticmethod
    def count_all(status=None):
        """Count total orders"""
        if status:
            query = "SELECT COUNT(*) as total FROM orders WHERE status = %s"
            result = execute_query(query, (status,), fetch_one=True)
        else:
            query = "SELECT COUNT(*) as total FROM orders"
            result = execute_query(query, fetch_one=True)
        return result['total'] if result else 0
    
    @staticmethod
    def get_total_revenue():
        """Get total revenue from completed orders"""
        query = """
            SELECT COALESCE(SUM(total_amount), 0) as total 
            FROM orders 
            WHERE status = 'completed'
        """
        result = execute_query(query, fetch_one=True)
        return result['total'] if result else 0
    
    @staticmethod
    def get_recent_orders(limit=5):
        """Get recent orders"""
        query = """
            SELECT o.id, o.full_name, o.total_amount, o.status, o.created_at
            FROM orders o
            ORDER BY o.created_at DESC
            LIMIT %s
        """
        return execute_query(query, (limit,), fetch_all=True)
    
    @staticmethod
    def update_notes(order_id, notes):
        """Update order notes (digunakan untuk payment proof)"""
        query = "UPDATE orders SET notes = %s WHERE id = %s"
        execute_query(query, (notes, order_id))
        return True
    
    @staticmethod
    def get_payment_proof(order):
        """Extract payment proof path from notes"""
        if not order or not order.get('notes'):
            return None
        
        notes = order['notes']
        if 'PAYMENT_PROOF:' in notes:
            parts = notes.split('|')
            for part in parts:
                if part.startswith('PAYMENT_PROOF:'):
                    return part.replace('PAYMENT_PROOF:', '')
        return None
    
    @staticmethod
    def get_user_notes(order):
        """Extract user notes from notes field"""
        if not order or not order.get('notes'):
            return ''
        
        notes = order['notes']
        if 'NOTE:' in notes:
            parts = notes.split('|')
            for part in parts:
                if part.startswith('NOTE:'):
                    return part.replace('NOTE:', '')
        return ''
