import { Contact, Audio } from '../LiteLoaderQQNT-Euphony/src/index.js';

document.addEventListener('drop', e => {
    if (document.querySelector(".audio-msg-input") != undefined) {
        e.dataTransfer.files.forEach(async file => {
            if (await audio_sender.isFileSilk(file.path)) {
                Contact.getCurrentContact().sendMessage(new Audio(file.path));
                return;
            }
            const getSampleRateResult = await audio_sender.getSampleRate(file.path);
            if (getSampleRateResult.error) {
                console.error(getSampleRateResult.error);
                return;
            }
            const convertToPcmResult = await audio_sender.convertToPcm(file.path);
            if (convertToPcmResult.error) {
                console.error(convertToPcmResult.error);
                return;
            }
            const convertToSilkResult = await audio_sender.convertToSilk(convertToPcmResult.data, getSampleRateResult.data);
            if (convertToSilkResult.error) {
                console.error(convertToSilkResult.error);
                return;
            }
            const silkPath = `${ file.path }.silk`;
            const writeFileError = await audio_sender.writeFile(silkPath, convertToSilkResult.data.data);
            if (writeFileError) {
                console.error(writeFileError);
                return;
            }
            await Contact.getCurrentContact().sendMessage(new Audio(silkPath, convertToSilkResult.data.duration / 1000));
            const deleteFileError = await audio_sender.deleteFile(silkPath);
            if (deleteFileError) {
                console.error(deleteFileError);
                return;
            }
        });
    }
});