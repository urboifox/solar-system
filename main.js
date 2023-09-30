import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import sunTexture from "./src/imgs/sun.jpg";
import starsTexture from "./src/imgs/stars.jpg";
import mercuryTexture from "./src/imgs/mercury.jpg";
import venusTexture from "./src/imgs/venus.jpg";
import earthTexture from "./src/imgs/earth.jpg";
import marsTexture from "./src/imgs/mars.jpg";
import jupiterTexture from "./src/imgs/jupiter.jpg";
import saturnRingTexture from "./src/imgs/saturn ring.png";
import saturnTexture from "./src/imgs/saturn.jpg";
import uranusTexture from "./src/imgs/uranus.jpg";
import uranusRingTexture from "./src/imgs/uranus ring.png";
import neptuneTexture from "./src/imgs/neptune.jpg";
import plutoTexture from "./src/imgs/pluto.jpg";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 50, 50);
controls.update();

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

// elements

const sunTex = textureLoader.load(sunTexture);
sunTex.colorSpace = THREE.SRGBColorSpace;
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: sunTex,
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(radius, texture, position, ring, ringTexture = null) {
  const planetTex = textureLoader.load(texture);
  planetTex.colorSpace = THREE.SRGBColorSpace;
  const planetGeo = new THREE.SphereGeometry(radius, 30, 30);
  const planetMat = new THREE.MeshStandardMaterial({
    map: planetTex,
  });
  const obj = new THREE.Object3D();
  const mesh = new THREE.Mesh(planetGeo, planetMat);
  if (ring) {
    const ringTex = textureLoader.load(ringTexture);
    ringTex.colorSpace = THREE.SRGBColorSpace;
    const ringGeo = new THREE.RingGeometry(ring.innerRad, ring.outerRad, 30);
    const ringMat = new THREE.MeshStandardMaterial({
      map: ringTex,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI * 0.5;
    ringMesh.position.x = position;
    obj.add(ringMesh);
  }
  mesh.position.x = position;
  obj.add(mesh);
  scene.add(obj);
  return { mesh, obj };
}

const earth = createPlanet(5, earthTexture, 50);
const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(
  10,
  saturnTexture,
  138,
  { innerRad: 10, outerRad: 20 },
  saturnRingTexture
);
const uranus = createPlanet(
  7,
  uranusTexture,
  176,
  { innerRad: 7, outerRad: 12 },
  uranusRingTexture
);
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const ambLight = new THREE.AmbientLight(0x555555);
scene.add(ambLight);

const pointLight = new THREE.PointLight(0xffffff, 7000, 300);
scene.add(pointLight);

const animate = () => {
  // self rotation
  sun.rotation.y += 0.004;
  mercury.mesh.rotation.y += 0.004;
  venus.mesh.rotation.y += 0.002;
  earth.mesh.rotation.y += 0.02;
  mars.mesh.rotation.y += 0.018;
  jupiter.mesh.rotation.y += 0.04;
  saturn.mesh.rotation.y += 0.038;
  uranus.mesh.rotation.y += 0.03;
  neptune.mesh.rotation.y += 0.032;
  pluto.mesh.rotation.y += 0.008;
  // around sun rotation
  mercury.obj.rotation.y += 0.04;
  venus.obj.rotation.y += 0.015;
  earth.obj.rotation.y += 0.01;
  mars.obj.rotation.y += 0.008;
  jupiter.obj.rotation.y += 0.002;
  saturn.obj.rotation.y += 0.0009;
  uranus.obj.rotation.y += 0.0004;
  neptune.obj.rotation.y += 0.0001;
  pluto.obj.rotation.y += 0.00007;
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
