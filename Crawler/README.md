# Web Scanner Tool

A comprehensive web scanner tool for detecting common web vulnerabilities including SQL injection, XSS, and security headers.

## Features

- Web crawling with customizable depth
- SQL injection detection
- Cross-site scripting (XSS) detection
- Missing security headers detection
- Form scanning and analysis
- Firebase integration for result storage

## Setup

### Prerequisites

- Python 3.9+
- Firebase project with Realtime Database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Firebase Setup

This scanner now stores all scan results in Firebase Realtime Database. To set up Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Realtime Database in your project
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase/serviceAccountKey.json` in the project root

You can use the template provided at `firebase/serviceAccountKey.template.json` as a reference.

## Usage

Run the scanner with:

```bash
python main.py
```

When prompted, enter the target URL to scan.

## Configuration

The scanner can be configured in `main.py` by modifying the following settings:

- `max_depth`: Maximum crawling depth (default: 3)
- `max_pages`: Maximum number of pages to scan (default: 100)
- `threads`: Number of concurrent threads (default: 4)
- `scan_delay`: Delay between requests in seconds (default: 1.0)
- `request_timeout`: Request timeout in seconds (default: 30)
- `verify_ssl`: Whether to verify SSL certificates (default: True)
- `follow_redirects`: Whether to follow redirects (default: True)

## Scan Results

All scan results are stored in Firebase Realtime Database under the 'scans' collection with the following structure:

```
scans/
  [scan_id]/
    timestamp: "2025-06-17T10:30:45.123456"
    summary: {...}
    vulnerabilities: [...]
    scanned_links: [...]
    scanned_forms: [...]
```

Each scan is assigned a unique ID that can be used to retrieve the results later. The scan ID is displayed in the console output after a scan is completed.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
