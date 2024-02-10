const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('audiosender', {
    convertToSilk: file => ipcRenderer.invoke(
        'LiteLoader.audiosender.convertToSilk',
        file
    ),
    deleteFile: file => ipcRenderer.invoke(
        'LiteLoader.audiosender.deleteFile',
        file
    )
});