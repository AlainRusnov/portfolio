// import * as THREE from 'https://unpkg.com/three/build/three.module.js';


/////////// GLSL Shaders //////////////////////

const vertex = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.141592653589793238;
uniform float distanceFromCenter;
void main() {

  vUv= (uv - vec2(0.5))*(1.08 - 0.1*distanceFromCenter*(2. - distanceFromCenter)) + vec2(0.5);
  vec3 pos = position;
  pos.y += sin(PI*uv.x)*0.01;
  pos.z += sin(PI*uv.x)*0.02;

  pos.y += sin(time*0.25)*0.01;
  vUv.y -= sin(time*0.25)*0.01;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}`;

const fragment = `
uniform float time;
uniform float progress;
uniform float distanceFromCenter;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main(){
  vec4 t = texture2D(texture1, vUv);
  float bw = (t.r + t.b + t.g)/3.;
  vec4 another = vec4(bw,bw,bw,1.5);
  gl_FragColor = mix(another,t,distanceFromCenter);
  gl_FragColor.a = clamp(distanceFromCenter,0.2,1.);
}`;


  let material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable"
    },
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: "f", value: 0},
      distanceFromCenter: { type: "f", value: 0},
      texture1: { type: "t", value: null },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1,1)
      }
    },
      fragmentShader:fragment,
      vertexShader:vertex
  });

//////////////////////////////////////////////////////////////////

let speed = 0;
let position = 0;
let rounded = 0;
let time = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrap');
let elems = [...document.querySelectorAll('.n')];
let container = document.getElementById("container");
const meshes = [];
let materials = [];
let groups = [];
let attractMode = false;
let attractTo = 0;
let camera, scene, renderer;
let geoback, mat, mesh;
let bkground = [0xff, 0xffff, 0x000, 0xffffff, 0x000ff];

var W, H;
  // var camera, scene, renderer;
  var geoRec, matBox
  var pointLight;
  var obj = {};
  var mouseX = 0;
  var mouseY = 0;
  var nbmesh = 100;

init();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
  camera.position.z = 1;

  W = window.innerWidth;
  H = window.innerHeight;

  scene = new THREE.Scene();
  // scene.background = new THREE.color( 0xff0000 );

  // geoRec = new THREE.PlaneBufferGeometry( 1,1 );
  // material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

  // mesh = new THREE.Mesh( geoRec, material );
  // scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xFFFFFF, 0);
  // renderer.setAnimationLoop( animation );
  container.appendChild( renderer.domElement );

   // LIGHTS
   pointLight = new THREE.PointLight(0xFFFFFF, 1.0, 1500);
   pointLight.position.x = 0;
   pointLight.position.y = 0;
   pointLight.position.z = 1500;
   scene.add(pointLight);

  //  geoRec = new THREE.BoxBufferGeometry( 1000, 500, 500 );


  //   var box;
  //   var color;
  //   for (var i = 0; i < nbmesh; i++) {
  //     color = new THREE.Color( 0xffffff );
  //     color.setRGB( 255, 255, 255 );

  //     matBox = new THREE.MeshPhongMaterial( { color:color, wireframe: false } );

  //     obj['box'+i] = new THREE.Mesh( geoRec, matBox );

  //     scene.add( obj['box'+i] );
  //     box = obj['box' + i];

  //     box.position.x = (( -W* 2) * Math.random()) + W;
  //     box.position.y = (( -H* 4) * Math.random()) + H;
  //     box.position.z = (( -H *4) * Math.random()) + H;
  //   }

  animate();
  handleImages();
}

function handleImages(){
  let images = [...document.querySelectorAll('.image-scroll')];
  images.forEach((img,i)=>{
    // console.log(img.src);
    let mat = material.clone();
    materials.push(mat);
    mat.uniforms.texture1.value = new THREE.Texture(img);
    mat.uniforms.texture1.value.needsUpdate = true;

    let group = new THREE.Group();

    // let imgSliders = img.src.split('img/').pop();
    // // console.log(imgSliders);
    // let txt = new THREE.TextureLoader().load(`img/${imgSliders}`);
    // let mat = new THREE.MeshBasicMaterial({ map: txt }); // wireframe: true
    // txt.needsUpdate = true;

    let geo = new THREE.PlaneBufferGeometry(1.25,0.9,40,40);
    let mesh = new THREE.Mesh(geo,mat);

    mesh.position.y = i*1.2;
    mesh.position.x = 0.3;
    // console.log(mesh);
    // mesh.position.z = 1500;

    group.rotation.y = -0.3;
    group.rotation.x = -0.2;
    group.rotation.z = -0.2;


    // renderer.setClearColor(0xffffff, 0);
    // console.log(bkground[i]);

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
    elems[i].style.transform === "scale(1)" ? elems[i].style.visibility = "hidden" : elems[i].style.visibility = "visible";
    // container.style.transform = `background: ${bkground[i]};`
    let scale = 1 + 0.10 * o.dist;
    meshes[i].position.y = i*-1.1 + position*1.1;
    meshes[i].scale.set(scale,scale,scale);
    meshes[i].material.uniforms.distanceFromCenter.value =  o.dist;
  });

  rounded = Math.round(position);

  let diff = (rounded - position);
  if(attractMode) {
    position += (position - attractTo)*-0.02;
  } else {
    position += Math.sign(diff)*Math.pow(Math.abs(diff),0.7) * 0.02; // inertia

    // console.log(position);
    wrap.style.transform =  `translate(0,${-position * 100/2}%)`                             //`translate(0,${-position*100 + 50}px`;

  }

  // meshes.forEach((mesh,i)=>{
  //   mesh.position.y = i*1.2 + position*1.2;
  //   mesh.scale.set(i*1.2 + position*1.2)
  // });
  window.requestAnimationFrame(roll);
}

roll();



function animate() {
  time += 0.05;
  if(materials){
    materials.forEach(m=>{
      m.uniforms.time.value = time;
    });
  }
	// mesh.rotation.x = time / 2000;
	// mesh.rotation.y = time / 1000;

  // for ( var i = 0; i < nbmesh; i++ ) {
  //   var box = obj['box'+i];
  //   box.rotation.x += ((W * .5) ) * .0000005;
  //   box.rotation.y += ((H * .5) - mouseX) * .0000005;
  //   box.position.z  = ((H * .5) - mouseY) * 1.0;
  // }

  pointLight.distance = (mouseY * 2) +2000;
  // camera.position.y = (mouseY * 0.5);
  // camera.position.x = (mouseX * 0.5);


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




// function Background(){
//   var self = this;
//   var W, H;
//   var camera, scene, renderer;
//   var geoback, matBox
//   var pointLight;
//   var obj = {};
//   var mouseX = 0;
//   var mouseY = 0;
//   var nbmesh = 100;


//   this.init = function(){
//     // SET
//     scene = new THREE.Scene();
//     W = window.innerWidth
//     H = window.innerHeight

    // LIGHTS
    // pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 1000);
	  // pointLight.position.x = 0;
		// pointLight.position.y = 0;
		// pointLight.position.z = 100;
		// scene.add(pointLight);

    // CAMERA
    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.z = 1000;

    // CAST
    // geoback = new THREE.BoxGeometry( 600, 200, 200 );


    // var box;
    // var color;
    // for (var i = 0; i < nbmesh; i++) {
    //   color = new THREE.Color( 0xffffff );
    //   color.setRGB( 255, 255, 255 );

    //   matBox = new THREE.MeshPhongMaterial( { color:color, wireframe: false } );

    //   obj['box'+i] = new THREE.Mesh( geoback, matBox );

    //   scene.add( obj['box'+i] );
    //   box = obj['box' + i];

    //   box.position.x = ((- W* 2) * Math.random()) + W;
    //   box.position.y = ((- H* 4) * Math.random()) + H;
    //   box.position.z = ((- H *4) * Math.random()) + H;
    // }

    // ACTION
    // renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.getElementById('container').appendChild( renderer.domElement );

  //   window.addEventListener( "resize", this.onresize)
  //   document.addEventListener( "mousemove", this.onmousemove)
  // }

//   this.animate = function(){
//     requestAnimationFrame( self.animate );


//     for ( var i = 0; i < nbmesh; i++ ) {
//       var box = obj['box'+i];
//       box.rotation.x += ((W * .5) ) * .0000005;
//       box.rotation.y += ((H * .5) - mouseX) * .0000005;
//       box.position.z  = ((H * .5) - mouseY) * 1.0;
//     }

//     pointLight.distance = (mouseY * 2) +1000;
//     camera.position.y = (mouseY * 0.5);
//     camera.position.x = (mouseX * 0.5);

//     renderer.render( scene, camera );
//   }

//   this.onresize = function(){
//     W = window.innerWidth
//     H = window.innerHeight
//     camera.aspect = W / H;
//     camera.updateProjectionMatrix();
//     renderer.setSize(W, H, true);
//     renderer.render(scene, camera);
//   }

//   this.onmousemove = function(e){
//     mouseX = e.pageX;
//     mouseY = e.pageY;
//   }

//   this.init();
// 	this.animate();
// }

// new Background();