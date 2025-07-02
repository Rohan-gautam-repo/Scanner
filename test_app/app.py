from flask import Flask, request, render_template_string, jsonify, session, make_response
import sqlite3
import os
import time
import uuid

app = Flask(__name__)
app.secret_key = "insecure_secret_key_for_testing"  # Insecure secret key for testing

# Track login attempts for rate limiting test
login_attempts = {}
# Track form submissions for CSRF testing
form_submissions = []

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
            <a href="/echo">Echo Chamber</a>
            <a href="/reflected-xss">XSS Test</a>
            <a href="/dom-xss">DOM XSS</a>
            <a href="/advanced-xss">Advanced XSS</a>
            <a href="/template-injection">Template Injection</a>
            <a href="/chained-xss">Chained XSS</a>
            <a href="/settings">Settings</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/config">Config</a>
            <a href="/hidden">Hidden Area</a>
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
        
        <div class="form-section">
            <h2>Update Password (No CSRF Protection)</h2>
            <form action="/update_password" method="POST">
                <input type="text" name="user_id" placeholder="User ID">
                <input type="password" name="new_password" placeholder="New Password">
                <input type="submit" value="Change Password">
            </form>
        </div>
        
        <div class="form-section">
            <h2>Send Message (No Rate Limiting)</h2>
            <form action="/send_message" method="POST">
                <input type="text" name="recipient" placeholder="Recipient">
                <textarea name="message" placeholder="Your message"></textarea>
                <input type="submit" value="Send Message">
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
    
    # Track login attempts for rate limiting tests (no actual rate limiting)
    client_ip = request.remote_addr
    if client_ip not in login_attempts:
        login_attempts[client_ip] = []
    
    login_attempts[client_ip].append(time.time())
    
    # Set an insecure cookie on login attempt
    resp = make_response()
    resp.set_cookie('last_login', str(time.time()), httponly=False, secure=False)
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        user = c.fetchone()
        conn.close()
        
        if user:
            resp = make_response(f"Welcome {user[1]}!")
            # Set session cookie without proper flags
            resp.set_cookie('auth', f"user_id={user[0]}", max_age=3600, httponly=False, secure=False)
            return resp
        else:
            resp = make_response("Invalid credentials")
            return resp
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
        
        # XSS vulnerability: reflecting search term without sanitization
        result = f"<h2>Search Results for: {query}</h2><ul>"
        for u in users:
            result += f"<li>ID: {u[0]}, Username: {u[1]}, Email: {u[3]}</li>"
        result += "</ul>"
        
        return result
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
            # XSS vulnerability: directly reflecting user input without sanitization
            return f"User Profile:<br>ID: {user[0]}<br>Username: {user[1]}<br>Email: {user[3]}<br>Search History: {user_id}"
        else:
            return "User not found"
    except Exception as e:
        # XSS vulnerability: error message reflection
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

