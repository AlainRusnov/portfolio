/////////////////////////////////////////////////////
// Alain Rusnov Portfolio --
// V 0.6
/////////////////////////////////////////////////////

// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js';




let scene, camera, renderer, boat, wave1;
var n = 1000;
var m = 0;
var w = 1000;

function init() {
  const canvas = document.querySelector('#c'); // Skybox and outdoor scene // Later
	// document.body.appendChild( container );


  ///////////// Scene + Cam /////////////////////////
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 60, 800000);
  camera.position.set(10000, -100, 12000);

  /////////// WebGL /////////////////////
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth * 1, window.innerHeight * 1);
  renderer.setClearColor(0x0000FF, 0.1);
  document.body.appendChild(renderer.domElement);

  ////////////// Camera/Mouse controls - /////////////////

  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', renderer.domElement); // was causing typeerror
  controls.listenToKeyEvents( window ); // keys...

  controls.enableDamping = true; // ( use later ) // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.5;

  controls.screenSpacePanning = false;

  // controls.maxPolarAngle = Math.PI / 2;
  // controls.minDistance = 3000;
  // controls.maxDistance = 3000;
  controls.keys = {
    LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    }

    controls.keyPanSpeed = 60; // Keyboard move speed ( janky )
    controls.panSpeed = 13;

    // Reassign controls ( review for mobile )
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    }

    ///////// Load Manager //////////////////

    const loadingManager = new THREE.LoadingManager( () => {

      const loadingScreen = document.getElementById( 'loading-screen' );
      loadingScreen.classList.add( 'fade-out' );

      // optional: remove loader from DOM via event listener
      loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

    } );

    ///////// Lighting ////////////////

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.1 );
    scene.add( ambientLight );

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
    // directionalLight.position.set( 9000, 100, 9000 ).normalize();
    // scene.add( directionalLight );


    //////////////// Skybox ///////////////////

    // let loader = new THREE.CubeTextureLoader();
    // let skybox = loader.load([
    //   './img/skybox/px.png',
    //   './img/skybox/nx.png',
    //   './img/skybox/py.png',
    //   './img/skybox/ny.png',
    //   './img/skybox/pz.png',
    //   './img/skybox/nz.png',
    // ]);

    let skybox = new THREE.TextureLoader().load('./img/sky3.png');
    scene.background = skybox;
    // scene.background.rotateY(0.5);

    // let skybox = [];
    // let texture_ftSky = new THREE.TextureLoader().load('./img/skybox/px.png');
    // let texture_bkSky = new THREE.TextureLoader().load('./img/skybox/nx.png');
    // let texture_upSky = new THREE.TextureLoader().load('./img/skybox/py.png');
    // let texture_dnSky = new THREE.TextureLoader().load('./img/skybox/ny.png');
    // let texture_rtSky = new THREE.TextureLoader().load('./img/skybox/pz.png');
    // let texture_lfSky = new THREE.TextureLoader().load('./img/skybox/nz.png');

    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_ftSky }));
    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_bkSky }));
    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_upSky }));
    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_dnSky }));
    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_rtSky }));
    // skybox.push(new THREE.MeshBasicMaterial({ map: texture_lfSky }));

    // for (let i = 0; i < 6; i++)
    // skybox[i].side = THREE.BackSide;

    // let skyboxGeo = new THREE.BoxGeometry(300000, 300000, 300000);
    // let outdoor = new THREE.Mesh(skyboxGeo, skybox);
    // outdoor.position.set(-75000, 0, -50000);
    // outdoor.rotation.set(0, Math.PI / 2 * 1.5,0);
    // scene.add(outdoor);

  //////////// 3D models //////////////////////////////////


  let tableLoader = new THREE.GLTFLoader();
  tableLoader.load('./img/models/table/scene.gltf', function(gltf){
    table = gltf.scene.children[0];
    table.scale.set(5000,5000,5000);
    table.position.set(45000, -9000, 12000);
    table.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI/2);
    scene.add(gltf.scene);
  });

  benchLoader = new THREE.GLTFLoader( loadingManager );
  benchLoader.load('./img/models/bench/scene.gltf', function(gltf){
    bench = gltf.scene.children[0];
    bench.scale.set(9000,9000,9000);
    bench.position.set(-27500, -9000, 28000);
    bench.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI/2);
    scene.add(gltf.scene);
  });

  let plantLoader = new THREE.GLTFLoader();
  plantLoader.load('./img/models/plant/scene.gltf', function(gltf){
    plant = gltf.scene.children[0];
    plant.scale.set(1200,1200,1200);
    plant.position.set(-29500, -15000, -22000);
    plant.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI/2);
    scene.add(gltf.scene);
  });

  let catLoader = new THREE.GLTFLoader();
  catLoader.load('./img/models/cat/scene.gltf', function(gltf){
    cat = gltf.scene.children[0];
    cat.scale.set(10,10,10);
    cat.position.set(45000, -3000, 12000);
    cat.rotation.set(Math.PI/2,Math.PI/3 * 3,Math.PI/2);
    scene.add(gltf.scene);
  });



  //////////// Outdoor wireframe /////////////////////////////////////////////

  let sidewalkGeo = new THREE.BoxGeometry(150000,1,10000);
  let sidewalkTxt = new THREE.TextureLoader().load('./img/sidewalk.jpg');
   ////// txt repeat /////
    sidewalkTxt.wrapS = THREE.RepeatWrapping;
    sidewalkTxt.wrapT = THREE.RepeatWrapping;

    const RepeatHorizon = 6;
    const RepeatVert = 2;
    sidewalkTxt.repeat.set(RepeatHorizon, RepeatVert);

  let sidewalkMaterial = new THREE.MeshBasicMaterial({ map: sidewalkTxt });
  const sidewalk = new THREE.Mesh( sidewalkGeo, sidewalkMaterial );
  sidewalk.position.set(-27500, -12500, -1000);
  sidewalk.rotation.set(Math.PI/2, Math.PI/2, Math.PI/2);
  scene.add(sidewalk);

  let sidewalk2Geo = new THREE.BoxGeometry(250000,1,10000);
  const sidewalk2 = new THREE.Mesh( sidewalk2Geo, sidewalkMaterial );
  sidewalk2.position.set(-130000, -13450, -1000);
  sidewalk2.rotation.set(Math.PI/2, Math.PI/2, Math.PI/2);
  scene.add(sidewalk2);

  let streetGeo = new THREE.BoxGeometry(250000,1,100000);
  let streetTxt = new THREE.TextureLoader().load('./img/streetflat.jpg');
    ////// txt repeat /////
    streetTxt.wrapS = THREE.RepeatWrapping;
    streetTxt.wrapT = THREE.RepeatWrapping;

    const RepeatStreetHorizon = 6;
    const RepeatStreetVert = 2;
    streetTxt.repeat.set(RepeatStreetHorizon, RepeatStreetVert);


  let streetMaterial = new THREE.MeshBasicMaterial({ map: streetTxt }); // wireframe: true
  const street = new THREE.Mesh( streetGeo, streetMaterial );
  street.position.set(-82000, -13500, -1000);
  street.rotation.set(Math.PI/2, Math.PI/2, Math.PI/2);
  scene.add(street);


  /////////// Waves //////////////////////////////
  let wave1Geo = new THREE.BoxGeometry(800000,1,70000);
  let wave1Txt = new THREE.TextureLoader().load('./img/wave.png');
   ////// txt repeat /////
    wave1Txt.wrapS = THREE.RepeatWrapping;
    wave1Txt.wrapT = THREE.RepeatWrapping;

    const RepeatWave1Horizon = 2;
    const RepeatWave1Vert = 1;
    wave1Txt.repeat.set(RepeatWave1Horizon, RepeatWave1Vert);
    // wave1Txt.flipY = false;

    let wave1Material = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: wave1Txt });
    wave1 = new THREE.Mesh( wave1Geo, wave1Material );
    wave1.position.set(-190000, -15500, 30000);
    wave1.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(wave1);


    let wave2Geo = new THREE.BoxGeometry(800000,1,60000);
    let wave2Txt = new THREE.TextureLoader().load('./img/wave.png');
   ////// txt repeat /////
    wave2Txt.wrapS = THREE.RepeatWrapping;
    wave2Txt.wrapT = THREE.RepeatWrapping;

    const RepeatWave2Horizon = 2;
    const RepeatWave2Vert = 1;
    wave2Txt.repeat.set(RepeatWave2Horizon, RepeatWave2Vert);

    let wave2Material = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: wave2Txt });
    const wave2 = new THREE.Mesh( wave2Geo, wave2Material );
    wave2.position.set(-250000, -16000, 20000);
    wave2.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(wave2);

    let wave3Geo = new THREE.BoxGeometry(800000,1,50000);
    let wave3Txt = new THREE.TextureLoader().load('./img/wave.png');
   ////// txt repeat /////
    wave3Txt.wrapS = THREE.RepeatWrapping;
    wave3Txt.wrapT = THREE.RepeatWrapping;

    const RepeatWave3Horizon = 3;
    const RepeatWave3Vert = 1;
    wave3Txt.repeat.set(RepeatWave3Horizon, RepeatWave3Vert);
    // wave3Txt.flipY = false;

    let wave3Material = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: wave3Txt });
    const wave3 = new THREE.Mesh( wave3Geo, wave3Material );
    wave3.position.set(-300000, -13500, 30000);
    wave3.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(wave3);

    let wave4Geo = new THREE.BoxGeometry(800000,1,50000);
    let wave4Txt = new THREE.TextureLoader().load('./img/wave.png');
   ////// txt repeat /////
    wave4Txt.wrapS = THREE.RepeatWrapping;
    wave4Txt.wrapT = THREE.RepeatWrapping;

    const RepeatWave4Horizon = 2;
    const RepeatWave4Vert = 1;
    wave4Txt.repeat.set(RepeatWave4Horizon, RepeatWave4Vert);

    let wave4Material = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: wave4Txt });
    const wave4 = new THREE.Mesh( wave4Geo, wave4Material );
    wave4.position.set(-350000, -12000, 60000);
    wave4.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(wave4);

    let wave5Geo = new THREE.BoxGeometry(800000,1,30000);
    let wave5Txt = new THREE.TextureLoader().load('./img/wave.png');
   ////// txt repeat /////
    wave5Txt.wrapS = THREE.RepeatWrapping;
    wave5Txt.wrapT = THREE.RepeatWrapping;

    const RepeatWave5Horizon = 2;
    const RepeatWave5Vert = 1;
    wave5Txt.repeat.set(RepeatWave5Horizon, RepeatWave5Vert);
    // wave5Txt.flipY = false;

    let wave5Material = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: wave5Txt });
    const wave5 = new THREE.Mesh( wave5Geo, wave5Material );
    wave5.position.set(-400000, -10500, 30000);
    wave5.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(wave5);

    /////////////// SUN ///////////////////////////////

    let sunGeo = new THREE.BoxGeometry(150000,1,180000);
    let sunTxt = new THREE.TextureLoader().load('./img/sunwatercolor.png');
   ////// txt repeat /////
    // sunTxt.wrapS = THREE.RepeatWrapping;
    // sunTxt.wrapT = THREE.RepeatWrapping;

    // const RepeatsunHorizon = 2;
    // const RepeatsunVert = 1;
    // sunTxt.repeat.set(RepeatsunHorizon, RepeatsunVert);
    // sunTxt.flipY = false;

    let sunMaterial = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: sunTxt });
    const sun = new THREE.Mesh( sunGeo, sunMaterial );
    sun.position.set(-500000, 45500, -200000);
    sun.rotation.set(Math.PI/2, 0, Math.PI/2);
    scene.add(sun);


    /////////// Boat ///////////////////////////////////

    let boatGeo = new THREE.BoxGeometry(90000,1,90000);
    let boatTxt = new THREE.TextureLoader().load('./img/boat.png');
   ////// txt repeat /////
    // boatTxt.wrapS = THREE.RepeatWrapping;
    // boatTxt.wrapT = THREE.RepeatWrapping;

    // const RepeatboatHorizon = 2;
    // const RepeatboatVert = 1;
    // boatTxt.repeat.set(RepeatboatHorizon, RepeatboatVert);
    // boatTxt.flipY = false;

    let boatMaterial = new THREE.MeshBasicMaterial({ opacity: 100, transparent: true, depthWrite: false, map: boatTxt });
    boat = new THREE.Mesh( boatGeo, boatMaterial );
    boat.position.set(-260000, 4000, 250000);
    boat.rotation.set(Math.PI/2, 0, Math.PI/2*3);
    scene.add(boat);

  //////////// Wireframe Intersect Objects /////////////////////////////////////////////////

  let projectGeo = new THREE.BoxGeometry(25000, 15000, 50);
  let projectMaterial = new THREE.MeshPhongMaterial({ opacity: 0, color: 0xff, transparent: true }); // wireframe: true transparent: true

  let stuud = new THREE.Mesh(projectGeo, projectMaterial);
  stuud.name = "stuud";

  let gumballBank = new THREE.Mesh(projectGeo, projectMaterial);
  gumballBank.name = "gumballbank";

  let gumballViewer = new THREE.Mesh(projectGeo, projectMaterial);
  gumballViewer.name = "gumballviewer";

  let dawg = new THREE.Mesh(projectGeo, projectMaterial);
  dawg.name = "dawg";

  ///////////////////////////////////////////////////////////////////////////////////////////
  /////////// Wireframe Intersect Objects Positions /////////////////////////////////////////


  stuud.position.set(30000, -2000, -22900); // z:-23000 is flush with wall bounds
  scene.add(stuud);

  gumballBank.position.set(33000, 2000, 37000); // z:-37000 is flush with wall bounds
  scene.add(gumballBank);

  gumballViewer.position.set(47500, 1000, -4000); // x:48000 is flush with wall bounds
  gumballViewer.rotation.set(0, Math.PI /2,0);
  scene.add(gumballViewer);

  dawg.position.set(-5000, 2000, 37000); // z:-37000 is flush with wall bounds
  scene.add(dawg);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// Raycasting // Intersect Object Logic Gate with tooltip and Modal  ////////////////////////////////



    const mouse = new THREE.Vector2();

    window.addEventListener( 'mousemove', onMouseMove );
    const  raycaster = new THREE.Raycaster();


    function onMouseMove( event ) {

      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera( mouse, camera );

      const intersects = raycaster.intersectObjects( scene.children );
      const tooltip = document.getElementById("tooltip");

      // const closeModal = function () {
      //   projectInfo.style.visibility = 'hidden';
      // };

      if (intersects[0]) {

        let coords = intersects[0].object.name; // Naming convention allows for wireframe detection + data call
        // console.log(coords);

        if (coords.match(/^[a-z]+$/)) {
          // ? console.log(true): console.log(false));
          // console.log(true);
          tooltip.innerHTML = coords;
          let name = coords;
          const projectInfo = document.getElementById(`${name}`);
          const modal = document.getElementById("modal");
          tooltip.style.visibility = 'visible';
            tooltip.style.top = event.clientY + 'px';
            tooltip.style.left = event.clientX + 20 + 'px';
            window.addEventListener( 'click', onClick );
            function onClick() {
              tooltip.style.visibility === 'visible' ? (projectInfo.style.visibility = 'visible') && (modal.style.visibility = 'visible') : (projectInfo.style.visibility = 'hidden') && (modal.style.visibility = 'hidden');
            };

              // document.addEventListener('keydown', function (e) {
              //   if (e.key === 'Escape') {
              //     closeModal();
              //     }
              //   });
                // console.log(projectInfo);
                // console.log(name);
                // coords = "";
                // projectInfo = "";
                console.log(coords);
            } else {
            tooltip.style.visibility = 'hidden';
            // coords = "";
            // projectInfo = "";
            };
      } else {
            tooltip.style.visibility = 'hidden';
            // projectInfo = "";

      };
    };



    // const btnCloseModal = document.getElementById('btn--close--modal');
    // console.log(btnCloseModal);
    // const closeModal = function () {
    //     projectInfo.style.visibility = 'hidden';
    //     // overlay.classList.add('hidden');
    //   };

    //   btnCloseModal.addEventListener('click', closeModal);


    ///////////// PROJECT MODAL //////////////////

    // const projectModal = document.querySelector('.project--modal');
    // const overlay = document.querySelector('.overlay');
    // const btnCloseModal = document.querySelector('.btn--close-project--modal');
    // const btnsOpenModal = document.querySelectorAll('.btn--show-project--modal');

    // const openModal = function (e) {
    //   e.preventDefault();
    //   projectInfo.classList.remove('hidden');
    //   // overlay.classList.remove('hidden');
    // };

    // const closeModal = function () {
    //   projectInfo.style.visibility = 'hidden';
    //   // projectInfo.classList.add('hidden');
    //   // overlay.classList.add('hidden');
    // };

    // btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
    // btnCloseModal.addEventListener('click', closeModal);
    // overlay.addEventListener('click', closeModal);

    // document.addEventListener('keydown', function (e) {
    //   if (e.key === 'Escape' && !projectModal.classList.contains('hidden')) {
    //     closeModal();
    //   }
    // });

