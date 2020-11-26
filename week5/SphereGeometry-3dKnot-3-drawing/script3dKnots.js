//use the mimic example as the start point
//instead of using my own triangle strips...(cuz there is a bug..
//this version - knot3:
//try to draw it frame by frame, instead of directly show it.

//3D Knots reference:
//http://paulbourke.net/geometry/knots/
//https://en.wikipedia.org/wiki/Knot_theory

//knot in this version: Knot3 by Paul Bourke
// This is an example of a torus knot which exists on the surface a torus.
// It is characterised by the number of time it wraps around the meridian and
// longitudinal axis of a torus.

// by nan zhao 2020.11.26

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
var size = 100;

//intialize the xyz, for generating the points in the loop; for performance
var x=0;
var y = 0;
var z = 0;
var hue = 0;

//for getting the projected in 2d from the 3d points
//https://en.wikipedia.org/wiki/3D_projection
var projection = [
    [1,0,0],
    [0,1,0]
]

var strokeColorArray = [];
var strokeColor = "rgb(255,255,255)";

//for the Knot 3
var segments = 1000;
var sizeKnot = 200;
var nlongitude = 7;
var nmeridian = 4;
var mu = 0;
//for knotDrawing
var k = 0;
var knotPoints = [];

function draw() {
    var points = [];

    // knotPoints = generateKnot(knotPoints);

    mu = k * Math.PI * 2 * nmeridian / segments;
    var x = Math.cos(mu) * (1 + Math.cos(nlongitude * mu / nmeridian) / 2.0 );
    var y = Math.sin(mu) * (1 + Math.cos(nlongitude * mu / nmeridian) / 2.0);
    var z = Math.sin(nlongitude * mu / nmeridian) / 2.0;
    x = x * sizeKnot;
    y = y * sizeKnot;
    z = z * sizeKnot;
    var point = [x,y,z];
    knotPoints.push(point);

    var colorSpacing = map(k, 0, segments, 0, 360);
    //var strokeColor = "rgb("+ x + "," + y + "," + z + ")";
    //var strokeColor = "rgb(255," + colorSpacing + ",255)";
    var strokeColor =  "hsl("+colorSpacing+", 100%, 70%)";
    strokeColorArray.push(strokeColor);

    k += 1;

    if (k === segments) {
        k = 0;
        knotPoints.splice(0,knotPoints.length);//clear the array
    }

//----------------- I AM THE DIVIDER LINE ------------------//
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0, 0, width, height);

    //for mouse rotating interaction
    // angleX=0.1* ((mouseX/width)-0.5)/4;
    // angleY=0.1* ((mouseY/height)-0.5)/4;
    angleX+=0.00001;
    angleY+=0.00001;

    //in the for loop draw all the points and link them
    var numKnotPoints = knotPoints.length;



    for (var i = 0; i < numKnotPoints; i++) {
        knotPoint3d = knotPoints[i];
        z3d = knotPoint3d[2];

        // z3d -= 1.0;//the speed of the z,moves the points forwards in space
        if (z3d < -fov) z3d += 0;
        knotPoint3d[2] = z3d;

        //try another rotation matrix formula...
        //rotateX(knotPoint3d,angleX);
        //rotateY(knotPoint3d,angleY);
        myRotationX(knotPoint3d, angleX);
        myRotationY(knotPoint3d, angleY);
       // myRotationZ(knotPoint3d, angleY);

        x3d = knotPoint3d[0];
        y3d = knotPoint3d[1];
        z3d = knotPoint3d[2];

        var scale = (fov / (fov + z3d));
        var knotPoint2d = matrixMul(projection,knotPoint3d);
        var x2d = knotPoint2d[0];//(x3d * scale) ;//+ HALF_WIDTH / 2;
        var y2d = knotPoint2d[1];//(y3d * scale) ;//+ HALF_HEIGHT;

        if (i===0){//store the first points and use them at the end.
            firstx2d=x2d;
            firsty2d=y2d;
            firstScale=scale;

            lastx2d=x2d;
            lasty2d=y2d;
            lastScale=scale;
        }

        // Draw the point
        // Set the size based on scaling
        context.lineWidth = scale* 20 * Math.abs(Math.sin(segments));
        context.save();
        context.translate(HALF_WIDTH,HALF_HEIGHT);

        //context.strokeStyle = "rgb(255,255,255)";
        context.strokeStyle = strokeColorArray[i];
        context.lineCap = "round";
       // context.strokeStyle =  "hsl("+hue+", 100%, 70%)";
        context.beginPath();
        context.moveTo(lastx2d + lastScale, lasty2d);
        context.lineTo(x2d + scale, y2d);
        //context.closePath();
        context.stroke();
        context.restore();

        // Store the last point so we can join it to the next one.
        lastx2d=x2d;
        lasty2d=y2d;
        lastScale=scale;

        // if it's the end of the current ring, join it to the first
        // if (i===numKnotPoints-1) {
        //     context.lineWidth = scale;
        //     //context.strokeStyle = "rgb(255,255,255)";
        //     context.beginPath();
        //     context.moveTo(lastx2d + lastScale, lasty2d);
        //     context.lineTo(firstx2d + firstScale, firsty2d);
        //     context.stroke();
        // }
    }


    // hue += 0.5;
    // if(hue === 359) hue = 0;

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

