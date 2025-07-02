"""
Test the OWASP Top 10 scanner modules
"""
import sys
import os

# Add the parent directory to the path so we can import the scanner module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scanner.scanner import Scanner
from scanner.config import ScannerConfig

def test_owasp_scanner():
    """Test the OWASP scanner modules"""
    
    # Create a custom configuration
    config = ScannerConfig()
    config.set('max_depth', 2)  # Limit crawl depth for testing
    config.set('max_pages', 10)  # Limit pages for testing
    config.set('scan_broken_access', True)
    config.set('scan_crypto_failures', True)
    config.set('scan_insecure_design', True)
    
    # Create scanner with the custom config
    scanner = Scanner(config)
    
    # Start scan on a test URL
    test_url = "http://testphp.vulnweb.com/"  # Test with a known vulnerable site
    scan_id = scanner.start_scan(test_url)
    
    # Print results
    results = scanner.get_results()
    print(f"Scan complete with ID: {scan_id}")
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
    
    # Print details of first 5 vulnerabilities
    print("\nFirst 5 vulnerabilities:")
    for i, vuln in enumerate(results['vulnerabilities'][:5]):
        print(f"\n{i+1}. {vuln['type']} at {vuln['url']}")
        print(f"   Description: {vuln['details'].get('description', 'N/A')}")
        print(f"   Severity: {vuln['details'].get('severity', 'N/A')}")
    
    return results

if __name__ == "__main__":
    test_owasp_scanner()
