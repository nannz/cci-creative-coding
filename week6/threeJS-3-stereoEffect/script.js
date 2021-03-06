import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { StereoEffect } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/effects/StereoEffect.js';

//canvas
//renderer
//camera
//scene
//light, scene.add(light)
//geometry, material, texture, mesh

//add the renderer into the canvas
const canvas = document.querySelector('#c');

const renderer = new THREE.WebGLRenderer({canvas});

const fov = 70;//75;
const aspect = window.innerWidth / window.innerHeight;//2;  // the canvas default
const near = 1;//0.1;
const far = 5;//1000
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

//add cameraHelper , draws a frustum for a camera
const cameraHelper = new THREE.CameraHelper(camera);

//-------------------------------------------------------//
//camera GUI helper to make sure 'far' is always greater than 'near'
//source code:https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
    }
}
//we can disable the updateCamera, since it updated in the draw() function
function updateCamera() {
    camera.updateProjectionMatrix();
}
const gui = new GUI();
gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 20, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 20, 0.1).name('far').onChange(updateCamera);

//---------orbit control of the camera-----------------------//
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

//-------------------------------------------------------//
// We use this class to pass to dat.gui
// so when it manipulates near or far
// near is never > far and far is never < near
//GUIHelper Code from https://threejsfundamentals.org/threejs/lessons/threejs-fog.html
class FogGUIHelper {
    constructor(fog, backgroundColor) {
        this.fog = fog;
        this.backgroundColor = backgroundColor;
    }
    get near() {
        return this.fog.near;
    }
    set near(v) {
        this.fog.near = v;
        this.fog.far = Math.max(this.fog.far, v);
    }
    get far() {
        return this.fog.far;
    }
    set far(v) {
        this.fog.far = v;
        this.fog.near = Math.min(this.fog.near, v);
    }
    get color() {
        return `#${this.fog.color.getHexString()}`;
    }
    set color(hexString) {
        this.fog.color.set(hexString);
        this.backgroundColor.set(hexString);
    }
}
//-------------------------SCENE------------------------------//
var scene = new THREE.Scene();
scene.add(cameraHelper);
//----------------------LIGHT & FOG---------------------------------//
const lightColor = 0xFFFFFF;
const intensity = 1;
var light = new THREE.DirectionalLight(lightColor, intensity);//color,intensity//"rgb(255,255,255)"
light.position.set(0, 2, 2);
scene.add(light);

//fog
const nearFog = 1;
const farFog = 15;
const fogColor = 'grey';
scene.fog = new THREE.Fog(fogColor, nearFog, farFog);
scene.background = new THREE.Color(fogColor);

const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
gui.add(fogGUIHelper, 'near', nearFog, farFog).listen();
gui.add(fogGUIHelper, 'far', nearFog, farFog).listen();
gui.addColor(fogGUIHelper, 'color');

//---------------------SKY BOX----------------------------------//
//make the skybox
const bgLoader = new THREE.TextureLoader();
//image source from 'https://hdrihaven.com/'
const bgTexture = bgLoader.load('dikhololo_night_4k.jpg', ()=>{
    const rt = new THREE.WebGLCubeRenderTarget(bgTexture.image.height);
    rt.fromEquirectangularTexture(renderer, bgTexture);//generate a cubemap from the equirectangular texture
    scene.background = rt;
});

//---------------------GEO & MESH----------------------------------//
{
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var myTextureLoader = new THREE.TextureLoader();
    var myTexture = myTextureLoader.load('sgpic10.jpg');
    var material = new THREE.MeshPhongMaterial({map: myTexture});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-3, 0, 0);
    scene.add(mesh);
}

// a sphere with mirror like material
{
    const geometry = new THREE.SphereBufferGeometry( 1, 16, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: bgTexture, refractionRatio: 0.95 } );
    const sphere = new THREE.Mesh( geometry, material );
    // sphere.position.set(5,0,0);
    scene.add( sphere );
}


// This is to make sure that the scene understands the resolution of the device we are on.
renderer.setPixelRatio(window.devicePixelRatio);
// We can also set the size of the render window
renderer.setSize(window.innerWidth, window.innerHeight);
// Finally we want to connect the renderer to the HTML document
// document.body.appendChild(renderer.domElement);
// And make sure that when the page is resized, everything gets updated
window.addEventListener('resize', onWindowResize, false);

console.log(scene);

function draw() {
    cameraHelper.visible = false;
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    //camera.position.x += 0.01;
    renderer.render(scene, camera);
    // effect.render(scene, camera);//apply the effect
    requestAnimationFrame(draw);
}

// This is the thing that does the resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Finally, call the draw loop.
requestAnimationFrame(draw);

