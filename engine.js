import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Engine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        // 1. Scene Setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020203);
        this.scene.fog = new THREE.FogExp2(0x020203, 0.03); // Deep sci-fi atmosphere

        // 2. Camera Setup
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 5); // Human eye level

        // 3. Renderer Setup (Realistic PBR settings)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Perf optimization
        
        // Cinematic tone mapping & lighting math
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);

        // 4. Controls (Temporary for dev)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 1.5, 0);

        this.setupEnvironment();
        this.setupLighting();

        // 5. Resize Handler
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setupEnvironment() {
        // Minimal realistic metallic/concrete floor
        const floorGeo = new THREE.PlaneGeometry(50, 50);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.2,
            metalness: 0.8
        });
        this.floor = new THREE.Mesh(floorGeo, floorMat);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);

        // Subtle ambient grid for scale
        const gridHelper = new THREE.GridHelper(50, 50, 0x00ffff, 0x222222);
        gridHelper.position.y = 0.01;
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    setupLighting() {
        // Cinematic 3-point lighting setup (Sci-Fi tones)
        
        // Key Light (Cool Moon/Cyber Blue)
        const keyLight = new THREE.SpotLight(0x4488ff, 50);
        keyLight.position.set(2, 5, 3);
        keyLight.angle = Math.PI / 6;
        keyLight.penumbra = 0.5;
        keyLight.castShadow = true;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);

        // Fill Light (Warm Orange/Red)
        const fillLight = new THREE.PointLight(0xff5522, 20, 10);
        fillLight.position.set(-3, 1, 2);
        this.scene.add(fillLight);

        // Rim Light (Sharp white for silhouette)
        const rimLight = new THREE.DirectionalLight(0xffffff, 2);
        rimLight.position.set(0, 3, -5);
        this.scene.add(rimLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        });
    }
}