@app.route('/echo', methods=['GET', 'POST'])
def echo():
    """
    Endpoint that echoes back user input - intentionally vulnerable to XSS
    This demonstrates multiple XSS contexts:
    1. URL parameter reflection
    2. Form data reflection
    """
    user_input = request.args.get('text', '')
    form_input = request.form.get('text', '')
    
    # If form submitted, use that input instead
    if form_input:
        user_input = form_input
    
    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Echo Chamber - {user_input}</title>
    </head>
    <body>
        <h1>Echo Chamber</h1>
        <div>
            <form action="/echo" method="POST">
                <input type="text" name="text" value="{user_input}" placeholder="Enter text to echo">
                <input type="submit" value="Echo">
            </form>
        </div>
        
        <div class="result">
            <h2>You said:</h2>
            <p>{user_input}</p>
        </div>
        
        <div class="javascript-context">
            <script>
                // XSS vulnerability: user input in JavaScript context
                var userMessage = "{user_input}";
                document.write("<p>Echo from script: " + userMessage + "</p>");
            </script>
        </div>
        
        <div class="attribute-context">
            <!-- XSS vulnerability: user input in HTML attribute context -->
            <a href="{user_input}">Click me</a>
            <div style="color: {user_input}">Colored text</div>
            <img src="image.jpg" onmouseover="alert('{user_input}')" />
        </div>
    </body>
    </html>
    '''
    
    return html

@app.route('/reflected-xss', methods=['GET'])
def reflected_xss():
    """
    Endpoint with various reflected XSS vulnerabilities to test scanner detection
    """
    param1 = request.args.get('param1', '')
    param2 = request.args.get('param2', '')
    param3 = request.args.get('param3', '')
    
    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>XSS Test Page</title>
    </head>
    <body>
        <h1>XSS Test Page</h1>
        
        <!-- Direct injection in HTML context -->
        <div id="context1">{param1}</div>
        
        <!-- Injection in JavaScript string -->
        <script>
            var userInput = "{param2}";
            console.log(userInput);
        </script>
        
        <!-- Injection in HTML attribute -->
        <a href="{param3}">Click me</a>
        
        <!-- Form with vulnerable auto-fill -->
        <form action="/reflected-xss" method="GET">
            <input type="text" name="param1" value="{param1}" placeholder="Parameter 1">
            <input type="text" name="param2" value="{param2}" placeholder="Parameter 2">
            <input type="text" name="param3" value="{param3}" placeholder="Parameter 3">
            <input type="submit" value="Submit">
        </form>
    </body>
    </html>
    '''
    
    return html

@app.route('/dom-xss')
def dom_xss():
    """
    Endpoint demonstrating DOM-based XSS vulnerabilities
    """
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>DOM XSS Test</title>
    </head>
    <body>
        <h1>DOM-based XSS Test</h1>
        
        <div>
            <p>This page is vulnerable to DOM-based XSS attacks.</p>
            <p>Try adding ?name=&lt;script&gt;alert(1)&lt;/script&gt; to the URL.</p>
        </div>
        
        <div id="greeting"></div>
        
        <script>
            // Vulnerable DOM manipulation
            function getParameterByName(name) {
                var url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            }
            
            // Directly insert user input into DOM without sanitization
            var name = getParameterByName('name');
            if (name) {
                document.getElementById('greeting').innerHTML = 'Hello, ' + name + '!';
            }
        </script>
    </body>
    </html>
    '''

@app.route('/advanced-xss')
def advanced_xss():
    """
    Endpoint with more advanced XSS vulnerabilities including context-specific attacks
    and output encoding bypasses
    """
    user_input = request.args.get('input', '')
    context = request.args.get('context', 'html')
    
    # Set the selected option
    html_select = {
        'html': '',
        'js': '',
        'attr': '',
        'css': '',
        'url': '',
        'all': ''
    }
    
    if context in html_select:
        html_select[context] = 'selected'
    
    html_header = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Advanced XSS Testing</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .container {{ max-width: 800px; margin: 0 auto; }}
            .test-section {{ margin: 20px 0; padding: 20px; border: 1px solid #ccc; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Advanced XSS Testing</h1>
            
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/advanced-xss">Reset</a>
            </div>
            
            <form action="/advanced-xss" method="GET">
                <input type="text" name="input" value="{user_input}" placeholder="Enter payload">
                <select name="context">
                    <option value="html" {html_select['html']}>HTML Context</option>
                    <option value="js" {html_select['js']}>JavaScript Context</option>
                    <option value="attr" {html_select['attr']}>Attribute Context</option>
                    <option value="css" {html_select['css']}>CSS Context</option>
                    <option value="url" {html_select['url']}>URL Context</option>
                    <option value="all" {html_select['all']}>All Contexts</option>
                </select>
                <input type="submit" value="Test">
            </form>
            
            <div class="test-section">
    '''
    
    html_footer = '''
            </div>
        </div>
    </body>
    </html>
    '''
    
    html_content = html_header
    
    # Add context-specific vulnerable sections
    if context == 'html' or context == 'all':
        html_content += f'''
        <h2>HTML Context</h2>
        <div>Your input: {user_input}</div>
        '''
    
    if context == 'js' or context == 'all':
        html_content += f'''
        <h2>JavaScript Context</h2>
        <script>
            // Vulnerable JavaScript context
            var userInput = "{user_input}";
            document.write("<p>Echo from script: " + userInput + "</p>");
            
            // Another JavaScript vulnerability with different encoding context
            var jsonData = {{"userMessage": "{user_input}"}};
            console.log(jsonData);
        </script>
        '''
    
    if context == 'attr' or context == 'all':
        html_content += f'''
        <h2>Attribute Context</h2>
        <div data-user="{user_input}">Attribute data</div>
        <a href="{user_input}">Click me</a>
        <div onclick="console.log('{user_input}')">Click for attribute-based XSS</div>
        '''
    
    if context == 'css' or context == 'all':
        html_content += f'''
        <h2>CSS Context</h2>
        <style>
            .user-controlled {{
                color: {user_input};
            }}
            .another-test {{
                background-image: url("{user_input}");
            }}
        </style>
        <div class="user-controlled">CSS controlled text</div>
        '''
    
    if context == 'url' or context == 'all':
        html_content += f'''
        <h2>URL Context</h2>
        <iframe src="{user_input}" width="300" height="100"></iframe>
        <object data="{user_input}"></object>
        '''
    
    html_content += html_footer
    return html_content

