import os
import shutil
import subprocess
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

frontend_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = r"C:\Users\saran\AppData\Local\AgriVision_Build"

print(f"[AgriVision] Syncing frontend source to fast workspace: {build_dir}")

# Files to sync
sync_files = ["index.html", "vite.config.js", "tailwind.config.js", "postcss.config.js", "package.json"]
sync_dirs = ["src", "public"]

for f in sync_files:
    src_f = os.path.join(frontend_dir, f)
    if os.path.exists(src_f):
        shutil.copy2(src_f, os.path.join(build_dir, f))

for d in sync_dirs:
    src_d = os.path.join(frontend_dir, d)
    dst_d = os.path.join(build_dir, d)
    if os.path.exists(src_d):
        shutil.copytree(src_d, dst_d, dirs_exist_ok=True)

print("[AgriVision] Validating build with Vite...")
res = subprocess.run(["npx.cmd", "vite", "build"], cwd=build_dir, capture_output=True, text=True)

print("Vite Build Output:", res.stdout)
if res.stderr:
    print("Vite Build Stderr:", res.stderr)

if res.returncode == 0:
    print("[SUCCESS] VITE BUILD SUCCESSFUL! Zero errors found!")
else:
    print(f"[ERROR] Build exited with code {res.returncode}")
    sys.exit(res.returncode)
