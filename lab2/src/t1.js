import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer;
let cylinderMesh, torusKnotMesh, ringMesh; 
let controls;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Сцена
    scene = new THREE.Scene();
    

    // Камера
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Об'єкт рендерингу
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Світло

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4); 
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 10); 
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    const pointLight2 = new THREE.SpotLight(0xffffff, 150);
    pointLight2.position.set(1, 2, 0);
    //gui.add(new DegRadHelper(pointLight2, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
    // gui.addColor(new ColorGUIHelper(pointLight2, 'color'), 'value').name('color');
    // gui.add(pointLight2, 'intensity', 0, 5, 0.01);
    // gui.add(pointLight2, 'penumbra', 0, 1, 0.01);
    scene.add(pointLight2);
    scene.add(pointLight2.target);
    const helper = new THREE.SpotLightHelper(pointLight2);
    scene.add(helper);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);
    
    // 1. Створюємо об'єкт Cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
    const emissiveMaterial = new THREE.MeshNormalMaterial({
        flatShading: true
    })

    /*
    const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500, 
        emissive: 0xff4500, 
        emissiveIntensity: 3, 
        metalness: 0.5,
        roughness: 0.2,
    });
    */
   
    cylinderMesh = new THREE.Mesh(cylinderGeometry, emissiveMaterial);
    cylinderMesh.position.x = -0.35;
    cylinderMesh.position.z = -1;

    scene.add(cylinderMesh);

    // 2. Створюємо об'єкт Torus Knot
    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.08, 0.03, 100, 16);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x01AC82, 
        transparent: true,
        opacity: 0.8,
        roughness: 0.4,
        metalness: 0.01,
        reflectivity: 0.5,
        transmission: 0.9,
        side: THREE.DoubleSide
    });
    torusKnotMesh = new THREE.Mesh(torusKnotGeometry, glassMaterial);
    torusKnotMesh.position.z = -1;

    scene.add(torusKnotMesh);

    // 3. Створюємо об'єкт Ring
    const ringGeometry = new THREE.RingGeometry(0.06, 0.12, 32);
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.3,
        side: THREE.DoubleSide
    });
    ringMesh = new THREE.Mesh(ringGeometry, goldMaterial);
    ringMesh.position.x = 0.35;
    ringMesh.position.z = -1;

    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);
    
    // Позиція для камери
    camera.position.z = 1;


    // Контролери
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
    controls.update();
}

function render() {
    rotateObjects();
    renderer.render(scene, camera);
}
    
function rotateObjects() {
    cylinderMesh.rotation.y -= 0.01;
    torusKnotMesh.rotation.x -= 0.01;
    ringMesh.rotation.y -= 0.01;
}
