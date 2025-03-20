// Three.js Book Animation Effect
// This script creates a responsive 3D floating books background

// Initialize variables
let camera, scene, renderer;
let books = [];
let container;

// Configuration
const BOOK_COUNT = 10;
const ANIMATION_SPEED = 0.005;
let mouseX = 0, mouseY = 0;

// Initialize and run the animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();

    // Add resize listener for responsiveness
    window.addEventListener('resize', onWindowResize);
    
    // Add mouse move handler for interactive effects
    document.addEventListener('mousemove', onMouseMove);
});

// Initialize the 3D scene
function init() {
    // Create container
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(70, aspectRatio, 1, 5000);
    camera.position.z = 1000;
    
    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, 1);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Create book objects
    createBooks();
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
}

// Create book objects
function createBooks() {
    const bookColors = [
        0xD32F2F, // Red
        0x1976D2, // Blue
        0x388E3C, // Green
        0xFFA000, // Amber
        0x7B1FA2, // Purple
        0x5D4037, // Brown
    ];
    
    for (let i = 0; i < BOOK_COUNT; i++) {
        // Create book geometry (cuboid)
        const width = 50 + Math.random() * 30;
        const height = 200 + Math.random() * 100;
        const depth = 20 + Math.random() * 10;
        
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // Random color from our palette
        const colorIndex = Math.floor(Math.random() * bookColors.length);
        const material = new THREE.MeshLambertMaterial({ 
            color: bookColors[colorIndex],
            emissive: bookColors[colorIndex],
            emissiveIntensity: 0.2
        });
        
        // Create mesh
        const book = new THREE.Mesh(geometry, material);
        
        // Set random position
        book.position.x = Math.random() * 2000 - 1000;
        book.position.y = Math.random() * 2000 - 1000;
        book.position.z = Math.random() * 2000 - 1000;
        
        // Set random rotation
        book.rotation.x = Math.random() * 2 * Math.PI;
        book.rotation.y = Math.random() * 2 * Math.PI;
        book.rotation.z = Math.random() * 2 * Math.PI;
        
        // Add custom animation properties
        book.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005
        };
        
        book.floatSpeed = Math.random() * 0.02 + 0.01;
        book.floatOffset = Math.random() * Math.PI * 2;
        
        // Add to scene and array
        scene.add(book);
        books.push(book);
    }
}

// Adjust when window is resized
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Handle mouse movement
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate and animate books
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        
        // Continuous rotation
        book.rotation.x += book.rotationSpeed.x;
        book.rotation.y += book.rotationSpeed.y;
        book.rotation.z += book.rotationSpeed.z;
        
        // Floating effect
        book.position.y += Math.sin(Date.now() * 0.001 * book.floatSpeed + book.floatOffset) * 0.5;
    }
    
    // Move camera slightly based on mouse position
    camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 50 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Render the scene
    renderer.render(scene, camera);
} 