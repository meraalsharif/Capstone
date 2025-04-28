// elementLoader.js
async function loadElements(scene, elements) {
    const response = await fetch('elements.csv');
    const csvText = await response.text();
    const rows = csvText.split('\n');
    const loader = new THREE.FontLoader();

    loader.load('helvetiker_regular.typeface.json', function (font) {
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');
            if (columns.length < 8) continue;

            const symbol = columns[0].trim();
            const name = columns[1].trim();
            const row = parseInt(columns[2].trim(), 10);
            const col = parseInt(columns[3].trim(), 10);
            const type = columns[4].trim();
            const atomicNumber = columns[5].trim();
            const atomicMass = columns[6].trim();
            const electronConfig = columns[7].trim();

            createElement(scene, elements, symbol, name, row, col, type, atomicNumber, atomicMass, electronConfig, font);
        }
    });
}
