
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
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 45, 30000);
  camera.position.set(-900, -100, 900);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 1, window.innerHeight * 1);
  renderer.setClearColor(0x888888, 1)
  document.body.appendChild(renderer.domElement);

  // Camera/Mouse controls - Issues on file restructure for three.js error nil[i]
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 1500;
  // controls.keys = {
  //   LEFT: 37, //left arrow
  //   UP: 38, // up arrow
  //   RIGHT: 39, // right arrow
  //   BOTTOM: 40 // down arrow
  // }

  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load('./img/left.png');
  let texture_bk = new THREE.TextureLoader().load('./img/back.png');
  let texture_up = new THREE.TextureLoader().load('./img/up.jpg');
  let texture_dn = new THREE.TextureLoader().load('./img/down.png');
  let texture_rt = new THREE.TextureLoader().load('./img/right.png');
  let texture_lf = new THREE.TextureLoader().load('./img/front.png');

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

  for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;
  let skyboxGeo = new THREE.BoxGeometry(35000, 25000, 30000);
  let skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
  animate();
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
init();
