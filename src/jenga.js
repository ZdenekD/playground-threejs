import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import './index.css';

let scene;
let camera;
let renderer;
let box;

const app = document.getElementById('js_window');
const onResize = () => {
    camera.aspect = app.offsetWidth / app.offsetHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(app.offsetWidth, app.offsetHeight);
};
const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
};
const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#aaa');

    camera = new THREE.PerspectiveCamera(75, app.offsetWidth / app.offsetHeight, 0.1, 100);

    camera.position.set(0, 3, 10);

    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
    const light = new THREE.DirectionalLight(0xffffff, 1);

    light.position.set(1, 10, 6);

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(app.offsetWidth, app.offsetHeight);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0, 4, 0);
    controls.update();

    const height = 0.4;
    const geometry = new THREE.BoxGeometry(3, height, 0.9);
    const material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xdcbbc7)});

    box = new THREE.Mesh(geometry, material);

    for (let row = 0; row < 20; row += 1) {
        const yPos = row * (height + 0.05);
        let offset = -1;

        for (let count = 0; count < 3; count += 1) {
            const block = box.clone();

            if (row % 2) {
                block.rotation.y = Math.PI / 2;
                block.position.set(offset, yPos, 0);
            } else {
                block.position.set(0, yPos, offset);
            }

            scene.add(block);

            offset += 1;
        }
    }

    scene.add(ambient);
    scene.add(light);

    app.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

    update();
};

init();

console.info('%cHello Underworld! Authorship is attributed to %c01011010 01100100 01100101 01101110 01100101 01101011 01000100. %cYou can try this >> https://bit.ly/31QKTyy', 'color: #9cd9f2', 'color: #c8e49b', 'color: #9cd9f2');
