// Select the circle and all letters
const circle = document.querySelector('.landing-background.second-bg');
const letters = document.querySelectorAll('.floating-letters .letter');
const wrapper = document.querySelector('.landing-wrapper');
const container = document.querySelector('.container');
const first_bg = document.querySelector('.first-bg');
const second_bg = document.querySelector('.second-bg');

// Add hover event listeners to the circle
circle.addEventListener('mouseenter', () => {
    letters.forEach((letter, index) => {
        // Add a "jump" class to each letter with a slight delay

        setTimeout(() => {
            letter.classList.add('jump');
            // letter.classList.add('hover');
        }, index * 100); // Stagger the jump effect for each letter
    });
});

circle.addEventListener('mouseleave', () => {
    letters.forEach((letter) => {
        // Remove the "jump" class to reset the animation
        letter.classList.remove('jump');
        // letter.classList.remove('hover');
    });
});

// Handle click on the circle
circle.addEventListener('click', () => {
    // Remove "not-clicked" and add "clicked" class
    wrapper.classList.remove('not-clicked');
    wrapper.classList.add('clicked');

    // Show container with fade-in
    setTimeout(() => {
        container.classList.remove('hidden');
    }, 500); // Slight delay for smooth transition
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Selecting the Scratchable Areas link
// const scratchableAreasLink = document.getElementById("scratchable-areas-link");
//
// // Add click event listener to trigger fade-out and redirect
// scratchableAreasLink.addEventListener("click", () => {
//     // Add the fade-out class to trigger animation
//     document.body.classList.add("fade-out");
//
//     // Wait for the animation to complete, then redirect
//     setTimeout(() => {
//         window.location.href = "scratchable-areas.html";
//     }, 500); // Match this with the CSS transition duration
// });


// Select elements
const modalWindow = document.getElementById('modal-window');
const modalContent = modalWindow.querySelector('.modal-content');
const modalTitle = modalWindow.querySelector('.modal-title');
const closeButton = document.getElementById('close-button');
const reloadButton = document.getElementById('reload-button');
// const scratchAreas = document.getElementById("scratchable-areas-link");
// const puzzleArea = document.getElementById("puzzle-link");
const gameLinks = document.querySelectorAll('.game-area');

// Function to open the modal
function openModal() {
    modalWindow.style.display = 'block';
    modalWindow.classList.remove('hidden');
    console.log("am deschis");
    loadContent();
}
function openModal(title, contentUrl, initializer = null) {
    console.log("am deschis");
    modalWindow.style.display = 'block';
    modalWindow.classList.remove('hidden');
    modalTitle.textContent = title;

    // Load content into the modal
    fetch(contentUrl)
        .then(response => response.text())
        .then(html => {
            modalContent.innerHTML = html;
            // Call the initializer if provided (e.g., initialize games)
            if (initializer) initializer();
        })
        .catch(error => {
            console.error(`Error loading content from ${contentUrl}:`, error);
            modalContent.innerHTML = '<p>Error loading content.</p>';
        });
}

// Function to close the modal
// function closeModal(event) {
//     console.log("am inchis");
//     modalWindow.style.display = 'none';
//     event.stopPropagation(); // Prevents the click event from propagating to the modal's parent
//
// }
//
// // Function to reload content
// function reloadContent() {
//     console.log("am reload");
//     loadContent();
// }


// Close modal
function closeModal() {
    console.log("am inchis");
    modalWindow.style.display = 'none';
    modalContent.innerHTML = ''; // Clear content
    // event.stopPropagation();
}

// Reload modal content
function reloadContent() {
    console.log("am reload");
    const currentContentUrl = modalWindow.dataset.contentUrl;
    const currentInitializer = modalWindow.dataset.initializer
        ? window[modalWindow.dataset.initializer]
        : null;

    if (currentContentUrl) {
        openModal(modalTitle.textContent, currentContentUrl, currentInitializer);
    }
}

// Add event listeners to game links
gameLinks.forEach(link => {
    link.addEventListener('click', () => {
        const gameId = link.id;

        // Dynamically handle each game type
        if (gameId === 'scratchable-areas-link') {
            openModal('Scratchable Areas', 'scratchable-areas.html', initializeScratchableAreas);
            modalWindow.dataset.contentUrl = 'scratchable-areas.html';
            modalWindow.dataset.initializer = 'initializeScratchableAreas';
        } else if (gameId === 'puzzle-link') {
            openModal('Puzzle Area', 'puzzle.html', initializePuzzle);
            modalWindow.dataset.contentUrl = 'puzzle.html';
            modalWindow.dataset.initializer = 'initializePuzzle';
        }
    });
});

// Load scratchable-areas.html content into modal
// function loadContent() {
//     fetch('scratchable-areas.html')
//         .then(response => response.text())
//         .then(html => {
//             modalContent.innerHTML = html;
//             // After loading content, initialize the scratchable areas
//             initializeScratchableAreas();
//         })
//         .catch(error => {
//             console.error('Error loading content:', error);
//             modalContent.innerHTML = '<p>Error loading content.</p>';
//         });
// }
//
// // Load puzzle.html content into modal
// function loadContent() {
//     fetch('puzzle.html')
//         .then(response => response.text())
//         .then(html => {
//             modalContent.innerHTML = html;
//             // After loading content, initialize the scratchable areas
//             initializeScratchableAreas();
//         })
//         .catch(error => {
//             console.error('Error loading content:', error);
//             modalContent.innerHTML = '<p>Error loading content.</p>';
//         });
// }

// Attach event listeners
// scratchAreas.forEach(area => {
//     area.addEventListener('click', openModal);
// });
// scratchAreas.addEventListener('click', openModal);
closeButton.addEventListener('click', closeModal);
reloadButton.addEventListener('click', reloadContent);



// Make the modal draggable
let isDragging = false;
let offsetX, offsetY;

const header = modalWindow.querySelector('.modal-header');
// Prevent opening the modal when clicking the header area
header.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click from reaching the modal window
});
header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - modalWindow.offsetLeft;
    offsetY = e.clientY - modalWindow.offsetTop;
    modalWindow.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        modalWindow.style.left = `${e.clientX - offsetX}px`;
        modalWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    modalWindow.style.cursor = 'grab';
});

