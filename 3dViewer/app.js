// Get the container to hold the 3D canvas
const container = document.getElementById('canvas-container');

// Create a scene
const scene = new THREE.Scene();

// Create a camera
//const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
//camera.position.z = 300;
const camera = new THREE.OrthographicCamera(
    container.clientWidth / -2, // Left
    container.clientWidth / 2,  // Right
    container.clientHeight / 2, // Top
    container.clientHeight / -2, // Bottom
    0.1,
    1000
);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Load the STL object
const loader = new THREE.STLLoader();
loader.load('bunny_with_carrot.stl', function (geometry) {
	//geometry.center()
    //const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Replace with your desired material
    //const mesh = new THREE.Mesh(geometry, material);
	//camera.position.z = geometry.boundingBox.size().z+300
    //scene.add(mesh);
	geometry.center()
	 const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Replace with your desired material
    const mesh = new THREE.Mesh(geometry, material);
	camera.position.z = geometry.boundingBox.size().z+300
    scene.add(mesh);
});
// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};
let targetCameraPositionZ = 5;
const cameraMoveSpeed = 0.1;

// Mouse events for zooming and 3D movement
container.addEventListener('mousedown', function (event) {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

container.addEventListener('mousemove', function (event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Rotate based on the mouse movement
    const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
            toRadians(deltaY * 1), // Rotate up/down
            toRadians(deltaX * 1), // Rotate left/right
            0,
            'XYZ'
        ));

    camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);

    // Move the camera on the z-axis based on the vertical mouse movement
    targetCameraPositionZ -= deltaY * cameraMoveSpeed;
    targetCameraPositionZ = THREE.MathUtils.clamp(targetCameraPositionZ, 1, 50);

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

container.addEventListener('mouseup', function () {
    isDragging = false;
});

// Mouse events for zooming
container.addEventListener('wheel', function (event) {
    const zoomSpeed = 0.1;
    targetCameraPositionZ += event.deltaY * zoomSpeed;
    targetCameraPositionZ = THREE.MathUtils.clamp(targetCameraPositionZ, 1, 50);

    // Adjust the camera's FOV based on the zoom level
    const fov = 75 - targetCameraPositionZ * 1.5;
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
});

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Smoothly move the camera towards the target position on the z-axis
    camera.position.z += (targetCameraPositionZ - camera.position.z) * 0.05;

    renderer.render(scene, camera);
}

// Start the animation
animate();