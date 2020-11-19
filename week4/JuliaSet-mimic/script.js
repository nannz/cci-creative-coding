var mouseX = 1;
var mouseY = 1;

var canvas = document.querySelector("canvas");
canvas.addEventListener('mousemove', getMouse, false);

var width = 600;//window.innerWidth;
var height = 600;//window.innerHeight;
var context = canvas.getContext("2d");
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

var cx,cy=0;//These are variables we use to represent the complex number c - which is a pixel location.
//for julia set below:
var ja = -0.7269;
var jb = -0.1889;

var maxIterations=50;//We calculate the fractal by running a test over and over again for each pixel. The size of this number is the maximum number of tests
var res=1;//2;

var minVal = -1.5;
var maxVal = 1.5;

//try using the pixel
var imageWidth = width;
var imageHeight = height;

var imageData = context.getImageData(0, 0, imageWidth, imageHeight);

context.translate(width*0.5,height*0.5);//As always with proper stuff, we translate so that 0,0 is in the middle.
//function draw() {
var draw = function() {
    ja = map(mouseX, 0, width, -1, 0);
    jb = map(mouseY, 0, height, -0.5, 0.5);

//We are going to test every single pixel on the screen, so we need nested for loops.
    for (var i = -(width / 2); i < width / 2; i += res) {//for every pixel in the x dimension (columns)...
        for (var j = -(width / 2); j < width / 2; j += res) {//...run through all the y pixels
            //cx=i/(width/4);//adjust the values of x so that it is between -2 and 2, as this is where the mandelbrot is!!
            //cy=j/(width/4);//same for y. These two lines have given us the complex number c, which is just (cx,cy)

            //mandel set: doing the mapping
            //cx = map(i, -(width / 2), width / 2, minVal, maxVal);//originally -2 to 2
            //cy = map(j, -(width / 2), width / 2, minVal, maxVal);//originally -2 to 2
            //if doing var cx and cy, it has a strangely better performance.
            var cx = map(i, -(width / 2), width / 2, minVal, maxVal);
            var cy = map(j, -(width / 2), width / 2, minVal, maxVal);
            //var ca = a;//for mandel set
            //var cb = b;//for mandel set

            //use while loop to do the julia
            //and the while loop can record the testNum, in which I can make it
            //black in the centre..
            //if does so in a for loop, i may need another variable to hold the value...
            var testNum = 0;
            while(testNum < maxIterations){
                var x = (cx * cx) - (cy * cy);//x
                var y = 2 * cx * cy;//y
                //instead of add z and y with cx, cy, we just add the julia number
                //there are tons of julia number sets on the wikipedia
                cx = x + ja;//ca;//- 0.7269
                cy = y + jb;//cb;//- 0.1889

                if ((cx*cx + cy*cy)>16){// this equals "Math.sqrt(x^2 + y^2)", means the distance from the point to the centre point is less than 4(Math.sqrt(16))
                    //console.log(a+" "+ b);
                    //console.log(testNum);//all zero
                    break;
                }
                testNum ++;
            }

            //var norm = map(testNum, 0, maxIterations, 0,1);
            //var bright = map(Math.sqrt(norm), 0, 1, 0, 255);
            var bright = map(testNum, 0, maxIterations, 0, 255);
            var r = map(testNum, 0, maxIterations, 0, 360);//Math.sqrt(testNum.toFixed(2)/maxIterations);
            //do the pixel drawing, i-x;j-y
            var pixel = ((i + width/2) + (j+width/2)*width)*4;
            if(testNum === maxIterations){
                imageData.data[pixel] = 0;
                imageData.data[pixel+1] = 0;
                imageData.data[pixel+2] = 0;
                imageData.data[pixel+3] = 255;
            }else{
                imageData.data[pixel] = r;//bright;
                imageData.data[pixel+1] = 50;//bright;
                imageData.data[pixel+2] = 80;//bright;
                imageData.data[pixel+3] = 255;
            }
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