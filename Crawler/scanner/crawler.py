# crawler/crawler.py

from typing import List
from crawler.session import ScannerSession

def discover_urls(start_url: str) -> List[str]:
    """
    Fetch start_url and return a list of linked URLs found on the page.
    """
    session = ScannerSession()
    response = session.get(start_url)
    html = response.text
    # TODO: parse <a href> and <form action> into URLs
    return []

def enqueue_url(url: str) -> None:
    """
    Add URL to the scanning queue (thread-safe).
    """
    # TODO: implement queue logic
    pass
