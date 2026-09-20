import subprocess
import sys
import os

frontend_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Installing dependencies in {frontend_dir}...")

npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

process = subprocess.Popen(
    [npm_cmd, "install", "--no-audit", "--no-fund"],
    cwd=frontend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

for line in iter(process.stdout.readline, ''):
    print(line, end='', flush=True)

process.stdout.close()
return_code = process.wait()
print(f"\nFinished with return code {return_code}")
sys.exit(return_code)
