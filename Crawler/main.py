# main.py

import os
import json
from scanner.crawler import WebCrawler

def main():
    print("=== Web Application Vulnerability Scanner ===")
    start_url = input("Enter the URL to scan (e.g., https://example.com): ").strip()

    if not start_url.startswith("http://") and not start_url.startswith("https://"):
        print("[-] Invalid URL. It must start with http:// or https://")
        return

    crawler = WebCrawler(start_url)
    crawler.crawl()

    links = crawler.get_links()
    forms = crawler.get_forms()

    os.makedirs("reports", exist_ok=True)

    with open("reports/output.json", "w") as f:
        json.dump({
            "start_url": start_url,
            "links": links,
            "forms": forms
        }, f, indent=2)

    print(f"[+] Crawl completed. Results saved to reports/output.json")

if __name__ == "__main__":
    main()
