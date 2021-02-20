
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
  // const canvas = document.querySelector('#c');
	// document.body.appendChild( container );


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 60, 200000);
  camera.position.set(-900, -100, 5000);


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 1, window.innerHeight * 1);
  // renderer.setClearColor(0x00ffff, 1);
  document.body.appendChild(renderer.domElement);

  // Camera/Mouse controls - Issues on file restructure for three.js error nil[i]
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer.domElement);
  // controls.minDistance = 500;
  // controls.maxDistance = 1500;
  // controls.keys = {
    //   LEFT: 37, //left arrow
    //   UP: 38, // up arrow
    //   RIGHT: 39, // right arrow
    //   BOTTOM: 40 // down arrow
    // }

    // const geometry = new THREE.BoxGeometry(100000, 100000, 100000);
    // let textureContainer = new THREE.TextureLoader().load('./img/gumball.jpg');

    // const materialContainer = new THREE.MeshBasicMaterial( { map: textureContainer } );
    // // materialContainer.side = THREE.Backside;
    // const container = new THREE.Mesh(geometry, materialContainer);
    // scene.add(container);


    // Cube 1 texture map
  let materialArray1 = [];
  let texture_ft = new THREE.TextureLoader().load('./img/left.png');
  let texture_bk = new THREE.TextureLoader().load('./img/left.png');
  let texture_up = new THREE.TextureLoader().load('./img/up.jpg');
  let texture_dn = new THREE.TextureLoader().load('./img/down.png');
  let texture_rt = new THREE.TextureLoader().load('./img/right.png');
  let texture_lf = new THREE.TextureLoader().load('./img/Hero.png');

  materialArray1.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, map: texture_ft }));
  materialArray1.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray1.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray1.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray1.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }));
  materialArray1.push(new THREE.MeshBasicMaterial({ map: texture_lf }));


  for (let i = 0; i < 6; i++)
  materialArray1[i].side = THREE.BackSide;


  // Cube 2 texture map
  let materialArray2 = [];
  let texture_ft2 = new THREE.TextureLoader().load('./img/right.png');
  let texture_bk2 = new THREE.TextureLoader().load('./img/right.png');
  let texture_up2 = new THREE.TextureLoader().load('./img/up.jpg');
  let texture_dn2= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt2 = new THREE.TextureLoader().load('./img/dawg.png');
  let texture_lf2 = new THREE.TextureLoader().load('./img/right.png');

  materialArray2.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, map: texture_ft2 }));
  materialArray2.push(new THREE.MeshBasicMaterial({ map: texture_bk2 }));
  materialArray2.push(new THREE.MeshBasicMaterial({ map: texture_up2 }));
  materialArray2.push(new THREE.MeshBasicMaterial({ map: texture_dn2 }));
  materialArray2.push(new THREE.MeshBasicMaterial({ map: texture_rt2 }));
  materialArray2.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }));

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

  materialArray3.push(new THREE.MeshBasicMaterial({ map: texture_ft3 }));
  materialArray3.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, map: texture_bk3 }));
  materialArray3.push(new THREE.MeshBasicMaterial({ map: texture_up3 }));
  materialArray3.push(new THREE.MeshBasicMaterial({ map: texture_dn3 }));
  materialArray3.push(new THREE.MeshBasicMaterial({ map: texture_rt3 }));
  materialArray3.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, map: texture_lf3 }));

  for (let i = 0; i < 6; i++)
  materialArray3[i].side = THREE.BackSide;

  // // Cube 4 texture map
  let materialArray4 = [];
  let texture_ft4 = new THREE.TextureLoader().load('./img/gblogo.png');
  let texture_bk4 = new THREE.TextureLoader().load('./img/right.png');
  let texture_up4 = new THREE.TextureLoader().load('./img/up.jpg');
  let texture_dn4= new THREE.TextureLoader().load('./img/down.png');
  let texture_rt4 = new THREE.TextureLoader().load('./img/Gumwall.png');
  let texture_lf4 = new THREE.TextureLoader().load('./img/stuud.png');

  materialArray4.push(new THREE.MeshBasicMaterial({ map: texture_ft4 }));
  materialArray4.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, map: texture_bk4 }));
  materialArray4.push(new THREE.MeshBasicMaterial({ map: texture_up4 }));
  materialArray4.push(new THREE.MeshBasicMaterial({ map: texture_dn4 }));
  materialArray4.push(new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }));
  materialArray4.push(new THREE.MeshBasicMaterial({ map: texture_lf4 }));

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
  requestAnimationFrame(animate);
}
init();
