const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const electronDist = path.join(rootDir, 'node_modules', 'electron', 'dist');
const outDir = path.join(rootDir, 'dist', 'SolarScale-win32-x64');
const appDir = path.join(outDir, 'resources', 'app');

console.log('1. Cleaning previous build in dist/...');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

console.log('2. Copying Electron Windows x64 runtime...');
fs.cpSync(electronDist, outDir, { recursive: true });

// Rename electron.exe -> SolarScale.exe
const srcExe = path.join(outDir, 'electron.exe');
const destExe = path.join(outDir, 'SolarScale.exe');
if (fs.existsSync(srcExe)) {
  fs.renameSync(srcExe, destExe);
}

// Remove default_app.asar so Electron boots resources/app automatically
const defaultAsar = path.join(outDir, 'resources', 'default_app.asar');
if (fs.existsSync(defaultAsar)) {
  fs.rmSync(defaultAsar, { force: true });
}

console.log('3. Bundling Solar Scale 3D application files into resources/app...');
fs.mkdirSync(appDir, { recursive: true });

['package.json', 'index.html', 'manifest.json', 'README.md'].forEach((file) => {
  fs.copyFileSync(path.join(rootDir, file), path.join(appDir, file));
});

fs.cpSync(path.join(rootDir, 'src'), path.join(appDir, 'src'), { recursive: true });
fs.cpSync(path.join(rootDir, 'electron'), path.join(appDir, 'electron'), { recursive: true });

// Bundle Three.js modules for 100% offline execution
const threeSrc = path.join(rootDir, 'node_modules', 'three');
const threeDest = path.join(appDir, 'node_modules', 'three');
fs.mkdirSync(path.join(threeDest, 'build'), { recursive: true });
fs.copyFileSync(
  path.join(threeSrc, 'build', 'three.module.js'),
  path.join(threeDest, 'build', 'three.module.js')
);
if (fs.existsSync(path.join(threeSrc, 'build', 'three.core.js'))) {
  fs.copyFileSync(
    path.join(threeSrc, 'build', 'three.core.js'),
    path.join(threeDest, 'build', 'three.core.js')
  );
}
fs.cpSync(
  path.join(threeSrc, 'examples', 'jsm'),
  path.join(threeDest, 'examples', 'jsm'),
  { recursive: true }
);

console.log('4. Creating distributable ZIP archive for GitHub Releases...');
const zipPath = path.join(rootDir, 'dist', 'SolarScale-Windows-x64.zip');
if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });

execFileSync('C:\\Windows\\System32\\tar.exe', [
  '-a',
  '-cf',
  zipPath,
  '-C',
  path.join(rootDir, 'dist'),
  'SolarScale-win32-x64',
]);

console.log('\n✅ Packaging Complete!');
console.log('   Standalone EXE: ' + destExe);
console.log('   Release ZIP:    ' + zipPath);
