import * as THREE from 'https://unpkg.com/three@0.123.0/build/three.module.js';
const fireFlyMaterial = new THREE.MeshPhongMaterial({
    color: 0xF5E857,
    opacity: 0.3,
    transparent: true,
    reflection: 1,
    shininess: 100,
} );

const zeroVector = new THREE.Vector3(0,0,0);

class Firefly{
    constructor(r, x,y,z){
        this.radius = r;
        this.position = new THREE.Vector3( x,y,z );
        //create the centre lights/spheres
        this.numOfChildren = 5;
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
        this.light = new THREE.PointLight(this.lightColor, 0.3, 0);//color, intensity, distence, (decay)
        this.light.position.set(x, y, z);
        // this.pointLightHelper = new THREE.PointLightHelper( this.light, 1 );
        this.group.add(this.light);

        //for physics
        this.vel = new THREE.Vector3(Math.sin(Math.random()),Math.sin(Math.random()),Math.sin(Math.random()));
        this.acc = new THREE.Vector3(0,0,0);
        this.mass = Math.random()*10;
        this.massVector = new THREE.Vector3(this.mass,this.mass,this.mass);//create a mass vector to divide to force

        /*
        //add the axis helper
        this.axes = new THREE.AxesHelper(2);
        this.axes.material.depthTest = false;
        this.axes.renderOrder = 1;
        this.group.add(this.axes);
         */
        this.maxDesiredVel = new THREE.Vector3(0.05,0.05,0.05);
        // this.maxSteelForce = new THREE.Vector3(0.1,0.1,0.1);
        this.maxSteelForce = 0.2;
    }

    update(){
        //this.mesh.rotation.x += 0.005;
        //this.mesh.rotation.y += 0.01;
        this.vel.add(this.acc);
        this.position.add(this.vel);
        this.group.position.add(this.vel);
        //console.log(this.group.position);
        this.acc.multiply(zeroVector);
    }

    addPosition(vector3){
        this.position.add(vector3);
        this.group.position.add(vector3);
    }

    applyForce(force){//force is a vector3
        force.divide(this.massVector);//must divide by a vector!
        this.acc.add(force);
    }

    seek(_targetPosition){
        // var currentPos = this.position;
        var currentVel = this.vel;
        // var targetPosition = _targetPosition;
        var desiredVel = _targetPosition.sub(this.position);//this.position.sub(targetPosition);//Subtracts v from this vector.
        desiredVel.normalize();
        desiredVel.multiply(this.maxDesiredVel);

        var steelForce = desiredVel.sub(currentVel);
        steelForce.clampLength(0, this.maxSteelForce);
        //steelForce.min(this.maxSteelForce);//If this vector's x, y or z value is greater than v's x, y or z value, replace that value with the corresponding min value.
        this.applyForce(steelForce);

    }
}
function map(n, start1, stop1, start2, stop2){
    const newVal = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newVal;
}

export default Firefly;
