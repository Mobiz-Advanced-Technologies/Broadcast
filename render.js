const {app, desktopCapturer} = require('@electron/remote');
const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");
var os = require("os");

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var video = document.createElement('video');
var overlayImg = document.createElement('img');
var overlayMode = false;

document.documentElement.prepend(video)
video.setAttribute("autoplay", "true");
video.setAttribute("hidden", "");

let mediaRecorder;
let recordedChunks = [];

function recordCanvas(canvas) {
    document.getElementById('startRecordBtn').style.display = "none";
    document.getElementById('stopRecordBtn').style.display = "inline-block";

    const stream = canvas.captureStream();
    const videoStream = video.captureStream();

    const combinedStream = new MediaStream([...stream.getTracks(), ...videoStream.getTracks()]);
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=h264' });

    mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        const today = new Date();
        const yyyy = today.getFullYear();

        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;

        const BlobReader = new FileReader();
        BlobReader.readAsArrayBuffer(blob);
        await new Promise((resolve) => (BlobReader.onload = resolve));

        const HandlerData = new Uint8Array(BlobReader.result);
        const HandlerUInt8ArrayData = new Uint8Array(HandlerData);

        const result = ffmpeg({
          MEMFS: [{name: `dump.webm`, data: HandlerUInt8ArrayData}],
          arguments: [
            '-i', 'dump.webm',
            '-c:v', 'copy', '-c:a', 'copy', '-strict', 'experimental',
            '-f', 'mp4',
            'output.mp4'
          ],
        });

        document.getElementById('startRecordBtn').style.display = "inline-block";
        document.getElementById('exportBtn').style.display = "none";
        
        const out = result.MEMFS[0];
        console.log(out)

        const url = URL.createObjectURL(new Blob([out.data], {
            type: 'video/mp4'
        }));
        const link = document.createElement('a');

        link.href = url;
        link.download = out.name;
        link.click();

        recordedChunks = [];
    };

    mediaRecorder.start();
}

function stopRecording() {
    document.getElementById('exportBtn').style.display = "inline-block";
    document.getElementById('stopRecordBtn').style.display = "none";
    
    mediaRecorder.stop();
}

//fetch saved overlays
if (!localStorage.getItem("overlays")) {
    var overlaylist = [
        [
            {"fill":"#fff","top":10,"left":10,"width":1085,"height":270,"round":10,"type":"rect"},
            {"url":"https://mobiz-advanced-technologies.github.io/Cubic/Code/icon.png","top":15,"left":15,"width":256,"height":256,"type":"image"},
            {"text":"Cubic Broadcast","top":150,"left":277,"fontSize":110,"fontFamily":"arial","lineHeight":30,"textAlign":"left","fontWeight":30,"color":"#000000","type":"text"}
        ]
    ];
} else {
    var overlaylist = JSON.parse(localStorage.getItem("overlays"));
}

//load saved overlays
function loadSavedOverlays() {
    var savedelementlist = document.getElementById("presetlist");
    savedelementlist.innerHTML = "";

    overlaylist.forEach(element => {
        let presetlist = document.getElementById("presetlist");
        let option = document.createElement("option");
        option.innerText = element.overlayName || "Overlay";

        presetlist.prepend(option)

        option.onclick = function () {
            options.elements = element;
            refreshUIElements()
        }
    });
}
loadSavedOverlays()

function exportOverlay() {
    const blob = new Blob([JSON.stringify(options.elements)], { type: "application/json" });
    const fileName = "overlay.json";

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
}

function loadOverlay() {
    var input = document.getElementById("file-input");
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        options.elements = JSON.parse(contents);
    };

    reader.readAsText(file);
}

//overlay configuration
const options = {
    width: 360,
    height: 360,
    rate: 1,
    elements: []
};

//function to save an overlay to localstorage
function saveOverlay() {
    overlaylist.push(options.elements);
    localStorage.setItem("overlays", JSON.stringify(overlaylist))

    loadSavedOverlays()
}

video.addEventListener('play', function () {
    var $this = this; //cache
    var lastTime = performance.now();
    var frameCounter = 0;
    var fpsCounter = 0;

    //video rendering
    function loop() {
        if (!$this.paused && !$this.ended) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            options.width = video.videoWidth;
            options.height = video.videoHeight;

            ctx.drawImage($this, 0, 0);
            ctx.drawImage(overlayImg, 0, 0);

            frameCounter++;

            var currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                fpsCounter = frameCounter;
                frameCounter = 0;
                lastTime = currentTime;
                document.getElementById('FPSMark').innerText = ('FPS:' + fpsCounter);
            }
        }
    }


    //overlay rendering
    async function drawOverlays() {
        if (options.elements.length === 0) {
            overlayMode = false;
        } else {
            overlayMode = true;
        }

        if (!$this.paused && !$this.ended && overlayMode) {
            let ui = await simple2canvas(options);
            overlayImg.src = ui.toDataURL();
        }

        if (!overlayMode) {
            overlayImg.src = '';
        }
    }

    audioTimerLoop(loop, 0)
    audioTimerLoop(drawOverlays, 0)

}, 0);

async function startRecording() {
    const sources = await desktopCapturer.getSources({types: ["window", "screen"],});
    document.getElementById('whattorecord').style.display = 'flex';
    document.getElementById('medialist').innerHTML = ``;

    sources.forEach(function(item) {
        let button = document.createElement('button')

        let img = document.createElement('img')
        img.src = item.thumbnail.toDataURL();
        button.appendChild(img)

        let p = document.createElement('p')
        p.innerText = item.name;
        button.appendChild(p)

        button.onclick = async function() {
            document.getElementById('whattorecord').style.display = 'none';
            const screenId = item.id;
            selectedStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: screenId,
                    },
                },
            });

            video.srcObject = selectedStream;
            video.muted = true;
        }

        document.getElementById('medialist').appendChild(button);
    })
}

function custom_video(event) {
    var reader = new FileReader();
    reader.onload = function () {
        video.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

//insane borrowed code from stackoverflow
function audioTimerLoop(callback, frequency) {
  var freq = frequency / 1000;
  var aCtx = new AudioContext();

  var silence = aCtx.createGain();
  silence.gain.value = 0;
  silence.connect(aCtx.destination);

  onOSCend();

  var stopped = false;
  function onOSCend() {
    var osc = aCtx.createOscillator();
    osc.onended = onOSCend;
    osc.connect(silence);
    osc.start(0);
    osc.stop(aCtx.currentTime + freq);
    callback(aCtx.currentTime);
    if (stopped) {
      osc.onended = function() {
        aCtx.close();
        return;
      };
    }
  };

  return function() {
    stopped = true;
  };
}

function cpuAverage() {
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
  for(var i = 0, len = cpus.length; i < len; i++) {
    var cpu = cpus[i];

    for(type in cpu.times) {
      totalTick += cpu.times[type];
   }     

    totalIdle += cpu.times.idle;
  }

  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}
var startMeasure = cpuAverage();

setInterval(function() { 
  var endMeasure = cpuAverage(); 
  var idleDifference = endMeasure.idle - startMeasure.idle;
  var totalDifference = endMeasure.total - startMeasure.total;
  var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

  document.getElementById('CPUMark').innerText = `CPU: ${percentageCPU}%`
}, 1000);

document.getElementById('appver').innerText = app.getVersion();
document.getElementById('electronver').innerText = process.versions.electron;