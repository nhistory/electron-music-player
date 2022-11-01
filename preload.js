const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendSonglist: (callback) => ipcRenderer.on("song-endpoint", callback),
});
