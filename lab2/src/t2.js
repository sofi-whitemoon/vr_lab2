import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let camera, scene, renderer;
let loader;
let model;
let mixer;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5); 
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 3); 
    scene.add(ambientLight);
    
    
    // Додаємо GLTF модель на сцену
    const modelUrl = 'https://vrlab2-abcab.web.app/magic/scene.gltf';
    

    // Створюємо завантажувач
    loader = new GLTFLoader();
//////////////////////////////////
// Extend the loader to handle KHR_materials_pbrSpecularGlossiness
loader.setKhrMaterialsPbrSpecularGlossiness = true; 

// Function to convert the specular-glossiness materials
loader.parseMaterials = function (materials, parser) {
    for (const material of materials) {
        if (material.extensions && material.extensions.KHR_materials_pbrSpecularGlossiness) {
            const specGloss = material.extensions.KHR_materials_pbrSpecularGlossiness;
            
            const pbrMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(specGloss.diffuseColor[0], specGloss.diffuseColor[1], specGloss.diffuseColor[2]),
                roughness: specGloss.roughnessFactor,
                metalness: specGloss.specularFactor,
                envMapIntensity: specGloss.glossinessFactor,
            });

            // Set the PBR material as the material for this part
            material = pbrMaterial;
        }
    }
    return materials;
};

/////////////////////////
	loader.load(
        modelUrl,
        function (gltf) {
            model = gltf.scene;
            model.position.y = -3.5;
            model.position.z = -8;

            model.scale.set(0.05, 0.05, 0.05); // Зменшуємо модель у 20 разів
            scene.add(model);
            console.log("Model added to scene");
            
            // Перевіряємо наявність анімацій і відтворюємо їх
            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        },

        function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function (error) {
            console.error(error);
        }
    );

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
}

function render() {
    if (mixer) {
        mixer.update(0.01); // Оновлюємо анімацію
    }
    //rotateModel();
    renderer.render(scene, camera);
}
    
let degrees = 0; // кут для оберту нашої моделі
    
function rotateModel() {
    if (model !== undefined) {
        degrees = degrees + 0.2; 
        model.rotation.x = THREE.MathUtils.degToRad(degrees);
    } 
}
