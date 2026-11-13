
//CURRENTLY WORKING ON:
// GETING BLENDER ANIMATION TO PLAY IN THE INTEGRATED SECTION OF THE

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

    //animation mode constants
    const ani={
        idle: 'idle',
        explode: 'explode'
    }

    //reuseable loader
    const mixer=[]; //needed for animtions
    function loadModels(modelName, location={x:0,y:0,z:0}, anime='idle'){
        const path=model_paths[modelName]; //gets the path
        if(!path){return;} //invaild path

        loader.load(
            //path to model file
            // SAME AS model_paths.modelName
            //      (as in it looks for that one)
            path,
            function(glb){
                //model==glb.scene

                //location
                glb.scene.position.set(location.x, location.y, location.z);
                //prints to the console
                console.log(glb.scene.children[0].name);
                //adds it to the scene
                scene.add(glb.scene);

                //animation
                if(glb.animations && glb.animations.length>0){
                    const mixer_element=new THREE.AnimationMixer(glb.scene);
                    mixer.push(mixer_element);

                    if (anime=='explode') {
                        const action = mixer.clipAction(glb.animations[1]);
                    } else { //idle
                        const action = mixer.clipAction(glb.animations[0]);
                    }
                    action.play();

                }

            },
            undefined,
            function(error){
                console.error(error);
            }
        );

    }

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

//3) LOADING IN {STATIC/ANIMATION} MODELS:
loadModels('test',{x:0,y:0,z:0});
    const light = new THREE.AmbientLight( 0x404040 ,3); // soft white light
    scene.add( light );

//4) For animation models

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