# crawler/forms.py

from typing import List, Dict

def extract_forms(html: str) -> List[Dict]:
    """
    Parse all <form> tags in the HTML and return a list of dicts:
      { method, action, inputs: [{name, type, value}, …] }
    """
    # TODO: use BeautifulSoup to implement
    return []
