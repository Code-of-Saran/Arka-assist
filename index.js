/**
 * ARKA-ASSIST — Master Entrypoint (index.js)
 * Node.js single-file launcher for Arka-assist system.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('\n🌾 ========================================================');
console.log('   ARKA-ASSIST — Multimodal AI Farm Intelligence System');
console.log('   Node.js System Launcher');
console.log('========================================================\n');

const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
const indexPy = path.join(__dirname, 'index.py');

console.log(`[ARKA-ASSIST] Launching master process via ${pythonBin}...`);

const mainProcess = spawn(pythonBin, [indexPy], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

mainProcess.on('exit', (code) => {
    console.log(`[ARKA-ASSIST] Master process exited with code ${code}`);
    process.exit(code || 0);
});

process.on('SIGINT', () => {
    mainProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    mainProcess.kill('SIGTERM');
});
