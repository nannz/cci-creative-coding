
// We really need this
var TWO_PI = Math.PI * 2;


var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX =canvas.width/2;
var mouseY =canvas.height/2;

var context = canvas.getContext("2d");
//This tells the browser to get the mouse information from the function we've called getMouse
canvas.addEventListener('mousemove', getMouse, false);

//here's our function 'getMouse'.
function getMouse(mousePosition) {
    mouseX = mousePosition.layerX;
    mouseY = mousePosition.layerY;
}

var segments = Math.floor(Math.random()*1000);
var positionBaseX = canvas.width/2;
var positionBaseY = canvas.height/2;

// This function translates the canvas so that we're looking at it from a different position, meaning that 0,0 is somewhere else
function draw() {

    //var segments = Math.floor(Math.random()*1000);
    var spacing = TWO_PI / segments;
    var radius = 200;
    //clear the screen
    context.clearRect(0,0, canvas.width, canvas.height);

    //draw a circle with Path2D
    var ellipse = new Path2D();
    ellipse.arc(positionBaseX, positionBaseY, 25, 0, 2 * Math.PI);
    context.stroke(ellipse);

    //var jwCircle = new Path2D();//fail, cannot save the path as path2D
    drawJW(mouseX,mouseY,radius,spacing);



    requestAnimationFrame(draw);
}

//request the first animation frame
requestAnimationFrame(draw);
//the end.

function drawJW(x,y,r,spacing){
    var jwRadius = Math.random()*r;
    var jwCircle = new Path2D();
    //var segments = Math.floor(Math.random()*1000);
    context.save();//like push()
    context.translate(x, y);
    context.beginPath();
    for (var i = 0; i < segments; i++) {
        var hue = Math.floor(Math.random()*255);
        context.strokeStyle = 'hsl('+hue+', 90%, 70%)';//"#FF0000"; //set the line colour to black
        var xJW = Math.sin(spacing * i * (mouseX/50)) * Math.cos(spacing * i * (mouseY/50)) * jwRadius - jwRadius;
        var yJW = Math.sin(spacing * i* (mouseX/50)) * Math.sin(spacing * i * (mouseY/50)) * jwRadius - jwRadius;

        context.lineTo(xJW+jwRadius,yJW+jwRadius);
    }
    context.stroke(); //draw the outline
    context.closePath();
    context.restore();//like pop()

}