function generateKnot(knotPoints){
    for (var k = 0; k < segments; k ++){
        mu = k * Math.PI * 2 * nmeridian / segments;
        var x = Math.cos(mu) * (1 + Math.cos(nlongitude * mu / nmeridian) / 2.0 );
        var y = Math.sin(mu) * (1 + Math.cos(nlongitude * mu / nmeridian) / 2.0);
        var z = Math.sin(nlongitude * mu / nmeridian) / 2.0;
        x = x * sizeKnot;
        y = y * sizeKnot;
        z = z * sizeKnot;
        var point = [x,y,z];
        knotPoints.push(point);

        var colorSpacing = map(k, 0, segments, 0, 360);
        //var strokeColor = "rgb("+ x + "," + y + "," + z + ")";
        //var strokeColor = "rgb(255," + colorSpacing + ",255)";
        var strokeColor =  "hsl("+colorSpacing+", 100%, 70%)";
        strokeColorArray.push(strokeColor);
    }
    return knotPoints;
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

//for rotation Matrix : https://en.wikipedia.org/wiki/Rotation_matrix
var angleYY = 0;
var rotationMatrixY = [
    [Math.cos(angleYY), 0, - Math.sin(angleYY)],
    [ 0, 1, 0],
    [Math.sin(angleYY), 0, Math.cos(angleYY)]
]
function myRotationY(point3d, angleY){//a is the matrix, b is the point with xyz values
    var rotationMatrixY = [
        [Math.cos(angleY), 0, Math.sin(angleY)],
        [ 0, 1, 0],
        [- Math.sin(angleY), 0, Math.cos(angleY)]
    ];

    var newX = rotationMatrixY[0][0]*point3d[0] + rotationMatrixY[0][1]*point3d[1]+ rotationMatrixY[0][2]*point3d[2];
    var newY = rotationMatrixY[1][0]*point3d[0] + rotationMatrixY[1][1]*point3d[1]+ rotationMatrixY[1][2]*point3d[2];
    var newZ = rotationMatrixY[2][0]*point3d[0] + rotationMatrixY[2][1]*point3d[1]+ rotationMatrixY[2][2]*point3d[2];
    point3d[0] = newX;
    point3d[1] = newY;
    point3d[2] = newZ;
}

function myRotationX(point3d, angleX){
    var rotationMatrixX = [
        [ 1, 0, 0],
        [0, Math.cos(angleX), - Math.sin(angleX)],
        [0, Math.sin(angleX), Math.cos(angleX)]
    ];
    var newX = rotationMatrixX[0][0]*point3d[0] + rotationMatrixX[0][1]*point3d[1]+ rotationMatrixX[0][2]*point3d[2];
    var newY = rotationMatrixX[1][0]*point3d[0] + rotationMatrixX[1][1]*point3d[1]+ rotationMatrixX[1][2]*point3d[2];
    var newZ = rotationMatrixX[2][0]*point3d[0] + rotationMatrixX[2][1]*point3d[1]+ rotationMatrixX[2][2]*point3d[2];
    point3d[0] = newX;
    point3d[1] = newY;
    point3d[2] = newZ;
}
function myRotationZ(point3d, angleX){
    var rotationMatrixZ = [
        [ Math.cos(angleX), - Math.sin(angleX), 0],
        [Math.sin(angleX), Math.cos(angleX), 0],
        [0, 0, 1]
    ];
    var newX = rotationMatrixZ[0][0]*point3d[0] + rotationMatrixZ[0][1]*point3d[1]+ rotationMatrixZ[0][2]*point3d[2];
    var newY = rotationMatrixZ[1][0]*point3d[0] + rotationMatrixZ[1][1]*point3d[1]+ rotationMatrixZ[1][2]*point3d[2];
    var newZ = rotationMatrixZ[2][0]*point3d[0] + rotationMatrixZ[2][1]*point3d[1]+ rotationMatrixZ[2][2]*point3d[2];
    point3d[0] = newX;
    point3d[1] = newY;
    point3d[2] = newZ;
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

function matrixMul(a, b){//a is the matrix, b is the point3d. in this case
    var colsA = a[0].length;//列
    var rowsA = a.length;//行
    //var colsB = b[0].length;
    var rowsB = b.length;
    //for fault case
    if(colsA != rowsB){
        return null;
    }

    var sum1 = a[0][0]*b[0] + a[0][1]*b[1]+ a[0][2]*b[2];
    var sum2 = a[1][0]*b[0] + a[1][1]*b[1]+ a[1][2]*b[2];
    var result = [sum1, sum2];
    return result;

}
