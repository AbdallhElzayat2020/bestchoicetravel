// Initialize Swiper with 3D Coverflow Effect
const swiper = new Swiper('.packages-carousel', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 15,
        stretch: 0,
        depth: 300,
        modifier: 1.2,
        slideShadows: true,
    },
    grabCursor: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 'auto',
            spaceBetween: 20,
            coverflowEffect: {
                rotate: 20,
                depth: 250,
            },
        },
        768: {
            slidesPerView: 'auto',
            spaceBetween: 30,
            coverflowEffect: {
                rotate: 15,
                depth: 300,
            },
        },
        1024: {
            slidesPerView: 'auto',
            spaceBetween: 30,
            coverflowEffect: {
                rotate: 15,
                depth: 350,
            },
        },
    },
});

// Add click handlers for explore buttons
document.querySelectorAll('.explore-btn').forEach(button => {
    button.addEventListener('click', function() {
        const packageTitle = this.closest('.package-card').querySelector('.package-title').textContent;
        console.log('Exploring:', packageTitle);
        // Add your navigation logic here
        // window.location.href = `/package/${packageTitle.toLowerCase().replace(/\s+/g, '-')}`;
    });
});

// Navbar Toggle for Mobile
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const topBar = document.querySelector('.top-bar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    
    // Navbar effects
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        if (topBar) topBar.style.transform = 'translateY(-100%)';
    } else {
        navbar.classList.remove('scrolled');
        if (topBar) topBar.style.transform = 'translateY(0)';
    }
    
    // Hero section darkening and animation on scroll
    if (heroSection && currentScroll > 0 && currentScroll < heroHeight) {
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.min(currentScroll / (heroHeight * 0.5), 1);
        
        // Add scrolling class for CSS transitions
        heroSection.classList.add('scrolling');
        
        // Dynamic darkening overlay
        const darkeningOverlay = document.querySelector('.hero-darkening-overlay');
        if (darkeningOverlay) {
            const darkness = scrollProgress * 0.6; // Max 60% darkness
            darkeningOverlay.style.background = `rgba(0, 0, 0, ${darkness})`;
        }
        
        // Parallax effect for hero image
        const heroImage = document.querySelector('.hero-bg-image');
        if (heroImage) {
            const parallaxSpeed = currentScroll * 0.5;
            const scale = 1.1 - (scrollProgress * 0.1); // Scale down slightly
            const blur = scrollProgress * 3; // Blur up to 3px
            heroImage.style.transform = `scale(${scale}) translateY(${parallaxSpeed}px)`;
            heroImage.style.filter = `brightness(${1 - scrollProgress * 0.4}) blur(${blur}px)`;
        }
        
        // Fade out hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const contentOpacity = 1 - (scrollProgress * 0.3); // Fade up to 30%
            const translateY = scrollProgress * -30; // Move up
            heroContent.style.opacity = contentOpacity;
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
        
    } else if (heroSection && currentScroll === 0) {
        // Reset when at top
        heroSection.classList.remove('scrolling');
        const darkeningOverlay = document.querySelector('.hero-darkening-overlay');
        if (darkeningOverlay) {
            darkeningOverlay.style.background = 'rgba(0, 0, 0, 0)';
        }
        const heroImage = document.querySelector('.hero-bg-image');
        if (heroImage) {
            heroImage.style.transform = 'scale(1.1) translateY(0)';
            heroImage.style.filter = 'brightness(1) blur(0)';
        }
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }
    
    lastScroll = currentScroll;
});

// Top bar transition
if (topBar) {
    topBar.style.transition = 'transform 0.3s ease';
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation Observer - Powerful animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = element.dataset.delay || 0;
            
            setTimeout(() => {
                element.classList.add('animate');
            }, delay);
            
            // Stop observing once animated
            scrollObserver.unobserve(element);
        }
    });
}, observerOptions);

// Observe all scroll-animate elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });
    
    // Hero section initial animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroFeatures = document.querySelector('.hero-features');
    
    setTimeout(() => {
        if (heroTitle) heroTitle.classList.add('animate');
    }, 100);
    
    setTimeout(() => {
        if (heroSubtitle) heroSubtitle.classList.add('animate');
    }, 300);
    
    setTimeout(() => {
        if (heroButtons) heroButtons.classList.add('animate');
    }, 500);
    
    setTimeout(() => {
        if (heroFeatures) heroFeatures.classList.add('animate');
    }, 700);
});

// Enhanced scroll animations for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            
            // Animate children elements
            const children = entry.target.querySelectorAll('.scroll-animate');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate');
                }, index * 100);
            });
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -150px 0px'
});

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Image loading handler - ensure images load properly
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    // Fallback images array
    const fallbackImages = {
        'hero': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=1920&h=1080&fit=crop',
        'aswan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
        'pyramids': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=400&fit=crop',
        'nile': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
        'redsea': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop',
        'alexandria': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
    };
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('img-loading');
        
        // If image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('img-loading');
            img.classList.add('loaded');
        } else {
            // Wait for image to load
            img.addEventListener('load', function() {
                this.classList.remove('img-loading');
                this.classList.add('loaded');
            });
            
            // Handle image load errors with fallback
            img.addEventListener('error', function() {
                console.warn('Image failed to load, trying fallback:', this.src);
                this.classList.remove('img-loading');
                
                // Try to determine which fallback to use
                const alt = this.alt.toLowerCase();
                let fallbackSrc = '';
                
                if (alt.includes('pyramid') || alt.includes('egypt')) {
                    fallbackSrc = fallbackImages.hero;
                } else if (alt.includes('aswan') || alt.includes('nubian')) {
                    fallbackSrc = fallbackImages.aswan;
                } else if (alt.includes('cairo') || alt.includes('giza')) {
                    fallbackSrc = fallbackImages.pyramids;
                } else if (alt.includes('nile') || alt.includes('cruise')) {
                    fallbackSrc = fallbackImages.nile;
                } else if (alt.includes('red sea') || alt.includes('diving')) {
                    fallbackSrc = fallbackImages.redsea;
                } else if (alt.includes('alexandria')) {
                    fallbackSrc = fallbackImages.alexandria;
                } else {
                    fallbackSrc = fallbackImages.hero;
                }
                
                // Try fallback
                if (fallbackSrc && this.src !== fallbackSrc) {
                    this.src = fallbackSrc;
                } else {
                    // Last resort - show placeholder
                    this.style.background = 'linear-gradient(135deg, #d4a574 0%, #c49564 100%)';
                    this.style.display = 'flex';
                    this.style.alignItems = 'center';
                    this.style.justifyContent = 'center';
                    this.alt = 'Image loading...';
                }
            });
        }
    });
    
    // Preload hero image for better performance
    const heroImg = document.querySelector('.hero-bg-image');
    if (heroImg) {
        const preloadImg = new Image();
        preloadImg.src = heroImg.src;
        preloadImg.onload = () => {
            heroImg.classList.add('loaded');
            heroImg.classList.remove('img-loading');
        };
        preloadImg.onerror = () => {
            heroImg.src = fallbackImages.hero;
        };
    }
});
