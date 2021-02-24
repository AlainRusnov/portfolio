/////////////////////////////////////////////////////
// Alain Rusnov Portfolio --
// V 0.6
/////////////////////////////////////////////////////

// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js';




let scene, camera, renderer;

function init() {
  const canvas = document.querySelector('#c'); // Skybox and outdoor scene // Later
	// document.body.appendChild( container );


  ///////////// Scene + Cam /////////////////////////
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 60, 350000);
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

    let skybox = new THREE.TextureLoader().load('./img/sky.jpg');
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

  benchLoader = new THREE.GLTFLoader();
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
}

function animate() {
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);
}
init();
