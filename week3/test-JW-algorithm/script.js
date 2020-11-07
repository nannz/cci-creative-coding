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

// This function translates the canvas so that we're looking at it from a different position, meaning that 0,0 is somewhere else
function draw() {

    var segments = 100;
    var spacing = TWO_PI / segments;
    var radius = 200;
    //clear the screen
    context.clearRect(0,0, canvas.width, canvas.height);

    //draw circles

    context.beginPath();

    for (var i = 0; i < segments; i++) {

        context.strokeStyle = "#FF0000"; //set the line colour to black
        var x = Math.sin(spacing * i * (mouseX/50)) * Math.cos(spacing * i * (mouseY/50)) * radius;
        var y = Math.sin(spacing * i* (mouseX/50)) * Math.sin(spacing * i * (mouseY/50)) * radius;

        context.lineTo(x+radius,y+radius);
    }

    context.stroke(); //draw the outline
    context.closePath();
    requestAnimationFrame(draw);
}

//request the first animation frame
requestAnimationFrame(draw);
//the end.
