import os
import shutil
import subprocess
import sys
import tempfile

frontend_dir = os.path.dirname(os.path.abspath(__file__))
pkg_json_src = os.path.join(frontend_dir, "package.json")

# Create local fast build directory outside OneDrive
cache_build_dir = os.path.join(os.environ.get("LOCALAPPDATA", tempfile.gettempdir()), "AgriVision_Build")
os.makedirs(cache_build_dir, exist_ok=True)
print(f"[FastInstall] Using local workspace cache: {cache_build_dir}")

shutil.copy2(pkg_json_src, os.path.join(cache_build_dir, "package.json"))

npm_cli = r"C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

print("[FastInstall] Running npm install in fast local cache...")
res = subprocess.run(
    ["node", npm_cli, "install", "--no-audit", "--no-fund"],
    cwd=cache_build_dir,
    capture_output=True,
    text=True
)

print("[FastInstall] NPM Output:", res.stdout)
if res.stderr:
    print("[FastInstall] NPM Stderr:", res.stderr)

src_node_modules = os.path.join(cache_build_dir, "node_modules")
dst_node_modules = os.path.join(frontend_dir, "node_modules")

print(f"[FastInstall] Linking node_modules into {dst_node_modules}...")
if os.path.exists(dst_node_modules):
    try:
        if os.path.islink(dst_node_modules):
            os.unlink(dst_node_modules)
        else:
            shutil.rmtree(dst_node_modules)
    except Exception as e:
        print("[FastInstall] Clean note:", e)

# Use junction on Windows for instant 0-second link
cmd = f'cmd /c mklink /J "{dst_node_modules}" "{src_node_modules}"'
link_res = os.system(cmd)
print(f"[FastInstall] Directory junction created with code: {link_res}")

if os.path.exists(dst_node_modules):
    print(f"[FastInstall] SUCCESS! node_modules contains {len(os.listdir(dst_node_modules))} packages.")
else:
    print("[FastInstall] Junction failed, copying files...")
    shutil.copytree(src_node_modules, dst_node_modules)
    print(f"[FastInstall] SUCCESS! Copied {len(os.listdir(dst_node_modules))} packages.")
