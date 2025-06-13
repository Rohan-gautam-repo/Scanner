from flask import Flask, request, render_template_string, jsonify
import sqlite3
import os

app = Flask(__name__)

# Create a simple database
def init_db():
    db_path = 'database.db'
    if not os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute('''CREATE TABLE users
                    (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)''')
        # Add some test data
        c.execute("INSERT INTO users (username, password, email) VALUES ('admin', 'admin123', 'admin@test.com')")
        c.execute("INSERT INTO users (username, password, email) VALUES ('user1', 'pass123', 'user1@test.com')")
        conn.commit()
        conn.close()

# Initialize database
init_db()

# HTML template for the main page
MAIN_PAGE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Test Application</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .form-section { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
        .nav-links { margin: 20px 0; }
        .nav-links a { margin-right: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Test Application</h1>
        
        <div class="nav-links">
            <a href="/">Home</a>
            <a href="/search">Search</a>
            <a href="/profile">Profile</a>
            <a href="/admin">Admin</a>
        </div>

        <div class="form-section">
            <h2>Login Form</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username">
                <input type="password" name="password" placeholder="Password">
                <input type="submit" value="Login">
            </form>
        </div>

        <div class="form-section">
            <h2>Search Users</h2>
            <form action="/search" method="GET">
                <input type="text" name="query" placeholder="Search users...">
                <input type="submit" value="Search">
            </form>
        </div>

        <div class="form-section">
            <h2>User Profile</h2>
            <form action="/profile" method="GET">
                <input type="text" name="id" placeholder="Enter user ID">
                <input type="submit" value="View Profile">
            </form>
        </div>

        <div class="form-section">
            <h2>Register</h2>
            <form action="/register" method="POST">
                <input type="text" name="username" placeholder="Username">
                <input type="password" name="password" placeholder="Password">
                <input type="email" name="email" placeholder="Email">
                <input type="submit" value="Register">
            </form>
        </div>

        <div class="form-section">
            <h2>Admin Panel</h2>
            <form action="/admin" method="POST">
                <input type="text" name="admin_id" placeholder="Admin ID">
                <input type="password" name="admin_pass" placeholder="Admin Password">
                <input type="submit" value="Access Admin Panel">
            </form>
        </div>

        <div class="form-section">
            <h2>Update Profile</h2>
            <form action="/update_profile" method="POST">
                <input type="text" name="user_id" placeholder="User ID">
                <input type="text" name="new_email" placeholder="New Email">
                <input type="submit" value="Update">
            </form>
        </div>
    </div>
</body>
</html>
'''

@app.route('/')
def home():
    return render_template_string(MAIN_PAGE)

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        user = c.fetchone()
        conn.close()
        
        if user:
            return f"Welcome {user[1]}!"
        else:
            return "Invalid credentials"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    
    # Vulnerable to SQL injection
    sql_query = f"SELECT * FROM users WHERE username LIKE '%{query}%' OR email LIKE '%{query}%'"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(sql_query)
        users = c.fetchall()
        conn.close()
        
        return jsonify([{"id": u[0], "username": u[1], "email": u[3]} for u in users])
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/profile', methods=['GET'])
def profile():
    user_id = request.args.get('id', '')
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE id={user_id}"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        user = c.fetchone()
        conn.close()
        
        if user:
            return f"User Profile:<br>ID: {user[0]}<br>Username: {user[1]}<br>Email: {user[3]}"
        else:
            return "User not found"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    email = request.form.get('email', '')
    
    # Vulnerable to SQL injection
    query = f"INSERT INTO users (username, password, email) VALUES ('{username}', '{password}', '{email}')"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        conn.commit()
        conn.close()
        return "Registration successful!"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/admin', methods=['POST'])
def admin():
    admin_id = request.form.get('admin_id', '')
    admin_pass = request.form.get('admin_pass', '')
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE id={admin_id} AND password='{admin_pass}'"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        admin = c.fetchone()
        conn.close()
        
        if admin:
            return "Welcome to Admin Panel!"
        else:
            return "Access Denied"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/update_profile', methods=['POST'])
def update_profile():
    user_id = request.form.get('user_id', '')
    new_email = request.form.get('new_email', '')
    
    # Vulnerable to SQL injection
    query = f"UPDATE users SET email='{new_email}' WHERE id={user_id}"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        conn.commit()
        conn.close()
        return "Profile updated successfully!"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True, port=5000) 