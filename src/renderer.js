document.addEventListener('drop', e => {
    if (document.querySelector(".audio-msg-input") != undefined) {
        e.dataTransfer.files.forEach(async file => {
            let path = file.path;
            if (path.endsWith(".mp3") || path.endsWith(".amr") || path.endsWith(".wav") || path.endsWith(".silk") || path.endsWith(".flac") || path.endsWith(".ogg")) {
                if (!path.endsWith(".silk")) {
                    if (!await audiosender.convertToSilk(file.path)) {
                        return;
                    }
                    path = path + '.silk';
                }
                const peer = await LLAPI.getPeer();
                await LLAPI.sendMessage(peer, [
                    {
                        type: 'ptt',
                        file: path
                    }
                ]);
                if (!file.path.endsWith(".silk")) {
                    audiosender.deleteFile(path);
                }
            }
        });
    }
})