document.addEventListener("DOMContentLoaded", () => {
    // Asynchronously load all shared UI components
    Promise.all([
            fetch("navbar.html").then(response => response.text()),
            fetch("donate-modal.html").then(response => response.text()),
            fetch("footer.html").then(response => response.text())
        ])
        .then(([navbarData, modalData, footerData]) => {
            // Inject components into their respective DOM insertion points
            document.getElementById("navbar").innerHTML = navbarData;
            document.getElementById("donate-modal").innerHTML = modalData;
            document.getElementById("footer").innerHTML = footerData;

            // Initialize core component controllers
            setupDonateModal();
            highlightCurrentPage();
            setupMobileMenu();

            function setupMobileMenu() {

                const menuToggle = document.getElementById("menuToggle");
                const navbarLinks = document.getElementById("navbarLinks");

                if (!menuToggle || !navbarLinks)
                    return;

                menuToggle.addEventListener("click", () => {

                    navbarLinks.classList.toggle("active");

                    const icon = menuToggle.querySelector("i");

                    if (navbarLinks.classList.contains("active")) {
                        icon.classList.remove("fa-bars");
                        icon.classList.add("fa-times");
                    } else {
                        icon.classList.remove("fa-times");
                        icon.classList.add("fa-bars");
                    }
                });
            }

            // Initialize homepage-specific modules if elements exist in the DOM
            if (document.querySelector('.counter')) {
                startCounters();
            }
            if (document.getElementById("slide")) {
                findImages();
            }

            // About page sliders
            createActivitySlider("general_slide", "general");
            createActivitySlider("environment_slide", "environment");
            createActivitySlider("health_slide", "health_yoga");
            createActivitySlider("women_slide", "women_empowerment");
            createActivitySlider("education_slide", "education");
            createActivitySlider("child_protection_slide", "child_protection");
            createActivitySlider("animal_rescue_slide", "animal_rescue");
            createActivitySlider("hunger_slide", "hunger_drive");
            createActivitySlider("others_slide", "others");
        })
        .catch(error => console.error("Error initializing application components:", error));
});

/**
 * Coordinates event listeners and state management for the Donation Modal.
 */
function setupDonateModal() {
    const donateBtn = document.getElementById("donateBtn");
    const heroDonateBtn = document.getElementById("heroDonateBtn");
    const footerDonateBtn = document.getElementById("footerDonateBtn");
    const modal = document.getElementById("donationModal");
    const closeBtn = document.querySelector(".close-btn");

    if (!modal || !closeBtn) return;

    const openModal = (e) => {
        e.preventDefault();
        modal.style.display = "flex";
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    // Attach trigger listeners
    if (donateBtn) donateBtn.addEventListener("click", openModal);
    if (heroDonateBtn) heroDonateBtn.addEventListener("click", openModal);
    if (footerDonateBtn) footerDonateBtn.addEventListener("click", openModal);

    closeBtn.addEventListener("click", closeModal);

    // Close modal window when clicking the background overlay
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/**
 * Parses the current URL pathname and assigns the active CSS class to the matching nav link.
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

/* ==========================================================================
   Image Slider Module
   ========================================================================== */

let images = [];
let currentIndex = 0;
let checkIndex = 1;
let slideTimer;

const slideDelay = 4000;

/**
 * Recursively checks the assets directory for valid sequentially numbered .webp images.
 */
function findImages() {
    const imgElement = document.getElementById("slide");
    if (!imgElement) return;

    let img = new Image();
    // UPDATE THIS LINE TO POINT TO THE NEW GALLERY FOLDER
    img.src = `images/gallery/${checkIndex}.webp`;

    img.onload = function() {
        images.push(img.src);

        if (images.length === 1) {
            imgElement.src = images[0];
            imgElement.style.opacity = 1;
        }

        checkIndex++;
        findImages();
    };

    img.onerror = function() {
        if (images.length > 0) {
            startAutoSlide();
        } else {
            console.warn("Asset Discovery: No sequentially numbered .webp assets resolved in /images/gallery.");
        }
    };
}

/**
 * Handles slide transitions with a timed opacity fade cross-over sequence.
 */
function changeSlide(direction) {
    const imgElement = document.getElementById("slide");
    if (images.length === 0 || !imgElement) return;

    imgElement.style.opacity = 0;

    setTimeout(() => {
        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        } else if (currentIndex >= images.length) {
            currentIndex = 0;
        }

        imgElement.src = images[currentIndex];
        imgElement.style.opacity = 1;
    }, 300);

    resetAutoSlide();
}

function startAutoSlide() {
    slideTimer = setInterval(() => {
        changeSlide(1);
    }, slideDelay);
}

function resetAutoSlide() {
    clearInterval(slideTimer);
    startAutoSlide();
}

/* ==========================================================================
   Activity Slider Module
   ========================================================================== */

function createActivitySlider(imageId, folderName) {

    let sliderImages = [];
    let sliderCurrentIndex = 0;
    let sliderCheckIndex = 1;

    const activitySlideDelay = 4000;
    const imgElement = document.getElementById(imageId);

    if (!imgElement) return;

    function loadImages() {
        let img = new Image();
        img.src = `images/${folderName}/${sliderCheckIndex}.webp`; // Strictly forces .webp lookups

        img.onload = () => {
            sliderImages.push(img.src);

            if (sliderImages.length === 1) {
                imgElement.src = sliderImages[0];
                imgElement.style.opacity = 1;
            }

            sliderCheckIndex++;
            loadImages();
        };

        img.onerror = () => {
            // Once the sequence breaks, fire up the interval timer
            if (sliderImages.length > 1) {
                setInterval(() => {
                    imgElement.style.opacity = 0;

                    setTimeout(() => {
                        sliderCurrentIndex = (sliderCurrentIndex + 1) % sliderImages.length;
                        imgElement.src = sliderImages[sliderCurrentIndex];
                        imgElement.style.opacity = 1;
                    }, 300);

                }, activitySlideDelay);
            }
        };
    }

    loadImages();
}

/* ==========================================================================
   Intersection Observer Counters
   ========================================================================== */

/**
 * Uses the IntersectionObserver API to fire high-performance frame-rate optimized (rAF)
 * count-up numerical sequences when the elements cross the view threshold.
 */
function startCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target");

                const duration = 2000;
                const increment = target / (duration / 16);
                let currentCount = 0;

                const updateCounter = () => {
                    currentCount += increment;
                    if (currentCount < target) {
                        counter.innerText = Math.ceil(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

function hideMapSkeleton() {

    console.log("Google Map Loaded");

    const placeholder = document.getElementById("mapSkeleton");

    if (!placeholder) {
        console.log("Placeholder not found");
        return;
    }

    placeholder.style.opacity = "0";
    placeholder.style.pointerEvents = "none";

    setTimeout(() => {
        placeholder.remove();
    }, 400);
}