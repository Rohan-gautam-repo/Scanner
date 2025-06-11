# tests/test_crawler.py

import pytest
from crawler.scanner.forms import extract_forms
from bs4 import BeautifulSoup

def test_extract_forms():
    html = '''
    <form action="/submit" method="post">
        <input type="text" name="username" value="admin"/>
        <input type="password" name="password"/>
        <input type="submit" value="Login"/>
    </form>
    '''
    forms = extract_forms(html)
    assert len(forms) == 1
    assert forms[0]['method'] == 'post'
    assert forms[0]['action'] == '/submit'
    assert any(inp['name'] == 'username' for inp in forms[0]['inputs'])
