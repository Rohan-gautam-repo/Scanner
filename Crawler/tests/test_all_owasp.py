"""
Test script for OWASP Top 10 vulnerability scanner modules
"""
import os
import sys
import json
from pprint import pprint

# Add the parent directory to the path so we can import from scanner
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scanner.config import ScannerConfig
from scanner.scanner import Scanner

def test_owasp_scanner():
    """
    Test the OWASP scanner modules A01-A10
    """
    print("Starting OWASP Top 10 scanner test...")
    
    # Configure scanner
    config = ScannerConfig()
    
    # Enable all OWASP scans
    config.set('scan_broken_access', True)              # A01: Broken Access Control
    config.set('scan_crypto_failures', True)            # A02: Cryptographic Failures
    config.set('scan_insecure_design', True)            # A04: Insecure Design
    config.set('scan_security_misconfigurations', True) # A05: Security Misconfiguration
    config.set('scan_vulnerable_components', True)      # A06: Vulnerable and Outdated Components
    config.set('scan_auth_failures', True)              # A07: Identification and Authentication Failures
    config.set('scan_integrity_failures', True)         # A08: Software and Data Integrity Failures
    config.set('scan_logging_monitoring', True)         # A09: Security Logging and Monitoring Failures
    config.set('scan_ssrf', True)                       # A10: Server-Side Request Forgery (SSRF)
    
    # Set other configurations
    config.set('max_depth', 2)
    config.set('max_pages', 10)
    config.set('scan_forms', True)
    config.set('scan_links', True)
    config.set('scan_headers', True)
    config.set('scan_xss', True)
    config.set('output_dir', 'scan_results')
    
    # Create scanner with configuration
    scanner = Scanner(config)
    
    # Start scan - use the test app if it's running locally
    test_url = "http://localhost:5000"
    
    try:
        print(f"Starting scan on {test_url}...")
        scan_id = scanner.start_scan(test_url)
        print(f"Scan completed with ID: {scan_id}")
        
        # Get and analyze results
        results = scanner.get_results()
        print(f"Found {len(results['vulnerabilities'])} vulnerabilities")
        
        # Count vulnerabilities by type
        vuln_types = {}
        for vuln in results['vulnerabilities']:
            vuln_type = vuln['type']
            if vuln_type not in vuln_types:
                vuln_types[vuln_type] = 0
            vuln_types[vuln_type] += 1
        
        print("\nVulnerabilities by type:")
        for vuln_type, count in vuln_types.items():
            print(f"- {vuln_type}: {count}")
        
        # Check if we found vulnerabilities from each OWASP category
        categories = {
            'A01': any('broken_access' in v['type'] for v in results['vulnerabilities']),
            'A02': any('crypto_failure' in v['type'] for v in results['vulnerabilities']),
            'A04': any('insecure_design' in v['type'] for v in results['vulnerabilities']),
            'A05': any('security_misconfiguration' in v['type'] for v in results['vulnerabilities']),
            'A06': any('vulnerable_component' in v['type'] for v in results['vulnerabilities']),
            'A07': any('auth_failure' in v['type'] for v in results['vulnerabilities']),
            'A08': any('integrity_failure' in v['type'] for v in results['vulnerabilities']),
            'A09': any('logging_monitoring' in v['type'] for v in results['vulnerabilities']),
            'A10': any('ssrf' in v['type'] for v in results['vulnerabilities']),
        }
        
        print("\nOWASP Categories Detected:")
        for category, detected in categories.items():
            print(f"- {category}: {'✅' if detected else '❌'}")
        
        # Print example vulnerabilities
        if results['vulnerabilities']:
            print("\nExample vulnerabilities:")
            for i, vuln in enumerate(results['vulnerabilities'][:3]):  # Show first 3 examples
                print(f"\nVulnerability {i+1}:")
                print(f"Type: {vuln['type']}")
                print(f"URL: {vuln['url']}")
                print(f"Severity: {vuln['details'].get('severity', 'Unknown')}")
                print(f"Description: {vuln['details'].get('description', 'No description')}")
        
        return scan_id, results
        
    except Exception as e:
        print(f"Error during scan: {str(e)}")
        raise

if __name__ == "__main__":
    scan_id, results = test_owasp_scanner()
    
    # Save full results to a file for inspection
    with open('test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\nFull results saved to test_results.json")
