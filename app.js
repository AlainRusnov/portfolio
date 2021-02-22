
// Alain Rusnov Portfolio -- Proof of Concept 3D
// V 0.4
// Getting error on structure fragmentation instead of local load on html :: -->
// three.min.js:2 Uncaught TypeError: n[i].call is not a function
// at THREE.OrbitControls.dispatchEvent (three.min.js:2)
// at THREE.OrbitControls.update (OrbitControls.js:254)
// at handleMouseMoveRotate (OrbitControls.js:523)
// at onMouseMove (OrbitControls.js:948)
// at HTMLDocument.onPointerMove (OrbitControls.js:804)     <---
// Works but might overload and crash.


// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";



let scene, camera, renderer;

function init() {
  // const canvas = document.querySelector('#c'); // Skybox and outdoor scene // Later
	// document.body.appendChild( container );


  ///////////// Scene + Cam /////////////////////////
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 60, 200000);
  camera.position.set(10000, -100, 12000);

  /////////// WebGL /////////////////////
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth * 1, window.innerHeight * 1);
  renderer.setClearColor(0x0000FF, 0.1);
  document.body.appendChild(renderer.domElement);

  ////////////// Camera/Mouse controls - ///////////////// Issues on file restructure for three.js error nil[i]

  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer.domElement);
				controls.listenToKeyEvents( window ); // keys...

				controls.enableDamping = true; // ( use later ) // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.5;

				controls.screenSpacePanning = false;

				controls.maxPolarAngle = Math.PI / 2;
  // controls.minDistance = 3000;
  // controls.maxDistance = 3000;
    controls.keys = {
      LEFT: 37, //left arrow
      UP: 38, // up arrow
      RIGHT: 39, // right arrow
      BOTTOM: 40 // down arrow
    }

    controls.keyPanSpeed = 60; // Keyboard move speed ( janky )
    controls.panSpeed = 15;

    // Reassign controls ( review for mobile )
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    }

  ///////// Lighting ////////////////

    const ambientLight = new THREE.AmbientLight( 0xcccccc );
				scene.add( ambientLight );

    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
    // directionalLight.position.set( 9000, 100, 9000 ).normalize();
    // scene.add( directionalLight );

    // const geometry = new THREE.BoxGeometry(100000, 100000, 100000);
    // let textureContainer = new THREE.TextureLoader().load('./img/gumball.jpg');

    // const materialContainer = new THREE.MeshBasicMaterial( { map: textureContainer } );
    // // materialContainer.side = THREE.Backside;
    // const container = new THREE.Mesh(geometry, materialContainer);
    // scene.add(container);


  //////////// Wireframe Intersect Objects /////////////////////////////////////////////////

  let projectGeo = new THREE.BoxGeometry(25000, 15000, 50);
  let projectMaterial = new THREE.MeshPhongMaterial({ opacity: 0, color: 0xff, wireframe: true }); // wireframe: true transparent: true

  let stuud = new THREE.Mesh(projectGeo, projectMaterial);
  stuud.name = "stuud";

  let gumballBank = new THREE.Mesh(projectGeo, projectMaterial);
  gumballBank.name = "gumballbank";

  let gumballViewer = new THREE.Mesh(projectGeo, projectMaterial);
  gumballViewer.name = "gumballviewer";

  let dawg = new THREE.Mesh(projectGeo, projectMaterial);
  dawg.name = "dawg";

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
      const projectInfo = document.getElementById("modal");

      const closeModal = function () {
        projectInfo.style.visibility = 'hidden';
      };

      if (intersects[0]) {

        let coords = intersects[0].object.name; // Naming convention allows for wireframe detection + data call
        console.log(coords);

          if (coords.match(/^[a-z]+$/)) {//"stuud" || "gumball-viewer" || "gumball-bank" || "dawg" ) {
          // ? console.log(true): console.log(false));
            // console.log(true);
            tooltip.innerHTML = coords;
            let name = coords;
            tooltip.style.visibility = 'visible';
            tooltip.style.top = event.clientY + 'px';
            tooltip.style.left = event.clientX + 20 + 'px';
            window.addEventListener( 'click', onClick );
            function onClick() {
              tooltip.style.visibility === 'visible' ? projectInfo.style.visibility = 'visible': projectInfo.style.visibility = 'hidden';
            };

              document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                  closeModal();
                  }
                });
            } else {
            tooltip.style.visibility = 'hidden';
            }
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



      // } else {
        // tooltip.style.visibility = 'hidden';
        // }


      // }

      // if (intersects[0])
      //   {console.log(intersects[0].object.position)}
    // }


///////////// MODULAR BUILD ///////////////
//// Schema Top view ////

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
  let texture_bk = new THREE.TextureLoader().load('./img/door.png');
  let texture_up = new THREE.TextureLoader().load('./img/up1.png');
  let texture_dn = new THREE.TextureLoader().load('./img/down.png');
  let texture_rt = new THREE.TextureLoader().load('./img/right.png');
  let texture_lf = new THREE.TextureLoader().load('./img/Hero.png');

  materialArray1.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_lf }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_bk }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_up }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_dn }));
  materialArray1.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_lf }));
  materialArray1.push(new THREE.MeshPhongMaterial({ map: texture_lf }));


  for (let i = 0; i < 6; i++)
  materialArray1[i].side = THREE.BackSide;


  // Cube 2 texture map
  let materialArray2 = [];
  let texture_ft2 = new THREE.TextureLoader().load('./img/right.png');
  let texture_bk2 = new THREE.TextureLoader().load('./img/window.png');
  let texture_up2 = new THREE.TextureLoader().load('./img/up2.png');
  let texture_dn2= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt2 = new THREE.TextureLoader().load('./img/dawg.png');
  let texture_lf2 = new THREE.TextureLoader().load('./img/right.png');

  materialArray2.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_ft2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_bk2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_up2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_dn2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ map: texture_rt2 }));
  materialArray2.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_lf2 }));

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
  materialArray3.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_bk3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_up3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_dn3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ map: texture_rt3 }));
  materialArray3.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_lf3 }));

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
  materialArray4.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_bk4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_up4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ map: texture_dn4 }));
  materialArray4.push(new THREE.MeshPhongMaterial({ opacity: 0, transparent: true, map: texture_bk4 }));
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
