# Vulnerable Test Application

This is a simple Flask application with intentionally vulnerable endpoints for testing SQL injection scanners.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

The application will be available at http://localhost:5000

## Vulnerable Endpoints

1. Login Form (POST /login)
   - Parameters: username, password
   - Vulnerable to SQL injection

2. Search Users (GET /search)
   - Parameter: query
   - Vulnerable to SQL injection

3. User Profile (GET /profile)
   - Parameter: id
   - Vulnerable to SQL injection

4. Register (POST /register)
   - Parameters: username, password
   - Vulnerable to SQL injection

## Test Cases

Here are some SQL injection payloads you can test:

1. Login bypass:
```
username: admin' OR '1'='1
password: anything
```

2. Search injection:
```
query: ' UNION SELECT id, username, password FROM users--
```

3. Profile injection:
```
id: 1 OR 1=1
```

4. Register injection:
```
username: test' OR '1'='1
password: test' OR '1'='1
``` 