const images = [
        "images/event1.jpeg",
        "images/event2.jpeg",
        "images/event3.jpeg",
        "images/event4.jpeg",
        "images/event5.jpeg",
        "images/event6.jpeg"
    ];

    let current = 0;

    const slide = document.getElementById("slide");

    function showImage(index) {
        slide.style.opacity = 0;

        setTimeout(() => {
            slide.src = images[index];
            slide.style.opacity = 1;
        }, 300);
    }

    function changeSlide(direction) {
        current += direction;

        if (current >= images.length)
            current = 0;

        if (current < 0)
            current = images.length - 1;

        showImage(current);
    }

    setInterval(() => {
        changeSlide(1);
    }, 5000);