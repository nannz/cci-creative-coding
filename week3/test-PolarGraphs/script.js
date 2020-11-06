const playButton = document.getElementById('playButton');
var changeThis = 1;
var maximJs = maximilian();
var maxiAudio = new maximJs.maxiAudio();

// maxiAudio.init();
var osc = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var drawOutput = new Array(1024);
var counter = 0;

//var canvas = document.getElementById("canvas");
var canvas = document.querySelector("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

var spacing = ((Math.PI * 2) / 1024);
var size = 200;
var position = 200;
// This works out a frequency we can use that matches the buffersize
var bufferFreq=44100/1024;

let playAudio = () => {
    playButton.style.display="none";
    maxiAudio.init();

    maxiAudio.play = function(){
        //var wave = (osc.sawn(bufferFreq) - osc2.sawn(bufferFreq*1.001));
        //var wave = osc.sinewave(bufferFreq+osc2.sinewave(bufferFreq*changeThis)*osc3.sinewave(0.01)*1000);
        var wave = osc.sinewave(bufferFreq*osc2.sinewave(bufferFreq));
        counter++;

        drawOutput[counter % 1024] = wave;
        return wave * 0.4;
    }

}

playButton.addEventListener("click", () => playAudio());


function draw() {

    context.clearRect(0, 0, width, height);

    for (var i = 0; i < 1024; i++) {
        context.beginPath();

        context.moveTo(position + (Math.cos(i * spacing) * size * drawOutput[i]),(height / 2) + (Math.sin(i * spacing) * size * drawOutput[i]));

        context.lineTo(position + (Math.cos(i * spacing) * drawOutput[i]),(height / 2) + (Math.sin(i * spacing) * drawOutput[i]));

        context.stroke();
        context.closePath();
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);