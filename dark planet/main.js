import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';


// ======================
// TEXTURES
// ======================

const q =
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=827&q=80';

const e =
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1033&q=80';

const p =
  'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&w=1050&q=80';

const a =
  'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=696&q=80';


const s_group = new THREE.Group();
const s_galax = new THREE.Group();

let camera;
let renderer;
let scene;

let c_mat;
let a_mes;
let b_mes;
let c_mes;
let d_mes;


function main() {

  // ======================
  // CANVAS
  // ======================

  const canvas = document.querySelector('#canvas');

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;


  // ======================
  // SCENE
  // ======================

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x391809, 9, 15);


  // ======================
  // CAMERA
  // ======================

  camera = new THREE.PerspectiveCamera(
    18,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );

  camera.position.z = 10;


  // ======================
  // CONTROLS
  // ======================

  const controls = new OrbitControls(camera, canvas);

  controls.enableZoom = false;
  controls.enablePan = false;

  controls.target.set(0, 0, 0);
  controls.update();


  // ======================
  // ADD GROUPS
  // ======================

  scene.add(s_group);
  scene.add(s_galax);


  // ======================
  // LIGHTS
  // ======================

  createLights();


  // ======================
  // OBJECTS
  // ======================

  createElements();


  // ======================
  // STARS
  // ======================

  createPoints();


  // ======================
  // GUI
  // ======================

  createGUI();


  // ======================
  // RESIZE
  // ======================

  window.addEventListener('resize', onWindowResize);


  // ======================
  // START
  // ======================

  animate();
}


// ======================
// TEXTURE LOADER
// ======================

function loadTexture(url) {

  const texture = new THREE.TextureLoader().load(url);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}


// ======================
// ENV MAP
// ======================

function createEnvMap() {

  const envMap = new THREE.TextureLoader().load(a);

  envMap.mapping = THREE.EquirectangularReflectionMapping;

  return envMap;
}


// ======================
// LIGHTS
// ======================

function createLights() {

  const hemiLight = new THREE.HemisphereLight(
    0xffffff,
    0x00a1a2,
    1
  );

  scene.add(hemiLight);


  const dirLight = new THREE.DirectionalLight(
    0xffffff,
    3
  );

  dirLight.position.set(5, 5, 5);

  dirLight.castShadow = true;

  scene.add(dirLight);
}


// ======================
// OBJECTS
// ======================

function createElements() {

  const a_geo = new THREE.IcosahedronGeometry(1, 5);

  const b_geo = new THREE.TorusKnotGeometry(
    0.6,
    0.25,
    100,
    15
  );

  const c_geo = new THREE.TetrahedronGeometry(1, 3);

  const d_geo = new THREE.TorusGeometry(
    2,
    0.4,
    3,
    60
  );


  c_mat = new THREE.MeshStandardMaterial({

    envMap: createEnvMap(),

    map: loadTexture(e),

    aoMap: loadTexture(e),

    bumpMap: loadTexture(q),

    emissiveMap: loadTexture(q),

    metalnessMap: loadTexture(e),

    displacementMap: loadTexture(p),

    roughness: 0.0,

    metalness: 1.0,

    emissive: 0x333333,

    emissiveIntensity: 0.1,

    bumpScale: 0.01,

    displacementScale: 0.0
  });


  a_mes = new THREE.Mesh(a_geo, c_mat);

  b_mes = new THREE.Mesh(b_geo, c_mat);

  c_mes = new THREE.Mesh(c_geo, c_mat);

  d_mes = new THREE.Mesh(d_geo, c_mat);


  d_mes.rotation.x = -Math.PI / 2;

  d_mes.scale.z = 0.02;


  a_mes.add(d_mes);


  a_mes.castShadow = true;
  b_mes.castShadow = true;
  c_mes.castShadow = true;

  a_mes.receiveShadow = true;
  b_mes.receiveShadow = true;
  c_mes.receiveShadow = true;


  s_group.add(a_mes);
  s_group.add(b_mes);
  s_group.add(c_mes);


  b_mes.visible = false;
  c_mes.visible = false;
}


// ======================
// GUI
// ======================

function createGUI() {

  const gui = new GUI();

  const materialFolder = gui.addFolder('Material');

  const geometryFolder = gui.addFolder('Geometry');

  const cameraFolder = gui.addFolder('Camera');


  // Camera

  cameraFolder
    .add(camera.position, 'z', 5, 20)
    .name('Zoom');


  // Material

  materialFolder
    .add(c_mat, 'roughness', 0, 1)
    .name('Roughness');

  materialFolder
    .add(c_mat, 'metalness', 0, 1)
    .name('Metalness');

  materialFolder
    .add(c_mat, 'emissiveIntensity', 0, 2)
    .name('Glow');

  materialFolder
    .add(c_mat, 'bumpScale', 0, 0.1)
    .name('Bump');

  materialFolder
    .add(c_mat, 'displacementScale', 0, 0.2)
    .name('Displacement');


  // Geometry

  const settings = {
    geometry: 'Planet',
    shading: 'Smooth'
  };

  geometryFolder
    .add(settings, 'geometry', [
      'Planet',
      'TorusKnot',
      'Tetrahedron'
    ])
    .onChange((value) => {

      a_mes.visible = false;
      b_mes.visible = false;
      c_mes.visible = false;

      if (value === 'Planet') {
        a_mes.visible = true;
      }

      if (value === 'TorusKnot') {
        b_mes.visible = true;
      }

      if (value === 'Tetrahedron') {
        c_mes.visible = true;
      }
    });


  geometryFolder
    .add(settings, 'shading', [
      'Smooth',
      'Flat'
    ])
    .onChange((value) => {

      c_mat.flatShading = value === 'Flat';

      c_mat.needsUpdate = true;
    });


  materialFolder.open();
  cameraFolder.open();
}


// ======================
// STARS
// ======================

function createPoints(count = 15000, size = 20) {

  const geometry = new THREE.BufferGeometry();

  const positions = [];

  const half = size / 2;


  for (let i = 0; i < count; i++) {

    const x = Math.random() * size - half;

    const y = Math.random() * size - half;

    const z = Math.random() * size - half;

    positions.push(x, y, z);
  }


  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );


  const material = new THREE.PointsMaterial({
    size: 0.02
  });


  const points = new THREE.Points(
    geometry,
    material
  );

  s_galax.add(points);
}


// ======================
// ANIMATION
// ======================

function animate() {

  requestAnimationFrame(animate);


  s_group.rotation.y -= 0.001;

  s_group.rotation.x += 0.0005;

  s_galax.rotation.z += 0.00025;

  s_galax.rotation.x += 0.000125;


  renderer.render(scene, camera);
}


// ======================
// RESIZE
// ======================

function onWindowResize() {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
}


// ======================
// START APP
// ======================

window.addEventListener('load', main);