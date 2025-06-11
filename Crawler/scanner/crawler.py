# crawler/crawler.py

import threading
from queue import Queue
from urllib.parse import urljoin
from utils import is_same_domain, is_valid_link
from scanner.forms import extract_forms
from scanner.session import CustomSession
from bs4 import BeautifulSoup
from tldextract import extract

class WebCrawler:
    def __init__(self, base_url):
        self.base_url = base_url
        self.visited = set()
        self.queue = Queue()
        self.queue.put(base_url)
        self.domain = extract(base_url).registered_domain
        self.session = CustomSession()
        self.found_links = []
        self.found_forms = {}

    def crawl(self):
        while not self.queue.empty():
            url = self.queue.get()
            if url in self.visited:
                continue

            self.visited.add(url)
            print(f"[Crawling] {url}")
            response = self.session.get(url)

            if response is None or 'text/html' not in response.headers.get("Content-Type", ""):
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            # Extract <a> hrefs
            for tag in soup.find_all("a", href=True):
                link = urljoin(url, tag['href'])
                if is_same_domain(self.base_url, link) and link not in self.visited:
                    if is_valid_link(link):
                        self.queue.put(link)
                        self.found_links.append(link)

            # Extract <form> tags
            forms = extract_forms(response.text)
            if forms:
                self.found_forms[url] = forms

    def get_links(self):
        return list(set(self.found_links))

    def get_forms(self):
        return self.found_forms
