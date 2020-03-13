import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import './index.css';

let scene;
let camera;
let renderer;
let capsule;

const app = document.getElementById('js_window');
const onResize = () => {
    camera.aspect = app.offsetWidth / app.offsetHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(app.offsetWidth, app.offsetHeight);
};
const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);

    capsule.rotation.x += 0.01;
    capsule.rotation.y += 0.01;
    capsule.rotation.z += 0.01;
};
const init = () => {
    const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677';

    scene = new THREE.Scene();

    const background = new THREE.CubeTextureLoader().setPath(`${assetPath}/skybox2_`).load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
    ]);

    scene.background = background;

    camera = new THREE.PerspectiveCamera(75, app.offsetWidth / app.offsetHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(app.offsetWidth, app.offsetHeight);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.DirectionalLight('#fff', 3);
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);

    light.position.set(0, 2, 1);
    scene.add(light);
    scene.add(ambient);

    const segments = 50;

    capsule = new THREE.Group();

    scene.add(capsule);

    const sphereGeometry = new THREE.SphereGeometry(1, segments, segments, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshLambertMaterial({envMap: background});
    const sphereTop = new THREE.Mesh(sphereGeometry, material);
    const sphereBottom = sphereTop.clone();

    sphereTop.position.y = 1.5;
    sphereBottom.position.y = -1.5;
    sphereBottom.rotation.z = Math.PI;

    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, segments, 1, true);
    const cylinder = new THREE.Mesh(cylinderGeometry, material);

    capsule.add(sphereTop);
    capsule.add(sphereBottom);
    capsule.add(cylinder);

    app.appendChild(renderer.domElement);
    window.addEventListener('resize', onResize, false);

    update();
};

init();

console.info('%cHello Underworld! Authorship is attributed to %c01011010 01100100 01100101 01101110 01100101 01101011 01000100. %cYou can try this >> https://bit.ly/31QKTyy', 'color: #9cd9f2', 'color: #c8e49b', 'color: #9cd9f2');
