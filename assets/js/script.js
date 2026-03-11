// Initialize Swiper with 3D Coverflow Effect (Packages)
if (document.querySelector('.packages-carousel')) {
    // eslint-disable-next-line no-unused-vars
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
}

// Review badges Swiper (trust logos)
if (document.querySelector('.review-badges-carousel')) {
    // eslint-disable-next-line no-unused-vars
    const reviewBadgesSwiper = new Swiper('.review-badges-carousel', {
        slidesPerView: 2.2,
        spaceBetween: 18,
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            768: {
                slidesPerView: 3.2,
            },
            1024: {
                slidesPerView: 4.2,
            },
        },
    });
}

// Testimonials Swiper
if (document.querySelector('.testimonials-carousel')) {
    // eslint-disable-next-line no-unused-vars
    const testimonialsSwiper = new Swiper('.testimonials-carousel', {
        slidesPerView: 1.1,
        spaceBetween: 24,
        centeredSlides: true,
        loop: true,
        speed: 700,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.testimonials-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 1.4,
            },
            1024: {
                slidesPerView: 2,
            },
        },
    });
}

// Tour gallery Swipers (details page)
let tourGallery = null;
let tourThumbs = null;
if (document.querySelector('.tour-gallery-main')) {
    tourThumbs = new Swiper('.tour-gallery-thumbs', {
        direction: 'vertical',
        slidesPerView: 4,
        spaceBetween: 10,
        freeMode: true,
        watchSlidesProgress: true,
    });

    // eslint-disable-next-line no-unused-vars
    tourGallery = new Swiper('.tour-gallery-main', {
        spaceBetween: 10,
        loop: true,
        navigation: {
            nextEl: '.tour-gallery-next',
            prevEl: '.tour-gallery-prev',
        },
        thumbs: {
            swiper: tourThumbs,
        },
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const tourGalleryMain = document.querySelector('.tour-gallery-main');
    const tourLightbox = document.getElementById('tourLightbox');
    const tourLightboxBackdrop = document.getElementById('tourLightboxBackdrop');
    const tourLightboxClose = document.getElementById('tourLightboxClose');
    const tourLightboxImage = document.getElementById('tourLightboxImage');

    const openTourLightbox = (imgSrc, imgAlt) => {
        if (!tourLightbox || !tourLightboxImage) return;
        tourLightboxImage.src = imgSrc;
        tourLightboxImage.alt = imgAlt || 'Tour image preview';
        tourLightbox.classList.add('open');
        document.body.classList.add('modal-open');
    };

    const closeTourLightbox = () => {
        if (!tourLightbox) return;
        tourLightbox.classList.remove('open');
        document.body.classList.remove('modal-open');
    };

    if (tourGalleryMain) {
        const mainSlides = document.querySelectorAll('.tour-gallery-main .swiper-slide img');
        const thumbSlides = document.querySelectorAll('.tour-gallery-thumbs .swiper-slide img');

        const attachOpenHandler = (images) => {
            images.forEach((img) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    openTourLightbox(img.src, img.alt);
                });
            });
        };

        attachOpenHandler(mainSlides);
        attachOpenHandler(thumbSlides);
    }

    if (tourLightboxBackdrop) {
        tourLightboxBackdrop.addEventListener('click', closeTourLightbox);
    }

    if (tourLightboxClose) {
        tourLightboxClose.addEventListener('click', closeTourLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tourLightbox && tourLightbox.classList.contains('open')) {
            closeTourLightbox();
        }
    });
});

