from app.models.database import execute_query

class Product:
    @staticmethod
    def get_all(category_id=None, search=None):
        query = """
            SELECT p.*,
                   GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') as category_name
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.is_available = TRUE
        """
        params = []

        if category_id:
            query += " AND pc.category_id = %s"
            params.append(category_id)

        if search:
            query += " AND (p.name LIKE %s OR p.description LIKE %s)"
            search_term = f"%{search}%"
            params.extend([search_term, search_term])

        query += " GROUP BY p.id ORDER BY p.created_at DESC"

        return execute_query(query, tuple(params) if params else None, fetch_all=True)

    @staticmethod
    def get_all_admin():
        """Get all products for admin (including unavailable)"""
        query = """
            SELECT p.*,
                   GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') as category_name
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            GROUP BY p.id ORDER BY p.created_at DESC
        """
        return execute_query(query, fetch_all=True)

    @staticmethod
    def get_by_id(product_id):
        query = """
            SELECT p.*,
                   GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') as category_name,
                   GROUP_CONCAT(c.id ORDER BY c.name SEPARATOR ',') as category_ids
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.id = %s
            GROUP BY p.id
        """
        return execute_query(query, (product_id,), fetch_one=True)

    @staticmethod
    def create(name, description, price, stock, image_url, category_ids):
        query = """
            INSERT INTO products (name, description, price, stock, image_url)
            VALUES (%s, %s, %s, %s, %s)
        """
        product_id = execute_query(query, (name, description, price, stock, image_url))
        if product_id and category_ids:
            for cid in category_ids:
                execute_query(
                    "INSERT INTO product_categories (product_id, category_id) VALUES (%s, %s)",
                    (product_id, cid)
                )
        return product_id

    @staticmethod
    def update(product_id, name, description, price, stock, image_url, category_ids):
        if image_url:
            execute_query(
                "UPDATE products SET name=%s, description=%s, price=%s, stock=%s, image_url=%s WHERE id=%s",
                (name, description, price, stock, image_url, product_id)
            )
        else:
            execute_query(
                "UPDATE products SET name=%s, description=%s, price=%s, stock=%s WHERE id=%s",
                (name, description, price, stock, product_id)
            )
        # Sync categories
        execute_query("DELETE FROM product_categories WHERE product_id = %s", (product_id,))
        if category_ids:
            for cid in category_ids:
                execute_query(
                    "INSERT INTO product_categories (product_id, category_id) VALUES (%s, %s)",
                    (product_id, cid)
                )
        return True

    @staticmethod
    def delete(product_id):
        execute_query("DELETE FROM products WHERE id = %s", (product_id,))
        return True

    @staticmethod
    def update_stock(product_id, quantity):
        execute_query("UPDATE products SET stock = stock - %s WHERE id = %s", (quantity, product_id))

    @staticmethod
    def all_out_of_stock():
        """Return True if all available products have stock = 0"""
        result = execute_query(
            "SELECT COUNT(*) as total FROM products WHERE is_available = TRUE AND stock > 0",
            fetch_one=True
        )
        return result['total'] == 0 if result else True

    @staticmethod
    def count_all():
        result = execute_query("SELECT COUNT(*) as total FROM products", fetch_one=True)
        return result['total'] if result else 0

    @staticmethod
    def get_low_stock(threshold=10):
        return execute_query(
            "SELECT * FROM products WHERE stock <= %s AND is_available = TRUE ORDER BY stock ASC",
            (threshold,), fetch_all=True
        )
