
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
canvas.addEventListener('click', mouseClick, false);

//here's our function 'getMouse'.
function getMouse(mousePosition) {
    mouseX = mousePosition.layerX;
    mouseY = mousePosition.layerY;
}
var frameCount = 0;
var jwCircles = [];//new Array(5);
var showInstruction = true;
//mouseClick, add a new jwCircles
function mouseClick(){
    showInstruction = false;
    var jwCircle = new JWCircle(mouseX, mouseY, 200);
    jwCircles.push(jwCircle);
}


var segments = Math.floor(Math.random()*1000);
// var positionBaseX = canvas.width/2;
// var positionBaseY = canvas.height/2;



function draw() {

    //clear the screen
    context.clearRect(0,0, canvas.width, canvas.height);
    //the instruction
    if(showInstruction){
        context.font = '48px serif';
        context.fillText('Try Clicking', canvas.width/2, canvas.height/2);
    }

    //drawJW(mouseX,mouseY,radius,spacing);
    jwCircles.forEach(jwCircle=>{
        jwCircle.display();
        //jwCircle.displayCircles();
    });

    frameCount ++;
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

//test wrapping in a function
function drawJW(x,y,r,spacing){
    var jwRadius = Math.random()*r;
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