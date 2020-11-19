
var mouseX=0;
var mouseY=0;
var imageObj = new Image();
imageObj.onload = function(){
    console.log('image loaded');
};
imageObj.src = "zolner.jpg";
//imageObj.src = "pic2.jpg";

var canvas = document.getElementById('myCanvas');
var canvas2 = document.getElementById('myCanvas2');

var context = canvas.getContext('2d');
var context2 = canvas2.getContext('2d');
var imageWidth = imageObj.width;
var imageHeight = imageObj.height;

context2.drawImage(imageObj, 0, 0);

var imageData = context2.getImageData(0, 0, imageWidth, imageHeight);
var data = imageData.data;

// This will hold the X gradient
var imageData2 = context.getImageData(0, 0, imageWidth, imageHeight);

// This will hold the Y gradient
var imageData3 = context.getImageData(0, 0, imageWidth, imageHeight);


// iterate over all pixels
for(var i = 1; i < imageHeight-1; i++) {

    // This is the row above
    var collm1 = (i - 1) * imageWidth;
    // This is the row below
    var collp1 = (i + 1) * imageWidth;

    // loop through each row
    for (var j = 1; j < imageWidth - 1; j++) {

        // This is the X gradient
        imageData2.data[((imageWidth * i) + j) * 4] = (-1 * (data[((imageWidth * i) + j - 1) * 4])) + (data[((imageWidth * i) + j + 1) * 4]);
        imageData2.data[((imageWidth * i) + j) * 4 + 1] = (-1 * (data[((imageWidth * i) + j - 1) * 4 + 1])) + (data[((imageWidth * i) + j + 1) * 4]);
        imageData2.data[((imageWidth * i) + j) * 4 + 2] = (-1 * (data[((imageWidth * i) + j - 1) * 4 + 2])) + (data[((imageWidth * i) + j + 1) * 4]);
        imageData2.data[((imageWidth * i) + j) * 4 + 3] = 255;

// This is the Y gradient
        imageData3.data[((imageWidth * i) + j) * 4] += (-1 * (data[((collm1) + j - 1) * 4])) + (data[((collp1) + j + 1) * 4]);
        imageData3.data[((imageWidth * i) + j) * 4 + 1] += (-1 * (data[((collm1) + j - 1) * 4 + 1])) + (data[((collp1) + j + 1) * 4]);
        imageData3.data[((imageWidth * i) + j) * 4 + 2] += (-1 * (data[((collm1) + j - 1) * 4 + 2])) + (data[((collp1) + j + 1) * 4]);
        imageData3.data[((imageWidth * i) + j) * 4 + 3] += 255;

// Can you calculate the magnitude and direction vector? Look at the C++ example for a hint on how to do this


    }
}
// view X gradient
context.putImageData(imageData2,0,0);

// view Y gradient
// context.putImageData(imageData3,0,0);