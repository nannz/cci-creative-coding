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


/*
* for ( let i = 0; i < 500; i ++ ) {

					const mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = Math.random() * 10000 - 5000;
					mesh.position.y = Math.random() * 10000 - 5000;
					mesh.position.z = Math.random() * 10000 - 5000;
					mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
					scene.add( mesh );

					spheres.push( mesh );

				}
*/