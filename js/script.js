// Select the circle and all letters
const circle = document.querySelector('.landing-background.second-bg');
const letterHeader = document.getElementById('letter-header');
const letters = document.querySelectorAll('.floating-letters .letter');
const wrapper = document.querySelector('.landing-wrapper');
const container = document.querySelector('.container');

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
    wrapper.style.overflowY = 'auto';
    wrapper.style.backgroundColor = '#FCFFC1';
    circle.style.border = '0';

    // Move the letters up
    setTimeout(() => {
        letterHeader.style.position = 'fixed';
        letterHeader.style.zIndex = '6';
        letterHeader.style.height = '120px';
        letterHeader.style.alignItems = 'flex-end';
        letterHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.22)'; // Header background color
        letters.forEach((letter, index) => {
            letter.style.animation = 'none';
        });
    }, 750); // Slight delay to make it appear as letters move

    // Show container with fade-in after the header background is visible
    setTimeout(() => {
        container.classList.remove('hidden');
        container.style.opacity = '1'; // Ensure smooth fade-in
        container.style.transition = 'opacity 0.8s ease'; // Fade-in effect
    }, 800); // Delay content appearance until header animation completes
});


function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Selecting the Scratchable Areas link
// Select elements
const modalWindow = document.getElementById('modal-window');
const modalContent = modalWindow.querySelector('.modal-content');
const modalTitle = modalWindow.querySelector('.modal-title');
const closeButton = document.getElementById('close-button');
const reloadButton = document.getElementById('reload-button');
const gameLinks = document.querySelectorAll('.game-area');

// Function to open the modal
function openModal(title, contentUrl, initializer = null) {
    console.log("am deschis");
    modalWindow.style.display = 'block';
    modalWindow.classList.remove('hidden');
    modalTitle.textContent = title;

    // Change floating letters position to relative
    toggleFloatingLettersPosition(true);

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

function toggleFloatingLettersPosition(isModalOpen) {
    const header = document.getElementById('letter-header');
    if (isModalOpen) {
        header.style.position = 'relative';
    } else {
        header.style.position = 'fixed';
    }
}


// Close modal
function closeModal() {
    console.log("am inchis");
    modalWindow.style.display = 'none';
    modalContent.innerHTML = ''; // Clear content
    // Reset floating letters position to fixed
    toggleFloatingLettersPosition(false);
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
            openModal('Gamification Meaning', 'scratchable-areas.html', initializeScratchableAreas);
            modalWindow.dataset.contentUrl = 'scratchable-areas.html';
            modalWindow.dataset.initializer = 'initializeScratchableAreas';
        } else if (gameId === 'puzzle-link') {
            openModal('Derivative Forms', 'puzzle.html', initializePuzzle);
            modalWindow.dataset.contentUrl = 'puzzle.html';
            modalWindow.dataset.initializer = 'initializePuzzle';
        }
    });
});
closeButton.addEventListener('click', closeModal);
reloadButton.addEventListener('click', reloadContent);

// Make the modal draggable
let isDragging = false;
let offsetX, offsetY;

const modal_header = modalWindow.querySelector('.modal-header');
// Prevent opening the modal when clicking the modal_header area
modal_header.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent the click from reaching the modal window
});
modal_header.addEventListener('mousedown', (e) => {
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
    console.log("Initializing Scratchable Areas...");
    const scratchableAreas = document.querySelectorAll('.scratchable-area');

    scratchableAreas.forEach(area => {
        const canvas = area.querySelector('.scratch-canvas');
        const hiddenContent = area.querySelector('.hidden-content');

        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        let isDrawing = false;

        // Setup canvas size and fill with scratchable color
        function setupCanvas() {
            canvas.width = area.offsetWidth;
            canvas.height = area.offsetHeight;

            // Fill the canvas with a scratchable color
            ctx.fillStyle = "#ccc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Scratch logic
        function scratch(x, y) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2); // Scratch area is a circle with radius 20
            ctx.fill();
        }

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
            return scratchedPercentage > 0.5; // Adjust threshold as needed
        }

        // Handle mouse events
        canvas.addEventListener('mousedown', () => { isDrawing = true; });
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            if (checkScratchCompletion()) {
                canvas.style.display = "none"; // Hide canvas
                hiddenContent.style.display = "block"; // Show hidden content
            }
        });
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            scratch(e.clientX - rect.left, e.clientY - rect.top);
        });

        // Handle touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling on touch devices
            isDrawing = true;
        });
        canvas.addEventListener('touchend', () => {
            isDrawing = false;
            if (checkScratchCompletion()) {
                canvas.style.display = "none"; // Hide canvas
                hiddenContent.style.display = "block"; // Show hidden content
            }
        });
        canvas.addEventListener('touchmove', (e) => {
            if (!isDrawing) return;
            e.preventDefault(); // Prevent scrolling on touch devices

            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0]; // Get the first touch point
            scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });

        // Initialize canvas on load and resize
        setupCanvas();
        window.addEventListener('resize', setupCanvas);
    });
}

