document.addEventListener('drop', e => {
    if (document.querySelector(".audio-msg-input") != undefined) {
        e.dataTransfer.files.forEach(async file => {
            let error = await audiosender.convertToSilk(file.path);
            if (error) {
                console.error(error);
                return;
            }
            const path = file.path + '.silk';
            const peer = await LLAPI.getPeer();
            await LLAPI.sendMessage(peer, [{
                type: 'ptt',
                file: path
            }]);
            audiosender.deleteFile(path);
        });
    }
});