// Stop clicks on the modal from triggering the openModal function
modalWindow.addEventListener('click', (event) => {
    event.stopPropagation();
});

function initializeScratchableAreas(){
    console.log("Window Context: ", window.location.href);

    const scratchableAreas = document.querySelectorAll('.scratchable-area');
    scratchableAreas.forEach((area, index) => {
        console.log(`Scratchable Area ${index}:`, area.offsetWidth, area.offsetHeight);
    });

    scratchableAreas.forEach(area => {
        const canvas = area.querySelector('.scratch-canvas');
        const hiddenContent = area.querySelector('.hidden-content');

        // Set the 'willReadFrequently' option to true when getting the context
        const ctx = canvas.getContext('2d', {willReadFrequently: true});

        let isDrawing = false;

        // Set up each canvas
        function setupCanvas() {
            canvas.width = area.offsetWidth;
            canvas.height = area.offsetHeight;

            // Fill the canvas with a solid color
            ctx.fillStyle = "#ccc"; // This color can represent the 'scratchable' area
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Common scratch function
        function scratch(x, y) {
            // console.log(`Scratching at: ${x}, ${y}`);
            ctx.globalCompositeOperation = "destination-out"; // Set to clear area
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mouse event listeners
        canvas.addEventListener("mousedown", () => { isDrawing = true; });
        canvas.addEventListener("mouseup", () => { isDrawing = false; });
        canvas.addEventListener("mousemove", (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            scratch(x, y);
        });

        // Touch event listeners
        canvas.addEventListener("touchstart", (e) => {
            isDrawing = true;
            e.preventDefault(); // Prevent scrolling when touching
        });
        canvas.addEventListener("touchend", () => {
            isDrawing = false;
        });
        canvas.addEventListener("touchmove", (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0]; // Get the first touch point
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            scratch(x, y);
        });

        // Check if enough area has been scratched
        function checkScratchCompletion() {
            console.log("Checking scratch completion...");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let clearedPixels = 0;
            for (let i = 3; i < imageData.length; i += 4) {
                if (imageData[i] === 0) clearedPixels++;
            }
            const scratchedPercentage = clearedPixels / (canvas.width * canvas.height);
            console.log(`Scratched Area: ${(scratchedPercentage * 100).toFixed(2)}%`);
            return scratchedPercentage > 0.5; // Adjust the threshold if needed
        }

        // Clear scratch area after enough scratching
        canvas.addEventListener("mouseup", () => {
            if (checkScratchCompletion()) {
                console.log("Scratch area cleared!");
                canvas.style.display = "none"; // Hide the canvas after enough scratching
                hiddenContent.style.display = "block"; // Show the hidden content
            }
        });

        canvas.addEventListener("touchend", () => {
            if (checkScratchCompletion()) {
                console.log("Scratch area cleared!");
                canvas.style.display = "none"; // Hide the canvas after enough scratching
                hiddenContent.style.display = "block"; // Show the hidden content
            }
        });

        // Initialize canvas after page load and on resize
        // window.addEventListener("load", setupCanvas);
        // window.addEventListener("resize", setupCanvas);
        setupCanvas();
        window.addEventListener("resize", setupCanvas);
    });
}
