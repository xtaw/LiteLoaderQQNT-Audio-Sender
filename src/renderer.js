document.addEventListener('drop', e => {
    if (document.querySelector(".audio-msg-input") != undefined) {
        e.dataTransfer.files.forEach(async file => {
            let path = file.path;
            const conversionSuccess = await audiosender.convertToSilk(file.path);
            if (!conversionSuccess) {
                console.error("File conversion failed or file type not supported.");
                return;
            }
            path += '.silk';
            const peer = await LLAPI.getPeer();
            await LLAPI.sendMessage(peer, [{
                type: 'ptt',
                file: path
            }]);
            if (!file.path.endsWith(".silk")) {
                audiosender.deleteFile(path);
            }
        });
    }
});