const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: __dirname + "/assets/icon.png"
  });

  mainWindow.removeMenu()
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  //Dev tools
  // mainWindow.webContents.openDevTools();
};
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
