// Smooth scrolling for the navigation bar
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetSection = document.querySelector(this.getAttribute('href'));
        if (targetSection) {
            e.preventDefault();
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth' // This ensures smooth scrolling
            });
        }
    });
});

// Detect the section currently in view and highlight the corresponding nav link
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});


let slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    
    if (n >= slides.length) {
        slideIndex = 0; // Loop back to the first slide
    }
    if (n < 0) {
        slideIndex = slides.length - 1; // Go to the last slide
    }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Show the current slide
    slides[slideIndex].style.display = "block";
}

// Create a reference to the dynamic close button
let dynamicCloseButton;

// Initialize the dynamic close button
function createDynamicCloseButton() {
    dynamicCloseButton = document.createElement('button');
    dynamicCloseButton.textContent = 'Close';
    dynamicCloseButton.classList.add('dynamic-close-button', 'hidden');
    dynamicCloseButton.addEventListener('click', closeExpandedProject);
    document.body.appendChild(dynamicCloseButton);
}

// Function to toggle the expanded project and manage the button
function toggleProject(projectId) {
    const projectItem = document.getElementById(projectId);
    const expanded = document.getElementById(`${projectId}-expanded`);

    if (projectItem.classList.contains('expanded')) {
        // Collapse the card
        projectItem.classList.remove('expanded');
        expanded.style.display = 'none';
    } else {
        // Collapse all other cards first
        document.querySelectorAll('.project-item.expanded').forEach(item => {
            item.classList.remove('expanded');
            const itemExpanded = item.querySelector('.project-expanded');
            if (itemExpanded) itemExpanded.style.display = 'none';
        });

        // Expand the selected card
        projectItem.classList.add('expanded');
        expanded.style.display = 'block';
    }
}


// Function to close the currently expanded project
function closeExpandedProject() {
    const expandedItems = document.querySelectorAll('.project-item.expanded');
    expandedItems.forEach((item) => item.classList.remove('expanded'));
    dynamicCloseButton.classList.add('hidden');
}

// Update the button's position relative to the expanded project
function updateButtonPosition(projectItem) {
    const rect = projectItem.getBoundingClientRect();
    dynamicCloseButton.style.top = `${rect.top + window.scrollY + 10}px`;
    dynamicCloseButton.style.right = `${window.innerWidth - rect.right + 10}px`;
}

// Listen for scroll events to update the button's position dynamically
window.addEventListener('scroll', () => {
    const expandedItems = document.querySelectorAll('.project-item.expanded');
    if (expandedItems.length > 0) {
        updateButtonPosition(expandedItems[0]); // Position the button relative to the first expanded project
    }
});

// Initialize the button on page load
document.addEventListener('DOMContentLoaded', createDynamicCloseButton);
