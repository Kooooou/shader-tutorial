import "./style.css";
import * as THREE from "three";
import vertex from "./shaders/vertexShader";
import fragment from "./shaders/fragmentShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import skyTexture from "./textures/sky.jpg"

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const sky = textureLoader.load(skyTexture);
scene.background = sky;
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 256, 256);

// 波の高さで色を変える
const colorObject = {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uWaveLength: {value: 0.45},
    uFrequency: {value: new THREE.Vector2(7.0,3.5)},
    uTime: {value: 0},
    uWaveSpeed: {value: 0.7},
    uDepthColor: {value: new THREE.Color(colorObject.depthColor)},
    uSurfaceColor: {value: new THREE.Color(colorObject.surfaceColor)},
    uColotOffset: {value: 0.03},
    uColorMutiplier: {value:5.0},
    uSmallWaveElevation: {value: 0.2},
    uSmallWaveFrequency: {value: 3.0},
    uSmallWaveSpeed: {value: 0.2},
  }
});
// デバック
const gui = new dat.GUI({width:300});
gui.add(material.uniforms.uWaveLength,'value').min(0).max(1).step(0.01).name("uWaveLength");
gui.add(material.uniforms.uFrequency.value,"x").min(0).max(1).step(0.01).name("uFrequency:X");
gui.add(material.uniforms.uFrequency.value,"y").min(0).max(1).step(0.01).name("uFrequency:Y");
gui.add(material.uniforms.uWaveSpeed,"value").min(0).max(5).step(0.01).name("waveSpeed")
// 色の濃さを変えるデバッグ
gui.add(material.uniforms.uColotOffset,'value').min(0).max(1).step(0.01).name("uColorOffset");
gui.add(material.uniforms.uColorMutiplier,'value').min(0).max(10).step(0.01).name("uColorMutiplier");
// 小さい波のデバッグ
gui.add(material.uniforms.uSmallWaveElevation, "value").min(0).max(1).name("uSmallWaveElevation")
gui.add(material.uniforms.uSmallWaveFrequency, "value").min(0).max(5).name("uSmallWaveFrequency")
gui.add(material.uniforms.uSmallWaveSpeed, "value").min(0).max(1).name("uSmallWaveSpeed")
// カラーデバッグ
gui.addColor(colorObject, "depthColor").onChange(()=>{
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
})
gui.addColor(colorObject, "surfaceColor").onChange(()=>{
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
})
gui.show(false);
// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.35, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  camera.position.x = Math.sin(elapsedTime * 0.2) * 3.0;
  camera.position.z = Math.cos(elapsedTime * 0.2) * 3.0;
  
  camera.lookAt(Math.sin(elapsedTime) / 3.0, Math.sin(elapsedTime) / 3.0, 0)
  
  // controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
