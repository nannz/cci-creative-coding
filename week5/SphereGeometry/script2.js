//progress
//1.matrix multiplication method
//2.draw the triangle strips by calculating the point below and the point beside

//wait to update
//1. debug the empty strip
//2. apply the formula

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
var point3d = [];
var point3d2 = [];//for drawing the triangle strips
var point3d3 = [];
var x3d = 0;
var y3d = 0;
var z3d = 0;
var x3d2 = 0;
var y3d2 = 0;
var z3d2 = 0;
var x3d3 = 0;
var y3d3 = 0;
var z3d3 = 0;

//for getting the projected in 2d from the 3d points
//https://en.wikipedia.org/wiki/3D_projection
var projection = [
    [1,0,0],
    [0,1,0]
]
var pointTest = [100, 10, 50];
var resultTest = matrixMul(projection, pointTest);
//console.log(resultTest);

//build the sphere and add it to the points array
for (var i = 0; i < dim; i ++){
    var latitude = map(i, 0, dim, 0, Math.PI);//wei du
    var z = r * Math.cos(latitude);

    for (var j = 0; j< dim; j ++){
        var longitude = map(j, 0, dim, 0, Math.PI * 2);//jing du
        var x = r * Math.sin(latitude) * Math.cos(longitude);
        var y = r * Math.sin(longitude)*Math.sin(latitude);
        var point = [x,y,z];
        points.push(point);
    }
}
console.log(points.length);

//translate to the centre
//context.translate(HALF_WIDTH,HALF_HEIGHT);

function draw() {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, width, height);


    //for mouse rotating interaction
    angleX = 0.1 * ((mouseX / width) - 0.5) / 4;
    angleY = 0.1 * ((mouseY / height) - 0.5) / 4;


    //try another way to do the drawing, like two-dimensional arrays
    for (var i = 0; i < dim; i++) {
        context.beginPath();
        context.strokeStyle = "rgb(255,255,255)";
        context.fillStyle = "rgb(255,255,255)";

        for (var j = 0; j < dim-1; j++) {
            var index = j + i * dim;
            var index2 = j + (i + 1) * dim;//the one below
            if(index2>=400)index2 = 399;
            var index3 = index + 1;//the one on the right
            if(index3>=400)index3 = 399;

            //the three points to connect as a triangle
            point3d = points[index];
            point3d2 = points[index2];
            point3d3 = points[index3];

            z3d = point3d[2];
            z3d2 = point3d2[2];
            z3d3 = point3d3[2];
            if (z3d < -fov) z3d += 0;
            if (z3d2 < -fov) z3d2 += 0;
            if (z3d3 < -fov) z3d3 += 0;
            point3d[2] = z3d;
            point3d2[2] = z3d2;
            point3d3[2] = z3d3;

            //convert 3d to 2d points, with matrixMultiplication,
            var point2d = matrixMul(projection,point3d);//threeDtoTwoD(point3d, fov);
            var point2d2 = matrixMul(projection,point3d2);//threeDtoTwoD(point3d2, fov);
            var point2d3 = matrixMul(projection,point3d3);//threeDtoTwoD(point3d3, fov);
            x3d = point3d[0];
            y3d = point3d[1];
            z3d = point3d[2];
            var scale = (fov / (fov + z3d));
            var x2d = point2d[0];//(x3d * scale) + HALF_WIDTH;//  / 2;
            var y2d = point2d[1];//(y3d * scale) + HALF_HEIGHT;
            var x2d2 = point2d2[0];
            var y2d2 = point2d2[1];
            var x2d3 = point2d3[0];
            var y2d3 = point2d3[1];


            //i need to convert 3d values into 2d values for context.lineTo()!
            context.lineWidth = scale;

            //draw the triangle strips!
            context.save();
            context.translate(HALF_WIDTH,HALF_HEIGHT);
            context.beginPath();
            context.moveTo(x2d, y2d);
            context.lineTo(x2d2, y2d2);
            context.lineTo(x2d3, y2d3);
            context.closePath();
            context.restore();
            if(i%2 === 0 || j%2 === 0){
                context.fill();
            }else{
                context.stroke();
            }
            context.fill();
        }
        context.closePath();
        //context.stroke();
    }
    //mouse interaction and rotation
    for (var w = 0; w < numPoints; w++) {
        point3d = points[w];
        rotateX(point3d,angleX);
        rotateY(point3d,angleY);
    }
    requestAnimationFrame(draw);
}

/*
    //the original way of drawing
    for (var w = 0; w < numPoints; w++) {
        point3d = points[w];

        //if for testing
        if(w == 0){
            var projected2d = matrixMul(projection, point3d);
        }
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

        //draw the individual dots (format as lines) - MIMIC from the example
        context.lineWidth = scale;
        context.strokeStyle = "rgb(255,255,255)";
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

 */

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

//3d to 2d
function threeDtoTwoD(point3d, fov){
    var scale = (fov / (fov + point3d[2]));
    var x2d = (x3d * scale) + HALF_WIDTH;//  / 2;
    var y2d = (y3d * scale) + HALF_HEIGHT;
    var point2d = [x2d, y2d];
    return point2d;
}
//matrix multiple, to convert a 3d point into 2d space
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