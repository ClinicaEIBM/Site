/**
 * Clínica Infantil - Main JavaScript file
 * Handles animations, form validation, and interactive elements
 * Author: Developer
 * Version: 2.0
 * Updated: Portal structure with tree-like navigation
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    setupMobileMenu();
    setupScrollAnimations();
    setupQuestionsCarousel();
    setupContactForm();
    setupNewsletterForm();
    setupBackToTopButton();
    setupStickyHeader();
    setupPortalNavigation();
    setupFAQAccordion();
    setupTestimonialsCarousel();
});

/**
 * Handle Mobile Menu Toggle
 */
function setupMobileMenu() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuIcon || !navLinks) return;
    
    mobileMenuIcon.addEventListener('click', function() {
        // Toggle active class for menu icon animation
        this.classList.toggle('active');
        
        // Toggle bars to form X icon
        const bars = this.querySelectorAll('div');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
        
        // Toggle menu visibility
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    const menuLinks = navLinks.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                mobileMenuIcon.click();
            }
        });
    });
}

/**
 * Setup IntersectionObserver for scroll animations
 */
function setupScrollAnimations() {
    // Get all elements with the animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    // Create observer options
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% of the element must be visible
    };
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay if specified in the data-delay attribute
                const delay = entry.target.dataset.delay || 0;
                
                // Add the visible class after the specified delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Trigger animations that are already visible on page load
    setTimeout(() => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const delay = element.dataset.delay || 0;
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
                observer.unobserve(element);
            }
        });
    }, 100);
}

/**
 * Setup Questions Carousel
 */
function setupQuestionsCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselTrack || !carouselItems.length) return;
    
    let currentIndex = 0;
    let itemWidth = carouselItems[0].clientWidth;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Create dots
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Update slide position
    function updateSlidePosition() {
        carouselTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Disable/enable navigation buttons for edge cases
        if (prevBtn && nextBtn) {
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            
            nextBtn.style.opacity = currentIndex === carouselItems.length - 1 ? '0.5' : '1';
            nextBtn.style.pointerEvents = currentIndex === carouselItems.length - 1 ? 'none' : 'auto';
        }
    }
    
    // Go to a specific slide
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= carouselItems.length) index = carouselItems.length - 1;
        
        currentIndex = index;
        updateSlidePosition();
    }
    
    // Initialize buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
        // Initially disable if at first slide
        prevBtn.style.opacity = '0.5';
        prevBtn.style.pointerEvents = 'none';
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    // Handle touch events for swipe support
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left, go to next slide
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right, go to previous slide
            goToSlide(currentIndex - 1);
        }
    }
    
    // Update on window resize
    window.addEventListener('resize', () => {
        itemWidth = carouselItems[0].clientWidth;
        updateSlidePosition();
    });
    
    // Initial update
    updateSlidePosition();
}

/**
 * Setup Contact Form handling
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm || !formMessage) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !phone || !message) {
            showFormMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        // Email validation with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Phone validation with regex (Brazilian format)
        const phoneRegex = /^[0-9]{10,11}$/;
        const phoneStripped = phone.replace(/\D/g, '');
        if (!phoneRegex.test(phoneStripped)) {
            showFormMessage('Por favor, insira um telefone válido (apenas números).', 'error');
            return;
        }
        
        // In a real application, here would be an AJAX call to send the form data to a server
        
        // For this demo, just show a success message
        showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Reset form fields
        contactForm.reset();
    });
    
    // Helper function to show form messages
    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        
        // Scroll to the form message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Clear the message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
    
    // Format phone input as the user types
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            e.target.value = value;
        });
    }
}

/**
 * Setup Newsletter Form handling
 */
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }
        
        // In a real application, here would be an AJAX call to subscribe the email
        
        // For this demo, just show an alert and reset the form
        alert('Obrigado por se inscrever em nossa newsletter!');
        emailInput.value = '';
    });
}

/**
 * Setup Back to Top button behavior
 */
function setupBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show button when user scrolls down 300px from the top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Setup Sticky Header behavior
 */
function setupStickyHeader() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Setup Portal Navigation interactions
 */
function setupPortalNavigation() {
    // Handle portal-main-item hover effects
    const portalItems = document.querySelectorAll('.portal-main-item');
    if (portalItems.length) {
        portalItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Add extra highlight effect on hover
                item.style.transform = 'translateY(-10px) scale(1.02)';
                item.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.15)';
            });
            
            item.addEventListener('mouseleave', () => {
                // Reset to CSS-defined values
                item.style.transform = '';
                item.style.boxShadow = '';
            });
        });
    }
    
    // Handle tree-item connecting lines
    const treeItems = document.querySelectorAll('.tree-item');
    if (treeItems.length) {
        // Add connecting lines between tree items dynamically
        treeItems.forEach((item, index) => {
            if (index > 0) {
                const prevItem = treeItems[index - 1];
                const connector = document.createElement('div');
                connector.classList.add('tree-connector');
                
                // Position the connector between items
                const prevRect = prevItem.getBoundingClientRect();
                const currentRect = item.getBoundingClientRect();
                
                if (window.innerWidth > 768) {
                    // On desktop, draw horizontal lines between items
                    connector.style.width = `${currentRect.left - (prevRect.right)}px`;
                    connector.style.height = '2px';
                    connector.style.top = `${prevRect.top + prevRect.height / 2}px`;
                    connector.style.left = `${prevRect.right}px`;
                } else {
                    // On mobile, draw vertical lines between items
                    connector.style.width = '2px';
                    connector.style.height = `${currentRect.top - prevRect.bottom}px`;
                    connector.style.top = `${prevRect.bottom}px`;
                    connector.style.left = `${prevRect.left + prevRect.width / 2}px`;
                }
                
                document.querySelector('.tree-navigation').appendChild(connector);
            }
        });
    }
    
    // Handle portal return button effects
    const returnButtons = document.querySelectorAll('.portal-return-btn');
    if (returnButtons.length) {
        returnButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                // Animate the arrow icon
                const arrow = btn.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = 'translateX(-5px)';
                    arrow.style.transition = 'transform 0.3s ease';
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                const arrow = btn.querySelector('svg');
                if (arrow) {
                    arrow.style.transform = '';
                }
            });
        });
    }
}
