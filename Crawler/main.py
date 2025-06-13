# main.py

import os
import json
import argparse
import logging
from scanner.crawler import WebCrawler

def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    log_level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Web Application Vulnerability Scanner')
    parser.add_argument('--url', help='URL to scan (e.g., https://example.com)')
    parser.add_argument('--threads', type=int, default=5, help='Number of crawling threads')
    parser.add_argument('--login-url', help='Login URL for authentication')
    parser.add_argument('--login-user', help='Username for authentication')
    parser.add_argument('--login-pass', help='Password for authentication')
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    args = parser.parse_args()

    # Setup logging
    setup_logging(args.verbose)
    logger = logging.getLogger('scanner.main')

    # Get URL to scan
    start_url = args.url
    if not start_url:
        start_url = input("Enter the URL to scan (e.g., https://example.com): ").strip()

    if not start_url.startswith("http://") and not start_url.startswith("https://"):
        logger.error("Invalid URL. It must start with http:// or https://")
        return

    # Initialize crawler
    crawler = WebCrawler(start_url)
    
    # Set number of threads
    crawler.max_threads = args.threads
    
    # Handle authentication if provided
    if args.login_url and args.login_user and args.login_pass:
        logger.info(f"Attempting to login as {args.login_user}")
        if crawler.session.login(args.login_url, args.login_user, args.login_pass):
            logger.info("Login successful")
        else:
            logger.warning("Login failed, continuing without authentication")

    logger.info("Starting crawl and vulnerability scan...")
    links, forms, vulnerable_points = crawler.crawl()

    logger.info(f"Scan completed!")
    logger.info(f"Discovered {len(links)} links")
    logger.info(f"Found {len(forms)} forms")
    logger.info(f"Identified {len(vulnerable_points)} potentially vulnerable points")

    # Create reports directory if it doesn't exist
    os.makedirs("reports", exist_ok=True)

    # Save results
    results = {
        "start_url": start_url,
        "links": links,
        "forms": forms,
        "vulnerable_points": vulnerable_points
    }

    output_path = "reports/output.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

    logger.info(f"Results saved to: {output_path}")

    # Print vulnerable points summary
    if vulnerable_points:
        logger.info("\nPotentially vulnerable points found:")
        for point in vulnerable_points:
            logger.info(f"\nURL: {point['url']}")
            logger.info(f"Method: {point['method']}")
            logger.info(f"Parameter: {point['parameter']}")
            logger.info("Successful payloads:")
            for payload in point['payloads']:
                logger.info(f"  - {payload['payload']}")

if __name__ == "__main__":
    main()
