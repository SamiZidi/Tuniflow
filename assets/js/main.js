// ========================================
// Utility: Check for reduced motion preference
// ========================================
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// Initialize AOS immediately (script at bottom of body)
// ========================================
AOS.init({
  duration: prefersReducedMotion ? 0 : 800,
  easing: 'slide',
  once: true,
  disable: prefersReducedMotion
});

window.addEventListener('load', function() {
  AOS.refresh();
});

// ========================================
// Main Initialization
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  initLoader();
  initMobileMenu();
  initCarousels();
  initLightbox();
  initSmoothScroll();
  initScrollNavbar();
  initCounters();
  initAccordion();
  initDarkMode();
  initPricingToggle();
  initAuthModal();
});

// ========================================
// Loader
// ========================================
function initLoader() {
  setTimeout(function() {
    var loader = document.querySelector('.loader');
    var overlayer = document.getElementById('overlayer');
    if (loader) loader.style.display = 'none';
    if (overlayer) overlayer.style.display = 'none';
  }, 200);
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  var body = document.body;
  var menuToggle = document.querySelector('.js-menu-toggle');
  var mobileMenu = document.querySelector('.site-mobile-menu');
  var mobileMenuBody = document.querySelector('.site-mobile-menu-body');
  var navSource = document.querySelectorAll('.js-clone-nav');

  if (!menuToggle || !mobileMenuBody) return;

  // Clone navigation
  navSource.forEach(function(nav) {
    var clone = nav.cloneNode(true);
    clone.className = 'site-nav-wrap';
    // Remove IDs from cloned elements to avoid duplicates
    clone.querySelectorAll('[id]').forEach(function(el) {
      el.removeAttribute('id');
    });
    mobileMenuBody.appendChild(clone);
  });

  // Toggle menu
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    body.classList.toggle('offcanvas-menu');
    this.classList.toggle('active');
  });

  // Close menu button
  var closeBtn = document.querySelector('.site-mobile-menu-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      body.classList.remove('offcanvas-menu');
      menuToggle.classList.remove('active');
    });
  }

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (body.classList.contains('offcanvas-menu') &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      body.classList.remove('offcanvas-menu');
      menuToggle.classList.remove('active');
    }
  });

  // Close on resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991 && body.classList.contains('offcanvas-menu')) {
      body.classList.remove('offcanvas-menu');
      menuToggle.classList.remove('active');
    }
  });

  // Setup dropdown toggles
  setTimeout(function() {
    var counter = 0;
    mobileMenuBody.querySelectorAll('.has-children').forEach(function(item) {
      var arrow = document.createElement('span');
      arrow.className = 'arrow-collapse collapsed';
      arrow.setAttribute('data-bs-toggle', 'collapse');
      arrow.setAttribute('data-bs-target', '#collapseItem' + counter);
      item.insertBefore(arrow, item.firstChild);

      var submenu = item.querySelector('ul');
      if (submenu) {
        submenu.className = 'collapse';
        submenu.id = 'collapseItem' + counter;
      }
      counter++;
    });
  }, 100);

  // Arrow click handler
  mobileMenuBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('arrow-collapse')) {
      var collapse = e.target.closest('li').querySelector('.collapse');
      if (collapse && collapse.classList.contains('show')) {
        e.target.classList.remove('active');
      } else {
        e.target.classList.add('active');
      }
    }
  });
}

// ========================================
// Carousels (Swiper)
// ========================================
var featuresSwiper = null;
var testimonialsSwiper = null;

function initCarousels() {
  // Autoplay config - disabled if user prefers reduced motion
  var autoplayConfig = prefersReducedMotion ? false : {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  };

  // Features slider (synced with custom dots)
  var featuresEl = document.querySelector('.features-slider');
  if (featuresEl) {
    featuresSwiper = new Swiper('.features-slider', {
      slidesPerView: 1,
      loop: true,
      speed: prefersReducedMotion ? 0 : 400,
      autoplay: autoplayConfig,
      on: {
        slideChange: function() {
          updateCustomDots(this.realIndex);
        }
      }
    });

    // Initialize custom dots
    initCustomDots();
  }

  // Testimonials slider
  var testimonialEl = document.querySelector('.testimonials-slider');
  if (testimonialEl) {
    var testimonialAutoplay = prefersReducedMotion ? false : {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    };

    testimonialsSwiper = new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      speed: prefersReducedMotion ? 0 : 400,
      autoplay: testimonialAutoplay,
      pagination: {
        el: '.testimonials-pagination',
        clickable: true
      },
      breakpoints: {
        800: { slidesPerView: 2 }
      }
    });

    // Custom navigation buttons
    var prevBtn = document.querySelector('.js-custom-prev-v2');
    var nextBtn = document.querySelector('.js-custom-next-v2');

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        testimonialsSwiper.slidePrev();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        testimonialsSwiper.slideNext();
      });
    }
  }
}

