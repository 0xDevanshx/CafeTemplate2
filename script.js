/**
 * Brew & Bloom V2 — Premium Cafe Website
 * GSAP-Powered Animations & Interactions - Bug Fixes applied
 */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  // ========================================
  //  PAGE LOADER & INITIALIZATION
  // ========================================
  const pageLoader = document.getElementById('pageLoader');

  // Ensure all images are loaded before initializing GSAP to prevent offset bugs
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('loaded');
      initAllAnimations();
    }, 1000);
  });

  // Fallback in case load event gets stuck
  setTimeout(() => {
    if (!pageLoader.classList.contains('loaded')) {
      pageLoader.classList.add('loaded');
      initAllAnimations();
    }
  }, 3500);

  // ========================================
  //  NAVBAR — SCROLL HIDE/SHOW + GLASSMORPHISM
  // ========================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;
  let navHidden = false;

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;

    // Glassmorphism on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > 400) {
      if (scrollY > lastScrollY && !navHidden) {
        navbar.classList.add('hidden');
        navHidden = true;
      } else if (scrollY < lastScrollY && navHidden) {
        navbar.classList.remove('hidden');
        navHidden = false;
      }
    } else {
      navbar.classList.remove('hidden');
      navHidden = false;
    }

    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ========================================
  //  ACTIVE NAV LINK ON SCROLL
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ========================================
  //  MOBILE MENU
  // ========================================
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ========================================
  //  SMOOTH SCROLL FOR ANCHORS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        gsap.to(window, {
          scrollTo: { y: targetEl, offsetY: navHeight },
          duration: 1,
          ease: 'power3.inOut'
        });
      }
    });
  });

  // ========================================
  //  MAIN ANIMATION INITIALIZATION
  // ========================================
  function initAllAnimations() {
    
    // Refresh ScrollTrigger to ensure correct measurements
    ScrollTrigger.refresh();

    // 1. HERO ANIMATIONS
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-bg img', { scale: 1.2, duration: 2, ease: 'power2.out' })
      .fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=1.2')
      .fromTo('.hero-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.6')
      .fromTo('.hero-description', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
      .fromTo('.hero-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
      .fromTo('.hero-stat', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')
      .fromTo('.hero-scroll', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');

    gsap.to('.hero-bg img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    // 2. STICKY COFFEE CUP JOURNEY (FLAGSHIP)
    const coffeeJourney = document.getElementById('coffeeJourney');
    const coffeeCup = document.getElementById('coffeeCup');
    const journeyPath = document.getElementById('journeyPath');
    const journeyPathProgress = document.getElementById('journeyPathProgress');
    const journeyCards = document.querySelectorAll('.journey-card');

    if (coffeeJourney && coffeeCup && journeyPathProgress) {
      // Setup dasharray for draw effect
      const pathLength = journeyPathProgress.getTotalLength() || 2000;
      journeyPathProgress.style.strokeDasharray = pathLength;
      journeyPathProgress.style.strokeDashoffset = pathLength;

      const journeyTl = gsap.timeline({
        scrollTrigger: {
          trigger: coffeeJourney,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });

      // Animate path drawing
      journeyTl.to(journeyPathProgress, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);

      // Animate cup position using MotionPath plugin (handles mapping to responsive SVGs!)
      journeyTl.to(coffeeCup, {
        motionPath: {
          path: journeyPath,
          align: journeyPath,
          alignOrigin: [0.5, 0.5],
          autoRotate: 15,
        },
        duration: 1,
        ease: 'none'
      }, 0);

      // Card reveals based on scroll progress
      journeyCards.forEach((card, index) => {
        const startProgress = (index * 0.22) + 0.05;
        const endProgress = startProgress + 0.2;
        ScrollTrigger.create({
          trigger: coffeeJourney,
          start: `${startProgress * 100}% top`,
          end: `${endProgress * 100}% top`,
          onEnter: () => card.classList.add('active'),
          onLeaveBack: () => card.classList.remove('active'),
        });
      });
    }

    // 3. FEATURES — CARD STACKING
    const featureCards = gsap.utils.toArray('.feature-card');
    featureCards.forEach((card, index) => {
      // Only scale down if it's not the last card
      if (index < featureCards.length - 1) {
        const inner = card.querySelector('.feature-card-inner');
        ScrollTrigger.create({
          trigger: card,
          start: "top " + (120 + index * 20),
          endTrigger: ".features-stack",
          end: "bottom bottom",
          scrub: true,
          animation: gsap.to(inner, {
            scale: 0.9 - (featureCards.length - index) * 0.02,
            opacity: 0.5,
            ease: "none"
          })
        });
      }
    });

    // 4. HORIZONTAL SCROLL — PROCESS SECTION
    const processTrack = document.getElementById('processTrack');
    const processPinWrapper = document.getElementById('processPinWrapper');

    if (processTrack && processPinWrapper) {
      let getScrollAmount = () => -(processTrack.scrollWidth - window.innerWidth);
      
      const horizontalTween = gsap.to(processTrack, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: processPinWrapper,
          start: 'top top',
          end: () => `+=${processTrack.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Animate steps inside horizontal scroll (fade up)
      const processSteps = document.querySelectorAll('.process-step');
      processSteps.forEach((step) => {
        gsap.fromTo(step, 
          { y: 60, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              containerAnimation: horizontalTween,
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Specific animation for elements inside the intro of horizontal scroll
      gsap.utils.toArray('.anim-fade-up-hs').forEach((el) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: processPinWrapper, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
      });
    }

    // 5. STANDARD SCROLL ANIMATIONS
    // Use fromTo for better reliability with ScrollTrigger reversing
    gsap.utils.toArray('.anim-fade-up').forEach((el) => {
      if (el.closest('.process-track')) return; // handled separately
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    gsap.utils.toArray('.anim-fade-left').forEach((el) => {
      gsap.fromTo(el, { x: -80, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    gsap.utils.toArray('.anim-fade-right').forEach((el) => {
      gsap.fromTo(el, { x: 80, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    gsap.utils.toArray('.anim-scale-in').forEach((el) => {
      gsap.fromTo(el, { scale: 0.85, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    // 6. STAGGER ANIMATIONS
    ScrollTrigger.create({
      trigger: '.menu-grid', start: 'top 80%', once: true,
      onEnter: () => gsap.fromTo('.menu-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' })
    });

    ScrollTrigger.create({
      trigger: '.about-features', start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo('.about-feature', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    });

    ScrollTrigger.create({
      trigger: '.testimonials-grid', start: 'top 80%', once: true,
      onEnter: () => gsap.fromTo('.testimonial-card', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
    });

    ScrollTrigger.create({
      trigger: '.social-grid', start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo('.social-item', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)' })
    });

    ScrollTrigger.create({
      trigger: '.stats-grid', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.fromTo('.stat-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
        animateCounters();
      }
    });

    // 7. PARALLAX ELEMENTS
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) gsap.to(aboutImage, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    
    const aboutAccent = document.querySelector('.about-image-accent');
    if (aboutAccent) gsap.to(aboutAccent, { y: -40, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    
    const expBadge = document.querySelector('.about-experience-badge');
    if (expBadge) gsap.fromTo(expBadge, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: expBadge, start: 'top 85%', toggleActions: 'play none none reverse' } });

    const quoteBanner = document.getElementById('quoteBanner');
    if (quoteBanner) {
      const quoteBg = quoteBanner.querySelector('.quote-banner-bg img');
      if (quoteBg) gsap.to(quoteBg, { yPercent: 20, ease: 'none', scrollTrigger: { trigger: quoteBanner, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }

    // 8. GALLERY — HORIZONTAL SCROLL (GSAP PINNED)
    const gallerySection = document.getElementById('gallery');
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryPinWrapper = document.getElementById('galleryPinWrapper');

    if (gallerySection && galleryTrack && galleryPinWrapper) {
      let getGalleryScroll = () => -(galleryTrack.scrollWidth - window.innerWidth);

      const galleryTween = gsap.to(galleryTrack, {
        x: getGalleryScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: galleryPinWrapper,
          start: 'top top',
          end: () => `+=${galleryTrack.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Animate gallery header text up when it enters
      gsap.utils.toArray('.anim-fade-up-gallery').forEach((el) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: galleryPinWrapper, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
      });
      
      // Animate gallery items in slightly as they scroll horizontally
      const galleryItems = document.querySelectorAll('.gallery-item');
      galleryItems.forEach((item) => {
        gsap.fromTo(item, 
          { scale: 0.9, opacity: 0.5 }, 
          {
            scale: 1, opacity: 1, duration: 1, ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              containerAnimation: galleryTween,
              start: 'left 90%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }

  } // End initAllAnimations

  // ========================================
  //  COUNTER ANIMATION
  // ========================================
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      gsap.to(el, {
        duration: 2, ease: 'power2.out',
        onUpdate: function() {
          const current = Math.round(target * this.progress());
          el.textContent = current + suffix;
        }
      });
    });
  }

  // ========================================
  //  MENU TAB FILTERING
  // ========================================
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      menuCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        const show = (category === 'all' || cardCategory === category);

        if (show) {
          card.style.display = '';
          gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: index * 0.06, ease: 'power3.out' });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in', onComplete: () => { card.style.display = 'none'; } });
        }
      });
    });
  });

  // ========================================
  //  CARD HOVER — GLOW & TILT
  // ========================================
  const tiltCards = document.querySelectorAll('.menu-card, .testimonial-card:not(.featured)');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Glow follow
      if (card.classList.contains('menu-card')) {
        card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
      }

      // 3D Tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ========================================
  //  MAGNETIC BUTTONS
  // ========================================
  const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta, .about-cta, .btn-dark, .btn-outline, .socialIcon');

  magneticElements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // ========================================
  //  FORMS HANDLING
  // ========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('formSubmit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        submitBtn.textContent = '✓ Reserved Successfully!';
        submitBtn.style.background = '#4CAF50';
        submitBtn.style.opacity = '1';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.style.pointerEvents = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  const setupNewsletter = (inputId, btnId) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    btn.addEventListener('click', () => {
      if (input.value && input.value.includes('@')) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        input.value = '';
        setTimeout(() => { btn.textContent = originalText; }, 2500);
      } else {
        gsap.to(input, { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.5, ease: 'power2.out' });
        input.style.borderColor = '#e74c3c';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });
  };

  setupNewsletter('newsletterInput', 'newsletterBtn');
  setupNewsletter('footerNewsletterInput', 'footerNewsletterBtn');

  // ========================================
  //  BACK TO TOP & PROGRESS BAR
  // ========================================
  const backToTop = document.getElementById('backToTop');
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 10001;
    background: linear-gradient(to right, #C8956C, #C9A96E);
    transform-origin: left; transform: scaleX(0);
    pointer-events: none; transition: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    progressBar.style.transform = `scaleX(${scrollPercent})`;
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut' });
  });

  // ========================================
  //  GALLERY LIGHTBOX
  // ========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title');

      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(26, 15, 10, 0.95);
        display: flex; align-items: center; justify-content: center;
        flex-direction: column; gap: 20px;
        opacity: 0; cursor: pointer;
        backdrop-filter: blur(16px);
        transition: opacity 0.4s ease;
      `;

      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 85vw; max-height: 75vh;
        object-fit: contain; border-radius: 16px;
        transform: scale(0.9);
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;

      lightbox.appendChild(lightboxImg);

      if (title) {
        const lt = document.createElement('p');
        lt.textContent = title.textContent;
        lt.style.cssText = `font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #FAF5EF; margin-top: 12px;`;
        lightbox.appendChild(lt);
      }

      const hint = document.createElement('p');
      hint.textContent = 'Click anywhere to close';
      hint.style.cssText = `font-size: 0.72rem; color: rgba(250, 245, 239, 0.35); letter-spacing: 3px; text-transform: uppercase;`;
      lightbox.appendChild(hint);

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });

      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 400);
      });
    });
  });

});
