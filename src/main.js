const { ipcMain } = require("electron");

const util = require('util');
const exec = util.promisify(require("child_process").exec);

const fs = require('fs');

ipcMain.handle('LiteLoader.audiosender.convertToSilk', async (event, file) => {
    try {
        let { stderr } = await exec(`ffmpeg -y -i "${ file }" -acodec pcm_s16le -f s16le -ac 1 "${ file }.pcm"`);
        stderr = stderr.substring(0, stderr.lastIndexOf('Hz')).trim();
        stderr = stderr.substring(stderr.lastIndexOf(',') + 1).trim();
        await exec(`silk_codec pts -i "${ file }.pcm" -s ${ stderr } -o "${ file }.silk"`);
        fs.unlink(`${ file }.pcm`, error => {});
        return true;
    } catch {
        return false;
    }
});

ipcMain.handle('LiteLoader.audiosender.deleteFile', (event, file) => {
    fs.unlink(file, error => {});
})