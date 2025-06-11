
from urllib.parse import urlparse
import tldextract

def get_domain(url):
    extracted = tldextract.extract(url)
    return f"{extracted.domain}.{extracted.suffix}"

def is_valid_url(url, domain):
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ["http", "https"]:
            return False
        if get_domain(url) != domain:
            return False
        if parsed.fragment:
            return False
        return True
    except Exception:
        return False