@app.route('/template-injection')
def template_injection():
    """
    Endpoint demonstrating template injection vulnerabilities
    """
    name = request.args.get('name', 'Guest')
    template = request.args.get('template', 'Hello, {{ name }}!')
    
    # Vulnerable template - directly renders user-provided template string
    try:
        # Only import Jinja2 if installed
        try:
            from jinja2 import Template
            rendered = Template(template).render(name=name)
        except ImportError:
            rendered = f"Jinja2 not installed. Template would render: {template}"
        result = f"<p>Rendered result: {rendered}</p>"
    except Exception as e:
        result = f"<p>Error: {str(e)}</p>"
    
    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Template Injection Test</title>
    </head>
    <body>
        <h1>Template Injection Test</h1>
        
        <div>
            <p>This page is vulnerable to template injection attacks.</p>
            <p>Try using template parameters that execute code:</p>
            <code>?template={{{{ 7 * 7 }}}}</code>
        </div>
        
        <form action="/template-injection" method="GET">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value="{name}">
            <br>
            <label for="template">Template:</label>
            <input type="text" id="template" name="template" value="{template}" style="width: 300px;">
            <br>
            <input type="submit" value="Render">
        </form>
        
        <div>
            {result}
        </div>
        
        <div>
            <p>Try these templates:</p>
            <ul>
                <li><code>Hello, {{ name }}!</code> - Normal template</li>
                <li><code>{{ 7 * 7 }}</code> - Simple code execution</li>
                <li><code>{{ config }}</code> - Configuration leak</li>
                <li><code>{{ self.__class__.__mro__[1].__subclasses__() }}</code> - Class introspection</li>
            </ul>
        </div>
    </body>
    </html>
    '''
    
    return html

@app.route('/chained-xss')
def chained_xss():
    """
    Endpoint with multiple parameters that could lead to chained XSS attacks
    """
    user_id = request.args.get('id', '')
    action = request.args.get('action', '')
    redirect = request.args.get('redirect', '')
    token = request.args.get('token', '')
    
    html = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chained XSS Test</title>
        <script>
            // Vulnerable redirection with user input
            function processRedirect() {{
                var redirectUrl = "{redirect}";
                if (redirectUrl) {{
                    window.location = redirectUrl;
                }}
            }}
            
            // Vulnerable token handling
            var authToken = "{token}";
            localStorage.setItem("userToken", authToken);
            
            // Vulnerable action handling
            var userAction = "{action}";
            if (userAction) {{
                eval("perform" + userAction + "()");
            }}
            
            function performLogin() {{ console.log("Login action"); }}
            function performLogout() {{ console.log("Logout action"); }}
        </script>
    </head>
    <body>
        <h1>Chained XSS Vulnerabilities</h1>
        
        <div>
            <p>User ID: {user_id}</p>
            <p>Action: {action}</p>
            <p>Redirect: {redirect}</p>
            <p>Token: {token}</p>
        </div>
        
        <div>
            <button onclick="processRedirect()">Process Redirect</button>
        </div>
        
        <form action="/chained-xss" method="GET">
            <input type="text" name="id" value="{user_id}" placeholder="User ID">
            <input type="text" name="action" value="{action}" placeholder="Action">
            <input type="text" name="redirect" value="{redirect}" placeholder="Redirect URL">
            <input type="text" name="token" value="{token}" placeholder="Token">
            <input type="submit" value="Submit">
        </form>
    </body>
    </html>
    '''
    
    return html