// ========================================
// Custom Dots (for features slider)
// ========================================
function initCustomDots() {
  var dotsContainer = document.querySelector('.js-custom-dots');
  if (!dotsContainer || !featuresSwiper) return;

  var dots = dotsContainer.querySelectorAll('.service.link');
  dots.forEach(function(dot, index) {
    dot.setAttribute('data-index', index);
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      featuresSwiper.slideToLoop(index);
    });
  });
}

function updateCustomDots(index) {
  var dotsContainer = document.querySelector('.js-custom-dots');
  if (!dotsContainer) return;

  dotsContainer.querySelectorAll('.service.link').forEach(function(dot, i) {
    dot.classList.toggle('active', i === index);
  });
}

// ========================================
// Lightbox (GLightbox)
// ========================================
function initLightbox() {
  if (typeof GLightbox === 'undefined') return;
  GLightbox({ selector: '.glightbox' });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 100;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Update URL
        history.pushState(null, null, targetId);

        // Close mobile menu if open
        document.body.classList.remove('offcanvas-menu');
        var toggle = document.querySelector('.js-menu-toggle');
        if (toggle) toggle.classList.remove('active');

        // Focus target for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

// ========================================
// Scroll Navbar State
// ========================================
function initScrollNavbar() {
  var navbar = document.querySelector('.js-site-navbar');
  if (!navbar) return;

  function handleScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 150) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled', 'sleep');
    }

    if (scrollTop > 350) {
      navbar.classList.add('awake');
    } else {
      navbar.classList.remove('awake');
      if (scrollTop > 150) {
        navbar.classList.add('sleep');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

// ========================================
// Counters (IntersectionObserver)
// ========================================
function initCounters() {
  var counters = document.querySelectorAll('.counter > span[data-number]');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-number'), 10);

    // If reduced motion, show final value immediately
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }

    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(progress * target);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var container = entry.target;
        container.querySelectorAll('.counter > span[data-number]').forEach(animateCounter);
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.5 });

  var countContainer = document.querySelector('.count-numbers');
  if (countContainer) {
    // Add ARIA live region for accessibility
    countContainer.setAttribute('aria-live', 'polite');
    countContainer.setAttribute('aria-atomic', 'false');
    observer.observe(countContainer);
  }
}

// ========================================
// Accordion Active State
// ========================================
function initAccordion() {
  document.addEventListener('show.bs.collapse', function(e) {
    var item = e.target.closest('.accordion-item');
    if (item) item.classList.add('active');
  });

  document.addEventListener('hidden.bs.collapse', function(e) {
    var item = e.target.closest('.accordion-item');
    if (item) item.classList.remove('active');
  });
}

// ========================================
// Dark Mode Toggle
// ========================================
function initDarkMode() {
  var html = document.documentElement;
  var systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var toggles = Array.from(document.querySelectorAll(
    '#darkModeToggle, #darkModeToggleFixed, .mobile-theme-toggle'
  ));

  var savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    html.setAttribute('data-bs-theme', savedTheme);
    updateIcons(savedTheme === 'dark');
  } else if (systemDarkQuery.matches) {
    html.setAttribute('data-bs-theme', 'dark');
    updateIcons(true);
  }

  function updateIcons(isDark) {
    var iconClass = isDark ? 'icon-sun-o' : 'icon-moon-o';
    var ariaLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    toggles.forEach(function(btn) {
      var icon = btn.querySelector('span');
      if (icon) icon.className = iconClass;
      btn.setAttribute('aria-label', ariaLabel);
    });
  }

  function toggleTheme(e) {
    e.preventDefault();
    var currentTheme = html.getAttribute('data-bs-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme === 'dark');
  }

  systemDarkQuery.addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      var newTheme = e.matches ? 'dark' : 'light';
      html.setAttribute('data-bs-theme', newTheme);
      updateIcons(e.matches);
    }
  });

  toggles.forEach(function(btn) {
    btn.addEventListener('click', toggleTheme);
  });
}

