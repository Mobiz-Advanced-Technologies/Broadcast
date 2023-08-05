const { app, BrowserWindow, ipcMain, ipcRenderer, remote, electron } = require("electron");
const fs = require('fs');
const path = require('path');
var win

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: "icon.png",
    autoHideMenuBar: true,
    backgroundColor: '#1d1d1d',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      contextIsolation: false,
      webviewTag: true,
    }
  });
  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(win.webContents)

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})