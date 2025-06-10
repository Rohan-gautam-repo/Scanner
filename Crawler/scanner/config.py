# crawler/config.py

import os

# Target settings
TARGET_DOMAIN    = os.getenv("TARGET_DOMAIN", "https://example.com")

# Scanning parameters
MAX_THREADS      = int(os.getenv("MAX_THREADS", 5))
REQUEST_TIMEOUT  = int(os.getenv("REQUEST_TIMEOUT", 10))  # seconds

# Authentication (placeholders)
LOGIN_URL        = os.getenv("LOGIN_URL", "")
USERNAME         = os.getenv("LOGIN_USER", "")
PASSWORD         = os.getenv("LOGIN_PASS", "")
