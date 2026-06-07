import bcrypt
from app.models.database import execute_query

class User:
    @staticmethod
    def create(full_name, email, phone, password, role='customer'):
        """Create new user"""
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        query = """
            INSERT INTO users (full_name, email, phone, password_hash, role) 
            VALUES (%s, %s, %s, %s, %s)
        """
        return execute_query(query, (full_name, email, phone, password_hash, role))
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        query = "SELECT * FROM users WHERE email = %s"
        return execute_query(query, (email,), fetch_one=True)
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        query = "SELECT * FROM users WHERE id = %s"
        return execute_query(query, (user_id,), fetch_one=True)
    
    @staticmethod
    def verify_password(password, password_hash):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    @staticmethod
    def get_all_customers():
        """Get all customer users"""
        query = """
            SELECT id, full_name, email, phone, created_at 
            FROM users 
            WHERE role = 'customer' 
            ORDER BY created_at DESC
        """
        return execute_query(query, fetch_all=True)
    
    @staticmethod
    def count_customers():
        """Count total customers"""
        query = "SELECT COUNT(*) as total FROM users WHERE role = 'customer'"
        result = execute_query(query, fetch_one=True)
        return result['total'] if result else 0
