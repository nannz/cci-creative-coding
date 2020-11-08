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
// This function translates the canvas so that we're looking at it from a different position, meaning that 0,0 is somewhere else
function draw() {
    //clear the screen
    context.fillStyle = 'rgba(0,0,0,0.1)';//blackground is black
    context.fillRect(0, 0, width, height);
    //context.moveTo(width/2, height/2);//not work for translate().

    for (let angle = 0; angle <360; angle +=72){
        context.save();//like push()
        context.translate(width/2, height/2);

        var degrees = angle * Math.PI / 180;
        context.rotate(degrees + frameCount*0.01);
        context.fillStyle =  'hsl('+hue+', 100%, 70%)';
        context.fillRect(25,25,200,200);
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