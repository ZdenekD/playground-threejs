import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
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
const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
};
const init = () => {
    const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#aaa');

    camera = new THREE.PerspectiveCamera(75, app.offsetWidth / app.offsetHeight, 0.1, 100);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(app.offsetWidth, app.offsetHeight);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0, 0, 0);
    controls.update();

    const size = 0.25;
    const texture = new THREE.TextureLoader().load(`${assetPath}/bricks-diffuse3.png`);
    const alpha = new THREE.TextureLoader().load('./images/dots.jpg');
    const background = new THREE.CubeTextureLoader().setPath(`${assetPath}/skybox1_`).load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
    ]);
    const geometry = new THREE.BoxGeometry(size, size, size);
    const standardMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('white'), map: texture});
    const lambertMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('white'), map: texture, alphaMap: alpha, transparent: true, side: THREE.DoubleSide,
    });
    const light = new THREE.DirectionalLight();

    box = new THREE.Mesh(geometry, standardMaterial);
    boxLeft = new THREE.Mesh(geometry, lambertMaterial);
    boxRight = new THREE.Mesh(geometry, lambertMaterial);

    boxLeft.position.x = -0.5;
    boxRight.position.x = 0.5;

    light.position.set(0, 1, 2);
    scene.background = background;

    scene.add(box);
    scene.add(boxLeft);
    scene.add(boxRight);
    scene.add(light);

    app.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

    update();
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
