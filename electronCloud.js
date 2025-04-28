// electronCloud.js
function initElectronCloud() {
    const container = document.getElementById('electron-cloud-container');
    electronCloudScene = new THREE.Scene();
    electronCloudCamera = new THREE.OrthographicCamera(
        -5, 5, 5, -5, 0.1, 1000
    );
    electronCloudCamera.position.y = 10;
    electronCloudCamera.lookAt(0, 0, 0);

    electronCloudRenderer = new THREE.WebGLRenderer({ antialias: true });
    electronCloudRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(electronCloudRenderer.domElement);

    // Create text elements for proton and neutron counts
    const protonCountElement = document.createElement('div');
    protonCountElement.id = 'proton-count';
    protonCountElement.style.position = 'absolute';
    protonCountElement.style.bottom = '10px';
    protonCountElement.style.right = '-20px'; // Adjusted right position
    protonCountElement.style.color = 'white';
    protonCountElement.style.fontFamily = 'Arial, sans-serif';
    container.appendChild(protonCountElement);

    const neutronCountElement = document.createElement('div');
    neutronCountElement.id = 'neutron-count';
    neutronCountElement.style.position = 'absolute';
    neutronCountElement.style.bottom = '30px';
    neutronCountElement.style.right = '-20px'; // Adjusted right position
    neutronCountElement.style.color = 'white';
    neutronCountElement.style.fontFamily = 'Arial, sans-serif';
    container.appendChild(neutronCountElement);
}

function updateElectronCloud(atomicNumber, atomicMass) {
    clearElectronCloud();
    if (!atomicNumber) return;

    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    electronCloudScene.add(nucleus);

    // Electron Shells
    const shells = getElectronShells(atomicNumber);
    let shellRadius = 1;

    shells.forEach(shellElectrons => {
        const shellGeometry = new THREE.TorusGeometry(shellRadius, 0.01, 16, 100);
        const shellMaterial = new THREE.LineBasicMaterial({
            color: 0x333333,
            linewidth: 1,
            linecap: 'round',
            linejoin: 'round',
            dashSize: 0.05,
            gapSize: 0.05,
        });

        const shell = new THREE.Line(shellGeometry, shellMaterial);
        shell.computeLineDistances();
        shell.rotation.x = Math.PI / 2;
        electronCloudScene.add(shell);

        for (let i = 0; i < shellElectrons; i++) {
            const electronGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const electronMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            electron.userData = { angle: (i / shellElectrons) * Math.PI * 2, radius: shellRadius };

            electronCloudScene.add(electron);
        }

        shellRadius += 1;
    });

    adjustCamera(shellRadius - 0.5);
    animateElectrons();

    // Update proton and neutron counts
    const protons = atomicNumber;
    let neutrons = Math.round(parseFloat(atomicMass) - atomicNumber); // Corrected neutron count
    if (isNaN(neutrons)) {
        neutrons = 0; // Handle cases where atomicMass is not available
    }
    document.getElementById('proton-count').textContent = `P: ${protons}`;
    document.getElementById('neutron-count').textContent = `N: ${neutrons}`;
}

function adjustCamera(maxRadius) {
    electronCloudCamera.left = -maxRadius;
    electronCloudCamera.right = maxRadius;
    electronCloudCamera.top = maxRadius;
    electronCloudCamera.bottom = -maxRadius;
    electronCloudCamera.updateProjectionMatrix();
}

function animateElectrons() {
    electronCloudScene.children.forEach(object => {
        if (object.geometry.type === 'SphereGeometry' && object !== electronCloudScene.children[0]) {
            const { angle, radius } = object.userData;
            const speed = 0.005 / radius;
            object.userData.angle += speed;
            object.position.x = radius * Math.cos(angle);
            object.position.z = radius * Math.sin(angle);
        }
    });

    electronCloudRenderer.render(electronCloudScene, electronCloudCamera);
    requestAnimationFrame(animateElectrons);
}

function clearElectronCloud() {
    while (electronCloudScene.children.length > 0) {
        electronCloudScene.remove(electronCloudScene.children[0]);
    }
}

function getElectronShells(atomicNumber) {
    const shells = [];
    let remainingElectrons = atomicNumber;
    const maxElectronsPerShell = [2, 8, 18, 32, 32, 18, 8];

    for (const maxElectrons of maxElectronsPerShell) {
        if (remainingElectrons <= 0) break;
        const electronsInShell = Math.min(remainingElectrons, maxElectrons);
        shells.push(electronsInShell);
        remainingElectrons -= electronsInShell;
    }

    return shells;
}