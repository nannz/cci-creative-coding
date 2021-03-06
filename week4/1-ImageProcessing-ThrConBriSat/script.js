
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

// console.log(data[((imageWidth * 10) + 10) * 4]);

var draw = function() {
    //---for contrast
    var mouseModContrast = mouseX/imageWidth;
    var contrastSub = 127*(1-mouseModContrast);
    //
    //---for brightness
    var mouseModBrightness = mouseX - imageWidth/2;

    // iterate over all pixels
    var R = 0;
    var G = 0;
    var B = 0;
    var luminance = 0.0;
    var mouseModLuminance = mouseX/imageWidth;
    var sv = 2*(mouseModLuminance); // saturation value. 0 = grayscale, 1 = original
    var luR = 0.3086; // constant to determine luminance of red. Similarly, for green and blue
    var luG = 0.6094;
    var luB = 0.0820;
    var az = (1 - sv)*luR + sv;
    var bz = (1 - sv)*luG;
    var cz = (1 - sv)*luB;
    var dz = (1 - sv)*luR;
    var ez = (1 - sv)*luG + sv;
    var fz = (1 - sv)*luB;
    var gz = (1 - sv)*luR;
    var hz = (1 - sv)*luG;
    var iz = (1 - sv)*luB + sv;


    for(var i = 0; i < imageHeight; i++) {//y
        // loop through each row
        for(var j = 0; j < imageWidth; j++) {//x
            //if for contrast and brightness, doesn't need ifElse statement.
            //for contrast: contrastSub + (data[((imageWidth * i) + j) * 4])*mouseMod
            //for brightness: data[((imageWidth * i) + j) * 4] + mouseMod;

            //calculate luminance: (0.2126*R + 0.7152*G + 0.0722*B).
            R = data[((imageWidth * i) + j) * 4];
            G = data[((imageWidth * i) + j) * 4 + 1];
            B = data[((imageWidth * i) + j) * 4 + 2];
            //luminance&saturation Algorithm: https://www.qoncious.com/questions/changing-saturation-image-html5-canvas-using-javascript
            luminanceSub = luminance/2*(1-mouseModLuminance);
            //luminance&saturation
            imageData2.data[((imageWidth * i) + j) * 4] = R*az + G*bz + B*cz;//R*mouseModLuminance*2 + luminanceSub;
            imageData2.data[((imageWidth * i) + j) * 4+1] = R*dz + G*ez + B*fz;//G*mouseModLuminance*2 +  luminanceSub;
            imageData2.data[((imageWidth * i) + j) * 4+2] = R*gz + G*hz + B*iz;//B*mouseModLuminance*2 +  luminanceSub;
            // This is the alpha - it makes stuff disappear.So perhaps leave this one alone unless you want the image to fade away
            imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * i) + j) * 4 + 3];

            //pixelThreshold(i,j);
            //pixelBrightness(i,j,mouseModBrightness);
            //pixelContrast(i,j,mouseModContrast,contrastSub);

        }
    }

    context.putImageData(imageData2,0,0);
    requestAnimationFrame(draw);
};



requestAnimationFrame(draw);
function pixelContrast(i,j,mouseModContrast,contrastSub){
    imageData2.data[((imageWidth * i) + j) * 4] = contrastSub + (data[((imageWidth * i) + j) * 4] * mouseModContrast*2);
    imageData2.data[((imageWidth * i) + j) * 4+1] = contrastSub + (data[((imageWidth * i) + j) * 4 + 1]) *  mouseModContrast*2;
    imageData2.data[((imageWidth * i) + j) * 4+2] = contrastSub + (data[((imageWidth * i) + j) * 4 + 2]) * mouseModContrast*2;
    imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * i) + j) * 4 + 3];
}
function pixelBrightness(i,j,mouseModBrightness){
    imageData2.data[((imageWidth * i) + j) * 4] = data[((imageWidth * i) + j) * 4] + mouseModBrightness;
    imageData2.data[((imageWidth * i) + j) * 4+1] = data[((imageWidth * i) + j) * 4 + 1] +  mouseModBrightness;
    imageData2.data[((imageWidth * i) + j) * 4+2] = data[((imageWidth * i) + j) * 4 + 2] +  mouseModBrightness;
    // This is the alpha - it makes stuff disappear.So perhaps leave this one alone unless you want the image to fade away
    imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * i) + j) * 4 + 3];
}
function pixelThreshold(i,j){
    if (data[((imageWidth * i) + j) * 4] > mouseX) {//only on the Red value

        imageData2.data[((imageWidth * i) + j) * 4] = data[((imageWidth * i) + j) * 4];
        imageData2.data[((imageWidth * i) + j) * 4+1] = data[((imageWidth * i) + j) * 4 + 1];
        imageData2.data[((imageWidth * i) + j) * 4+2] = data[((imageWidth * i) + j) * 4 + 2];
        imageData2.data[((imageWidth * i) + j) * 4+3] = data[((imageWidth * i) + j) * 4 + 3];
    }
    else {
        imageData2.data[((imageWidth * i) + j) * 4] = 0;
        imageData2.data[((imageWidth * i) + j) * 4+1] = 0;
        imageData2.data[((imageWidth * i) + j) * 4+2] = 0;
        imageData2.data[((imageWidth * i) + j) * 4+3] = 255;
    }
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