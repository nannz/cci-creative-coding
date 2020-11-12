//version log: positionX and positionY is another wave array
const playButton = document.getElementById('playButton');
var changeThis = 1;
var maximJs = maximilian();
var maxiAudio = new maximJs.maxiAudio();

// maxiAudio.init();
var osc = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var osc4 = new maximJs.maxiOsc();
var osc5 = new maximJs.maxiOsc();
var osc6 = new maximJs.maxiOsc();
var drawOutput = new Array(1024);
var drawCentre = new Array(1024);
var counter = 0;

//var canvas = document.getElementById("canvas");
var canvas = document.querySelector("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);


// This works out a frequency we can use that matches the buffersize
var bufferFreq=44100/1024;

let playAudio = () => {
    playButton.style.display="none";
    maxiAudio.init();

    maxiAudio.play = function(){
        //var wave = (osc.sawn(bufferFreq) - osc2.sawn(bufferFreq*1.001));
        var wave = osc.sinewave(bufferFreq+osc2.sinewave(bufferFreq*changeThis)*osc3.sinewave(0.01)*1000);
        //var wave2 = osc4.sinewave(bufferFreq*osc5.sinewave(bufferFreq*1)*osc6.sinewave(0.01)*100);
        // var wave2 = osc3.sinewave(bufferFreq*osc4.sinewave(bufferFreq));
        var wave2 = (osc.sawn(bufferFreq) - osc3.sawn(bufferFreq*10.01));
        counter++;

        drawOutput[counter % 1024] = wave;
        drawCentre[counter % 1024] = wave2;
        return wave * 0.0;
    }

}

playButton.addEventListener("click", () => playAudio());


var positionBaseX = width/2;
var positionBaseY = height/2;
function draw() {

    context.clearRect(0, 0, width, height);
    //var spacing = ((Math.PI * 2) / 1024);
    var spacing = ((Math.PI * 2) / 1024 );
    var size = 200;

    for (var i = 0; i < 1024; i++) {
        positionX = positionBaseX + Math.cos(i*spacing)*size*2 *drawCentre[i];
        positionY = positionBaseY + Math.sin(i*spacing)*size*2 * drawCentre[i];
        context.beginPath();
        //there is a more efficient way to do the code.
        context.moveTo(positionBaseX + (Math.cos(i * spacing) * size * drawOutput[i]),positionBaseY + (Math.sin(i * spacing) * size * drawOutput[i]));
        //context.lineTo(positionX+ 100 + Math.sin(i * spacing)*100,positionY -100 + Math.cos(i * spacing)*100);
        context.lineTo(positionX,positionY );
        //context.lineTo(position + (Math.cos(i * spacing) ),(height / 2) + (Math.sin(i * spacing)));
        // context.lineTo(position + (Math.cos(i * spacing) * drawOutput[i]),(height / 2) + (Math.sin(i * spacing) * drawOutput[i]));

        context.stroke();
        context.closePath();
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);