import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import tldextract
import time

class WebCrawler:
    def __init__(self, base_url, max_depth=2, max_links=30, delay=0.5):
        self.base_url = base_url
        self.visited = set()
        self.domain = self.extract_domain(base_url)
        self.internal_links = []
        self.max_depth = max_depth
        self.max_links = max_links
        self.delay = delay

    def extract_domain(self, url):
        ext = tldextract.extract(url)
        return f"{ext.domain}.{ext.suffix}"

    def is_internal(self, url):
        return self.extract_domain(url) == self.domain

    def crawl(self, url=None, depth=0):
        if url is None:
            url = self.base_url

        if url in self.visited or depth > self.max_depth:
            return

        if len(self.internal_links) >= self.max_links:
            return

        self.visited.add(url)

        try:
            print(f"[*] Crawling ({depth}): {url}")
            response = requests.get(url, timeout=5)
            soup = BeautifulSoup(response.text, "html.parser")

            for link in soup.find_all("a", href=True):
                href = urljoin(url, link['href'])
                parsed_href = urlparse(href).scheme + "://" + urlparse(href).netloc + urlparse(href).path

                if self.is_internal(href) and parsed_href not in self.visited:
                    self.internal_links.append(parsed_href)
                    time.sleep(self.delay)
                    self.crawl(parsed_href, depth + 1)

        except Exception as e:
            print(f"[!] Error crawling {url}: {e}")

    def get_links(self):
        return list(set(self.internal_links))
