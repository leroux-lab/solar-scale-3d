/**
 * Prepares the self-contained mobile web bundle (www/) for Capacitor (Android / iOS).
 * Copies index.html, manifest.json, sw.js, icons/, src/, and local Three.js modules
 * so the native mobile app runs 100% offline without needing CDN access.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

console.log('1. Cleaning mobile www/ bundle directory...');
fs.rmSync(wwwDir, { recursive: true, force: true });
fs.mkdirSync(wwwDir, { recursive: true });

console.log('2. Copying core mobile web files...');
['manifest.json', 'sw.js'].forEach((file) => {
  fs.copyFileSync(path.join(rootDir, file), path.join(wwwDir, file));
});

fs.cpSync(path.join(rootDir, 'src'), path.join(wwwDir, 'src'), { recursive: true });
fs.cpSync(path.join(rootDir, 'icons'), path.join(wwwDir, 'icons'), { recursive: true });

// Bundle local Three.js inside www/vendor/three so Capacitor mobile builds run 100% offline
const threeSrc = path.join(rootDir, 'node_modules', 'three');
const threeDest = path.join(wwwDir, 'vendor', 'three');
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

// Rewrite importmap in www/index.html to use local ./vendor/three/
const indexHtml = fs
  .readFileSync(path.join(rootDir, 'index.html'), 'utf-8')
  .replaceAll('https://unpkg.com/three@0.170.0/', './vendor/three/');
fs.writeFileSync(path.join(wwwDir, 'index.html'), indexHtml, 'utf-8');

console.log('✅ Mobile bundle ready at: ' + wwwDir);
console.log('   Ready for Capacitor: npx cap add android / npx cap sync');
