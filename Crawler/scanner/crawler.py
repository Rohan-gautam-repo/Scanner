import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from scanner.utils import is_valid_url, get_domain
import json
import os
from datetime import datetime

class WebCrawler:
    def __init__(self, base_url):
        self.base_url = base_url
        self.visited = set()
        self.domain = get_domain(base_url)
        self.links = []
        self.results = {
            "base_url": base_url,
            "crawl_time": None,
            "total_links": 0,
            "links": []
        }

    def crawl(self, url=None):
        if url is None:
            url = self.base_url

        if url in self.visited:
            return

        print(f"[+] Crawling: {url}")
        self.visited.add(url)

        try:
            response = requests.get(url, timeout=5)
            if "text/html" not in response.headers.get("Content-Type", ""):
                return

            soup = BeautifulSoup(response.text, "html.parser")
            for tag in soup.find_all("a", href=True):
                link = urljoin(url, tag['href'])
                if is_valid_url(link, self.domain):
                    if link not in self.visited:
                        self.links.append(link)
                        self.crawl(link)

        except requests.RequestException as e:
            print(f"[-] Request failed: {e}")

    def get_links(self):
        return self.links

    def save_results(self):
        # Create reports directory if it doesn't exist
        os.makedirs("reports", exist_ok=True)
        
        # Update results dictionary
        self.results["crawl_time"] = datetime.now().isoformat()
        self.results["total_links"] = len(self.links)
        self.results["links"] = self.links

        # Save to JSON file
        output_file = "reports/output.json"
        with open(output_file, "w") as f:
            json.dump(self.results, f, indent=4)
        
        print(f"[+] Results saved to {output_file}")
