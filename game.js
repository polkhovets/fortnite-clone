import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.132.2/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Add sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance",
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add renderer to game container
const gameContainer = document.getElementById('gameContainer');
gameContainer.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x88ff88,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player controls
const controls = new PointerLockControls(camera, gameContainer);
camera.position.y = 2;

// Instructions
const blocker = document.createElement('div');
blocker.id = 'blocker';
Object.assign(blocker.style, {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    zIndex: '1000'
});

const instructions = document.createElement('div');
instructions.id = 'instructions';
instructions.innerHTML = `
    <p>Click to play</p>
    <p>WASD = Move</p>
    <p>MOUSE = Look around</p>
    <p>ESC = Pause</p>
`;
blocker.appendChild(instructions);
gameContainer.appendChild(blocker);

// Click to start
blocker.addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    blocker.style.display = 'none';
});

controls.addEventListener('unlock', () => {
    blocker.style.display = 'flex';
});

// Movement
const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

const handleKeyEvent = (event, isKeyDown) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveState.forward = isKeyDown;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveState.backward = isKeyDown;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveState.left = isKeyDown;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveState.right = isKeyDown;
            break;
    }
};

document.addEventListener('keydown', (event) => handleKeyEvent(event, true));
document.addEventListener('keyup', (event) => handleKeyEvent(event, false));

// Animation loop
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 0.1;

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize();

        if (moveState.forward || moveState.backward) velocity.z -= direction.z * speed;
        if (moveState.left || moveState.right) velocity.x -= direction.x * speed;

        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);

        velocity.x *= 0.9;
        velocity.z *= 0.9;
    }

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onWindowResize, false); 