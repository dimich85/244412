const { app, BrowserWindow, ipcMain, BrowserView, session } = require('electron');
const path = require('path');

let mainWindow;
const views = {}; // To store and manage BrowserView instances
const sessions = {}; // To store and manage session instances

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Keep false for security
      contextIsolation: true, // Keep true for security
    }
  });

  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

const profiles = require('./fingerprint-profiles');
let currentProfile = profiles['macos-safari-16']; // Default profile

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers for Profiles & Safari ---

// Provide the list of profiles to the renderer process
ipcMain.handle('get-profiles', () => {
  return profiles;
});

// Set the active profile
ipcMain.on('set-profile', (event, profileId) => {
  if (profiles[profileId]) {
    currentProfile = profiles[profileId];
    console.log(`Switched to profile: ${currentProfile.name}`);
  }
});

// Provide the current profile to the injector script
ipcMain.handle('get-current-profile', () => {
  return currentProfile;
});

// This is the core logic for managing the Safari BrowserView
ipcMain.on('safari-actions', (event, args) => {
  const view = views[args.id];

  switch(args.action) {
    case 'open': {
      if (view) return;
      const sessionId = `persist:safari-${Date.now()}`;
      // Create a new isolated session for each Safari window
      const viewSession = session.fromPartition(sessionId);
      viewSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = currentProfile.userAgent;
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      });

      const newView = new BrowserView({
        webPreferences: {
          preload: path.join(__dirname, 'fingerprint-injector.js'),
          contextIsolation: true, // Recommended for security
          session: viewSession, // Use the isolated session
        }
      });
      mainWindow.addBrowserView(newView);
      // Bounds are sent from the renderer process
      newView.setBounds(args.bounds);
      newView.webContents.loadURL(args.url || 'https://duckduckgo.com');
      newView.setAutoResize({ width: true, height: true });
      views[args.id] = newView;
      sessions[args.id] = viewSession;
      break;
    }
    case 'close': {
      if (!view) return;
      mainWindow.removeBrowserView(view);
      try {
        view.webContents.destroy();
      } catch (e) {
        console.error("Failed to destroy BrowserView:", e);
      }
      // Also clear the session data
      if (sessions[args.id]) {
        sessions[args.id].clearStorageData();
      }
      delete views[args.id];
      delete sessions[args.id];
      break;
    }
    case 'update-bounds': {
      if (!view) return;
      view.setBounds(args.bounds);
      break;
    }
    case 'load-url': {
      if (!view) return;
      view.webContents.loadURL(args.url);
      break;
    }
    case 'visibility': {
      if (!view) return;
      if (args.visible) {
        mainWindow.addBrowserView(view);
      } else {
        mainWindow.removeBrowserView(view);
      }
      break;
    }
  }
});