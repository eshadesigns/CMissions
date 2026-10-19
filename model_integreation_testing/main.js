//importing the three.js lib
import * as THREE from 'three';

//makes a new scene/camera
const scene= new THREE.Scene();
//oarameter: field of view, aspect ratio
const camera= new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

//rendering
const renderer= new THREE.WebGLRenderer();
//full screen !! will need to be modified later for the levels
renderer.setSize(window.innerWidth, window.innerHeight);
console.log(renderer);
//creates a canvas
document.body.appendChild(renderer.domElement);

//creates a box, its material
const geometry = new THREE.BoxGeometry( 1, 2, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// adds to the scene
scene.add( cube );

camera.position.z = 5;

//renders the scene via refreshsing (loop in which in draws again)
function animate( time ) {
    cube.rotation.x+=0.01;
    cube.rotation.y+=0.01;
    //camera.position.z += 0.01;

    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );