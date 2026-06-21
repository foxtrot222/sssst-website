document.addEventListener("DOMContentLoaded", () => {
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {

            document.getElementById("navbar").innerHTML = data;

            // Donation Popup Modal
            const donateBtn = document.getElementById("donateBtn");
            const modal = document.getElementById("donationModal");
            const closeBtn = document.querySelector(".close-btn");

            if (donateBtn && modal && closeBtn) {

                donateBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    modal.style.display = "flex";
                });

                closeBtn.addEventListener("click", function() {
                    modal.style.display = "none";
                });

                window.addEventListener("click", function(e) {
                    if (e.target === modal) {
                        modal.style.display = "none";
                    }
                });
            }

            // Highlight current page
            const currentPage = window.location.pathname.split("/").pop() || "index.html";

            const navLinks = document.querySelectorAll(".nav-link");

            navLinks.forEach(link => {
                const href = link.getAttribute("href");

                if (href === currentPage) {
                    link.classList.add("active");
                }
            });
        })
        .catch(error => console.error("Error loading navbar:", error));
});

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
        
        // NEW: If this is the very first image found, display it immediately!
        if (images.length === 1) {
            imgElement.src = images[0];
            imgElement.style.opacity = 1; // Fade it in
        }

        checkIndex++;         
        extIndex = 0;         
        findImages();         
    };

    img.onerror = function() {
        extIndex++; 

        if (extIndex < extensions.length) {
            findImages(); 
        } else {
            // We reached the end of the gallery
            if (images.length > 0) {
                // The first image is already showing, so just start the timer
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

    }, 300);

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
