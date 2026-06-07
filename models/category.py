from app.models.database import execute_query

class Category:
    @staticmethod
    def get_all():
        """Get all categories"""
        query = "SELECT * FROM categories ORDER BY name ASC"
        return execute_query(query, fetch_all=True)
    
    @staticmethod
    def get_by_id(category_id):
        """Get category by ID"""
        query = "SELECT * FROM categories WHERE id = %s"
        return execute_query(query, (category_id,), fetch_one=True)
    
    @staticmethod
    def create(name, description=''):
        """Create new category"""
        query = "INSERT INTO categories (name, description) VALUES (%s, %s)"
        return execute_query(query, (name, description))
    
    @staticmethod
    def update(category_id, name, description=''):
        """Update category"""
        query = "UPDATE categories SET name = %s, description = %s WHERE id = %s"
        execute_query(query, (name, description, category_id))
        return True
    
    @staticmethod
    def delete(category_id):
        """Delete category"""
        query = "DELETE FROM categories WHERE id = %s"
        execute_query(query, (category_id,))
        return True
