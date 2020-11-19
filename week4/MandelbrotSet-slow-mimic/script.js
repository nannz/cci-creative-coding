var mouseX = 1;
var mouseY = 1;

var canvas = document.querySelector("canvas");
canvas.addEventListener('mousemove', getMouse, false);

var width = 600;//window.innerWidth;
var height = 600;//window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

var z,zx,zy=0;//So these are variables that hold the absolute value of z, and the x and y coordinates that we use to represent z
var cx,cy=0;//These are variables we use to represent the complex number c - which is a pixel location.
var maxIterations=50;//We calculate the fractal by running a test over and over again for each pixel. The size of this number is the maximum number of tests
var res=1;//2;

var minVal = -2;
var maxVal = 2;

//try using the pixel
var imageWidth = width;
var imageHeight = height;

var imageData = context.getImageData(0, 0, imageWidth, imageHeight);

context.translate(width*0.5,height*0.5);//As always with proper stuff, we translate so that 0,0 is in the middle.
var mouseMapped_min = -2;
var mouseMapped_max = 2;

//function draw() {
var draw = function() {
    mouseMapped_min = map(mouseX, 0, width, -2,0);
    mouseMapped_max = map(mouseY, 0, width, 2, 0);
    minVal = mouseMapped_min;
    maxVal = mouseMapped_max;
    // console.log(mouseMapped);
//We are going to test every single pixel on the screen, so we need nested for loops.
    for (var i = -(width / 2); i < width / 2; i += res) {//for every pixel in the x dimension (columns)...
        for (var j = -(width / 2); j < width / 2; j += res) {//...run through all the y pixels
            //cx=i/(width/4);//adjust the values of x so that it is between -2 and 2, as this is where the mandelbrot is!!
            //cy=j/(width/4);//same for y. These two lines have given us the complex number c, which is just (cx,cy)
            //my way of doing the mapping
            cx = map(i, -(width / 2), width / 2, minVal, maxVal);//originally -2 to 2
            cy = map(j, -(width / 2), width / 2, minVal, maxVal);//originally -2 to 2

            var greyScale = 0;
            var col = 0;
            //1-the original for-loop
            for (var test = 0; test < maxIterations; test++) {//now we run the test as many times as we want. the more we run it the longer it takes
                if (z < 2.0) {//so only run the test if the square of the absolute value of z is less than 2.0 - that's what gives the Mandelbrot its shape.
                    var x = (zx * zx) - (zy * zy);//this is z(x)
                    var y = 2 * (zx * zy);//this is z(y)
                    zx = x + cx;//then we add cx to x to get the next value of zx
                    zy = y + cy;//and then add cy to y to get the next value of zy
                    z = Math.sqrt((zx * zx) + (zy * zy));//Now we get the square of the absolute value of z so that we can see if it's over 2 the next time we run the test. If it is, we don't do anything

                    greyScale = map(test, 0, maxIterations, 0, 255);
                    //var greyScaleMap = map(test, 0, maxIterations, 0, 1);
                    //greyScale = map(Math.sqrt(greyScaleMap),0,1,0,255 );

                    col = 255 - (255 / maxIterations) * test;
                    //context.fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';//the colour we use depends on how many tests we had to do before the value of z got bigger than 2.

                }
                if(test === maxIterations){
                    greyScale = 0;
                    col = 0
                }
            }
            //do the coloring stuff
                //maybe we can define the greyScale here outside of the loop
                z = 0;
                zx = 0;
                zy = 0;

            //do the pixel drawing, i-x;j-y
            var pixel = ((i + width/2) + (j+width/2)*width)*4;
            imageData.data[pixel] = greyScale;
            imageData.data[pixel+1] = greyScale;
            imageData.data[pixel+2] = greyScale;
            imageData.data[pixel+3] = 255;
        }
    }
    context.putImageData(imageData,0,0);
    requestAnimationFrame(draw);
}

//draw();
requestAnimationFrame(draw);

//and that's how you calculate the Mandelbrot set!

function map(n, start1, stop1, start2, stop2){
    const newVal = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    // if (start2 < stop2) {
    //     return this.constrain(newval, start2, stop2);
    // } else {
    //     return this.constrain(newval, stop2, start2);
    // }
    return newVal;
}

function constrain(n, low, high){
    return Math.max(Math.min(n, high), low);
}

function getMouse(mousePosition) {

    if (mousePosition.layerX || mousePosition.layerX === 0) {
        mouseX = mousePosition.layerX;
        mouseY = mousePosition.layerY;
    } else if (mousePosition.offsetX || mousePosition.offsetX === 0) {
        mouseX = mousePosition.offsetX;
        mouseY = mousePosition.offsetY;
    }
}