// Tours page: search + filters + sort
document.addEventListener('DOMContentLoaded', () => {
    const toursPage = document.querySelector('.tours-page');
    if (!toursPage) return;

    const cards = Array.from(document.querySelectorAll('.tours-card[data-tour="1"]'));
    const grids = Array.from(document.querySelectorAll('[data-tours-grid]'));
    const sections = Array.from(document.querySelectorAll('.tours-section'));

    const chips = Array.from(document.querySelectorAll('.tours-filter-chip[data-tour-type]'));
    const searchInput = document.getElementById('toursSearch');
    const sortSelect = document.getElementById('toursSort');
    const durationSelect = document.getElementById('toursDuration');
    const minPriceInput = document.getElementById('toursMinPrice');
    const maxPriceInput = document.getElementById('toursMaxPrice');
    const onSaleInput = document.getElementById('toursOnSale');
    const resetBtn = document.getElementById('toursReset');
    const resultsCount = document.getElementById('toursResultsCount');

    let activeType = 'all';

    const normalize = (s) => String(s || '').toLowerCase().trim();

    const parseRange = (value) => {
        if (!value || value === 'all') return null;
        const [min, max] = value.split('-').map((v) => Number(v));
        if (Number.isFinite(min) && Number.isFinite(max)) return { min, max };
        return null;
    };

    const setActiveChip = (type) => {
        activeType = type || 'all';
        chips.forEach((chip) => chip.classList.toggle('active', chip.dataset.tourType === activeType));
    };

    const getFilters = () => {
        const q = normalize(searchInput?.value);
        const durationRange = parseRange(durationSelect?.value);
        const minPriceValue = (minPriceInput?.value || '').trim();
        const maxPriceValue = (maxPriceInput?.value || '').trim();
        const minPrice = minPriceValue ? Number(minPriceValue) : null;
        const maxPrice = maxPriceValue ? Number(maxPriceValue) : null;
        const onSaleOnly = Boolean(onSaleInput?.checked);

        return {
            q,
            type: activeType,
            durationRange,
            minPrice: minPrice != null && Number.isFinite(minPrice) ? minPrice : null,
            maxPrice: maxPrice != null && Number.isFinite(maxPrice) ? maxPrice : null,
            onSaleOnly,
            sort: sortSelect?.value || 'recommended',
        };
    };

    const matches = (card, filters) => {
        const type = card.dataset.type || 'egypt';
        const days = Number(card.dataset.days || 0);
        const price = Number(card.dataset.price || 0);
        const discount = Number(card.dataset.discount || 0);

        if (filters.type !== 'all' && type !== filters.type) return false;

        if (filters.durationRange) {
            if (!(days >= filters.durationRange.min && days <= filters.durationRange.max)) return false;
        }

        if (filters.minPrice != null && price < filters.minPrice) return false;
        if (filters.maxPrice != null && price > filters.maxPrice) return false;

        if (filters.onSaleOnly && !(discount > 0)) return false;

        if (filters.q) {
            const hay = normalize(card.innerText);
            if (!hay.includes(filters.q)) return false;
        }

        return true;
    };

    const applyVisibility = (filters) => {
        let visibleCount = 0;
        cards.forEach((card) => {
            const isVisible = matches(card, filters);
            card.classList.toggle('tours-card--hidden', !isVisible);
            if (isVisible) visibleCount += 1;
        });

        // Hide empty sections
        sections.forEach((section) => {
            const sectionCards = section.querySelectorAll('.tours-card[data-tour="1"]');
            const anyVisible = Array.from(sectionCards).some((c) => !c.classList.contains('tours-card--hidden'));
            section.classList.toggle('tours-section--empty', !anyVisible);
        });

        if (resultsCount) resultsCount.textContent = String(visibleCount);
    };

    const applySort = (filters) => {
        const sort = filters.sort;
        if (sort === 'recommended') return;

        grids.forEach((grid) => {
            const visibleCards = Array.from(grid.querySelectorAll('.tours-card[data-tour="1"]:not(.tours-card--hidden)'));
            const hiddenCards = Array.from(grid.querySelectorAll('.tours-card[data-tour="1"].tours-card--hidden'));

            const valueFor = (card) => {
                const price = Number(card.dataset.price || 0);
                const days = Number(card.dataset.days || 0);
                if (sort.startsWith('price')) return price;
                if (sort.startsWith('days')) return days;
                return 0;
            };

            visibleCards.sort((a, b) => {
                const av = valueFor(a);
                const bv = valueFor(b);
                if (sort.endsWith('asc')) return av - bv;
                return bv - av;
            });

            // Re-append in order (visible first, keep hidden at the end)
            visibleCards.forEach((c) => grid.appendChild(c));
            hiddenCards.forEach((c) => grid.appendChild(c));
        });
    };

    const run = () => {
        const filters = getFilters();
        applyVisibility(filters);
        applySort(filters);
    };

    // Events
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            setActiveChip(chip.dataset.tourType || 'all');
            run();
        });
    });

    [searchInput, sortSelect, durationSelect, minPriceInput, maxPriceInput, onSaleInput].forEach((el) => {
        if (!el) return;
        el.addEventListener('input', run);
        el.addEventListener('change', run);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (sortSelect) sortSelect.value = 'recommended';
            if (durationSelect) durationSelect.value = 'all';
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            if (onSaleInput) onSaleInput.checked = false;
            setActiveChip('all');
            run();
        });
    }

    // Init
    setActiveChip('all');
    run();
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

