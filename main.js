let scene, camera, renderer, controls;
const elements = [];
let electronCloudScene, electronCloudCamera, electronCloudRenderer;

const allElements = [];

// Register each element for filtering
function registerAllElements(mesh) {
    allElements.push(mesh);
}

// Filter by category
function filterElementsByCategory(category) {
    console.log("Filtering by category:", category);
    
    allElements.forEach(el => {
        if (el.userData.category.toLowerCase() === category.toLowerCase()) {
            el.visible = true;
        } else {
            el.visible = false;
        }
    });
    console.log("Category filtering complete");
}

function showAllElements() {
    allElements.forEach(el => el.visible = true);
}

async function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 20, 30);
    scene.add(light);

    await loadElements(scene, elements); // Load elements
    animate();
    setupEventListeners(); // Setup event listeners
    initElectronCloud(); // Initialize electron cloud
    setupLegendClickHandlers(); // Setup legend category click filtering
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    if (electronCloudRenderer) {
        electronCloudRenderer.render(electronCloudScene, electronCloudCamera); // Render electron cloud
    }
}

function setupEventListeners() {
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", onClick);
    document.getElementById('resetButton').addEventListener("click", resetView); // Bind the reset button
    document.getElementById('search-bar').addEventListener("input", onSearchInput); // Bind the search input
}

function resetView() {
    camera.position.set(0, 10, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls.reset();
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    if (electronCloudRenderer) {
        const container = document.getElementById('electron-cloud-container');
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        electronCloudRenderer.setSize(width, height);
        electronCloudCamera.aspect = width / height;
        electronCloudCamera.updateProjectionMatrix();
    }
}

function onSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();

    elements.forEach(element => {
        const { symbol, name } = element.userData;
        const matches = symbol.toLowerCase().includes(searchTerm) || name.toLowerCase().includes(searchTerm);

        element.visible = matches;
    });
}

// Legend click listener
function setupLegendClickHandlers() {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            console.log("Category clicked:", category);
            filterElementsByCategory(category);
        });
    });
}

init();

// Export function for external use (optional, if you want to import it elsewhere)
window.registerAllElements = registerAllElements;