///////////////////////////////////////////////////


/////////// MODULAR BUILD ///////////////
////////// Schema Top view //////////////

               //Front

            //////////////
            //          //
    //Left  //          // //Right
            //          //
            //////////////

               //Back


    ///////////////////////////
    //          //           //
    //    4     //      3    //
    //          //           //
    ///////////////////////////
    //          //           //
    //    1     //      2    //
    //          //           //
    ///////////////////////////

  //^^ Windows + Doors this side ^^//



    // Cube 1 texture map
  let materialArray1 = [];
  let texture_ft = new THREE.TextureLoader().load('./img/left.png');
  let texture_bk = new THREE.TextureLoader().load('./img/doortr.png');
  let texture_up = new THREE.TextureLoader().load('./img/up1.png');
  let texture_dn = new THREE.TextureLoader().load('./img/down.png');
  let texture_rt = new THREE.TextureLoader().load('./img/right.png');
  let texture_lf = new THREE.TextureLoader().load('./img/Hero.png');

  materialArray1.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_lf }));
  materialArray1.push(new THREE.MeshPhongMaterial({ opacity: 100, transparent: true, depthWrite: false, map: texture_bk }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_up }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_dn }));
  materialArray1.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_lf }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_lf }));


  for (let i = 0; i < 6; i++)
  materialArray1[i].side = THREE.BackSide;


  // Cube 2 texture map
  let materialArray2 = [];
  let texture_ft2 = new THREE.TextureLoader().load('./img/right.png');
  let texture_bk2 = new THREE.TextureLoader().load('./img/windowtr.png');
  let texture_up2 = new THREE.TextureLoader().load('./img/up2.png');
  let texture_dn2= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt2 = new THREE.TextureLoader().load('./img/dawg.png');
  let texture_lf2 = new THREE.TextureLoader().load('./img/right.png');

  materialArray2.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_ft2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ opacity: 100, transparent: true, depthWrite: false, map: texture_bk2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_up2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_dn2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_rt2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_lf2 }));

  for (let i = 0; i < 6; i++)
  materialArray2[i].side = THREE.BackSide;

  // // Cube 3 texture map
  let materialArray3 = [];
  let texture_ft3 = new THREE.TextureLoader().load('./img/pfpro.png');
  let texture_bk3 = new THREE.TextureLoader().load('./img/right.png');
  let texture_up3 = new THREE.TextureLoader().load('./img/up.jpg');
  let texture_dn3= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt3 = new THREE.TextureLoader().load('./img/gbbank.png');
  let texture_lf3 = new THREE.TextureLoader().load('./img/right.png');

  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_ft3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_bk3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_up3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_dn3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_rt3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_lf3 }));

  for (let i = 0; i < 6; i++)
  materialArray3[i].side = THREE.BackSide;

  // // Cube 4 texture map
  let materialArray4 = [];
  let texture_ft4 = new THREE.TextureLoader().load('./img/gblogo.png');
  let texture_bk4 = new THREE.TextureLoader().load('./img/right.png');
  let texture_up4 = new THREE.TextureLoader().load('./img/up4.png');
  let texture_dn4= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt4 = new THREE.TextureLoader().load('./img/Gumwall.png');
  let texture_lf4 = new THREE.TextureLoader().load('./img/stuud.png');

  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_ft4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_bk4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_up4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_dn4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, depthWrite: false, map: texture_bk4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_lf4 }));

  for (let i = 0; i < 6; i++)
  materialArray4[i].side = THREE.BackSide;

  let cubeGeo = new THREE.BoxGeometry(35000, 25000, 30000);
  let cube1 = new THREE.Mesh(cubeGeo, materialArray1);
  let cube2 = new THREE.Mesh(cubeGeo, materialArray2);
  let cube3 = new THREE.Mesh(cubeGeo, materialArray3);
  let cube4 = new THREE.Mesh(cubeGeo, materialArray4);
  cube1.position.set(-5000, -100, -8000);
  cube2.position.set(-5000, -100, 22000);
  cube3.position.set(30000, -100, 22000);
  cube4.position.set(30000, -100, -8000);
  // scene.add(canvas);
  scene.add(cube1);
  scene.add(cube2);
  scene.add(cube3);
  scene.add(cube4);




  animate();

};

/////// Animate Boat ///////////////////////

function animBoat(obj) {
  obj.position.z += n;

  if (obj.position.z >= -250000) {
    obj.position.z -= 100;
    n = 0;
  } if (obj.position.z === -250000) {
    obj.position.z -= 100;
    n = 500000;
  }

}

//////// ANimate Wave 1 ////////////////// -190000, -15500, 30000
// function animWave1(obj) {
// 	obj.position.z += w;
//   // obj.position.y += m;

//   if (obj.position.z >= -10000) {
//     obj.position.z -= 100;
//     w = 0;
//     // m = 0;
//   }
//   if (obj.position.z <= 30000) {
//     obj.position.z = 100;
//     w = -10000;
//     // m = 0;
  // }
  // if (obj.position.y >= -17000) {
  //   obj.position.y -= 100;
  //   // n = 0;
  //   m = -17000;
  // }
  // if (obj.position.y === -17000) {
  //   obj.position.y = -100;
  //   // n = -16000;
  //   m = -15500;
  // }

// }

//////////////////////////////////////////

function animate() {
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);
  animBoat(boat);
  // animWave1(wave1);

};
function onTransitionEnd( event ) {

	const element = event.target;
	element.remove();

};

init();
