# tests/test_basic.py

from click.testing import CliRunner
from main import main

def test_cli_no_args():
    runner = CliRunner()
    result = runner.invoke(main, [])
    assert "[+] Scanner would start against:" in result.stdout
