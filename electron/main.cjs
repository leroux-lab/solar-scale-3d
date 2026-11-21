const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

let mainWindow = null;
let localServer = null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Starts a tiny embedded localhost HTTP server so ES Modules (<script type="module">)
 * and Import Maps run identically to a web server without file:// CORS restrictions.
 */
function startEmbeddedServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const relPath = urlPath === '/' ? '/index.html' : urlPath;
      const safePath = path.normalize(relPath).replace(/^(\.\.[/\\])+/, '');
      const filePath = path.join(rootDir, safePath);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        });
        // In Desktop mode, map Three.js imports to local node_modules so the app works 100% offline
        if (relPath === '/index.html') {
          const html = data
            .toString('utf-8')
            .replaceAll('https://unpkg.com/three@0.170.0/', '/node_modules/three/');
          res.end(html);
          return;
        }
        res.end(data);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
    server.on('error', reject);
  });
}

function buildDesktopMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save 3D Snapshot (PNG)...',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('desktop:menu-action', 'save-png'),
        },
        {
          label: 'Export Scale Report (JSON)...',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow?.webContents.send('desktop:menu-action', 'export-json'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'Exit Solar Scale 3D' },
      ],
    },
    {
      label: 'Perspective Modes',
      submenu: [
        {
          label: '1. True Scale Lineup',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow?.webContents.send('desktop:menu-action', 'mode-lineup'),
        },
        {
          label: '2. Size & Scale Comparison',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow?.webContents.send('desktop:menu-action', 'mode-compare'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Solar Scale 3D',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Solar Scale 3D',
              message: 'Solar Scale 3D — Desktop Edition (v1.0.0)',
              detail:
                'An interactive 3D visualizer for Dwarf Planets, Solar System Worlds, Exoplanets, and Hypergiant Stars.\n\nBuilt with Three.js + Electron.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ============================================================================
// IPC Handlers: Native OS File Dialogs for Saving PNG Screenshots & JSON Reports
// ============================================================================
ipcMain.handle('desktop:save-screenshot', async (_event, { dataUrl, defaultName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save 3D Solar Scale Snapshot',
    defaultPath: defaultName || 'solar-scale-snapshot.png',
    filters: [{ name: 'PNG Image', extensions: ['png'] }],
  });

  if (canceled || !filePath) return { saved: false };

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
  await fs.promises.writeFile(filePath, Buffer.from(base64Data, 'base64'));
  return { saved: true, filePath };
});

ipcMain.handle('desktop:export-report', async (_event, { reportObj, defaultName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Solar Scale Report',
    defaultPath: defaultName || 'solar-scale-report.json',
    filters: [{ name: 'JSON Data', extensions: ['json'] }],
  });

  if (canceled || !filePath) return { saved: false };

  await fs.promises.writeFile(filePath, JSON.stringify(reportObj, null, 2), 'utf-8');
  return { saved: true, filePath };
});

async function createWindow() {
  const rootDir = path.resolve(__dirname, '..');
  const { server, port } = await startEmbeddedServer(rootDir);
  localServer = server;

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#05070f',
    title: 'Solar Scale 3D — Desktop Edition',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  buildDesktopMenu();
  const appUrl = `http://127.0.0.1:${port}/index.html`;
  console.log('Solar Scale 3D Desktop running at:', appUrl);
  await mainWindow.loadURL(appUrl);
  mainWindow.show();
  mainWindow.focus();
}

app.whenReady().then(createWindow).catch((err) => {
  console.error('Failed to launch Electron window:', err);
});

app.on('window-all-closed', () => {
  if (localServer) localServer.close();
  if (process.platform !== 'darwin') app.quit();
});
