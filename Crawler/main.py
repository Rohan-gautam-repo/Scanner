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
    print(f"\n[+] {len(links)} links discovered.")

    # Save results using the new method
    crawler.save_results()

if __name__ == "__main__":
    main()
