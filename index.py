"""
ARKA-ASSIST — Master Entrypoint (index.py)
Single-file launcher for the entire Multimodal AI Farm Intelligence System.
Executes both Flask REST API backend (Port 5000) and Vite React frontend (Port 5173).
"""

import os
import sys
import subprocess
import time
import signal
import webbrowser

# Ensure UTF-8 output formatting for Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

processes = []

def start_backend():
    """Start Flask REST API backend process."""
    print("[1/2] Starting Flask Backend REST API (http://127.0.0.1:5000)...")
    p = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=BACKEND_DIR
    )
    processes.append(p)
    return p

def start_frontend():
    """Start Vite React frontend process."""
    print("[2/2] Starting Vite Frontend UI (http://localhost:5173)...")
    p = subprocess.Popen(
        [sys.executable, "start_dev.py"],
        cwd=FRONTEND_DIR
    )
    processes.append(p)
    return p

def cleanup(sig=None, frame=None):
    """Graceful shutdown handler for all child processes."""
    print("\n" + "=" * 60)
    print("🌾 [ARKA-ASSIST] Stopping services and cleaning up resources...")
    for p in processes:
        try:
            if p.poll() is None:
                p.terminate()
                p.wait(timeout=3)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass
    print("✅ All services stopped successfully.")
    print("=" * 60)
    sys.exit(0)

def main():
    # Register signal handlers for clean exit
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("\n" + "🌾" + "  " + "=" * 56)
    print("   ARKA-ASSIST — Multimodal AI Farm Intelligence System")
    print("   Unified System Entrypoint")
    print("=" * 60)

    # Launch Backend & Frontend
    p_back = start_backend()
    time.sleep(1.5)
    p_front = start_frontend()

    print("\n" + "=" * 60)
    print("🚀 ARKA-ASSIST IS LIVE AND READY!")
    print("👉 Web Application UI: http://localhost:5173")
    print("👉 Backend REST API:   http://127.0.0.1:5000")
    print("👉 Demo Credentials:   User: 'farmer' | Pass: 'arka-assist'")
    print("=" * 60)
    print("Press Ctrl+C at any time to shut down all processes.\n")

    # Keep master process alive and monitor child processes
    try:
        while True:
            # Check if any child process crashed unexpectedly
            for p in processes:
                if p.poll() is not None:
                    print(f"⚠️ Warning: A child process (PID {p.pid}) exited with code {p.returncode}")
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
