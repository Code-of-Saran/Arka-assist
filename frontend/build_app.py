import os
import shutil
import subprocess
import sys
import tempfile

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

frontend_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(os.environ.get("LOCALAPPDATA", tempfile.gettempdir()), "ArkaAssist_Build")
local_node_modules = os.path.join(frontend_dir, "node_modules")

if os.path.exists(local_node_modules):
    target_dir = frontend_dir
else:
    target_dir = build_dir
    os.makedirs(build_dir, exist_ok=True)
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

print(f"[Arka-assist] Validating build with Vite in {target_dir}...")
res = subprocess.run(["npx.cmd", "vite", "build"], cwd=target_dir, capture_output=True, text=True)

print("Vite Build Output:", res.stdout)
if res.stderr:
    print("Vite Build Stderr:", res.stderr)

if res.returncode == 0:
    print("[SUCCESS] VITE BUILD SUCCESSFUL! Zero errors found!")
else:
    print(f"[ERROR] Build exited with code {res.returncode}")
    sys.exit(res.returncode)
