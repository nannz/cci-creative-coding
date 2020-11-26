//super shape
//formula: http://paulbourke.net/geometry/supershape/
//inspirations: https://www.syedrezaali.com/3d-supershapes/
//wiki: https://en.wikipedia.org/wiki/Spherical_coordinate_system
//
//this super shape script
// enables you to see the stretches and changes on the shape
// when moving the mouse
//Nan 2020.11

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
var hue = 0;

//variables for super shapes
var m = 0;
var a = 1; //a can be changed each frame
var b = 1;
var aChange = 0;
var bChange = 0;
var nChange = 0;
var n1 = 0.2;
var n2 = 1.7;
var n3 = 1.7;

function draw() {
    var points = [];

    m = map(mouseX, 0, width, 0, 10);
    //n1 = map(mouseY, 0, height, -1, 1);
    a = map(Math.sin(aChange),-1,1,0.95,1.05 );
    b = map(Math.cos(bChange),-1,1,0.95,1.05 );
    n1 =map(Math.sin(m),-1,1,-1,1 );//map(Math.sin(nChange), -1, 1, -0.5, 0.5);
    //n2 = 0.05 + Math.sin(10);//map(Math.sin(m), -1, 1, 0.5,1.5);
   // n3 = n2;
    aChange += 0.01;
    bChange += 0.01;

    // Now we build the sphere in the loop to do the change
    for (var i =0; i < dim ; i++) {//dim ; i++) {
        //hue = map(i, 0, dim, 0, 360);
        var latitude = map(i, 0, dim, - Math.PI/2, Math.PI/2);//wei du
        //var s = size * Math.sin(spacing /2 * i);//i);// Calculate the size of the current ring
        var r2 = superShape(latitude,m, n1, n2, n3);

        for (var j = 0; j < dim; j++ ) {//dim; j++ ) {// For each ring..
            var longitude = map(j, 0, dim, - Math.PI, Math.PI);//jing du
            // ...create the next point in the circle at the current size s, at the current depth z
            var r1 = superShape(longitude,m,n1,n2,n3);
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
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, width, height);

    //for mouse rotating interaction
    //angleX=0.1* ((mouseX/width)-0.5)/4;
    //angleY=0.1* ((mouseY/height)-0.5)/4;
    angleX+=0.03;
    angleY+=0.03;

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

        if (j===0){//store the first points and use them at the end.
            firstx2d=x2d;
            firsty2d=y2d;
            firstScale=scale;

            lastx2d=x2d;
            lasty2d=y2d;
            lastScale=scale;
        }

        // Draw the point
        // Set the size based on scaling
        context.lineWidth = scale*2;
        context.save();
        context.translate(HALF_WIDTH,HALF_HEIGHT);
        context.lineCap = "round";
        // context.strokeStyle = "rgb(255,255,255)";

        //context.strokeStyle = "rgb(255,255,255)";
        context.strokeStyle =  "hsl("+hue+", 100%, 80%)";
        context.beginPath();
        //context.moveTo(x2d, y2d);
        context.moveTo(lastx2d + lastScale, lasty2d);
        context.lineTo(x2d + scale, y2d);
        //context.closePath();
        //context.fill();
        context.stroke();
        context.restore();

        // Store the last point so we can join it to the next one.
        lastx2d=x2d;
        lasty2d=y2d;
        lastScale=scale;

        // if it's the end of the current ring, join it to the first
        if (j===dim-1) {
            context.lineWidth = scale;
            //context.strokeStyle = "rgb(255,255,255)";
            context.beginPath();
            context.moveTo(lastx2d + lastScale, lasty2d);
            context.lineTo(firstx2d + firstScale, firsty2d);
            context.stroke();
        }
    }
    context.fillStyle =  "hsl("+hue+", 100%, 70%)";
    context.font = '48px "Courier New", Courier, monospace';
    context.fillText('W6-Super Shape', 10, 50);
    context.font = '32px "Courier New", Courier, monospace';
    context.fillText('Nan 2020.11', 10, 90);

    hue += 1;
    if(hue === 359) hue = 0;

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

//http://paulbourke.net/geometry/supershape/
//there are global virables a and b
function superShape(angle, m, n1, n2, n3){
    var t1 = Math.abs((1/a)* Math.cos(m*angle / 4));
    t1 = Math.pow(t1, n2);
    var t2 = Math.abs((1/b)*Math.sin(m*angle / 4));
    t2 = Math.pow(t2, n3);
    var t3 = t1 + t2;
    var r = Math.pow(t3, (-1)/n1);
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
