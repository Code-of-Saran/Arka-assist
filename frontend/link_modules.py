import os
import subprocess
import shutil
import tempfile

dst = os.path.abspath("node_modules")
src = os.path.join(os.environ.get("LOCALAPPDATA", tempfile.gettempdir()), "ArkaAssist_Build", "node_modules")

if os.path.exists(dst):
    # Remove files inside
    for f in os.listdir(dst):
        p = os.path.join(dst, f)
        try:
            if os.path.isdir(p):
                shutil.rmtree(p)
            else:
                os.remove(p)
        except Exception as e:
            print("remove error:", e)
    try:
        os.rmdir(dst)
    except Exception as e:
        print("rmdir error:", e)

os.system(f'mklink /J "{dst}" "{src}"')

if os.path.exists(dst):
    print("SUCCESS: node_modules linked successfully! Total packages:", len(os.listdir(dst)))
else:
    print("Failed to link")
