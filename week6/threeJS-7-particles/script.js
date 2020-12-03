import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import Glass from './Glass.js';
import Firefly from "./Firefly.js";
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';

//this version:
//don't know how to make the fly as an object with load model function and get it animated
//so try directly create meshes to apply particle system.
//next, to use the 3d model.
//Nan 2020.12

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

//-------------------------SCENE------------------------------//
var scene = new THREE.Scene();
scene.add(cameraHelper);


//----------------------LIGHT & FOG---------------------------------//
const lightColor = 0xFFFFFF;
const ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

//---------------------SKY BOX----------------------------------//
//make the skybox
const bgLoader = new THREE.TextureLoader();
//image source from 'https://hdrihaven.com/'
const bgTexture = bgLoader.load('resources/skybox/dikhololo_night_4k.jpg', ()=>{
    const rt = new THREE.WebGLCubeRenderTarget(bgTexture.image.height);
    // rt.fromEquirectangularTexture(renderer, bgTexture);//generate a cubemap from the equirectangular texture
    // scene.background = rt;
});
//https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_envmaps.html
bgTexture.mapping = THREE.EquirectangularRefractionMapping;
// bgTexture.encoding = THREE.sRGBEncoding;
scene.background = bgTexture;

//---------------------GEO & MESH----------------------------------//
var myGeos = [];
const numMyGeos = 20;
// a sphere with mirror like material
{
    const material = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        envMap: bgTexture,
        refractionRatio: 0.95,
        opacity: 0.5,
        transparent: false,
    } );
    //use class to create a Icosahedron, give r , material, position x y z
    for (var i = 0; i < numMyGeos; i ++){
        var myGeo = new Glass(1, material, 0,0,0);
        myGeos.push(myGeo);
    }
    //var fly = new Firefly(1, material, 0,0,0);
    myGeos.forEach(myGeo => {
        myGeo.mesh.position.x = Math.random() * 10 - 5;
        myGeo.mesh.position.y = Math.random() * 10 - 5;
        myGeo.mesh.position.z = Math.random() * 10 - 5;
        myGeo.mesh.scale.x = myGeo.mesh.scale.y = myGeo.mesh.scale.z = map(Math.random(), 0, 1, 0.1, 1.5);

       scene.add( myGeo.mesh );
   })
}
var fireFlys = [];
var numfireFlys = 1;
//I moved the material into the Firefly.js
{
    for (var i = 0; i < numfireFlys; i ++) {
        var firefly = new Firefly(1, 0, 0, 0);//radius, material , x, y , z
        fireFlys.push(firefly);
    }
    fireFlys.forEach(fly => {
        scene.add(fly.group);
        scene.add(fly.light);
        // scene.add(fly.pointLightHelper);
    })

}



//---------add moving particle light to the plane-------//
const lightColorBlue = new THREE.Color(0x0040ff);//blue
const lightColorYellow = new THREE.Color(0xFFFF00);
const lightColorRed = new THREE.Color(0xFF4D0A);//red
const particleSphere = new THREE.SphereBufferGeometry(0.05, 8, 8);
var particleLight1 = new THREE.PointLight(lightColorBlue, 5, 50);//color,intensity, distance,
var particleLight2 = new THREE.PointLight(lightColorRed, 5, 50);
particleLight1.add(new THREE.Mesh(particleSphere, new THREE.MeshBasicMaterial({
    color: lightColorBlue,
    envMap: bgTexture,
    refractionRatio: 0.95,
} ) ) );
particleLight2.add(new THREE.Mesh(particleSphere, new THREE.MeshBasicMaterial({
    color: lightColorRed,
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

    myGeos.forEach(myGeo=>{
        myGeo.update();
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
