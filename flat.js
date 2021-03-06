// import * as THREE from 'https://unpkg.com/three/build/three.module.js';


/////////// GLSL Shaders Scroller //////////////////////

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
  pos.z += sin(PI*uv.x)*0.03;

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
///////////// GLSL Shaders Cylinder /////////////////////////////

const cylVert =`
varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;

  vec3 transformed = position;
  // transformed.z += sin(position.y + uTime);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const cylFrag = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime * 0.1;

  vec2 uv = vUv;
  vec2 repeat = vec2(12.0,4.0);
  uv.x += sin(uv.y) * -0.25;
  uv = fract(uv * repeat + vec2(0.0, time));
  vec4 color = texture(uTexture, uv);

  gl_FragColor = color;
}
`;

 // Text //
 const typo = new THREE.TextureLoader().load('./img/projtypofill.png', (texture) =>
 {
   texture.minFilter = THREE.NearestFilter;
 });

// Cylinder Shader mat

let matCyl = new THREE.ShaderMaterial({
  vertexShader: cylVert,
  fragmentShader: cylFrag,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: typo }
  },
  transparent: false,
  side: THREE.DoubleSide,
});

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


let speed = 0;
let position = 0;
let rounded = 0;
let time = 0;
let block = document.getElementById('block');
let body = document.querySelector('body');
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


let pointLight;
let obj = {};
let mouseX = 0;
let mouseY = 0;

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
  //  pointLight = new THREE.PointLight(0xFFFFFF, 1.0, 20000);
  //  pointLight.position.x = 3;
  //  pointLight.position.y = 0;
  //  pointLight.position.z = 3;
  //  scene.add(pointLight);

  //  shadow = new THREE.LightShadow( camera );
  //  scene.add(shadow);

  // Clock ///

  clock = new THREE.Clock();

  // // Text //
  // typo = new THREE.TextureLoader().load('./img/projectstypo.png', (typo) =>
  // {
  //   typo.minFilter = THREE.NearestFilter;
  // });



   // Cylinder

   geoCyl = new THREE.CylinderBufferGeometry( 0.60, 0.60, 6, 64 );
   geoCyl2 = new THREE.CylinderBufferGeometry( 0.60, 0.60, 6, 10 );


  let cyl;
  let cyl2;

  color = new THREE.Color( 0xffffff );
  color.setRGB( 255, 255, 255 );

  matCyl2 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } ); // depthwrite: false

      cyl = new THREE.Mesh( geoCyl, matCyl );
      scene.add(cyl);
      cyl2 = new THREE.Mesh( geoCyl2, matCyl2 );
      scene.add(cyl2);

      // Cyl 1 text
      cyl.position.x = 1;
      cyl.position.y = 1;
      cyl.position.z = -1;

      cyl.rotation.y = -0.3;
      cyl.rotation.x = -0.2;
      cyl.rotation.z = -0.2;

      // Cyl 2 mesh
      cyl2.position.x = 0;
      cyl2.position.y = -1.5;
      cyl2.position.z = -1;

      cyl2.rotation.y = 0.3;
      cyl2.rotation.x = 0.2;
      cyl2.rotation.z = 1.2;

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
    elems[i].style.transform === "scale(1.8)" ? elems[i].style.visibility = "visible" : elems[i].style.visibility = "hidden";
    // container.style.transform = `background: ${bkground[i]};`
    let scale = 1 + 0.10 * o.dist;
    meshes[i].position.y = i*-1.08 + position*1.1;
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

  // Uniform update on cylinder
  matCyl.uniforms.uTime.value = clock.getElapsedTime();

  // pointLight.distance = (mouseY * 2) +2000;
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