# -------------- OWASP A01 - Broken Access Control --------------

@app.route('/admin', methods=['GET'])
def admin_get():
    """
    Admin panel - vulnerable to broken access control
    No authentication check on GET request
    """
    # Vulnerable: No authentication check
    users = []
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users")
        users = c.fetchall()
        conn.close()
    except Exception as e:
        return f"Error: {str(e)}"
    
    result = "<h1>Admin Panel</h1><h2>All Users:</h2><ul>"
    for user in users:
        result += f"<li>ID: {user[0]}, Username: {user[1]}, Password: {user[2]}, Email: {user[3]}</li>"
    result += "</ul>"
    
    return result

@app.route('/dashboard')
def dashboard():
    """Dashboard - vulnerable to broken access control"""
    # Vulnerable: No authentication check
    return """
    <h1>User Dashboard</h1>
    <p>Welcome to your dashboard!</p>
    <div>
        <h2>User Statistics</h2>
        <p>Posts: 15</p>
        <p>Comments: 42</p>
        <p>Likes: 120</p>
    </div>
    """

@app.route('/settings')
def settings():
    """Settings page - vulnerable to broken access control"""
    # Vulnerable: No authentication check
    return """
    <h1>User Settings</h1>
    <form method="POST" action="/update_settings">
        <label>Email notifications: <input type="checkbox" name="email_notify" checked></label><br>
        <label>Two-factor authentication: <input type="checkbox" name="2fa"></label><br>
        <label>Privacy level: 
            <select name="privacy">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
            </select>
        </label><br>
        <button type="submit">Save Settings</button>
    </form>
    """

@app.route('/config')
def config():
    """Config page - vulnerable to broken access control"""
    # Vulnerable: No authentication check
    return """
    <h1>Application Configuration</h1>
    <pre>
    {
      "database": {
        "host": "localhost",
        "user": "app_user",
        "password": "db_password_123",
        "name": "app_db"
      },
      "api_keys": {
        "google_maps": "AIzaSyDz8URW1-X_MJnTNAQEwrwwM0t9_1Abcde",
        "stripe": "sk_test_abcdefghijklmnopqrstuvwxyz123456789",
        "mailchimp": "abcdef1234567890abcdef1234567890-us20"
      },
      "email": {
        "smtp_server": "smtp.example.com",
        "smtp_port": 587,
        "username": "notifications@example.com",
        "password": "email_password_456"
      }
    }
    </pre>
    """

@app.route('/hidden')
def hidden():
    """Hidden page - vulnerable to broken access control"""
    # Vulnerable: No authentication check
    return """
    <h1>Hidden Features</h1>
    <p>This page contains development features that should not be accessible in production.</p>
    <ul>
        <li><a href="/debug">Debug Console</a></li>
        <li><a href="/phpinfo">PHP Info</a></li>
        <li><a href="/logs">Server Logs</a></li>
        <li><a href="/reset">Reset Database</a></li>
    </ul>
    """

# -------------- OWASP A04 - Insecure Design --------------