function initializePuzzle() {
    const pieces = document.querySelectorAll('.piece');
    const dropZone = document.querySelector('.drop-zone');
    const puzzleInfoArea = document.querySelector(".puzzle-info-area");

    const placedPiecesMap = new Set();
    let placedPieces = 0; // Counter for correctly placed pieces
    const totalPieces = pieces.length;
    let currentPiece = null;
    let offsetX = 0, offsetY = 0;

    const startDrag = (e) => {
        e.preventDefault();
        currentPiece = e.target;

        let startX, startY;
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        // Calculate offset relative to the piece's current position
        const pieceRect = currentPiece.getBoundingClientRect();
        offsetX = startX - pieceRect.left;
        offsetY = startY - pieceRect.top;

        console.log(`Start Drag: offsetX: ${offsetX}, offsetY: ${offsetY}`);

        // Add global event listeners for dragging
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', moveDrag);
        document.addEventListener('touchend', endDrag);
    };

    const moveDrag = (e) => {
        if (!currentPiece) return;

        let clientX, clientY;
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Update position relative to viewport
        const newX = clientX - offsetX;
        const newY = clientY - offsetY;

        currentPiece.style.position = 'absolute';
        currentPiece.style.left = `${newX}px`;
        currentPiece.style.top = `${newY}px`;

        // console.log(`Move Drag: clientX - offsetX: ${newX}px ; clientY - offsetY: ${newY}px`);
    };

    const endDrag = (e) => {
        if (!currentPiece) return;

        const dropZoneRect = dropZone.getBoundingClientRect();

        let clientX, clientY;
        if (e.type === 'touchend') {
            const touch = e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Calculate drop position relative to drop zone
        const dropOffsetX = clientX - dropZoneRect.left - offsetX;
        const dropOffsetY = clientY - dropZoneRect.top - offsetY;

        console.log(`End Drag: dropOffsetX: ${dropOffsetX}px ; dropOffsetY: ${dropOffsetY}px`);

        // Check if dropped inside the drop zone
        if (
            clientX > dropZoneRect.left &&
            clientX < dropZoneRect.right &&
            clientY > dropZoneRect.top &&
            clientY < dropZoneRect.bottom
        ) {
            // Append piece to the drop zone and position it
            dropZone.appendChild(currentPiece);
            currentPiece.classList.add("placed");
            placedPiecesMap.add(currentPiece); // Add the piece to the set

            // Position piece relative to drop zone
            currentPiece.style.left = `${dropOffsetX}px`;
            currentPiece.style.top = `${dropOffsetY}px`;

            console.log(`Piece dropped at: ${currentPiece.style.left} ; ${currentPiece.style.top}`);

            // Check if all pieces are placed
            console.log(placedPiecesMap.size)
            console.log(totalPieces)
            if (placedPiecesMap.size === totalPieces) {
                puzzleInfoArea.style.display = "block"; // Show the info area
            }
        }

        // Remove global event listeners
        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('touchend', endDrag);

        // Reset current piece
        currentPiece = null;
    };

    // Attach event listeners for both mouse and touch
    pieces.forEach((piece) => {
        piece.addEventListener('mousedown', startDrag);
        piece.addEventListener('touchstart', startDrag, { passive: false });
    });

    // Allow drop on the drop zone
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
}