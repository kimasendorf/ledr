const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

let outputWindow

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 312,
    height: 68,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools()
}

function createOutputWindow(pos) {
  outputWindow = new BrowserWindow({
    x: pos.x,
    y: pos.y,
    width: 512,
    height: 256,
    frame: false,
    roundedCorners: false,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  outputWindow.loadFile('start.html')
}

app.whenReady().then(() => {
  createMainWindow()

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  createOutputWindow(externalDisplay.bounds)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const { ipcMain } = require('electron')

ipcMain.on('update', async (event, args) => {
  try {
    outputWindow.loadURL(args.url)
    event.reply('reply', {
      success: true,
      message: 'iframe updated'
    })
  } catch (err) {
    event.reply('reply', {
      success: false,
      message: err.message
    })
  }
})
