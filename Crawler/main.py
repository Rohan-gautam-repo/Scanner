# main.py

import os
import json
import argparse
import logging
from scanner import Scanner, ScannerConfig
from scanner.logger import ScannerLogger
from scanner.stats import ScanStats
from scanner.utils import save_json, is_valid_url
from datetime import datetime

def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    log_level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def get_target_url() -> str:
    """Get target URL from user input"""
    while True:
        url = input("Enter target URL (e.g., http://example.com): ").strip()
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        if is_valid_url(url):
            return url
        print("Invalid URL. Please enter a valid URL.")

def print_vulnerability(vuln):
    """Print vulnerability details in a structured format"""
    print("\n" + "="*80)
    print(f"VULNERABILITY FOUND")
    print("="*80)
    print(f"Type: {vuln['type'].upper()}")
    print(f"File: {vuln['file']}")
    print(f"URL: {vuln['url']}")
    print(f"Timestamp: {vuln['timestamp']}")
    print(f"Severity: {vuln['details']['severity']}")
    print(f"Description: {vuln['details']['description']}")
    
    if 'form' in vuln['details']:
        print("\nForm Details:")
        print(f"  Action: {vuln['details']['form']['action']}")
        print(f"  Method: {vuln['details']['form']['method']}")
        print(f"  Input Field: {vuln['details']['input_field']}")
    
    if 'payload' in vuln['details']:
        print(f"\nPayload: {vuln['details']['payload']}")
    
    print(f"\nRecommendation: {vuln['details']['recommendation']}")
    print("="*80)

def print_scan_summary(results):
    """Print scan summary in a structured format"""
    summary = results['summary']
    scan_info = summary['scan_info']
    
    print("\n" + "="*80)
    print("SCAN SUMMARY")
    print("="*80)
    print(f"Scan Duration: {scan_info['duration']:.2f} seconds")
    print(f"Total URLs Scanned: {scan_info['total_urls_scanned']}")
    print(f"Total Links Scanned: {scan_info['total_links_scanned']}")
    print(f"Total Forms Scanned: {scan_info['total_forms_scanned']}")
    print(f"Total Vulnerabilities Found: {scan_info['total_vulnerabilities']}")
    
    print("\nVulnerabilities by Type:")
    for vuln_type, count in summary['vulnerabilities_by_type'].items():
        print(f"  {vuln_type}: {count}")
    
    print("\nPerformance Metrics:")
    print(f"  Average Response Time: {summary['performance_metrics']['avg_response_time']:.2f} seconds")
    print(f"  Minimum Response Time: {summary['performance_metrics']['min_response_time']:.2f} seconds")
    print(f"  Maximum Response Time: {summary['performance_metrics']['max_response_time']:.2f} seconds")
    print("="*80)

def print_scanned_links(links):
    """Print scanned links in a structured format"""
    print("\n" + "="*80)
    print("SCANNED LINKS")
    print("="*80)
    for link in links:
        print(f"\nSource URL: {link['source_url']}")
        print(f"Target URL: {link['target_url']}")
        print(f"Timestamp: {link['timestamp']}")
        print("-"*40)
    print("="*80)

def print_scanned_forms(forms):
    """Print scanned forms in a structured format"""
    print("\n" + "="*80)
    print("SCANNED FORMS")
    print("="*80)
    for form in forms:
        print(f"\nURL: {form['url']}")
        print(f"Action: {form['action']}")
        print(f"Method: {form['method']}")
        print("Input Fields:")
        for input_field in form['inputs']:
            print(f"  - Name: {input_field['name']}")
            print(f"    Type: {input_field['type']}")
        print(f"Timestamp: {form['timestamp']}")
        print("-"*40)
    print("="*80)

def main():
    # Create output directory
    output_dir = 'scan_results'
    os.makedirs(output_dir, exist_ok=True)
    
    # Configure scanner
    config = ScannerConfig()
    config.set('output_dir', output_dir)
    config.set('log_file', os.path.join(output_dir, 'scanner.log'))
    config.set('max_depth', 3)
    config.set('max_pages', 100)
    config.set('threads', 4)
    config.set('scan_delay', 1.0)
    config.set('request_timeout', 30)
    config.set('verify_ssl', True)
    config.set('follow_redirects', True)
    config.set('scan_forms', True)
    config.set('scan_links', True)
    config.set('scan_headers', True)
    config.set('scan_cookies', True)
    
    # Initialize scanner
    scanner = Scanner(config)
    
    # Get target URL from user
    target_url = get_target_url()
    print(f"\nStarting scan for: {target_url}")
    
    try:
        # Start scan
        scanner.start_scan(target_url)
        
        # Get results
        results = scanner.get_results()
        
        # Print results
        print_scan_summary(results)
        
        # Print vulnerabilities
        if results['vulnerabilities']:
            print("\nDETAILED VULNERABILITIES")
            for vuln in results['vulnerabilities']:
                print_vulnerability(vuln)
        else:
            print("\nNo vulnerabilities found.")
        
        # Print scanned links
        if results['scanned_links']:
            print_scanned_links(results['scanned_links'])
        else:
            print("\nNo links were scanned.")
        
        # Print scanned forms
        if results['scanned_forms']:
            print_scanned_forms(results['scanned_forms'])
        else:
            print("\nNo forms were scanned.")
        
        # Print errors if any
        if results['summary']['errors_by_type']:
            print("\nERRORS ENCOUNTERED")
            for error_type, count in results['summary']['errors_by_type'].items():
                print(f"{error_type}: {count}")
        
        print(f"\nDetailed results saved to {output_dir}/detailed_results.json")
        
    except Exception as e:
        print(f"Error during scan: {str(e)}")

if __name__ == "__main__":
    main()
