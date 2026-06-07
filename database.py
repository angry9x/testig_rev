import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Create and return database connection"""
    connection = pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'lanjar_mulia_db'),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )
    return connection

def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """Execute query with connection handling"""
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            
            if fetch_one:
                return cursor.fetchone()
            elif fetch_all:
                return cursor.fetchall()
            else:
                connection.commit()
                return cursor.lastrowid
    finally:
        connection.close()
