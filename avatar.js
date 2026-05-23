import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Avatar {
    constructor(scene) {
        this.scene = scene;
        this.model = new THREE.Group();
        this.scene.add(this.model);

        // State flags
        this.isLoaded = false;
        this.mixer = null; // For animations later

        // For now, we generate a high-quality PBR placeholder.
        // Once you have a real GLTF/GLB model, you will call this.loadRealModel() instead.
        this.createPBRPlaceholder();
    }

    createPBRPlaceholder() {
        // High-end sci-fi synthetic skin material
        const syntheticSkin = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.3,
            roughness: 0.4,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2,
            envMapIntensity: 2.0
        });

        // Dark chrome material for the neck/cybernetic joints
        const cyberMetal = new THREE.MeshStandardMaterial({
            color: 0x050505,
            metalness: 1.0,
            roughness: 0.1
        });

        // Head (Placeholder)
        const headGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.25, 32);
        const head = new THREE.Mesh(headGeo, syntheticSkin);
        head.position.y = 1.65; // Average human eye level
        head.castShadow = true;
        head.receiveShadow = true;

        // Neck (Placeholder)
        const neckGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 32);
        const neck = new THREE.Mesh(neckGeo, cyberMetal);
        neck.position.y = 1.48;
        neck.castShadow = true;

        // Torso / Shoulders (Placeholder)
        const torsoGeo = new THREE.BoxGeometry(0.4, 0.5, 0.2);
        const torso = new THREE.Mesh(torsoGeo, syntheticSkin);
        torso.position.y = 1.18;
        torso.castShadow = true;
        torso.receiveShadow = true;

        this.model.add(head, neck, torso);
        
        // Expose head for future look-at tracking
        this.headBone = head; 
        
        console.log("HIM Avatar: PBR Placeholder constructed.");
        this.isLoaded = true;
    }

    // Use this method when you drop your actual HIM model into /assets/models/
    loadRealModel(url = './assets/models/him.glb') {
        const loader = new GLTFLoader();
        
        loader.load(
            url,
            (gltf) => {
                // Remove placeholder
                this.scene.remove(this.model);
                
                this.model = gltf.scene;
                
                // Enable realistic shadows on the loaded model
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // Enforce environment mapping for realism
                        if (child.material) {
                            child.material.envMapIntensity = 1.5; 
                        }
                    }
                });

                this.scene.add(this.model);
                
                // Setup animation mixer for Phase 3
                this.mixer = new THREE.AnimationMixer(this.model);
                
                this.isLoaded = true;
                console.log("HIM Avatar: Real model loaded successfully.");
            },
            (xhr) => {
                console.log(`HIM loading: ${(xhr.loaded / xhr.total * 100)}%`);
            },
            (error) => {
                console.error("HIM Avatar: Failed to load model.", error);
            }
        );
    }

    update(deltaTime) {
        if (!this.isLoaded) return;
        
        // Update animations when we add them in Phase 3
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        // Slight procedural idle breathing motion for the placeholder
        if (!this.mixer) {
            const time = Date.now() * 0.001;
            this.model.position.y = Math.sin(time) * 0.005; // Subtle chest rise
        }
    }
}
