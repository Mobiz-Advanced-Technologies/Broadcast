function startLiveStream() {
    const receiverWindow = window.open('receiver.html', 'popup', 'popup=true');

    receiverWindow.addEventListener('load', function () {
        const receiverVideo = receiverWindow.document.getElementById('receiver-video');
        const stream = canvas.captureStream();
        const videoStream = video.captureStream();
        const combinedStream = new MediaStream([...stream.getTracks(), ...videoStream.getTracks()]);

        receiverVideo.srcObject = combinedStream;
        receiverVideo.play();
    });
}