//version log:
//test the parametric line theory

// This is where we are going to store the mouse information
var mouseX =175;
var mouseY =25;
// We really need this
var TWO_PI = Math.PI * 2;

// This gets a reference to the canvas in the browser
var canvas = document.querySelector("canvas");

// This sets the width and height to the document window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Be aware that when you resize the window, you will need to call (do) this again
var width = canvas.width;
var height = canvas.height;
// This creates a 2d drawing 'context' in your canvas
// All your drawing will be done in this canvas
var context = canvas.getContext("2d");
//This tells the browser to get the mouse information from the function we've called getMouse
canvas.addEventListener('mousemove', getMouse, false);
//here's our function 'getMouse'.
function getMouse(mousePosition) {
    mouseX = mousePosition.layerX;
    mouseY = mousePosition.layerY;
}


var hue = 0;
var frameCount = 0;
// noise.seed(Math.random());
context.fillRect(0, 0, width, height);

function draw() {
    context.fillStyle = 'rgba(0,0,0,0.01)';//blackground is black
    context.fillRect(0, 0, width, height);

    for (let angle = 0; angle <360; angle +=(360/5)){
        context.save();//like push()
        context.translate(width/2, height/2);

        var degrees = angle * Math.PI / 180;
        context.rotate(degrees + frameCount*0.01);
        context.fillStyle =  'hsl('+hue+', 100%, 70%)';

        var freq = frameCount * 0.02;
        var amp = 300;
        var noiseVal = Math.abs(noise.perlin2(freq,height/2))*amp;
        //console.log(noiseVal);
        freq = frameCount * 0.035;
        amp = noiseVal*1.1;
        var dist = Math.sin(freq+Math.random()*0.1)*amp ;
        // console.log(noiseVal);
        context.fillRect(dist,0,1,1);
        drawLine(1,dist,hue);
        context.restore();//like pop()
    }

    if (hue <= 359){
        hue+= 1;
    }else{
        hue = 0;
    }
    frameCount +=1;
    requestAnimationFrame(draw);
}

//request the first animation frame
requestAnimationFrame(draw);
//the end.

function drawLine(lineWidth, endPoint,hue){
    context.lineWidth = lineWidth;
    context.strokeStyle = 'hsl('+hue+', 100%, 70%)';
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(endPoint,0);
    context.stroke();
    context.closePath();
}