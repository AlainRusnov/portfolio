// import * as THREE from 'https://unpkg.com/three/build/three.module.js';



let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrap');
let elems = [...document.querySelectorAll('.n')];
let container = document.getElementById("container");

window.addEventListener('wheel',(e)=>{
  // console.log(e);
  speed += e.deltaY*0.0003;
});

let objs = Array(5).fill({dist:0});


function raf(){
  // console.log(speed);
  position += speed;
  speed *= 0.85; // speed inertia

  objs.forEach((o,i)=> {
    o.dist = Math.min(Math.abs(position - i),1);
    o.dist = 1 - o.dist**2;
    elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
  });

  rounded = Math.round(position);

  let diff = (rounded - position);

  position += Math.sign(diff)*Math.pow(Math.abs(diff),0.7) * 0.015; // value scroll strength

  console.log(position);
  wrap.style.transform = `translate(0,${-position*100 + 50}px`;
  window.requestAnimationFrame(raf);
}

raf();


let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();
  // scene.background = new THREE.color( 0xff0000 );

	// geometry = new THREE.PlaneBufferGeometry( 1,1 );
	// material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

	// mesh = new THREE.Mesh( geometry, material );
	// scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xFFFFFF);
  // renderer.setAnimationLoop( animation );
	container.appendChild( renderer.domElement );

  animate();
  handleImages();
}

function handleImages(){
  let images = [...document.querySelectorAll('.image-scroll')];
  images.forEach((img,i)=>{
    console.log(img.src);
    // let mat = material.clone();
    let imgSliders = img.src.split('img/').pop();
    console.log(imgSliders);
    let txt = new THREE.TextureLoader().load(`img/${imgSliders}`);
    let mat = new THREE.MeshBasicMaterial({ map: txt }); // wireframe: true
    txt.needsUpdate = true;
    let geo = new THREE.PlaneBufferGeometry(1.5,1,20,20);
    let mesh = new THREE.Mesh(geo,mat);
    mesh.position.y = i*1.1;
    scene.add(mesh);
    // container.appendChild( renderer.domElement );
    console.log(images,i);
  });
}

function animate() {

	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);

}