@app.route('/update_password', methods=['POST'])
def update_password():
    """Update password - vulnerable to CSRF (no CSRF token)"""
    user_id = request.form.get('user_id', '')
    new_password = request.form.get('new_password', '')
    
    # Record submission for CSRF testing
    form_submissions.append({
        'type': 'password_update',
        'user_id': user_id,
        'timestamp': time.time()
    })
    
    # Vulnerable to SQL injection too
    query = f"UPDATE users SET password='{new_password}' WHERE id={user_id}"
    
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute(query)
        conn.commit()
        conn.close()
        return "Password updated successfully!"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/send_message', methods=['POST'])
def send_message():
    """Send message - vulnerable to CSRF and no rate limiting"""
    recipient = request.form.get('recipient', '')
    message = request.form.get('message', '')
    
    # Record submission for rate limiting testing
    form_submissions.append({
        'type': 'message',
        'recipient': recipient,
        'timestamp': time.time()
    })
    
    # No rate limiting implemented
    return f"Message sent to {recipient}!"

@app.route('/update_settings', methods=['POST'])
def update_settings():
    """Update settings - vulnerable to CSRF (no CSRF token)"""
    # Record submission for CSRF testing
    form_submissions.append({
        'type': 'settings_update',
        'email_notify': request.form.get('email_notify', 'off'),
        'twofa': request.form.get('2fa', 'off'),
        'privacy': request.form.get('privacy', 'public'),
        'timestamp': time.time()
    })
    
    return "Settings updated successfully!"

# -------------- OWASP A02 - Cryptographic Failures --------------

@app.route('/set_insecure_cookie')
def set_insecure_cookie():
    """Set insecure cookies without proper flags"""
    resp = make_response("Cookie has been set! <a href='/'>Go back to home</a>")
    
    # Set cookie without Secure flag
    resp.set_cookie('session_id', str(uuid.uuid4()), httponly=False)
    
    # Set cookie without HttpOnly flag
    resp.set_cookie('user_pref', 'theme=dark', secure=False)
    
    # Set cookie without SameSite attribute
    resp.set_cookie('tracking', 'enabled', max_age=31536000)
    
    return resp

# -------------- Debug and Stats Routes --------------

@app.route('/debug/login_attempts')
def debug_login_attempts():
    """Debug endpoint to view login attempts"""
    return jsonify(login_attempts)

@app.route('/debug/form_submissions')
def debug_form_submissions():
    """Debug endpoint to view form submissions"""
    return jsonify(form_submissions)

@app.route('/debug/cookies')
def debug_cookies():
    """Debug endpoint to view cookies"""
    return jsonify(dict(request.cookies))

@app.route('/scanner-info')
def scanner_info():
    """Endpoint that provides information about the test app"""
    info = {
        "name": "Test Application for OWASP Top 10 Scanner",
        "version": "1.0.0",
        "vulnerabilities": [
            {
                "id": "A01",
                "name": "Broken Access Control",
                "endpoints": ["/admin", "/dashboard", "/settings", "/config", "/hidden"]
            },
            {
                "id": "A02",
                "name": "Cryptographic Failures",
                "endpoints": ["/login", "/set_insecure_cookie"]
            },
            {
                "id": "A04", 
                "name": "Insecure Design",
                "endpoints": ["/update_password", "/send_message", "/update_settings"]
            }
        ]
    }
    return jsonify(info)

if __name__ == '__main__':
    print("=" * 80)
    print("OWASP Top 10 Vulnerable Test Application")
    print("This app contains intentional vulnerabilities for testing the web scanner")
    print("Vulnerable endpoints include:")
    print("- A01 (Broken Access Control): /admin, /dashboard, /settings, /config, /hidden")
    print("- A02 (Cryptographic Failures): /login, /set_insecure_cookie")
    print("- A04 (Insecure Design): /update_password, /send_message, /update_settings")
    print("=" * 80)
    app.run(debug=True, port=5000, ssl_context=None)  # Deliberately not using HTTPS