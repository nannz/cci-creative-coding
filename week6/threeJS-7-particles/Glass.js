import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';

class Glass{
    constructor(r, material, x,y,z){
        this.radius = r;
        this.geo = new THREE.IcosahedronBufferGeometry( this.radius,0 );
        this.material = material;
        this.mesh = new THREE.Mesh(this.geo, this.material);
        this.mesh.position.set(x,y,z);//position is a 3Vector
    }

    update(){
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.01;
    }
}
export default Glass;