// Navbar scroll effect + scroll progress + floating buttons
const navbar = document.querySelector('.navbar');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const whatsappBtn = document.getElementById('whatsappBtn');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const heroSection = document.querySelector('.hero-section');

    // Navbar background/state
    if (navbar) {
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Scroll progress bar
    if (scrollProgressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    // Show / hide floating buttons
    const shouldShowFloating = currentScroll > 350;
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('show', shouldShowFloating);
    }
    if (whatsappBtn) {
        whatsappBtn.classList.toggle('show', shouldShowFloating);
    }

    // Hero section: keep image stable (no extra dark overlay now)
    if (heroSection && currentScroll === 0) {
        const heroImage = document.querySelector('.hero-bg-image');
        if (heroImage) {
            heroImage.style.transform = 'scale(1.1) translateY(0)';
            heroImage.style.filter = 'brightness(1) blur(0)';
        }
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
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

// Scroll Animation Observer - AOS-like animations on every scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const element = entry.target;
        const delay = Number(element.dataset.delay || 0);

        if (entry.isIntersecting) {
            // Trigger animation when element enters viewport
            setTimeout(() => {
                element.classList.add('animate');
            }, delay);
        } else {
            // Reset when element leaves viewport so it can animate again
            element.classList.remove('animate');
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

// Enhanced scroll animations for sections (also repeat on re-enter)
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const section = entry.target;
        const children = section.querySelectorAll('.scroll-animate');

        if (entry.isIntersecting) {
            section.classList.add('section-visible');

            // Animate child elements with small stagger
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate');
                }, index * 100);
            });
        } else {
            // Reset section + children when leaving viewport
            section.classList.remove('section-visible');
            children.forEach(child => {
                child.classList.remove('animate');
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
    
    // FAQ accordion behaviour
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            if (!questionBtn) return;
            
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
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
            img.addEventListener('load', function handleLoad() {
                this.classList.remove('img-loading');
                this.classList.add('loaded');
            });
            
            // Handle image load errors with fallback
            img.addEventListener('error', function handleError() {
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
                    // بعد أول محاولة فشل + fallback، شيل الليسنر عشان ما يحصلش لوب
                    this.removeEventListener('error', handleError);
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

    // Desert video modal
    const desertVideoTrigger = document.getElementById('desertVideoTrigger');
    const desertVideoModal = document.getElementById('desertVideoModal');
    const desertVideoFrame = document.getElementById('desertVideoFrame');
    const desertVideoClose = document.getElementById('desertVideoClose');
    const desertVideoBackdrop = document.getElementById('desertVideoBackdrop');
    const DESERT_VIDEO_URL = 'https://www.youtube.com/embed/2ElPeQQMaXw?si=90ZowOqIhtOM-fC-&autoplay=1';

    const openDesertVideo = () => {
        if (!desertVideoModal || !desertVideoFrame) return;
        desertVideoModal.classList.add('open');
        desertVideoFrame.src = DESERT_VIDEO_URL;
        document.body.classList.add('modal-open');
    };

    const closeDesertVideo = () => {
        if (!desertVideoModal || !desertVideoFrame) return;
        desertVideoModal.classList.remove('open');
        desertVideoFrame.src = '';
        document.body.classList.remove('modal-open');
    };

    if (desertVideoTrigger) {
        desertVideoTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openDesertVideo();
        });
    }

    if (desertVideoClose) {
        desertVideoClose.addEventListener('click', closeDesertVideo);
    }

    if (desertVideoBackdrop) {
        desertVideoBackdrop.addEventListener('click', closeDesertVideo);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && desertVideoModal && desertVideoModal.classList.contains('open')) {
            closeDesertVideo();
        }
    });
});
