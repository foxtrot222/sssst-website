// Array to hold our successfully found images
let images = [];
let currentIndex = 0;
const imgElement = document.getElementById("slide");

// The number we start checking at (1.something)
let checkIndex = 1;

// The file extensions we want to check for each number
const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
let extIndex = 0; 

// --- Auto-Slide Timer Variables ---
let slideTimer;
const slideDelay = 4000; 

function findImages() {
    let img = new Image();
    
    let currentExtension = extensions[extIndex];
    img.src = `images/${checkIndex}.${currentExtension}`;

    img.onload = function() {
        images.push(img.src); 
        checkIndex++;         
        extIndex = 0;         
        findImages();         
    };

    img.onerror = function() {
        extIndex++; 

        if (extIndex < extensions.length) {
            findImages(); 
        } else {
            if (images.length > 0) {
                imgElement.src = images[0]; 
                startAutoSlide(); 
            } else {
                console.log("No images found. Make sure they are numbered (1, 2, 3...) inside the images folder.");
            }
        }
    };
}

// Function to handle the Next and Previous buttons
function changeSlide(direction) {
    if (images.length === 0) return; 

    // 1. Trigger the fade-out effect
    imgElement.style.opacity = 0;

    // 2. Wait 300 milliseconds for it to fade, then swap the image
    setTimeout(function() {
        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        } else if (currentIndex >= images.length) {
            currentIndex = 0;
        }

        imgElement.src = images[currentIndex];
        
        // 3. Trigger the fade-in effect
        imgElement.style.opacity = 1;

    }, 300); // This delay creates the smooth fade effect

    resetAutoSlide();
}

// --- Auto-Slide Functions ---
function startAutoSlide() {
    slideTimer = setInterval(function() {
        changeSlide(1); 
    }, slideDelay);
}

function resetAutoSlide() {
    clearInterval(slideTimer);
    startAutoSlide();
}

// Start the auto-detect process as soon as the file loads
findImages();
