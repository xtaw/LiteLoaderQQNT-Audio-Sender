const {  isMainThread, parentPort, workerData } = require('worker_threads');

const { encode } = require('silk-wasm');

if (!isMainThread) {
    encode(workerData.pcmData, workerData.sampleRate).then(silk => {
        parentPort.postMessage({
            data: silk.data
        });
    }).catch(error => {
        parentPort.postMessage({
            error: `An error occurred while converting .pcm to .silk. Details: ${ error }`
        });
    });
}