
var mouseX = 1;
var mouseY = 1;
var imageObj = new Image();
imageObj.onload = function(){
    console.log('image loaded');
};
imageObj.src = "pic2.jpg";
var canvas = document.getElementById('myCanvas');
var canvas2 = document.getElementById('myCanvas2');
canvas.addEventListener('mousemove', getMouse, false);

var context = canvas.getContext('2d');
var context2 = canvas2.getContext('2d');
var imageWidth = imageObj.width;
var imageHeight = imageObj.height;

context2.drawImage(imageObj, 0, 0);

var imageData = context2.getImageData(0, 0, imageWidth, imageHeight);
var data = imageData.data;
var imageData2 = context.getImageData(0, 0, imageWidth, imageHeight);
//var imageData2 = imageData;


var draw = function() {


    for(var i = 0; i < imageHeight; i++) {//y
        // loop through each row
        for(var j = 0; j < imageWidth; j++) {//x

            imageData2.data[((imageWidth * i) + j) * 4] = data[((imageWidth * i) + j) * 4];
            imageData2.data[((imageWidth * i) + j) * 4+1] = data[((imageWidth * i) + j) * 4 + 1];
            imageData2.data[((imageWidth * i) + j) * 4+2] = data[((imageWidth * i) + j) * 4 + 2];
            imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * i) + j) * 4 + 3];

        }
    }

    context.putImageData(imageData2,0,0);
    requestAnimationFrame(draw);
};



requestAnimationFrame(draw);

function getMouse(mousePosition) {

    if (mousePosition.layerX || mousePosition.layerX === 0) {
        mouseX = mousePosition.layerX;
        mouseY = mousePosition.layerY;
    } else if (mousePosition.offsetX || mousePosition.offsetX === 0) {
        mouseX = mousePosition.offsetX;
        mouseY = mousePosition.offsetY;
    }
}