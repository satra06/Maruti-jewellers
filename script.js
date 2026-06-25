/**
 * Maruti Jewellers - Premium Jewellery Store Javascript
 * Hand-coded interactions, preloader, stats counting, and lightbox popups.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Preloader Timeout
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 1000); // 1-second delay for premium monogram animation
        });
        
        // Backup: Hide preloader anyway if load event doesn't trigger quickly
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 3000);
    }

    // 2. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 3. Navbar Sticky Effect on Scroll & Active Links
    const header = document.querySelector('.navbar-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky class toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active page link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Toggle hamburger bars animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close mobile menu when nav-link clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Helper to close mobile menu
        const closeMobileMenu = () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.querySelectorAll('.bar').forEach(bar => bar.style.transform = 'none');
            const bar2 = hamburger.querySelector('.bar:nth-child(2)');
            if (bar2) bar2.style.opacity = '1';
        };

        // Close mobile menu on scroll to prevent it from covering content
        window.addEventListener('scroll', () => {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // 5. Initialize Swiper.js for Reviews Testimonials Slider
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
    }

    // 6. Custom Accordion for FAQs
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Toggle current accordion panel
            faqItem.classList.toggle('active');
            
            // Close other accordion panels (optional but clean layout behavior)
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
        });
    });

    // 7. Lightbox for Masonry Visual Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSource = item.querySelector('img').getAttribute('src');
                const captionText = item.querySelector('.gallery-hover-overlay span').textContent;
                
                lightboxImg.setAttribute('src', imgSource);
                lightboxCaption.textContent = captionText;
                
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop scrolling
            });
        });

        // Close functions
        const closeLightboxModal = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scroll
        };

        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxModal);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightboxModal();
            }
        });
    }

    // 8. Stats Counter Animation on Viewport Scroll
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const startCounting = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // Animation duration in ms
            const step = Math.ceil(target / (duration / 30)); // 30ms interval step
            let count = 0;

            const counterInterval = setInterval(() => {
                count += step;
                if (count >= target) {
                    stat.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    stat.textContent = count;
                }
            }, 30);
        });
    };

    const handleStatsScroll = () => {
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !counted) {
            startCounting();
            counted = true;
            window.removeEventListener('scroll', handleStatsScroll); // Trigger only once
        }
    };

    window.addEventListener('scroll', handleStatsScroll);
    handleStatsScroll(); // Call once immediately in case section is already in view on load

    // 9. Scroll to Top Button Action
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
