"""
Test script to run the scanner against the test app
"""
import os
import sys
import time
import subprocess
import signal
import argparse

# Add the parent directory to the path so we can import the scanner module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scanner.scanner import Scanner
from scanner.config import ScannerConfig

def start_test_app():
    """Start the test app in a subprocess"""
    print("Starting test application...")
    test_app_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                 'test_app', 'app.py')
    
    # Check if the test app exists
    if not os.path.exists(test_app_path):
        print(f"Error: Test app not found at {test_app_path}")
        return None
    
    # Start the test app in a subprocess
    process = subprocess.Popen([sys.executable, test_app_path], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE)
    
    # Wait for the app to start
    print("Waiting for test app to start...")
    time.sleep(3)
    
    return process

def stop_test_app(process):
    """Stop the test app subprocess"""
    if process:
        print("Stopping test application...")
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()

def run_scanner_test():
    """Run the scanner test against the test app"""
    # Start the test app
    app_process = start_test_app()
    if not app_process:
        return
    
    try:
        # Create a custom configuration
        config = ScannerConfig()
        config.set('max_depth', 3)
        config.set('max_pages', 30)
        config.set('scan_broken_access', True)
        config.set('scan_crypto_failures', True)
        config.set('scan_insecure_design', True)
        config.set('scan_xss', True)
        config.set('scan_forms', True)
        config.set('scan_links', True)
        config.set('scan_headers', True)
        config.set('request_timeout', 5)
        config.set('rate_limit', 10)  # 10 requests per second to avoid overwhelming the test app
        
        # Create scanner with the custom config
        scanner = Scanner(config)
        
        # Start scan on the test app
        test_url = "http://localhost:5000/"
        print(f"Starting scan on {test_url}...")
        scan_id = scanner.start_scan(test_url)
        
        # Print results
        results = scanner.get_results()
        print(f"\nScan complete with ID: {scan_id}")
        print(f"Total vulnerabilities found: {len(results['vulnerabilities'])}")
        
        # Group vulnerabilities by type
        vuln_types = {}
        for vuln in results['vulnerabilities']:
            vuln_type = vuln['type']
            if vuln_type not in vuln_types:
                vuln_types[vuln_type] = 0
            vuln_types[vuln_type] += 1
        
        # Print vulnerability summary
        print("\nVulnerability summary:")
        for vuln_type, count in vuln_types.items():
            print(f"  {vuln_type}: {count}")
        
        # Print details of first 5 vulnerabilities of each OWASP category
        print("\nA01 - Broken Access Control vulnerabilities:")
        a01_vulns = [v for v in results['vulnerabilities'] if v['type'] == 'broken_access_control']
        for i, vuln in enumerate(a01_vulns[:5]):
            print(f"\n{i+1}. {vuln['type']} at {vuln['url']}")
            print(f"   Description: {vuln['details'].get('description', 'N/A')}")
            print(f"   Severity: {vuln['details'].get('severity', 'N/A')}")
        
        print("\nA02 - Cryptographic Failures vulnerabilities:")
        a02_vulns = [v for v in results['vulnerabilities'] 
                    if 'crypto_failure' in v['type']]
        for i, vuln in enumerate(a02_vulns[:5]):
            print(f"\n{i+1}. {vuln['type']} at {vuln['url']}")
            print(f"   Description: {vuln['details'].get('description', 'N/A')}")
            print(f"   Severity: {vuln['details'].get('severity', 'N/A')}")
        
        print("\nA04 - Insecure Design vulnerabilities:")
        a04_vulns = [v for v in results['vulnerabilities'] 
                    if 'insecure_design' in v['type']]
        for i, vuln in enumerate(a04_vulns[:5]):
            print(f"\n{i+1}. {vuln['type']} at {vuln['url']}")
            print(f"   Description: {vuln['details'].get('description', 'N/A')}")
            print(f"   Severity: {vuln['details'].get('severity', 'N/A')}")
        
        print("\nCheck the 'scan_results' directory for complete results.")
        return results
    
    finally:
        # Stop the test app
        stop_test_app(app_process)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run the scanner against the test app')
    args = parser.parse_args()
    
    run_scanner_test()
