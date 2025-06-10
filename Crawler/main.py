# crawler/main.py

import click
from crawler.config import TARGET_DOMAIN

@click.command()
@click.option("--target", default=None, help="Domain to scan")
def main(target):
    """
    Entry point for the vulnerability scanner CLI.
    """
    domain = target or TARGET_DOMAIN
    click.echo(f"[+] Scanner would start against: {domain}")

if __name__ == "__main__":
    main()