// ========================================
// Pricing Toggle (Monthly/Yearly)
// ========================================
function initPricingToggle() {
  var toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  var priceAmounts = document.querySelectorAll('.price-amount');
  var periodTexts = document.querySelectorAll('.period-text');
  var monthlyLabel = document.querySelector('.toggle-label[data-period="monthly"]');
  var yearlyLabel = document.querySelector('.toggle-label[data-period="yearly"]');
  var pricingCards = document.querySelectorAll('.pricing-card');
  var yearlySavings = document.querySelectorAll('.yearly-savings');

  // Set initial state
  updateLabels(false);

  toggle.addEventListener('change', function() {
    var isYearly = this.checked;

    // Update toggle labels
    updateLabels(isYearly);

    // Animate price change
    priceAmounts.forEach(function(el) {
      el.classList.add('changing');

      setTimeout(function() {
        var newPrice = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        el.textContent = newPrice;
        el.classList.remove('changing');
      }, 150);
    });

    // Update period text
    periodTexts.forEach(function(el) {
      el.textContent = isYearly ? 'yr' : 'mo';
    });

    // Toggle yearly savings visibility
    pricingCards.forEach(function(card) {
      if (isYearly) {
        card.classList.add('yearly-active');
      } else {
        card.classList.remove('yearly-active');
      }
    });
  });

  // Click on labels to toggle
  if (monthlyLabel) {
    monthlyLabel.addEventListener('click', function() {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
    });
  }

  if (yearlyLabel) {
    yearlyLabel.addEventListener('click', function() {
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    });
  }

  function updateLabels(isYearly) {
    if (monthlyLabel) {
      monthlyLabel.classList.toggle('active', !isYearly);
    }
    if (yearlyLabel) {
      yearlyLabel.classList.toggle('active', isYearly);
    }
  }
}

// ========================================
// Auth Modal
// ========================================
function initAuthModal() {
  var authModal = document.getElementById('authModal');
  if (!authModal) return;

  var signInForm = document.getElementById('signInForm');
  var registerForm = document.getElementById('registerForm');

  // Switch between forms
  document.querySelectorAll('[data-auth-switch]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = this.getAttribute('data-auth-switch');
      switchAuthForm(target);
    });
  });

  // Handle which form to show when modal opens
  document.querySelectorAll('[data-auth-form]').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var target = this.getAttribute('data-auth-form');
      switchAuthForm(target);
    });
  });

  function switchAuthForm(target) {
    if (target === 'register') {
      signInForm.classList.add('d-none');
      registerForm.classList.remove('d-none');
      // Re-trigger animation
      registerForm.style.animation = 'none';
      registerForm.offsetHeight; // Trigger reflow
      registerForm.style.animation = '';
    } else {
      registerForm.classList.add('d-none');
      signInForm.classList.remove('d-none');
      // Re-trigger animation
      signInForm.style.animation = 'none';
      signInForm.offsetHeight; // Trigger reflow
      signInForm.style.animation = '';
    }
  }

  // Password visibility toggle
  document.querySelectorAll('.password-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var input = this.parentElement.querySelector('input');
      var icon = this.querySelector('span');

      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'icon-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'icon-eye';
      }
    });
  });

  // Reset forms when modal is hidden
  authModal.addEventListener('hidden.bs.modal', function() {
    // Reset to sign in form
    switchAuthForm('signin');

    // Reset all form fields
    authModal.querySelectorAll('form').forEach(function(form) {
      form.reset();
    });

    // Reset password visibility
    authModal.querySelectorAll('.password-toggle').forEach(function(btn) {
      var input = btn.parentElement.querySelector('input');
      var icon = btn.querySelector('span');
      input.type = 'password';
      icon.className = 'icon-eye';
    });
  });

  // Form submission handling (placeholder)
  authModal.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your form submission logic here
      console.log('Form submitted:', new FormData(this));
    });
  });
}
