//importing the three.js lib & orbital controls for movement (by user)
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    //to import custom models
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//----------------------------------------------------------------------------
    //0)constants
    const sizes={
        width: window.innerWidth,
        height:window.innerHeight
    }
//might switch for a map for future levels, maybe a vector+map combo, where map have ids
    const model_paths={
        test: "../models/battery.glb"
    }

    //makes a new scene/camera
    const scene= new THREE.Scene();

    //html element
    const canvas=document.getElementById("experience-canvas");

    //gltf loader
    const loader= new GLTFLoader();

//----------------------------------------------------------

//1) RENDER
    const renderer= new THREE.WebGLRenderer({canvas: canvas,antialias: true});
    //turn off antialsis if bad performance

    //full screen !! will need to be modified later for the levels
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

//2) Camera
    const camera= new THREE.PerspectiveCamera(75, sizes.width /sizes.height);
    //{
//     "x": 0.2240011324121139,
//     "y": 0.5558287981919455,
//     "z": 1.3327264583980014
// }
    camera.position.x = 0.2240011324121139;
    camera.position.y = 0.5558287981919455;
    camera.position.z = 1.3327264583980014;

//2B) CONTROLS [USER]
    const controls=new OrbitControls(camera,canvas);
    controls.update();
//______________________________________________________________________________________

//3) Model:

    loader.load(
        //path to model file
        model_paths.test,
        function(glb){
            console.log(glb.scene.children[0].name);
            scene.add(glb.scene);
        },
        undefined,
        function(error){
            console.error(error);
        }
    );
    const light = new THREE.AmbientLight( 0x404040 ,3); // soft white light
    scene.add( light );


//     const geometry = new THREE.BoxGeometry( 1, 2, 1 );
//     const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//     const cube = new THREE.Mesh( geometry, material );
//
// //4) adds to the scene
//     scene.add( cube );

//______________________________________________________________________
//resize func
    function resize(){
        sizes.width=window.innerWidth;
        sizes.height=window.innerHeight;
        camera.aspect=sizes.width/sizes.height;
        camera.updateProjectionMatrix();
        console.log("resizing");

        renderer.setSize(sizes.width, sizes.height);
    }
    window.addEventListener("resize",resize);

//renders the scene via refreshsing (loop in which in draws again)
    function animate( time ) {
        // cube.rotation.x+=0.01;
        // cube.rotation.y+=0.01;
        //camera.position.z += 0.01;
        console.log(camera.position);

        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );