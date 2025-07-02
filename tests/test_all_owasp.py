"""
Test script to verify that the scanner can detect all OWASP Top 10 vulnerabilities in the test app.
"""
import sys
import os
import json
from pathlib import Path

# Add the Crawler directory to the Python path
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))

from Crawler.scanner.scanner import Scanner
from Crawler.scanner.config import ScannerConfig

def main():
    print("=" * 80)
    print("OWASP Top 10 Scanner Test")
    print("=" * 80)
    
    # Configure scanner
    config = ScannerConfig()
    config.set('target_url', 'http://localhost:5000')
    config.set('max_urls', 50)  # Limit scan depth for testing
    config.set('log_file', 'scan_results/scanner.log')
    config.set('scan_xss', True)
    config.set('scan_sqli', True)
    config.set('scan_broken_access', True)
    config.set('scan_crypto_failures', True)
    config.set('scan_insecure_design', True)
    config.set('scan_security_misconfigurations', True)
    config.set('scan_vulnerable_components', True)
    config.set('scan_auth_failures', True)
    config.set('scan_integrity_failures', True)
    config.set('scan_logging_monitoring', True)
    config.set('scan_ssrf', True)
    
    # Initialize scanner
    scanner = Scanner(config)
    
    # Run scan
    print("Starting scan of test application...")
    scanner.scan()
    
    # Save results
    results_dir = root_dir / 'scan_results'
    results_dir.mkdir(exist_ok=True)
    
    # Save detailed results
    detailed_results = {
        'vulnerabilities': scanner.vulnerabilities,
        'stats': scanner.stats.get_stats(),
        'scanned_urls': list(scanner.visited_urls),
        'scan_config': config.get_all()
    }
    
    with open(results_dir / 'detailed_results.json', 'w') as f:
        json.dump(detailed_results, f, indent=2)
    
    # Analyze results by OWASP category
    vulnerabilities_by_category = {}
    for vuln in scanner.vulnerabilities:
        category = vuln.get('category', 'Unknown')
        if category not in vulnerabilities_by_category:
            vulnerabilities_by_category[category] = []
        vulnerabilities_by_category[category].append(vuln)
    
    # Generate summary
    summary = {
        'total_urls_scanned': len(scanner.visited_urls),
        'total_vulnerabilities': len(scanner.vulnerabilities),
        'vulnerabilities_by_category': {
            category: len(vulns) for category, vulns in vulnerabilities_by_category.items()
        }
    }
    
    with open(results_dir / 'scan_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    # Print results
    print("\nScan completed!")
    print(f"Total URLs scanned: {summary['total_urls_scanned']}")
    print(f"Total vulnerabilities found: {summary['total_vulnerabilities']}")
    print("\nVulnerabilities by category:")
    for category, count in summary['vulnerabilities_by_category'].items():
        print(f"  - {category}: {count}")
    
    # Check if all OWASP categories were detected
    owasp_categories = [
        'A01:2021-Broken Access Control', 
        'A02:2021-Cryptographic Failures', 
        'A03:2021-Injection',  # SQLi and XSS
        'A04:2021-Insecure Design',
        'A05:2021-Security Misconfiguration',
        'A06:2021-Vulnerable and Outdated Components',
        'A07:2021-Identification and Authentication Failures',
        'A08:2021-Software and Data Integrity Failures',
        'A09:2021-Security Logging and Monitoring Failures',
        'A10:2021-Server-Side Request Forgery'
    ]
    
    detected_categories = set(vulnerabilities_by_category.keys())
    missing_categories = []
    
    for category in owasp_categories:
        # Check if the category or parts of it are in detected categories
        if not any(category.split('-')[0] in detected for detected in detected_categories):
            missing_categories.append(category)
    
    if missing_categories:
        print("\nWARNING: The following OWASP categories were not detected:")
        for category in missing_categories:
            print(f"  - {category}")
    else:
        print("\nSUCCESS: All OWASP Top 10 categories were detected!")
    
    print("\nDetailed results saved to:", results_dir / 'detailed_results.json')
    print("Summary saved to:", results_dir / 'scan_summary.json')
    print("=" * 80)

if __name__ == "__main__":
    main()
