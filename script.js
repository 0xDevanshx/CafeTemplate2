/**
 * Brew & Bloom — Cafe Website
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  //  PAGE LOADER
  // ========================================
  const pageLoader = document.getElementById('pageLoader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      pageLoader.classList.add('loaded');
      document.querySelector('.hero').classList.add('loaded');
    }, 1200);
  });

  // Fallback: hide loader after 3 seconds max
  setTimeout(() => {
    pageLoader.classList.add('loaded');
    document.querySelector('.hero').classList.add('loaded');
  }, 3000);

  // ========================================
  //  NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
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
  //  SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  //  SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay for siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const siblingIndex = Array.from(siblings).indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, siblingIndex * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  //  MENU TAB FILTERING
  // ========================================
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      menuCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.display = '';
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 60);
        } else {
          card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ========================================
  //  BACK TO TOP BUTTON
  // ========================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========================================
  //  CONTACT FORM HANDLING
  // ========================================
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('formSubmit');
    const originalText = submitBtn.textContent;

    // Simulate submission
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

  // ========================================
  //  NEWSLETTER FORM
  // ========================================
  const newsletterBtn = document.getElementById('newsletterBtn');
  const newsletterInput = document.getElementById('newsletterInput');

  newsletterBtn.addEventListener('click', () => {
    if (newsletterInput.value && newsletterInput.value.includes('@')) {
      const originalText = newsletterBtn.textContent;
      newsletterBtn.textContent = '✓ Done!';
      newsletterInput.value = '';
      
      setTimeout(() => {
        newsletterBtn.textContent = originalText;
      }, 2500);
    } else {
      newsletterInput.style.borderColor = '#e74c3c';
      setTimeout(() => {
        newsletterInput.style.borderColor = '';
      }, 2000);
    }
  });

  // ========================================
  //  PARALLAX EFFECT ON SCROLL
  // ========================================
  const parallaxBanner = document.getElementById('parallaxBanner');

  if (parallaxBanner) {
    const parallaxBg = parallaxBanner.querySelector('.parallax-banner-bg');

    window.addEventListener('scroll', () => {
      const rect = parallaxBanner.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollPercent - 0.5) * 60;
        parallaxBg.style.transform = `translateY(${translateY}px)`;
      }
    }, { passive: true });
  }

  // ========================================
  //  COUNTER ANIMATION (Hero Stats)
  // ========================================
  const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const heroStats = document.querySelectorAll('.hero-stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        heroStats.forEach(stat => {
          const text = stat.textContent;
          const num = parseInt(text.replace(/[^0-9]/g, ''));
          const suffix = text.replace(/[0-9]/g, '');
          animateCounter(stat, num, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  heroStats.forEach(stat => statsObserver.observe(stat));

  // ========================================
  //  TILT EFFECT ON MENU CARDS
  // ========================================
  const tiltCards = document.querySelectorAll('.menu-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });

  // ========================================
  //  MAGNETIC BUTTON EFFECT
  // ========================================
  const magneticButtons = document.querySelectorAll('.btn-primary, .nav-cta, .about-cta, .parallax-banner-cta');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ========================================
  //  GALLERY LIGHTBOX (Simple)
  // ========================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title');
      
      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(44, 24, 16, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
        backdrop-filter: blur(10px);
      `;

      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 85vw;
        max-height: 75vh;
        object-fit: contain;
        border-radius: 12px;
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;

      if (title) {
        const lightboxTitle = document.createElement('p');
        lightboxTitle.textContent = title.textContent;
        lightboxTitle.style.cssText = `
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #FFF8F0;
          margin-top: 12px;
        `;
        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(lightboxTitle);
      } else {
        lightbox.appendChild(lightboxImg);
      }

      // Close hint
      const closeHint = document.createElement('p');
      closeHint.textContent = 'Click anywhere to close';
      closeHint.style.cssText = `
        font-size: 0.75rem;
        color: rgba(255, 248, 240, 0.4);
        letter-spacing: 2px;
        text-transform: uppercase;
      `;
      lightbox.appendChild(closeHint);

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      // Animate in
      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });

      // Close lightbox
      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      });
    });
  });

  // ========================================
  //  TYPING EFFECT ON HERO (Subtle)
  // ========================================
  // The hero already uses CSS animations, so this is a gentle accent

  // ========================================
  //  PRELOAD CRITICAL IMAGES
  // ========================================
  const preloadImages = ['images/hero-coffee.png'];
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

});
