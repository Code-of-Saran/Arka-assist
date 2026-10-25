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

# If local node_modules exists, run directly in frontend_dir for maximum speed & independence
if os.path.exists(local_node_modules):
    target_dir = frontend_dir
else:
    target_dir = build_dir
    os.makedirs(build_dir, exist_ok=True)
    # Sync latest files to build cache
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

print(f"[ARKA-ASSIST] Starting Vite Dev Server in {target_dir} on http://localhost:5173 ...")
p = subprocess.Popen(["npx.cmd", "vite", "--host", "0.0.0.0", "--port", "5173"], cwd=target_dir)
p.wait()
