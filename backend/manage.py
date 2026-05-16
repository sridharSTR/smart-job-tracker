#!/usr/bin/env python
import os
import sys
from pathlib import Path


def use_project_venv():
    base_dir = Path(__file__).resolve().parent
    venv_python = base_dir / "venv" / "Scripts" / "python.exe"
    if venv_python.exists() and Path(sys.executable).resolve() != venv_python.resolve():
        os.execv(str(venv_python), [str(venv_python), *sys.argv])


def main():
    use_project_venv()
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
