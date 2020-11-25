//use the mimic example as the start point
//instead of using my own triangle strips...(cuz there is a bug..
//supershape reference:
//http://paulbourke.net/geometry/supershape/

var fov = 500;

var canvas = document.querySelector("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
canvas.addEventListener('mousemove',getMouse,false);
var mouseX=0;
var mouseY=0;

var point = [];
var point3d = [];
var angleX = 0;
var angleY = 0;
var HALF_WIDTH = width / 2;
var HALF_HEIGHT = height / 2;

var x3d = 0;
var y3d = 0;
var z3d = 0;

var lastScale = 0;
var lastx2d = 0;
var lasty2d = 0;

// The below code creates a sphere of points
var dim = 50; // This is the number of rings
// Each ring has as many points as there are rings
// This is the spacing for each ring
var spacing = ((Math.PI * 2) / dim);

// This is the total number of points
var numPoints = dim * dim;

// This is how big the sphere is.
var size = 200;
//intialize the xyz, for generating the points in the loop; for performance
var x=0;
var y = 0;
var z = 0;

function draw() {
    var points = [];
    // Now we build the sphere in the loop to do the change
    for (var i =0; i < dim ; i++) {//dim ; i++) {

        var latitude = map(i, 0, dim, - Math.PI/2, Math.PI/2);//wei du
        //var s = size * Math.sin(spacing /2 * i);//i);// Calculate the size of the current ring
        var r1 = superShape(latitude,7,0.2,1.7,1.7);

        for (var j = 0; j < dim; j++ ) {//dim; j++ ) {// For each ring..
            var longitude = map(j, 0, dim, - Math.PI, Math.PI);//jing du
            // ...create the next point in the circle at the current size s, at the current depth z
            var r2 = superShape(longitude,7,0.2,1.7,1.7);
            //var point = [Math.cos(spacing * j) * s,Math.sin(spacing * j) * s,z];
            x = size * r1 * Math.cos(longitude) * r2 * Math.cos(latitude);
            y = size * r1 * Math.sin(longitude) * r2 * Math.cos(latitude);
            z = size * r2 * Math.sin(latitude);//size * Math.cos(spacing / 2 * i);
            var point = [x,y,z];
            // Add the point to the geometry.
            points.push(point);
        }
    }

//----------------- I AM THE DIVIDER LINE ------------------//
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, width, height);

    //for mouse rotating interaction
    // angleX=0.1* ((mouseX/width)-0.5)/4;
    // angleY=0.1* ((mouseY/height)-0.5)/4;
    angleX+=0.01;
    angleY+=0.01;

    for (var i = 0; i < numPoints; i++) {
        point3d = points[i];
        z3d = point3d[2];

        // z3d -= 1.0;//the speed of the z,moves the points forwards in space

        if (z3d < -fov) z3d += 0;

        point3d[2] = z3d;

        rotateX(point3d,angleX);
        rotateY(point3d,angleY);

        x3d = point3d[0];
        y3d = point3d[1];
        z3d = point3d[2];

        var scale = (fov / (fov + z3d));

        var x2d = (x3d * scale) ;//+ HALF_WIDTH / 2;
        var y2d = (y3d * scale) ;//+ HALF_HEIGHT;

// Draw the point

// Set the size based on scaling
        context.lineWidth = scale;
        context.save();
        context.translate(HALF_WIDTH,HALF_HEIGHT);
        context.strokeStyle = "rgb(255,255,255)";
        context.beginPath();
        context.moveTo(x2d, y2d);
        context.lineTo(x2d + scale, y2d);
        context.stroke();
        context.restore();
    }
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

function superShape(angle, m, n1, n2, n3){
    var r = 1;
    return r;
}
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
