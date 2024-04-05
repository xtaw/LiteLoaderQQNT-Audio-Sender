const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('audio_sender', {
    isFileSilk: filePath => ipcRenderer.invoke(
        'LiteLoader.audio_sender.isFileSilk',
        filePath
    ),
    getSampleRate: audioPath => ipcRenderer.invoke(
        'LiteLoader.audio_sender.getSampleRate',
        audioPath
    ),
    convertToPcm: audioPath => ipcRenderer.invoke(
        'LiteLoader.audio_sender.convertToPcm',
        audioPath
    ),
    convertToSilk: (pcmData, sampleRate) => ipcRenderer.invoke(
        'LiteLoader.audio_sender.convertToSilk',
        pcmData,
        sampleRate
    ),
    writeFile: (path, data) => ipcRenderer.invoke(
        'LiteLoader.audio_sender.writeFile',
        path,
        data
    ),
    deleteFile: path => ipcRenderer.invoke(
        'LiteLoader.audio_sender.deleteFile',
        path
    )
});