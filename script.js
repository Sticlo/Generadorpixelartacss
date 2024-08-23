const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pixelartDiv = document.getElementById('pixelart');
const downloadButton = document.getElementById('downloadButton');

fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        const pixelSize = 2; // Tamaño de cada "píxel"
        const pixelArtSize = 50; // 100px / 2px = 50 píxeles por lado
        
        canvas.width = pixelArtSize;
        canvas.height = pixelArtSize;

        // Escalar la imagen para que quepa en la matriz 50x50
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const cssContent = generatePixelArt(imgData, pixelSize);
        createDownloadButton(cssContent);
    };
});

function generatePixelArt(imgData, pixelSize) {
    pixelartDiv.innerHTML = '';
    pixelartDiv.style.display = 'grid';
    pixelartDiv.style.gridTemplateColumns = `repeat(${imgData.width}, ${pixelSize}px)`;
    pixelartDiv.style.gridTemplateRows = `repeat(${imgData.height}, ${pixelSize}px)`;

    let cssContent = '';

    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
            const index = (y * imgData.width + x) * 4;
            const r = imgData.data[index];
            const g = imgData.data[index + 1];
            const b = imgData.data[index + 2];
            const color = `rgb(${r},${g},${b})`;

            const pixel = document.createElement('div');
            pixel.style.backgroundColor = color;
            pixel.style.width = `${pixelSize}px`;
            pixel.style.height = `${pixelSize}px`;

            pixelartDiv.appendChild(pixel);

            // Generar el CSS para este píxel
            cssContent += `#pixelart div:nth-child(${y * imgData.width + x + 1}) { background-color: ${color}; width: ${pixelSize}px; height: ${pixelSize}px; }\n`;
        }
    }

    return cssContent;
}

function createDownloadButton(cssContent) {
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);

    downloadButton.style.display = 'inline-block';
    downloadButton.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixelart.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}
