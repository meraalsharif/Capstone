function createElement(scene, elements, symbol, name, row, col, type, atomicNumber, atomicMass, electronConfig, font) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: getColorByType(type), side: THREE.DoubleSide });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(col * 2.5 - 20, -row * 2.5 + 20, 0);

    // Ensure category is set correctly when creating the element
    const category = getCategory(type);
    cube.userData = { symbol, name, type, category, atomicNumber, atomicMass, electronConfig };

    scene.add(cube);
    elements.push(cube);

    // Register element for category filtering
    if (window.registerAllElements) {
        window.registerAllElements(cube);
    }

    const textGeometry = new THREE.TextGeometry(symbol, {
        font: font,
        size: 0.7,
        height: 0.1
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();
    const textSize = textGeometry.boundingBox.getSize(new THREE.Vector3());
    textMesh.position.set(- textSize.x / 2, - textSize.y / 2, 1.1);
    cube.add(textMesh);

    const atomicNumberTextGeometry = new THREE.TextGeometry(atomicNumber.toString(), {
        font: font,
        size: 0.4,
        height: 0.1
    });

    const atomicNumberTextMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const atomicNumberTextMesh = new THREE.Mesh(atomicNumberTextGeometry, atomicNumberTextMaterial);

    atomicNumberTextGeometry.computeBoundingBox();
    const atomicNumberTextSize = atomicNumberTextGeometry.boundingBox.getSize(new THREE.Vector3());
    atomicNumberTextMesh.position.set(-0.8 + atomicNumberTextSize.x / 2, 0.8 - atomicNumberTextSize.y / 2, 1.1);
    cube.add(atomicNumberTextMesh); 
}

// Get category function
function getCategory(type) {
    switch(type.toLowerCase().trim()) {  // Added trim to avoid extra spaces
        case 'alkali metal': return 'Alkali Metal';
        case 'alkaline earth metal': return 'Alkaline Earth Metal';
        case 'transition metal': return 'Transition Metal';
        case 'post transition metal': return 'Post-transition metal';
        case 'noble gas': return 'Noble Gas';
        case 'non-metal': return 'Non-metal';
        case 'metalloid': return 'Metalloid';
        case 'lanthanide': return 'Lanthanide';
        case 'actinide': return 'Actinide';
        default: return 'Unknown';
    }
}
