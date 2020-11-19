
var mouseX=0;
var mouseY=0;
var imageObj = new Image();
imageObj.onload = function(){
    console.log('image loaded');
};
//imageObj.src = "zolner.jpg";
imageObj.src = "pic2.jpg";

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
//this will hold the blur
var imageData4 = context.getImageData(0, 0, imageWidth, imageHeight);

var KENERAL = [0.0625,0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625];

// iterate over all pixels
for(var i = 1; i < imageHeight-1; i++) {
    // This is the row above and below
    var collm1 = (i - 1) * imageWidth;
    var collp1 = (i + 1) * imageWidth;

    // loop through each row
    for (var j = 1; j < imageWidth - 1; j++) {

        //keneral
        //column above
        var columnAboveR =  (data[((collm1) + j - 1) * 4])*KENERAL[0] + (data[((collm1) + j) * 4]) * KENERAL[1] + (data[((collm1) + j + 1) * 4])* KENERAL[2];
        var columnAboveG = (data[((collm1) + j - 1) * 4 + 1])*KENERAL[0] + (data[((collm1) + j) * 4 + 1]) * KENERAL[1] + (data[((collm1) + j + 1) * 4 + 1])* KENERAL[2];
        var columnAboveB = (data[((collm1) + j - 1) * 4 + 2])*KENERAL[0] + (data[((collm1) + j) * 4 + 2]) * KENERAL[1] + (data[((collm1) + j + 1) * 4 + 2])* KENERAL[2];
        //column here
        var columnHereR =  (data[((imageWidth * i) + j - 1) * 4]) * KENERAL[3] + (data[((imageWidth * i) + j) * 4]) * KENERAL[4] + (data[((imageWidth * i) + j + 1) * 4]) * KENERAL[5];
        var columnHereG =  (data[((imageWidth * i) + j - 1) * 4 + 1]) * KENERAL[3] + (data[((imageWidth * i) + j) * 4 + 1]) * KENERAL[4] + (data[((imageWidth * i) + j + 1) * 4 + 1]) * KENERAL[5];
        var columnHereB =  (data[((imageWidth * i) + j - 1) * 4 + 2]) * KENERAL[3] + (data[((imageWidth * i) + j) * 4 + 2]) * KENERAL[4] + (data[((imageWidth * i) + j + 1) * 4 + 2]) * KENERAL[5];
        //column below
        var columnBelowR =  (data[((collp1) + j - 1) * 4])*KENERAL[6] + (data[((collp1) + j) * 4]) * KENERAL[7] + (data[((collp1) + j + 1) * 4]) * KENERAL[8];
        var columnBelowG =  (data[((collp1) + j - 1) * 4 + 1])*KENERAL[6] + (data[((collp1) + j) * 4 + 1]) * KENERAL[7] + (data[((collp1) + j + 1) * 4 + 1]) * KENERAL[8];
        var columnBelowB =  (data[((collp1) + j - 1) * 4 + 2])*KENERAL[6] + (data[((collp1) + j) * 4 + 2]) * KENERAL[7] + (data[((collp1) + j + 1) * 4 + 2]) * KENERAL[8];
        //Edge: if <0 or >imageWidth, then equals to the current column.

        //this is the blur
        imageData4.data[((imageWidth * i) + j) * 4] = columnAboveR + columnHereR + columnBelowR;
        imageData4.data[((imageWidth * i) + j) * 4 + 1] = columnAboveG + columnHereG + columnBelowG;
        imageData4.data[((imageWidth * i) + j) * 4 + 2] = columnAboveB + columnHereB + columnBelowB;
        imageData4.data[((imageWidth * i) + j) * 4 + 3] = 255;


/*
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
*/

// Can you calculate the magnitude and direction vector? Look at the C++ example for a hint on how to do this
//blur


    }
}
// view blur
context.putImageData(imageData4,0,0);
// view X gradient
//context.putImageData(imageData2,0,0);
// view Y gradient
// context.putImageData(imageData3,0,0);