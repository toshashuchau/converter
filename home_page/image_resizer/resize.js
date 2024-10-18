const fileInput = document.getElementById('file');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const dpiInput = document.getElementById('dpi');
const brightnessInput = document.getElementById('brightness');
const resizeBtn = document.getElementById('resizeBtn');
const cropBtn = document.getElementById('cropBtn');
const downloadLink = document.getElementById('downloadLink');

let originalImage = new Image();
let imgData = null;
let cropStartX = 0;
let cropStartY = 0;
let cropEndX = 0;
let cropEndY = 0;
let isDragging = false;

// Load image on canvas
fileInput.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = function(event) {
        originalImage.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

originalImage.onload = function() {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
};

// Apply transformations (resize, brightness)
resizeBtn.addEventListener('click', applyImageTransformation);

function applyImageTransformation() {
    const brightness = brightnessInput.value / 100;

    canvas.width = widthInput.value;
    canvas.height = heightInput.value;

    ctx.filter = `brightness(${brightness})`;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Reset filter
    ctx.filter = 'none';
    updateDownloadLink();
}

// Mouse events for drag-to-crop
canvas.addEventListener('mousedown', (e) => {
    cropStartX = e.offsetX;
    cropStartY = e.offsetY;
    isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        cropEndX = e.offsetX;
        cropEndY = e.offsetY;

        // Redraw image to clear previous selection rectangle
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        // Draw selection rectangle
        ctx.beginPath();
        ctx.rect(cropStartX, cropStartY, cropEndX - cropStartX, cropEndY - cropStartY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Apply cropping based on drag
cropBtn.addEventListener('click', () => {
    const cropWidth = cropEndX - cropStartX;
    const cropHeight = cropEndY - cropStartY;

    // Adjust canvas size to crop selection
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const brightness = brightnessInput.value / 100;
    ctx.filter = `brightness(${brightness})`;
    ctx.drawImage(originalImage, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    ctx.filter = 'none';
    updateDownloadLink();
});

function updateDownloadLink() {
    const dpi = dpiInput.value;
    const scaleFactor = dpi / 72;
    
    const dataURL = canvas.toDataURL('image/png', scaleFactor);
    downloadLink.href = dataURL;
}
