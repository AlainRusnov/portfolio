import * as THREE from 'https://unpkg.com/three/build/three.module.js';
// import fragment from './shaders/fragment.glsl';
// import vertex from './shaders/vertex.glsl';

// let camera, scene, renderer;
// let geometry, material, mesh;

// init();
// animate();

export default class Sketch{
  constructor(){

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();
    this.addMesh();
    this.time = 0;

    this.render();
  };

  addMesh(){
    this.geometry = new THREE.PlaneBufferGeometry( 1,1 );
    this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    // this.material = new THREE.ShaderMaterial({
    //   fragmentShader:fragment,
    //   vertexShader:vertex,
    //   uniforms:{
    //     progress: {type: "f", value: 0}
    //   },
    //   side: THREE.Doubleside
    // })
    this.plane = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.plane );
  };

  stop() {
    this.isPlaying = false;
  };

  play() {
    if(!this.isPlaying){
      this.render();
      this.isPlaying = true;
    }
  }

  render(){
    if (!this.isPlaying) return;
    this.time++;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    console.log(this.time);
    this.renderer.render( this.scene, this.camera );
    window.requestAnimationFrame(this.render.bind(this))
  };
};

new Sketch({
  dom: document.getElementById("container")
});






