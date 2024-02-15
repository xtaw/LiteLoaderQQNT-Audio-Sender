const { ipcMain } = require("electron");

const util = require('util');
const exec = util.promisify(require("child_process").exec);

const fs = require('fs').promises;

ipcMain.handle('LiteLoader.audiosender.convertToSilk', async (event, file) => {
    try {
        var { stderr } = await exec(`ffmpeg -y -i "${ file }" -acodec pcm_s16le -f s16le -ac 1 "${ file }.pcm" -loglevel error`);
        if (stderr) {
            return `An error occurred while converting ${ file } to .pcm. Details: ${ stderr }`;
        }
        var { stdout, stderr } = await exec(`ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 "${ file }"`);
        if (stderr) {
            return `An error occurred while obtaining the sample rate. Details: ${ stderr }`;
        }
        var { stderr } = await exec(`silk_codec pts -i "${ file }.pcm" -s ${ stdout.trim() } -o "${ file }.silk"`);
        if (stderr.includes('returned')) {
            return `An error occurred while converting ${ file } to .silk. Details: ${ stderr }`;
        }
        fs.unlink(`${ file }.pcm`);
    } catch (error) {
        return `An unknown error occurred. Details: ${ error }`;
    }
});

ipcMain.handle('LiteLoader.audiosender.deleteFile', async (event, file) => {
    try {
        await fs.unlink(file);
    } catch (error) {
        return `An error occurred while deleting ${ file }. Details: ${ error }`;
    }
})