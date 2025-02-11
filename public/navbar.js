
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbarContainer');
    if (navbarContainer) {
        fetch('navbar.html')
            .then(response => response.text())
            .then(html => {
                navbarContainer.innerHTML = html;
                initializeNavbar();
                loadDynamicLinks(); // Load different links per page
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
            });
    }

    function initializeNavbar() {
        const navToggle = document.getElementById('navToggle');
        const mobileNav = document.getElementById('mobileNav');
        const navbaroverlay = document.getElementById('navbar-overlay');

        // Toggle mobile navigation visibility
        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.style.right === '0px';
            mobileNav.style.right = isOpen ? '-100%' : '0px';
            navbaroverlay.style.visibility = isOpen ? 'hidden' : 'visible';
            navbaroverlay.style.opacity = isOpen ? '0' : '1';

            // Toggle icon class
            if (isOpen) {
                navToggle.classList.remove('open');
            } else {
                navToggle.classList.add('open');
            }
        });

        // Close mobile navbar when overlay is clicked
        navbaroverlay.addEventListener('click', () => {
            mobileNav.style.right = '-100%';
            navbaroverlay.style.visibility = 'hidden';
            navbaroverlay.style.opacity = '0';
            navToggle.classList.remove('open');
        });

        // Close navbar on resize to large screens
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileNav.style.right = '-100%';
                navbaroverlay.style.visibility = 'hidden';
                navbaroverlay.style.opacity = '0';
                navToggle.classList.remove('open');
            }
        });

        // Highlight active link
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.style.fontWeight = 'bold';
            }
        });
    }

    function loadDynamicLinks() {
        const currentPage = window.location.pathname.split('/').pop().split('.')[0]; // Get filename without .html
        const navLinksContainer = document.querySelector('.nav-links ul');

        if (!navLinksContainer) return;

        // Define navbar links for each page
        const navLinksData = {
            "dashboard": [
                { href: "mealschedule", text: "Schedule" },
                { href: "meals2", text: "Add" },
                { href: "recommendmeal", text: "Recommend" },
                { href: "automatemeal", text: "Automate" }
            ],
            "mealschedule": [

                { href: "dashboard", text: "Home" },
                { href: "profile", text: "Profile" },
                { href: "settings", text: "Settings" },
                { href: "logout", text: "Logout" } 
            ],

            "default": [
                { href: "home", text: "Home" },
                { href: "about", text: "About" },
                { href: "contact", text: "Contact" }
            ]
        };

        // Get the relevant links based on the page or use "default"
        const links = navLinksData[currentPage] || navLinksData["default"];

        // Clear existing links
        navLinksContainer.innerHTML = '';

        // Append the correct links
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            navLinksContainer.appendChild(a);
        });
    }
});


    
