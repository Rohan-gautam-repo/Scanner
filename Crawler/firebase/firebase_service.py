import firebase_admin
from firebase_admin import credentials, db
import os
import json
from datetime import datetime
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class FirebaseService:
    """Service class for Firebase operations"""
    
    _instance = None
    
    @classmethod
    def get_instance(cls):
        """Singleton pattern to ensure only one Firebase connection"""
        if cls._instance is None:
            cls._instance = FirebaseService()
        return cls._instance
    
    def __init__(self):
        """Initialize Firebase connection"""
        self.app = None
        self.db = None
        self.initialized = False
    
    def initialize(self):
        """Initialize Firebase connection with credentials"""
        if self.initialized:
            return
        
        # Firebase configuration from environment variables or default values for non-sensitive info
        firebase_config = {
            "apiKey": os.environ.get("FIREBASE_API_KEY", ""),
            "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN", "websentinal-f92ec.firebaseapp.com"),
            "databaseURL": os.environ.get("FIREBASE_DATABASE_URL", "https://websentinal-f92ec-default-rtdb.firebaseio.com"),
            "projectId": os.environ.get("FIREBASE_PROJECT_ID", "websentinal-f92ec"),
            "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET", "websentinal-f92ec.firebasestorage.app"),
            "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID", ""),
            "appId": os.environ.get("FIREBASE_APP_ID", ""),
            "measurementId": os.environ.get("FIREBASE_MEASUREMENT_ID", "")
        }
        
        # Create a service account credential file if it doesn't exist
        cred_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
        if not os.path.exists(cred_path):
            try:
                # Generate a temporary credentials file from config
                self._create_temp_credentials(firebase_config, cred_path)
            except Exception as e:
                print(f"Error creating credentials file: {e}")
                return
        
        # Initialize Firebase app
        try:
            cred = credentials.Certificate(cred_path)
            self.app = firebase_admin.initialize_app(cred, {
                'databaseURL': firebase_config['databaseURL']
            })
            self.db = db.reference()
            self.initialized = True
            print("Firebase initialized successfully")
        except Exception as e:
            print(f"Firebase initialization error: {e}")
    
    def _create_temp_credentials(self, config, path):
        """
        Creates a credentials file for Firebase Admin SDK from environment variables.
        To use this securely, set the following environment variables:
        - FIREBASE_PRIVATE_KEY_ID
        - FIREBASE_PRIVATE_KEY (base64 encoded to preserve newlines)
        - FIREBASE_CLIENT_EMAIL
        - FIREBASE_CLIENT_ID
        
        If environment variables are not set, a placeholder is used for local development only.
        """
        import base64
        
        # Get service account data from environment variables if available
        project_id = config["projectId"]
        private_key_id = os.environ.get("FIREBASE_PRIVATE_KEY_ID", "placeholder_key_id")
        
        # Private key should be base64 encoded in env var to preserve newlines
        encoded_private_key = os.environ.get("FIREBASE_PRIVATE_KEY", "")
        if encoded_private_key:
            try:
                # If it's already a private key format (starts with -----BEGIN PRIVATE KEY-----)
                if encoded_private_key.startswith("-----BEGIN PRIVATE KEY-----"):
                    private_key = encoded_private_key
                else:
                    # Try to decode from base64
                    private_key = base64.b64decode(encoded_private_key).decode('utf-8')
            except:
                private_key = "-----BEGIN PRIVATE KEY-----\nPLACEHOLDER_KEY\n-----END PRIVATE KEY-----\n"
        else:
            private_key = "-----BEGIN PRIVATE KEY-----\nPLACEHOLDER_KEY\n-----END PRIVATE KEY-----\n"
            
        client_email = os.environ.get("FIREBASE_CLIENT_EMAIL", f"firebase-adminsdk@{project_id}.iam.gserviceaccount.com")
        client_id = os.environ.get("FIREBASE_CLIENT_ID", "placeholder_client_id")
        
        # Create service account JSON structure
        cred_data = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": private_key_id,
            "private_key": private_key,
            "client_email": client_email,
            "client_id": client_id,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email.replace('@', '%40')}",
            "universe_domain": "googleapis.com"
        }
        
        # Save the credentials
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(cred_data, f, indent=2)
        
        if all([
            private_key_id != "placeholder_key_id",
            "PLACEHOLDER_KEY" not in private_key,
            client_id != "placeholder_client_id"
        ]):
            print("Service account credentials saved from environment variables.")
        else:
            print("WARNING: Using placeholder credentials. Set environment variables for production use.")
    
    def save_scan_results(self, scan_id, results):
        """Save scan results to Firebase"""
        if not self.initialized:
            self.initialize()
            if not self.initialized:
                raise Exception("Firebase not initialized")
        
        # Structure the data for Firebase
        timestamp = datetime.now().isoformat()
        scan_data = {
            'timestamp': timestamp,
            'summary': results['summary'],
            'vulnerabilities': results['vulnerabilities'],
            'scanned_links': results['scanned_links'],
            'scanned_forms': results['scanned_forms']
        }
        
        # Save to Firebase
        try:
            # If no scan_id is provided, generate one
            if not scan_id:
                scan_id = str(uuid.uuid4())
                
            # Update the scan in Firebase
            scans_ref = self.db.child('scans')
            scan_ref = scans_ref.child(scan_id)
            scan_ref.set(scan_data)
            
            return {
                'success': True,
                'scan_id': scan_id,
                'message': 'Scan results saved to Firebase'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to save scan results to Firebase'
            }
    
    def get_scan_results(self, scan_id):
        """Get scan results from Firebase"""
        if not self.initialized:
            self.initialize()
            if not self.initialized:
                raise Exception("Firebase not initialized")
        
        try:
            scan_ref = self.db.child('scans').child(scan_id)
            scan_data = scan_ref.get()
            return scan_data
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to retrieve scan results from Firebase'
            }
    
    def list_scans(self, limit=10):
        """List recent scans"""
        if not self.initialized:
            self.initialize()
            if not self.initialized:
                raise Exception("Firebase not initialized")
        
        try:
            scans_ref = self.db.child('scans').order_by_child('timestamp').limit_to_last(limit)
            scans = scans_ref.get()
            return scans
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to list scans from Firebase'
            }
