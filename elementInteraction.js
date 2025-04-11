let clickedElement = null;
let originalPosition = new THREE.Vector3();
let originalScale = new THREE.Vector3(); 
let isAnimating = false;
const animationDuration = 500;
let animationStartTime = null;
let pulseTimeout = null;
let hoveredElement = null;
let selectedAtomicNumber = null;

function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(elements);

    if (intersects.length > 0) {
        const element = intersects[0].object;
        const atomicNumber = element.userData.atomicNumber;
        const atomicMass = parseFloat(element.userData.atomicMass);

        if (clickedElement === element && !isAnimating) {
            isAnimating = true;
            animationStartTime = null;
            const targetPosition = new THREE.Vector3().copy(originalPosition); 
            const targetScale = new THREE.Vector3().copy(originalScale);
            animateElement(element, targetPosition, targetScale, () => {
                element.material.emissive.set(0x000000);
                clickedElement = null;
                selectedAtomicNumber = null;
                clearElectronCloud();
                document.getElementById('info').style.display = "none";
                document.getElementById('proton-count').style.display = "none";
                document.getElementById('neutron-count').style.display = "none";
                isAnimating = false;
            });
        } else if (!isAnimating) {
            if (clickedElement) {
                isAnimating = true;
                animationStartTime = null;
                const prevElement = clickedElement;
                const prevTargetPosition = new THREE.Vector3().copy(originalPosition);
                const prevTargetScale = new THREE.Vector3().copy(originalScale);
                animateElement(prevElement, prevTargetPosition, prevTargetScale, () => {
                    prevElement.material.emissive.set(0x000000);
                });
            }

            clickedElement = element;
            selectedAtomicNumber = atomicNumber;

            originalPosition.copy(element.position); 
            originalScale.copy(element.scale);

            const targetPosition = new THREE.Vector3(0, 0, 5); 
            const targetScale = new THREE.Vector3(3, 3, 3);

            element.material.emissive.set(element.material.color);
            clearTimeout(pulseTimeout);
            pulseTimeout = setTimeout(() => {
                element.scale.set(1.2, 1.2, 1.2);
                setTimeout(() => {
                    element.scale.set(1, 1, 1);
                }, 300);
            }, 10);

            updateElectronCloud(atomicNumber, atomicMass);
            document.getElementById('info').style.display = "block";
            showInfo(element.userData);
            document.getElementById('proton-count').style.display = "block";
            document.getElementById('neutron-count').style.display = "block";

            isAnimating = true;
            animationStartTime = null;
            animateElement(element, targetPosition, targetScale, () => {
                isAnimating = false;
            });
        }
    } else {
        if (selectedAtomicNumber !== null && clickedElement && !isAnimating) {
            isAnimating = true;
            animationStartTime = null;
            const targetPosition = new THREE.Vector3().copy(originalPosition);
            const targetScale = new THREE.Vector3().copy(originalScale);
            animateElement(clickedElement, targetPosition, targetScale, () => {
                clickedElement.material.emissive.set(0x000000);
                clickedElement = null;
                selectedAtomicNumber = null;
                clearElectronCloud();
                document.getElementById('info').style.display = "none";
                document.getElementById('proton-count').style.display = "none";
                document.getElementById('neutron-count').style.display = "none";
                isAnimating = false;
            });
        }
    }
}

function animateElement(element, targetPosition, targetScale, onComplete) {
    function updateAnimation() {
        if (!animationStartTime) animationStartTime = performance.now();
        const elapsedTime = performance.now() - animationStartTime;
        const progress = Math.min(1, elapsedTime / animationDuration);

        element.position.lerpVectors(element.position, targetPosition, progress);
        element.scale.lerpVectors(element.scale, targetScale, progress);

        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        } else if (onComplete) {
            onComplete();
        }
    }
    requestAnimationFrame(updateAnimation);
}

function onMouseMove(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(elements);

    if (intersects.length > 0) {
        const element = intersects[0].object;
        if (hoveredElement !== element) {
            if (hoveredElement && hoveredElement !== clickedElement && !isAnimating) {
                hoveredElement.material.emissive.set(0x000000);
            }
            if (element !== clickedElement && !isAnimating) {
                element.material.emissive.set(0x333333);
            }
            hoveredElement = element;
        }
    } else {
        if (hoveredElement && hoveredElement !== clickedElement && !isAnimating) {
            hoveredElement.material.emissive.set(0x000000);
        }
        hoveredElement = null;
    }
}

function showInfo(element) {
    const infoBox = document.getElementById('info');
    infoBox.innerHTML = `
        <strong>${element.symbol}</strong><br>
        Name: ${element.name}<br>
        Type: ${element.type}<br>
        Atomic Number: ${element.atomicNumber}<br>
        Atomic Mass: ${element.atomicMass}<br>
        Electron Configuration: ${element.electronConfig}
    `;
    infoBox.style.display = "block";
}

document.addEventListener("mousemove", onMouseMove);
