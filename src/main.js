const { ipcMain } = require("electron");

const util = require('util');
const exec = util.promisify(require("child_process").exec);

const fs = require('fs').promises;

const { Worker, workerData } = require('worker_threads');

ipcMain.handle('LiteLoader.audio_sender.isFileSilk', async (event, filePath) => {
    return (await fs.readFile(filePath)).toString('hex', 0, 7) == '02232153494c4b';
});

ipcMain.handle('LiteLoader.audio_sender.getSampleRate', async (event, audioPath) => {
    try {
        const { stdout, stderr } = await exec(`ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 "${ audioPath }"`);
        if (stderr) {
            return {
                error: `An error occurred while obtaining the sample rate. Details: ${ stderr }`
            };
        }
        return {
            data: stdout.trim()
        };
    } catch (error) {
        return {
            error: `An unknown error occurred. Details: ${ error }`
        };
    }
});

ipcMain.handle('LiteLoader.audio_sender.convertToPcm', async (event, audioPath) => {
    try {
        const { stderr } = await exec(`ffmpeg -y -i "${ audioPath }" -acodec pcm_s16le -f s16le -ac 1 "${ audioPath }.pcm" -loglevel error`);
        if (stderr) {
            return { 
                error: `An error occurred while converting ${ audioPath } to .pcm. Details: ${ stderr }`
            };
        }
        const pcm = await fs.readFile(`${ audioPath }.pcm`);
        await fs.unlink(`${ audioPath }.pcm`);
        return {
            data: pcm
        };
    } catch (error) {
        return {
            error: `An unknown error occurred. Details: ${ error }`
        };
    }
});

ipcMain.handle('LiteLoader.audio_sender.convertToSilk', (event, pcmData, sampleRate) => {
    return new Promise(resolve => {
        const worker = new Worker(`${ LiteLoader.plugins['audio_sender'].path.plugin }/src/worker/convert_to_silk.js`, {
            workerData: {
                pcmData,
                sampleRate
            }
        });
        worker.on('message', message => resolve(message));
    });
});

ipcMain.handle('LiteLoader.audio_sender.writeFile', async (event, path, data) => {
    try {
        await fs.writeFile(path, data);
    } catch (error) {
        return `An error occurred while writing ${ path }. Details: ${ error }`;
    }
})

ipcMain.handle('LiteLoader.audio_sender.deleteFile', async (event, path) => {
    try {
        await fs.unlink(path);
    } catch (error) {
        return `An error occurred while deleting ${ path }. Details: ${ error }`;
    }
})