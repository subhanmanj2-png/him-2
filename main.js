import * as THREE from 'three';
import { Engine } from './core/engine.js';
import { Avatar } from './core/avatar.js';

// 1. Initialize Core Reality Engine
const realityEngine = new Engine('canvas-container');

// 2. Instantiate HIM Avatar
const himAvatar = new Avatar(realityEngine.scene);

// 3. Hook Avatar into the render loop
const clock = new THREE.Clock();

// Overwrite the engine's start method slightly to inject our game loop logic
realityEngine.renderer.setAnimationLoop(() => {
    const deltaTime = clock.getDelta();

    // Update Avatar (Breathing / Animations)
    himAvatar.update(deltaTime);

    // Update camera controls
    realityEngine.controls.update();

    // Render Scene
    realityEngine.renderer.render(realityEngine.scene, realityEngine.camera);
});

console.log("HIM System: Core initialized. Entity instantiated.");
