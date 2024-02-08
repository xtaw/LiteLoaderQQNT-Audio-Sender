document.addEventListener('drop', e => {
    if (document.querySelector(".audio-msg-input") != undefined) {
        e.dataTransfer.files.forEach(file => {
            if (file.path.endsWith(".mp3") || file.path.endsWith(".amr") || file.path.endsWith(".wav") || file.path.endsWith(".silk") || file.path.endsWith(".flac") || file.path.endsWith(".ogg")) {
                LLAPI.getPeer().then(peer => {
                    LLAPI.sendMessage(peer, [
                        {
                            type: 'ptt',
                            file: file.path
                        }
                    ]);
                });
            }
        });
    }
})