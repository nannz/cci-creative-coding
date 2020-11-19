
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
var zoomX = 1;
var zoomY = 1;
var offsetX = 0;
var offsetY = 0;
var anchorX = imageWidth/2;
var anchorY = imageHeight/2;

var draw = function() {
    var theta = mouseX / imageWidth * Math.PI * 2;
    zoomX = (mouseY-(mouseY/2)) * 0.1;
    zoomY = (mouseY-(mouseY/2)) * 0.15;

    for(var i = 0; i < imageHeight; i++) {//y
        // loop through each row
        for(var j = 0; j < imageWidth; j++) {//x

            var x = Math.floor((Math.cos(theta)/zoomX) * (j-(offsetX+anchorX)) - (Math.sin(theta)/zoomY) * (i-(offsetY+anchorY)))+anchorX;
            var y = Math.floor((Math.sin(theta)/zoomX) * (j-(offsetX+anchorX)) + (Math.cos(theta)/zoomY) * (i-(offsetY+anchorY)))+anchorY;

            imageData2.data[((imageWidth * i) + j) * 4] = data[((imageWidth * y) + x) * 4];
            imageData2.data[((imageWidth * i) + j) * 4+1] = data[((imageWidth * y) + x) * 4 + 1];
            imageData2.data[((imageWidth * i) + j) * 4+2] = data[((imageWidth * y) + x) * 4 + 2];
            imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * y) + x) * 4 + 3];
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