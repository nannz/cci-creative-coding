//last version, have objects with envMap
//in this version, try to import 3d models;
//how can i change material of an imported 3d model?
import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import Firefly from './Firefly.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';
//-------STRUCTURE GUIDE-------//
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
const far = 20;//1000
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
gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

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
//----------------------GLOBAL LIGHT & FOG---------------------------------//
const lightColor = 0xFFFFFF;
const intensity = 1;
// var light = new THREE.DirectionalLight(lightColor, intensity);//color,intensity//"rgb(255,255,255)"
// light.position.set(0, 2, 2);
// scene.add(light);
const ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

//fog
/*
const nearFog = 1;
const farFog = 15;
const fogColor = 'grey';
scene.fog = new THREE.Fog(fogColor, nearFog, farFog);
scene.background = new THREE.Color(fogColor);

const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
gui.add(fogGUIHelper, 'near', nearFog, farFog).listen();
gui.add(fogGUIHelper, 'far', nearFog, farFog).listen();
gui.addColor(fogGUIHelper, 'color');
*/
//---------------------SKY BOX----------------------------------//
//make the skybox
const bgLoader = new THREE.TextureLoader();
//image source from 'https://hdrihaven.com/'
const bgTexture = bgLoader.load('dikhololo_night_4k.jpg', ()=>{
    const rt = new THREE.WebGLCubeRenderTarget(bgTexture.image.height);
    // rt.fromEquirectangularTexture(renderer, bgTexture);//generate a cubemap from the equirectangular texture
    // scene.background = rt;
});
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_envmaps.html
bgTexture.mapping = THREE.EquirectangularRefractionMapping;
// bgTexture.encoding = THREE.sRGBEncoding;
scene.background = bgTexture;

//---------------------GEO & MESH----------------------------------//
var flys = [];
// a sphere with mirror like material
{
    const geometry = new THREE.SphereBufferGeometry( 1, 16, 16 );
    const material = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        envMap: bgTexture,
        refractionRatio: 0.95,
        opacity: 0.5,
        transparent: false,
    } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(-2,0,0);
    scene.add( sphere );

    //use class to create a Icosahedron, give r , material, position x y z
    const numFlys = 20;
    for (var i = 0; i < numFlys; i ++){
        var fly = new Firefly(1, material, 0,0,0);
        flys.push(fly);
    }
    //var fly = new Firefly(1, material, 0,0,0);
   flys.forEach(fly => {
       fly.mesh.position.x = Math.random() * 10 - 5;
       fly.mesh.position.y = Math.random() * 10 - 5;
       fly.mesh.position.z = Math.random() * 10 - 5;
       fly.mesh.scale.x = fly.mesh.scale.y = fly.mesh.scale.z = map(Math.random(), 0, 1, 0.1, 1.5);

       scene.add( fly.mesh );
   })
}
//load models and create a model
{
    // const gltfLoader = new GLTFLoader();
    // gltfLoader.load('resources/models/paperPlane.gltf', (gltf) => {
    //     const root = gltf.scene;
    //     scene.add(root);
    //     console.log(root);
    // });
}
//try obj model
const planeMaterial = new THREE.MeshPhongMaterial( {
    color: 0xFFFFFF,
    envMap: bgTexture,
    refractionRatio: 0.95,
    opacity: 0.5,
    transparent: false,
} );
    //--------------------load 3d model (obj) --------------------//
var planeObj;
{//tried gltf format, but failed on changing the gltf's material.
    function loadModel() {
        planeObj.traverse( function ( child ) {
            if ( child.isMesh ){
                child.material = planeMaterial;
                child.material.side = THREE.DoubleSide;
            }
        } );
        scene.add( planeObj );
        console.log(planeObj);
    }
    const manager = new THREE.LoadingManager( loadModel );
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }
    function onError() {}
    const loader = new OBJLoader( manager );
    loader.load( 'resources/models/obj/paperPlane.obj', function ( obj ) {
        planeObj = obj;
    }, onProgress, onError );
}
//---add particle light to the plane
//add particle lights
const particleLights = [];
const lightColorBlue = new THREE.Color(0x0040ff);//blue
const lightColorYellow = new THREE.Color(0xFFFF00);
const particleSphere = new THREE.SphereBufferGeometry(0.05, 8, 8);
var particleLight1 = new THREE.PointLight(lightColorBlue, 5, 50);//color,intensity, distance,
var particleLight2 = new THREE.PointLight(lightColorYellow, 5, 50);
particleLight1.add(new THREE.Mesh(particleSphere, new THREE.MeshBasicMaterial({
    color: lightColorYellow,
    envMap: bgTexture,
    refractionRatio: 0.95,
} ) ) );
particleLight2.add(new THREE.Mesh(particleSphere, new THREE.MeshBasicMaterial({
    color: lightColorYellow,
    envMap: bgTexture,
    refractionRatio: 0.95,
} ) ) );
particleLight1.position.set( 0, 0.5, 0 );
particleLight2.position.set( 0, -0.5, 0 );
scene.add( particleLight1 );
scene.add( particleLight2 );

// This is to make sure that the scene understands the resolution of the device we are on.
renderer.setPixelRatio(window.devicePixelRatio);
// We can also set the size of the render window
renderer.setSize(window.innerWidth, window.innerHeight);
// Finally we want to connect the renderer to the HTML document
// document.body.appendChild(renderer.domElement);
// And make sure that when the page is resized, everything gets updated
window.addEventListener('resize', onWindowResize, false);

console.log(scene);
var timer = 0;
function draw() {

    cameraHelper.visible = false;

    flys.forEach(fly=>{
        fly.update();
    });

    //update particle lights
    particleLight1.position.x = Math.sin( timer * 7 ) * 3;
    particleLight1.position.y = Math.cos( timer * 5 ) * 4;
    particleLight1.position.z = Math.cos( timer * 3 ) * 3;
    particleLight2.position.x = - Math.sin( timer * 7 ) * 3;
    particleLight2.position.y = - Math.cos( timer * 5 ) * 4;
    particleLight2.position.z = Math.cos( timer * 3 ) * 3;

    //camera.position.x += 0.01;
    renderer.render(scene, camera);
    timer += 0.005;
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

function map(n, start1, stop1, start2, stop2){
    const newVal = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newVal;
}
