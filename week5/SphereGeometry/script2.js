var fov = 300;//can be variable

var canvas = document.querySelector("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

canvas.addEventListener('mousemove',getMouse,false);
var mouseX=0;
var mouseY=0;

var HALF_WIDTH = width / 2;
var HALF_HEIGHT = height / 2;

var dim = 20;
var theta = ((Math.PI * 2) / dim); // the spacing
var r = 200;//the size, radius
var numPoints = dim * dim;
var points = [];
var point3d = [];//like two dimensional arrays?

var x3d = 0;
var y3d = 0;
var z3d = 0;

//build the sphere and add it to the points array
for (var i = 0; i < dim; i ++){
    var latitude = map(i, 0, dim, 0, Math.PI);//wei du
    var z = r * Math.cos(latitude);//?????

    for (var j = 0; j< dim; j ++){
        var longitude = map(j, 0, dim, 0, Math.PI * 2);//jing du
        var x = r * Math.sin(latitude) * Math.cos(longitude);
        var y = r * Math.sin(longitude)*Math.sin(latitude);
        var point = [x,y,z];
        points.push(point);
    }
}

//translate to the centre
//context.translate(HALF_WIDTH,HALF_HEIGHT);

function draw() {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, width, height);


    //for mouse rotating interaction
    angleX=0.1* ((mouseX/width)-0.5)/4;
    angleY=0.1* ((mouseY/height)-0.5)/4;

    for (var i = 0; i < numPoints; i++) {
        point3d = points[i];
        z3d = point3d[2];

        if (z3d < -fov) z3d += 0;
        point3d[2] = z3d;

        //mouse interaction for rotating
        rotateX(point3d,angleX);
        rotateY(point3d,angleY);

        x3d = point3d[0];
        y3d = point3d[1];
        z3d = point3d[2];
        var scale = (fov / (fov + z3d));

        var x2d = (x3d * scale) + HALF_WIDTH ;//  / 2;
        var y2d = (y3d * scale) + HALF_HEIGHT;
        //draw
        context.lineWidth = scale;
        context.strokeStyle = "rgb(255,255,255)";
        //context.fillStyle = "rgb(255,255,255)";
        context.beginPath();
        context.moveTo(x2d, y2d);
        context.lineTo(x2d + scale*1, y2d);
        //context.closePath();
        context.stroke();

    }

    // points.forEach(function(point){
    //     //something code here.
    // });

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);



function rotateX(point3d,angleX) {
    var	x = point3d[0];
    var	z = point3d[2];

    var	cosRY = Math.cos(angleX);
    var	sinRY = Math.sin(angleX);

    var	tempz = z;
    var	tempx = x;

    x= (tempx*cosRY)+(tempz*sinRY);
    z= (tempx*-sinRY)+(tempz*cosRY);

    point3d[0] = x;
    point3d[2] = z;

}

function rotateY(point3d,angleY) {
    var y = point3d[1];
    var	z = point3d[2];

    var cosRX = Math.cos(angleY);
    var sinRX = Math.sin(angleY);

    var	tempz = z;
    var	tempy = y;

    y= (tempy*cosRX)+(tempz*sinRX);
    z= (tempy*-sinRX)+(tempz*cosRX);

    point3d[1] = y;
    point3d[2] = z;

}
//here's our function 'getMouse'.
function getMouse (mousePosition) {
//for other browsers..
    if (mousePosition.layerX || mousePosition.layerX === 0) { // Firefox?
        mouseX = mousePosition.layerX;
        mouseY = mousePosition.layerY;
    } else if (mousePosition.offsetX || mousePosition.offsetX === 0) { // Opera?
        mouseX = mousePosition.offsetX;
        mouseY = mousePosition.offsetY;
    }
}
function map(n, start1, stop1, start2, stop2){
    const newVal = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newVal;
}

function constrain(n, low, high){
    return Math.max(Math.min(n, high), low);
}