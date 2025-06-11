# crawler/forms.py

from typing import List, Dict
from bs4 import BeautifulSoup

def extract_forms(html: str) -> List[Dict]:
    soup = BeautifulSoup(html, "html.parser")
    forms = []

    for form in soup.find_all("form"):
        form_data = {
            "method": form.get("method", "get").lower(),
            "action": form.get("action"),
            "inputs": []
        }

        for input_tag in form.find_all("input"):
            input_type = input_tag.get("type", "text")
            input_name = input_tag.get("name")
            input_value = input_tag.get("value", "")
            form_data["inputs"].append({
                "type": input_type,
                "name": input_name,
                "value": input_value
            })

        forms.append(form_data)

    return forms
