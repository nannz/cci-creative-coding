/* eslint no-console:0 consistent-return:0 */
"use strict";

//4 ways a shader can receive data:
// 1)Attributes and Buffers(arrays of binary data);
// 2) Uniforms - global variables
// 3) Textures - arrays of data, ex. image data
// 4) Varyings

//a function that will create a shader, upload the GLSL source, and compile the shader.
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

//function to link those 2 shaders into a program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main() {
    // 🌟1-Get A WebGL context
    var canvas = document.querySelector("#c");
    // 2-Create a WebGL Rendering Context
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return; //fail to create webGL
    }

    /*
    // 3-1-Get the strings for our GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
    // 3-2-create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    // 3-3-Link the two shaders into a program, call the function defined
    var program = createProgram(gl, vertexShader, fragmentShader);
    */

    //🌟set up GLSL program 总结上面前3步
    var program = webglUtils.createProgramFromScripts(gl,["vertex-shader-2d", "fragment-shader-2d"]);
    /* we've created a GLSL program on the GPU we need to supply data to it. The majority of the WebGL API is about setting up state to supply data to our GLSL programs.*/

    /* our only input to our GLSL program is a_position which is an attribute.  */
    // So 4-1-look up where the vertex data needs to go.
    // Looking up attribute locations (and uniform locations) is something you should do during initialization, not in your render loop.
    //look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //≈look up uniform locations
    //** to set the uniform "u_resolution" in vertex shader, we need to look up its location. The rest should be clear from the comments. By setting u_resolution to the resolution of our canvas the shader will now take the positions we put in positionBuffer supplied in pixels coordinates and convert them to clip space.
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    //5-1 🌟 Create a buffer and put three 2d clip space points in it
    //because attributes get the data from buffers, so create a buffer first
    var positionBuffer = gl.createBuffer();

    /* WebGL lets us manipulate many WebGL resources on global bind points. You can think of bind points as internal global variables inside WebGL.  */
    // 5-2- 🌟 Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /* we are going to draw the rectangles, so comment the
    // 6-Put data in the buffer by referencing it through the bind point.
    // var positions = [0, 0, 0, 0.5, 0.7, 0,]; //three 2d points, it's a JS array.
    //This time we draw a rectangle made from 2 triangles, 3 points each.
    var positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ];
    //new Float32Array(positions) creates a new array of 32bit floating point numbers and copies the values from positions.
    //gl.bufferData then [copies] that data to the [positionBuffer] on the [GPU]. We just bind buffer of positionBuffer with gl.ARRAY_BUFFER in step 5-2.
    //It's using the position buffer because we bound it to the ARRAY_BUFFER bind point above.
    //The last argument, gl.STATIC_DRAW is a hint to WebGL about how we'll use the data. gl.STATIC_DRAW tells WebGL we are not likely to change this data much.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
*/
    // code above this line is initialization code.
    //=============================================================
    //=============================================================
    //=============================================================
    // code below this line is rendering code.

    // 1- resize the canvas to match the display size.
    /*Canvases just like Images have 2 sizes.
    The number of pixels actually in them and separately the size they are displayed. CSS determines the size the canvas is displayed.
    You should always set the size you want a canvas to be with CSS*/
    /*see more: https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html */
    /*The whole webglUtils helper functions can be found here: https://webglfundamentals.org/webgl/resources/webgl-utils.js */
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // 2- 🌟 Tell WebGL how to convert from clip space values(we'll be setting gl_Position to) back into pixels, often called screen space.
    /*To do this we call gl.viewport and pass it the current size of the canvas.
    * This tells WebGL the -1 +1 clip space maps to 0 <-> gl.canvas.width for x and 0 <-> gl.canvas.height for y.
    * */
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 3-🌟 Clear the canvas
    gl.clearColor(0, 0, 0, 0);//the alpha is 0, so it's transparent!
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 4- 🌟 Tell it to use our program (pair of shaders)
    //gl.useProgram is like gl.bindBuffer aboce in that it sets the current program.
    gl.useProgram(program);

    // 5 - 🌟 Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 6-1 🌟 specify how to Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 6-2 🌟 Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    /*A hidden part of gl.vertexAttribPointer is that it binds the current ARRAY_BUFFER to the attribute. In other words now this attribute is bound to positionBuffer.
    That means we're free to bind something else to the ARRAY_BUFFER bind point. The attribute will continue to use positionBuffer.*/
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    //Above we set size = 2. a_position is like a_position = {x: 0, y: 0, z: 0, w: 0}
    // Attributes default to 0, 0, 0, 1 so this attribute will get its first 2 values (x and y) from our buffer. The z, and w will be the default 0 and 1 respectively.
    //🌟 below we set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    //*here is drawing 50 random rectangles in random colors.*//
    for (var ii = 0; ii < 50; ++ii) {
        // Setup a random rectangle
        // This will write to positionBuffer because
        // its the last thing we bound on the ARRAY_BUFFER bind point
        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

        // Set a random color.
        //glUniform — Specify the value of a uniform variable for the current program object
        gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    /*we draw the rects in the for-loop above
    // 7 - After all that we can finally ask WebGL to execute our GLSL program.
    // draw
    //var primitiveType = gl.TRIANGLES;//Because we set primitiveType to gl.TRIANGLES, each time our vertex shader is run 3 times WebGL will draw a triangle based on the 3 values we set gl_Position to. No matter what size our canvas is those values are in clip space coordinates that go from -1 to 1 in each direction.
    //var offset = 0;
    //var count = 3; this will execute our vertex shader 3 times.
    // The first time a_position.x and a_position.y in our vertex shader attribute will be set to the first 2 values from the positionBuffer.
    // The second time a_position.x and a_position.y will be set to the second 2 values.
    // The last time they will be set to the last 2 values.
    //var count = 6;//3; //this time we draw 2 triangles we need to have webgl call our vertex shader 6 times so we need to change the count to 6.
    //gl.drawArrays(primitiveType, offset, count);
     */
}

main();

//returns a random integer from 0 to range - 1
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

//fills the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    //** NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer.
    // If we had more than one buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW);
}


