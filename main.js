const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let stateFile;
function loadState() {
  try { return JSON.parse(fs.readFileSync(stateFile, 'utf8')); }
  catch (e) { return { width: 1400, height: 880 }; }
}

function createWindow() {
  stateFile = path.join(app.getPath('userData'), 'window.json');
  const s = loadState();
  const win = new BrowserWindow({
    width: s.width, height: s.height, x: s.x, y: s.y,
    minWidth: 380, minHeight: 500,
    title: 'Мозгохран',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#141a22',
    autoHideMenuBar: true
  });
  if (s.max) win.maximize();
  win.loadFile('index.html');
  win.on('close', () => {
    try {
      fs.writeFileSync(stateFile, JSON.stringify({ ...win.getNormalBounds(), max: win.isMaximized() }));
    } catch (e) {}
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'viewMenu' }]));
  createWindow();
});
app.on('window-all-closed', () => app.quit());
