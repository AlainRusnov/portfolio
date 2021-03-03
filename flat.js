// import * as THREE from 'https://unpkg.com/three/build/three.module.js';



let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrap');
let elems = [...document.querySelectorAll('.n')];
let container = document.getElementById("container");
const meshes = [];
let groups = [];
let attractMode = false;
let attractTo = 0;
let camera, scene, renderer;
let geometry, material, mesh;
let bkground = [0xffff, 0xF800, 0x7FF, 0x1F, 0xF81F];

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

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
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
    // console.log(img.src);
    // let mat = material.clone();
    let group = new THREE.Group();
    let imgSliders = img.src.split('img/').pop();
    // console.log(imgSliders);
    let txt = new THREE.TextureLoader().load(`img/${imgSliders}`);
    let mat = new THREE.MeshBasicMaterial({ map: txt }); // wireframe: true
    // txt.needsUpdate = true;
    let geo = new THREE.PlaneBufferGeometry(1.1,0.8,20,20);
    let mesh = new THREE.Mesh(geo,mat);

    mesh.position.y = i*1.2;
    console.log(mesh);

    group.rotation.y = -0.3;
    group.rotation.x = -0.2;
    group.rotation.z = -0.2;

    renderer.setClearColor(0xffffff);
    console.log(bkground[i]);

    group.add(mesh);
    groups.push(group);
    scene.add(group);
    meshes.push(mesh);
    // container.appendChild( renderer.domElement );
    // console.log(images,i);
    // Add parallax afterwards
  });
}

window.addEventListener('wheel',(e)=>{
  // console.log(e);
  speed += e.deltaY*0.0003;
});

let objs = Array(5).fill({dist:0});

function roll(){
  // console.log(speed);
  position += speed;
  speed *= 0.9;

  objs.forEach((o,i)=> {
    o.dist = Math.min(Math.abs(position - i),1);
    o.dist = 1 - o.dist**2;
    elems[i].style.transform = `scale(${1 + 0.8 * o.dist})`;
    let scale = 1 + 0.3 * o.dist;
    meshes[i].position.y = i*-1.1 + position*1.1;
    meshes[i].scale.set(scale,scale,scale);
  });

  rounded = Math.round(position);

  let diff = (rounded - position);
  if(attractMode) {
    position += (position - attractTo)*-0.02;
  } else {
    position += Math.sign(diff)*Math.pow(Math.abs(diff),0.7) * 0.02; // inertia

    // console.log(position);
    wrap.style.transform = `translate(0,${-position*100 + 50}px`;

  }

  // meshes.forEach((mesh,i)=>{
  //   mesh.position.y = i*1.2 + position*1.2;
  //   mesh.scale.set(i*1.2 + position*1.2)
  // });
  window.requestAnimationFrame(roll);
}

roll();



function animate() {

	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);

}

let rots = groups.map(e=>e.rotation)

let navs = [...document.querySelectorAll("li")];
let nav = document.querySelector('.nav');
nav.addEventListener('mouseenter',()=>{
  attractMode = true;
  gsap.to(rots,{
    duration: 0.3,
    x:-0.4,
    y:0,
    z:0
  })
});

nav.addEventListener('mouseleave',()=>{
  attractMode = false;
  gsap.to(rots,{
    duration: 0.3,
    x:-0.2,
    y:-0.3,
    z:-0.2
  })
});

navs.forEach(el=>{
  el.addEventListener('mouseover',(e)=>{
    attractTo = Number(e.target.getAttribute('data-nav'));
    console.log(attractTo);
  })
});




