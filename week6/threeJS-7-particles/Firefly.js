import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
const fireFlyMaterial = new THREE.MeshPhongMaterial({
    color: 0xF5E857,
    opacity: 0.2,
    transparent: true,
    reflection: 1,
    shininess: 100,
} );

class Firefly{
    constructor(r, x,y,z){
        this.radius = r;
        this.position = new THREE.Vector3( x,y,z );
        //create the centre lights/spheres
        this.numOfChildren = 30;
        this.group = new THREE.Group();
        for(var i= 0; i < this.numOfChildren; i ++){
            var rr = this.radius/this.numOfChildren * (i+1);
            var geo = new THREE.SphereBufferGeometry( rr,16,16 );
            var mesh = new THREE.Mesh(geo, fireFlyMaterial);
            this.group.add(mesh);
        }
        this.group.position.set(x,y,z);

        //create a light inside
        this.lightColor = new THREE.Color(0xFFFF00)//yellow:(0xF5E857);//red 0xFF4D0A
        this.light = new THREE.PointLight(this.lightColor, 4, 0);//color, intensity, distence, (decay)
        this.light.position.set(x, y, z);
        // this.pointLightHelper = new THREE.PointLightHelper( this.light, 1 );

    }

    update(){
        //this.mesh.rotation.x += 0.005;
        //this.mesh.rotation.y += 0.01;
    }
}
export default Firefly;
