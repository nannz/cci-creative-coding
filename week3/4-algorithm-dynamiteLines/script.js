//version log:
//test the parametric line theory

// This is where we are going to store the mouse information
var mouseX =175;
var mouseY =25;
// We really need this
var TWO_PI = Math.PI * 2;
var NUM_LINES = 10;

// This gets a reference to the canvas in the browser
var canvas = document.querySelector("canvas");

// This sets the width and height to the document window
canvas.width = 500;//window.innerWidth;
canvas.height = 500;//window.innerHeight;
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


var t = 0.0;
var hue = 0;
var r = 0;
var g = 200;
var b = 160;
// This function translates the canvas so that we're looking at it from a different position, meaning that 0,0 is somewhere else
function draw() {
    //clear the screen
    context.fillStyle = 'rgba(0,0,0,0.1)';//blackground is black
    context.fillRect(0, 0, width, height);
    // context.clearRect(0,0, canvas.width, canvas.height);
    //context.moveTo(width/2, height/2);//not work for translate().
    //draw circles
    context.beginPath();
    for (let i = 0; i < NUM_LINES; i++){
        //context.strokeStyle = 'rgba('+r+','+g+','+b+',0.6)';
        context.strokeStyle = 'hsl('+hue+', 100%, 70%)';
        context.lineWidth = 1+Math.abs(Math.sin(t/10)*5);
        //start point: x1(t+i);y1(t+i);
        //end point: x2(t+i),y2(t+i));
        context.moveTo(x1(t+i)+width/2,y1(t+i)+height/2);
        context.lineTo(x2(t+i)+width/2,y2(t+i)+height/2);
    }
    context.stroke(); //draw the outline
    context.closePath();

    t += 0.5;

    if (hue <= 359){
        hue+= 1;
    }else{
        hue = 0;
    }
    requestAnimationFrame(draw);
}

//request the first animation frame
requestAnimationFrame(draw);
//the end.

//x->sin y-> cos => circle
//x-> sin1+sin2 can get a nearly circle but different shapes
//better to have lower amplitude if your frequency is higher.
function x1(t){//t is a float num
    return Math.sin(t/10)*100 + Math.sin(t)*10;//sin(freq)*amp
}
function y1(t){//t is a float num
    //divide t means lower the frequency ; multiply t means higher the frequency
    return Math.cos(-t/10)*100 + Math.sin(t/5)*50;
}
function x2(t){
    return Math.sin(t/10)*200 + Math.sin(t)*2 + Math.sin(t) *10;
}
function y2(t){
    return Math.cos(t/20)* 200 + Math.cos(t/12)*20;
}