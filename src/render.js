const { remote } = require("electron");

let videoElement = document.querySelector("video");
let audioSelect = document.getElementById("audioSource");
let videoSelect = document.getElementById("videoSource");
let fullscreen = document.getElementById("fullscreen");

let timer;
let full = false;


//Exit fullscreen
document.onkeydown = (e) => {
    if (e.key === "Escape") {
        remote.getCurrentWindow().setFullScreen(false)
    }
}

//Toggle fullscreen
fullscreen.addEventListener("click", () => {
    full = !full
    remote.getCurrentWindow().setFullScreen(full)
})

//If mouse if moving show menu items
videoElement.addEventListener("mousemove", () => {
    document.getElementById("bar").style.left = "0";
    document.querySelector("body").style.cursor = "auto";
    fullscreen.style.display = "block"

    clearTimeout(timer)
    timer = setTimeout(() => {
        fullscreen.style.display = "none"
        document.getElementById("bar").style.left = "-540px";
        document.querySelector("body").style.cursor = "none";
    }, 4000)
})

audioSelect.addEventListener("mousemove", () => {clearTimeout(timer)})
videoSelect.addEventListener("mousemove", () => {clearTimeout(timer)})

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices);

function getDevices() {
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos;
    console.log("Available devices:", deviceInfos);
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
            option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioSelect.value;
    const videoSource = videoSelect.value;
    const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined, width: {ideal: 1280}, height: {ideal: 720}}
    };
    return navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(handleError);
}

function gotStream(stream) {
    window.stream = stream;
    audioSelect.selectedIndex = [...audioSelect.options].findIndex(option => option.text === stream.getAudioTracks()[0].label);
    videoSelect.selectedIndex = [...videoSelect.options].findIndex(option => option.text === stream.getVideoTracks()[0].label);
    videoElement.srcObject = stream;
}

function handleError(error) {
    console.error("Error: ", error);
}
