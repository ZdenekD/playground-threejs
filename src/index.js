import * as THREE from 'three';
import './index.css';

let scene;
let camera;
let renderer;
let box;
let boxLeft;
let boxRight;

const app = document.getElementById('js_window');
const onResize = () => {
    camera.aspect = app.offsetWidth / app.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(app.offsetWidth, app.offsetHeight);
};
const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#aaa');

    camera = new THREE.PerspectiveCamera(75, app.offsetWidth / app.offsetHeight, 0.1, 100);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(app.offsetWidth, app.offsetHeight);

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshStandardMaterial({color: new THREE.Color('skyblue')});
    const light = new THREE.DirectionalLight();

    box = new THREE.Mesh(geometry, material);
    boxLeft = new THREE.Mesh(geometry, material);
    boxRight = new THREE.Mesh(geometry, material);

    boxLeft.position.x = -0.5;
    boxRight.position.x = 0.5;
    light.position.set(0, 1, 2);

    scene.add(box);
    scene.add(boxLeft);
    scene.add(boxRight);
    scene.add(light);

    app.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);
};
const animate = () => {
    requestAnimationFrame(animate);

    box.rotation.y += 0.01;
    box.rotation.x += 0.001;
    box.rotation.z += 0.025;

    boxLeft.rotation.y -= 0.01;
    boxLeft.rotation.x -= 0.002;
    boxLeft.rotation.z += 0.033;

    boxRight.rotation.x += 0.001;
    boxRight.rotation.y += 0.01;
    boxRight.rotation.z -= 0.025;

    renderer.render(scene, camera);
};

init();
animate();

console.info('%cHello Underworld! Authorship is attributed to %c01011010 01100100 01100101 01101110 01100101 01101011 01000100. %cYou can try this >> https://bit.ly/31QKTyy', 'color: #9cd9f2', 'color: #c8e49b', 'color: #9cd9f2');
