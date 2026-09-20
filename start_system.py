"""
AGRI VISION - Unified System Runner
Starts both Flask Backend (Port 5000) and Vite Frontend (Port 5173) simultaneously.
"""

import os
import sys
import subprocess
import time
import signal

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, "backend")
frontend_dir = os.path.join(base_dir, "frontend")

print("=" * 60)
print("🌾 Arka-assist — Multimodal AI Farm Intelligence System")
print("=" * 60)

processes = []

def start_backend():
    print("[1/2] Starting Flask Backend REST API on http://127.0.0.1:5000 ...")
    p = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=backend_dir
    )
    processes.append(p)
    return p

def start_frontend():
    print("[2/2] Starting Vite Frontend on http://localhost:5173 ...")
    p = subprocess.Popen(
        [sys.executable, "start_dev.py"],
        cwd=frontend_dir
    )
    processes.append(p)
    return p

def cleanup(sig=None, frame=None):
    print("\n[ARKA-ASSIST] Shutting down services...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    p_back = start_backend()
    time.sleep(1.5)
    p_front = start_frontend()

    print("\n" + "=" * 60)
    print("🚀 ARKA-ASSIST IS RUNNING!")
    print("👉 Frontend: http://localhost:5173")
    print("👉 Backend API: http://127.0.0.1:5000")
    print("👉 Demo Login: User: 'farmer' | Pass: 'arka-assist' (or 'agrivision')")
    print("=" * 60)
    print("Press Ctrl+C to stop all services.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()
