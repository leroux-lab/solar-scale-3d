const { contextBridge, ipcRenderer } = require('electron');

/**
 * Electron Preload Script (The Secure Bridge)
 * Exposes safe, specific desktop capabilities to the 3D web app (window.desktopAPI)
 * without exposing raw Node.js or filesystem APIs to untrusted web content.
 */
contextBridge.exposeInMainWorld('desktopAPI', {
  isDesktop: true,
  platform: process.platform,

  // Ask the Main Process to open a native OS "Save As..." dialog for a 3D PNG screenshot
  saveScreenshot: (dataUrl, defaultName) =>
    ipcRenderer.invoke('desktop:save-screenshot', { dataUrl, defaultName }),

  // Ask the Main Process to open a native OS "Save As..." dialog for a JSON Scale Report
  exportScaleReport: (reportObj, defaultName) =>
    ipcRenderer.invoke('desktop:export-report', { reportObj, defaultName }),

  // Listen for menu bar commands triggered from the native Windows top menu
  onMenuAction: (callback) => {
    ipcRenderer.on('desktop:menu-action', (_event, action) => callback(action));
  },
});
