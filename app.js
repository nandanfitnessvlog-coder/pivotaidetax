// Ensure page visibility on load & when restored from Back-Forward Cache (bfcache)
window.addEventListener('pageshow', (e) => {
  document.body.classList.add('page-loaded');
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');

  // 1. Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-toggle')) {
          e.preventDefault();
        } else {
          navMenu.classList.remove('active');
        }
      });
    });
  }

  // Prevent navigation on all dropdown toggle headers
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  // 2. Packages & Pricing Tabs Switcher with Exit/Enter Animations & Rolling Price Counter
  const tabIndividual = document.getElementById('tabIndividual');
  const tabBusiness = document.getElementById('tabBusiness');
  const tabIndicator = document.getElementById('tabIndicator');
  const individualContent = document.getElementById('individualContent');
  const businessContent = document.getElementById('businessContent');

  function updateTabIndicator(activeBtn) {
    if (!activeBtn || !tabIndicator) return;
    const parent = activeBtn.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const left = btnRect.left - parentRect.left;
    const width = btnRect.width;

    tabIndicator.style.transform = `translateX(${left}px)`;
    tabIndicator.style.width = `${width}px`;
  }

  function animatePriceCounter(cardEl) {
    const priceValEl = cardEl.querySelector('.plan-price-val');
    if (!priceValEl) return;

    if (!priceValEl.hasAttribute('data-price')) {
      priceValEl.setAttribute('data-price', priceValEl.innerText.trim());
    }
    const targetText = priceValEl.getAttribute('data-price');
    const numericMatch = targetText.match(/\d+/);
    if (!numericMatch) return;

    const targetNum = parseInt(numericMatch[0], 10);
    const isPlus = targetText.includes('+');
    const prefix = targetText.startsWith('$') ? '$' : '';

    const duration = 400; // 0.4s
    const steps = 14;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        clearInterval(timer);
        priceValEl.innerText = targetText;
      } else {
        const progress = step / steps;
        const randomOffset = Math.floor((Math.random() - 0.5) * 60);
        const currentNum = Math.max(0, Math.floor(targetNum * progress + randomOffset));
        priceValEl.innerText = `${prefix}${currentNum}${isPlus ? '+' : ''}`;
      }
    }, stepDuration);
  }

  function switchPricingTab(targetType) {
    const isIndividual = targetType === 'individual';
    const activeBtn = isIndividual ? tabIndividual : tabBusiness;
    const inactiveBtn = isIndividual ? tabBusiness : tabIndividual;
    const currentContent = isIndividual ? businessContent : individualContent;
    const targetContent = isIndividual ? individualContent : businessContent;

    if (targetContent.classList.contains('active') && !currentContent.classList.contains('exiting')) return;

    activeBtn.classList.add('active');
    inactiveBtn.classList.remove('active');
    updateTabIndicator(activeBtn);

    // 1. Exit Animation: Scale down (0.96), blur (4px), fade out (0.25s)
    currentContent.classList.add('exiting');

    setTimeout(() => {
      currentContent.classList.remove('active', 'exiting');

      // 2. Enter Animation: Staggered slide-up (y: 40px to 0), scale-in (0.95 to 1.0)
      targetContent.classList.add('active');

      // 3. Price Counter Roll Effect
      const cards = targetContent.querySelectorAll('.plan-card');
      cards.forEach(card => animatePriceCounter(card));
    }, 220);
  }

  if (tabIndividual && tabBusiness && individualContent && businessContent) {
    const initTabs = () => {
      const activeBtn = tabIndividual.classList.contains('active') ? tabIndividual : tabBusiness;
      updateTabIndicator(activeBtn);
    };

    window.addEventListener('load', initTabs);
    window.addEventListener('resize', initTabs);

    tabIndividual.addEventListener('click', () => switchPricingTab('individual'));
    tabBusiness.addEventListener('click', () => switchPricingTab('business'));

    document.querySelectorAll('.switch-business-tab').forEach(btn => {
      btn.addEventListener('click', () => switchPricingTab('business'));
    });

    setTimeout(initTabs, 100);
    setTimeout(initTabs, 500);
  }

  // 3. Modals Control System
  const quickPrepareModal = document.getElementById('quickPrepareModal');
  const appointmentModal = document.getElementById('appointmentModal');
  const openQuickPrepare = document.getElementById('openQuickPrepare');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const heroEstimateBtn = document.getElementById('heroEstimateBtn');
  const openAppointmentNav = document.getElementById('openAppointmentNav');
  const openAppointmentBanner = document.getElementById('openAppointmentBanner');

  const closeQuickPrepare = document.getElementById('closeQuickPrepare');
  const closeAppointment = document.getElementById('closeAppointment');

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  if (openQuickPrepare) openQuickPrepare.addEventListener('click', (e) => {
    if (quickPrepareModal) openModal(quickPrepareModal);
  });
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', (e) => {
      const target = document.getElementById('how-it-works');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  if (heroEstimateBtn) {
    heroEstimateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (quickPrepareModal) openModal(quickPrepareModal);
    });
  }

  if (openAppointmentNav) {
    openAppointmentNav.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://pivotaide.odoo.com/appointment/1', '_blank');
    });
  }

  if (openAppointmentBanner) {
    openAppointmentBanner.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://pivotaide.odoo.com/appointment/1', '_blank');
    });
  }

  // Appointment triggers -> Odoo appointment page
  document.querySelectorAll('.open-appt-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://pivotaide.odoo.com/appointment/1', '_blank');
    });
  });

  // Plan selection buttons trigger modal or appointment page
  document.querySelectorAll('.open-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (quickPrepareModal) {
        openModal(quickPrepareModal);
      } else {
        window.open('https://pivotaide.odoo.com/appointment/1', '_blank');
      }
    });
  });

  if (closeQuickPrepare) closeQuickPrepare.addEventListener('click', () => closeModal(quickPrepareModal));
  if (closeAppointment) closeAppointment.addEventListener('click', () => closeModal(appointmentModal));

  window.addEventListener('click', (e) => {
    if (e.target === quickPrepareModal) closeModal(quickPrepareModal);
    if (e.target === appointmentModal) closeModal(appointmentModal);
  });

  // 4. Dynamic QuickPrepare Estimator Logic
  const filingType = document.getElementById('filingType');
  const numForms = document.getElementById('numForms');
  const numStates = document.getElementById('numStates');
  const totalEstimate = document.getElementById('totalEstimate');
  const quickForm = document.getElementById('quickForm');

  function calculateEstimate() {
    if (!filingType || !numForms || !numStates || !totalEstimate) return;
    const baseFee = parseInt(filingType.value, 10);
    const formsCount = parseInt(numForms.value, 10) || 1;
    const stateCount = parseInt(numStates.value, 10) || 0;

    const extraForms = Math.max(0, formsCount - 1) * 20;
    const extraStates = stateCount * 30;

    const total = baseFee + extraForms + extraStates;
    const newText = `$${total}`;

    if (totalEstimate.textContent !== newText) {
      totalEstimate.textContent = newText;
      totalEstimate.classList.remove('price-pulse');
      void totalEstimate.offsetWidth; // trigger reflow
      totalEstimate.classList.add('price-pulse');
    } else {
      totalEstimate.textContent = newText;
    }
  }

  if (filingType) filingType.addEventListener('change', calculateEstimate);
  if (numForms) numForms.addEventListener('input', calculateEstimate);
  if (numStates) numStates.addEventListener('input', calculateEstimate);

  calculateEstimate();

  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`Thank you! Your estimated rate is ${totalEstimate.textContent}. A Pivot Aide Tax professional will redirect you to the secure portal now.`);
      closeModal(quickPrepareModal);
    });
  }

  const apptForm = document.getElementById('apptForm');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Your appointment request has been received! Our tax specialist will confirm your time slot shortly.');
      closeModal(appointmentModal);
      apptForm.reset();
    });
  }

  // 5. Accordion FAQs Logic (GSAP Auto-Height Expansion, Chevron Arrow Dynamics, Active Sibling Dimming)
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', (e) => {
      e.preventDefault();
      const item = question.closest('.faq-item') || question.parentElement;
      const container = item.closest('.faq-list, .faq-grid, .faq-section, .faq-group-block, .faq-accordion-container') || item.parentElement;
      const drawer = item.querySelector('.faq-answer-drawer, .faq-answer-wrapper');
      const isOpen = item.classList.contains('active') || item.classList.contains('open') || item.classList.contains('is-open');

      // Single-open accordion behavior: smoothly collapse previously opened siblings
      if (container) {
        container.querySelectorAll('.faq-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active', 'open', 'is-open');
            const sibBtn = sibling.querySelector('.faq-question');
            if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
            const sibDrawer = sibling.querySelector('.faq-answer-drawer, .faq-answer-wrapper');
            if (sibDrawer && typeof gsap !== 'undefined') {
              gsap.to(sibDrawer, { height: 0, duration: 0.3, ease: 'power2.inOut' });
            }
          }
        });
      }

      if (isOpen) {
        item.classList.remove('active', 'open', 'is-open');
        question.setAttribute('aria-expanded', 'false');
        if (drawer && typeof gsap !== 'undefined') {
          gsap.to(drawer, { height: 0, duration: 0.35, ease: 'power2.inOut' });
        }
        if (container) {
          container.querySelectorAll('.faq-item').forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
          });
        }
      } else {
        item.classList.add('active', 'open', 'is-open');
        question.setAttribute('aria-expanded', 'true');
        if (drawer && typeof gsap !== 'undefined') {
          gsap.fromTo(drawer,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.inOut' }
          );
        }
        // Dim adjacent unopened FAQ pills
        if (container) {
          container.querySelectorAll('.faq-item').forEach(sibling => {
            if (sibling !== item) {
              sibling.style.opacity = '0.65';
              sibling.style.transform = 'scale(0.99)';
            } else {
              sibling.style.opacity = '1';
              sibling.style.transform = '';
            }
          });
        }
      }
    });
  });

  // 6. WhatsApp Popover Toggle
  const waToggle = document.getElementById('waToggle');
  const waPopover = document.getElementById('waPopover');

  if (waToggle && waPopover) {
    waToggle.addEventListener('click', () => {
      waPopover.classList.toggle('active');
    });
  }

  // 7. Scroll Header Class & Shadow Toggle (rAF Throttled for GPU Performance)
  const header = document.getElementById('header');
  if (header) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // 8. Hero Background Video Muted Autoplay Ensure (All Pages)
  document.querySelectorAll('video').forEach(vid => {
    vid.muted = true;
    vid.play().catch(() => { });
  });

  // 8b. Curtain / Parallax Wave Divider (Speed: 0.85 Offset)
  const parallaxDividers = document.querySelectorAll('.section-divider-parallax');
  if (parallaxDividers.length > 0) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
          parallaxDividers.forEach(divider => {
            const rect = divider.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const speed = parseFloat(divider.getAttribute('data-speed') || '0.85');
              const offset = (window.innerHeight - rect.top) * (1 - speed);
              divider.style.transform = `translateY(${offset}px)`;
            }
          });
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // 8c. Animated SVG Step Connector Line Scroll Progress Draw
  const connectorPath = document.getElementById('connectorPath');
  const processFlow = document.getElementById('processFlow');

  if (connectorPath && processFlow) {
    const pathLength = connectorPath.getTotalLength();
    connectorPath.style.strokeDasharray = pathLength;
    connectorPath.style.strokeDashoffset = pathLength;

    let pathTicking = false;
    window.addEventListener('scroll', () => {
      if (!pathTicking) {
        window.requestAnimationFrame(() => {
          const rect = processFlow.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          if (rect.top < viewHeight && rect.bottom > 0) {
            const totalDistance = rect.height + viewHeight * 0.4;
            const currentDistance = viewHeight - rect.top;
            const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
            connectorPath.style.strokeDashoffset = pathLength * (1 - progress);
          }
          pathTicking = false;
        });
        pathTicking = true;
      }
    }, { passive: true });
  }

  // 9. Global Scroll Reveal Engine (Vanilla JS IntersectionObserver)
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-fade-up, .reveal-fade-down, .reveal-fade-left, .reveal-fade-right, .reveal-on-scroll'
  );

  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('is-revealed');
            if (entry.target.classList.contains('pricing-section') || entry.target.id === 'packages') {
              const activeCards = entry.target.querySelectorAll('.tab-content.active .plan-card');
              activeCards.forEach(card => animatePriceCounter(card));
            }
          } else {
            entry.target.classList.remove('active');
            entry.target.classList.remove('is-revealed');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -25% 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for legacy browsers
      revealElements.forEach(el => {
        el.classList.add('active');
        el.classList.add('is-revealed');
      });
    }
  }
  // 10. Subtle Internal Page Fade Transition System
  document.body.classList.add('page-loaded');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Bypass external links, Stripe, Odoo, PDF downloads, tel/mailto, forms, or hash anchors
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      target === '_blank' ||
      link.hasAttribute('download') ||
      href.endsWith('.pdf')
    ) {
      return;
    }

    if (href.endsWith('.html') || href.includes('.html#') || href === 'index.html') {
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      document.body.classList.add('page-exiting');

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    }
  });

  // 11. WhatsApp Live Agent Card 3D Mouse Tilt & Dynamic Shadow Repositioning
  const qrCard = document.getElementById('faqQrCard');
  if (qrCard) {
    qrCard.addEventListener('mousemove', (e) => {
      const rect = qrCard.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const centerX = rect.left + cardWidth / 2;
      const centerY = rect.top + cardHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Max rotation +/-6deg
      const rotateX = (-mouseY / (cardHeight / 2)) * 6;
      const rotateY = (mouseX / (cardWidth / 2)) * 6;

      // Dynamic shadow offset
      const shadowX = -rotateY * 2.5;
      const shadowY = rotateX * 2.5 + 18;

      qrCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      qrCard.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 38px rgba(0, 0, 0, 0.14)`;
    });

    qrCard.addEventListener('mouseleave', () => {
      qrCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      qrCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
    });
  }

  // 12. Hero Background Graphic Scroll Parallax (yPercent: 20 depth effect)
  const heroVideo = document.querySelector('.hero-bg-video');
  const heroSection = document.querySelector('.qp-hero-section');
  if (heroVideo && heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = heroSection.offsetHeight;
      if (scrollY <= heroHeight) {
        // yPercent: 20 scroll rate shift
        const parallaxY = (scrollY / heroHeight) * 20;
        heroVideo.style.transform = `translate(-50%, calc(-50% + ${parallaxY.toFixed(2)}%)) scale(1.0)`;
      }
    }, { passive: true });
  }

  // 12b. 'How it works' Primary Heading – Split-Text Mask Reveal (Trigger: top 80% viewport)
  const howItWorksSection = document.getElementById('how-it-works') || document.querySelector('.how-it-works-section');
  if (howItWorksSection) {
    const howItWorksHeader = howItWorksSection.querySelector('.how-it-works-header');
    if ('IntersectionObserver' in window) {
      const howItWorksObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            howItWorksSection.classList.add('active', 'is-revealed');
            if (howItWorksHeader) {
              howItWorksHeader.classList.add('active', 'is-revealed');
            }
            observer.unobserve(entry.target); // fire once only on scroll entrance
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -20% 0px' // triggers when section reaches top 80% of viewport
      });
      howItWorksObserver.observe(howItWorksSection);
    } else {
      howItWorksSection.classList.add('active', 'is-revealed');
      if (howItWorksHeader) howItWorksHeader.classList.add('active', 'is-revealed');
    }
  }

  // 13. QuickPrepare / Steps Title – Split-Text Mask Reveal (80% viewport trigger)
  const stepsTitles = document.querySelectorAll('.qp-steps-title, #qpStepsTitle');
  if (stepsTitles.length > 0) {
    if ('IntersectionObserver' in window) {
      const stepsTitleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('steps-title-revealed');
            observer.unobserve(entry.target); // fire once only
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -20% 0px' // triggers when top 80% of viewport is reached
      });
      stepsTitles.forEach(title => stepsTitleObserver.observe(title));
    } else {
      // Fallback: reveal immediately for legacy browsers
      stepsTitles.forEach(title => title.classList.add('steps-title-revealed'));
    }
  }

  // 14. QuickPrepare Steps – Connected Progress Line + Circle Stagger + Text Cascade + Idle Animations
  const stepsFlowWrapper = document.getElementById('qpStepsFlowWrapper');
  if (stepsFlowWrapper) {
    const STAGGER = 0.15;   // s between each numbered circle pop
    const CIRCLE_START = 0.15;   // s before first circle pops (line already drawing)
    const TEXT_OFFSET = 0.35;   // s after circle fires before its text slides up
    const WAVE_INTERVAL = 5000;   // ms between each sequential wave pulse loop
    const WAVE_NODE_GAP = 300;    // ms between each node within a single wave pass
    const WAVE_HOLD = 650;    // ms to hold .wave-pulse-active before removing

    const circles = [
      document.getElementById('qpCircle1'),
      document.getElementById('qpCircle2'),
      document.getElementById('qpCircle3'),
      document.getElementById('qpCircle4'),
      document.getElementById('qpCircle5'),
      document.getElementById('qpCircle6'),
    ];
    const texts = [
      document.getElementById('qpText1'),
      document.getElementById('qpText2'),
      document.getElementById('qpText3'),
      document.getElementById('qpText4'),
      document.getElementById('qpText5'),
      document.getElementById('qpText6'),
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sequential wave: add .wave-pulse-active to each circle 300ms apart, remove after hold
    const doWavePulse = () => {
      circles.forEach((circle, i) => {
        if (!circle) return;
        setTimeout(() => {
          circle.classList.add('wave-pulse-active');
          setTimeout(() => circle.classList.remove('wave-pulse-active'), WAVE_HOLD);
        }, i * WAVE_NODE_GAP);
      });
    };

    const triggerStepsAnimation = () => {
      if (prefersReducedMotion) {
        // Instant reveal + no idle animations for accessibility
        stepsFlowWrapper.classList.add('steps-active');
        circles.forEach(c => c && c.classList.add('circle-active'));
        texts.forEach(t => t && t.classList.add('text-active'));
        return;
      }

      // 1. Draw the gradient connecting line
      stepsFlowWrapper.classList.add('steps-active');

      // 2. Stagger each circle pop + 3. Cascade its text
      circles.forEach((circle, i) => {
        if (!circle) return;
        const circleDelay = (CIRCLE_START + i * STAGGER) * 1000; // ms
        const textDelay = circleDelay + TEXT_OFFSET * 1000;

        setTimeout(() => { circle.classList.add('circle-active'); }, circleDelay);
        setTimeout(() => { const text = texts[i]; if (text) text.classList.add('text-active'); }, textDelay);
      });

      // 4. After all entrance animations settle: start micro-floating
      // Last circle fires at (CIRCLE_START + 5*STAGGER)s, settles after +0.7s → ~1.9s total
      const entranceCompleteMs = (CIRCLE_START + 5 * STAGGER + 0.7) * 1000;

      setTimeout(() => {
        stepsFlowWrapper.classList.add('steps-floating');
      }, entranceCompleteMs);

      // 5. After floating starts + 0.8s grace: kick off the wave pulse loop every 5s
      setTimeout(() => {
        doWavePulse();                              // first wave
        setInterval(doWavePulse, WAVE_INTERVAL);   // repeat every 5s
      }, entranceCompleteMs + 800);
    };

    if ('IntersectionObserver' in window) {
      const stepsFlowObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerStepsAnimation();
            observer.unobserve(entry.target); // fire once only
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -20% 0px' // top 80% of viewport trigger
      });
      stepsFlowObserver.observe(stepsFlowWrapper);
    } else {
      // Legacy fallback
      triggerStepsAnimation();
    }
  }

  // 15. QuickPrepare Split FAQ Accordion Reveal (Trigger: top 75% viewport)
  const qpFaqSections = document.querySelectorAll('.qp-faq-split-section');
  if (qpFaqSections.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      qpFaqSections.forEach(sec => sec.classList.add('qp-faq-revealed'));
    } else if ('IntersectionObserver' in window) {
      const qpFaqObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('qp-faq-revealed');
            observer.unobserve(entry.target); // fire once only
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -25% 0px' // triggers as section reaches top 75% of viewport
      });
      qpFaqSections.forEach(sec => qpFaqObserver.observe(sec));
    } else {
      qpFaqSections.forEach(sec => sec.classList.add('qp-faq-revealed'));
    }
  }

  // 16. QuickPrepare Graphic – Static presentation

  // 17. Tax Extensions Title Mask Reveal (Trigger: top 75% viewport)
  const extSections = document.querySelectorAll('.tax-extensions-section');
  if (extSections.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      extSections.forEach(sec => {
        sec.classList.add('ext-revealed');
        const title = sec.querySelector('.ext-main-title');
        if (title) title.classList.add('ext-title-revealed');
      });
    } else if ('IntersectionObserver' in window) {
      const extObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ext-revealed');
            const title = entry.target.querySelector('.ext-main-title');
            if (title) title.classList.add('ext-title-revealed');
            observer.unobserve(entry.target); // fire once only
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -25% 0px' // triggers when section reaches top 75% of viewport
      });
      extSections.forEach(sec => extObserver.observe(sec));
    } else {
      extSections.forEach(sec => {
        sec.classList.add('ext-revealed');
        const title = sec.querySelector('.ext-main-title');
        if (title) title.classList.add('ext-title-revealed');
      });
    }
  }

  // 18. Download Tax Document Checklist / Blue CTA Section Scroll Entrance (Trigger: top 75% viewport)
  const checklistSections = document.querySelectorAll('.checklist-section');
  if (checklistSections.length > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      checklistSections.forEach(sec => sec.classList.add('checklist-revealed'));
    } else if ('IntersectionObserver' in window) {
      const checklistObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('checklist-revealed');
            observer.unobserve(entry.target); // fire once only
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -25% 0px' // triggers when section reaches top 75% of viewport
      });
      checklistSections.forEach(sec => checklistObserver.observe(sec));
    } else {
      checklistSections.forEach(sec => sec.classList.add('checklist-revealed'));
    }
  }

  // 19. WhatsApp QR Card Interactive 3D Mouse Parallax (Perspective: 1000px, Max Rotation: +/-6deg)
  const qrCards = document.querySelectorAll('.faq-qr-card');
  if (qrCards.length > 0) {
    qrCards.forEach(qrCard => {
      let qrTicking = false;
      qrCard.addEventListener('mousemove', (e) => {
        if (!qrTicking) {
          window.requestAnimationFrame(() => {
            const rect = qrCard.getBoundingClientRect();
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            const mouseX = e.clientX - rect.left - cardWidth / 2;
            const mouseY = e.clientY - rect.top - cardHeight / 2;

            // Max rotation +/- 6deg on X and Y axes
            const rotateX = (-mouseY / (cardHeight / 2)) * 6;
            const rotateY = (mouseX / (cardWidth / 2)) * 6;

            qrCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            qrTicking = false;
          });
          qrTicking = true;
        }
      });

      qrCard.addEventListener('mouseleave', () => {
        qrCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 20. Universal Scroll Reveal Observer for General Sections and Elements
  const genericRevealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale, .not-sure-section, .testimonials-section, .testimonial-card, .site-footer, .faq-section');
  if (genericRevealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const genericObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      });
      genericRevealElements.forEach(el => genericObserver.observe(el));
    } else {
      genericRevealElements.forEach(el => {
        el.classList.add('active');
        el.classList.add('is-revealed');
      });
    }
  }

  // 21. Payroll Hero Background Cinematic Scroll Parallax (yPercent: 18, scrub: 1)
  const payrollHero = document.getElementById('payrollHeroSection');
  const payrollBgImg = document.getElementById('payrollHeroBgImg');
  if (payrollHero && payrollBgImg) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(payrollBgImg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: payrollHero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    } else {
      let parallaxTicking = false;
      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          window.requestAnimationFrame(() => {
            const rect = payrollHero.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const scrollProgress = Math.max(0, -rect.top / (rect.height || 1));
              const yShift = scrollProgress * 18; // 18% shift
              payrollBgImg.style.transform = `scale(1) translateY(${yShift.toFixed(2)}%)`;
            }
            parallaxTicking = false;
          });
          parallaxTicking = true;
        }
      }, { passive: true });
    }
  }

  // 22. Bookkeeping Hero Background Cinematic Entrance & Scroll Parallax
  const bookkeepingHero = document.getElementById('bookkeepingHeroSection');
  const bookkeepingBgImg = document.getElementById('bookkeepingHeroBgImg');
  const bookkeepingOverlay = document.getElementById('bookkeepingHeroOverlay');

  if (bookkeepingHero && bookkeepingBgImg) {
    if (typeof gsap !== 'undefined') {
      // Initial Scale & Overlay Entrance on page load
      gsap.fromTo(bookkeepingBgImg,
        { scale: 1.08 },
        { scale: 1.0, duration: 1.2, ease: 'power3.out' }
      );
      if (bookkeepingOverlay) {
        gsap.fromTo(bookkeepingOverlay,
          { opacity: 0.6 },
          { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
        );
      }

      // Scroll Parallax via GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(bookkeepingBgImg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: bookkeepingHero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    } else {
      // Fallback scroll parallax when GSAP is not available
      let bookkeepingParallaxTicking = false;
      window.addEventListener('scroll', () => {
        if (!bookkeepingParallaxTicking) {
          window.requestAnimationFrame(() => {
            const rect = bookkeepingHero.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const scrollProgress = Math.max(0, -rect.top / (rect.height || 1));
              const yShift = scrollProgress * 18; // 18% shift
              bookkeepingBgImg.style.transform = `scale(1) translateY(${yShift.toFixed(2)}%)`;
            }
            bookkeepingParallaxTicking = false;
          });
          bookkeepingParallaxTicking = true;
        }
      }, { passive: true });
    }
  }

  // 23. White Pill CTA Button High-Fidelity Micro-Interactions (Entrance Pop, Hover Glow, Tactile Press)
  const whitePillButtons = document.querySelectorAll('.bookkeeping-hero-cta-btn, .white-pill-cta-btn');
  whitePillButtons.forEach(btn => {
    // Entrance Pop via GSAP if loaded (scale: 0.88 to 1.0, opacity: 0 to 1, duration: 0.45s, ease: back.out(1.7))
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(btn,
        { scale: 0.88, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 0.45, delay: 0.85, ease: 'back.out(1.7)' }
      );
    }

    // Hover & Glow Dynamics: Elevate (y: -3px, scale: 1.04, duration: 0.2s, ease: power2.out)
    btn.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          y: -3,
          scale: 1.04,
          boxShadow: '0 10px 24px rgba(255, 255, 255, 0.25), 0 0 20px rgba(0, 229, 255, 0.22)',
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          y: 0,
          scale: 1.0,
          boxShadow: '0 4px 18px rgba(255, 255, 255, 0.15), 0 0 12px rgba(0, 229, 255, 0.12)',
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    });

    // Tactile Press Feedback: Instant spring compression on click/tap (scale: 0.95, duration: 0.08s)
    btn.addEventListener('pointerdown', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          scale: 0.95,
          y: 0,
          duration: 0.08,
          ease: 'power2.inOut'
        });
      }
    });

    const releaseSpring = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          scale: btn.matches(':hover') ? 1.04 : 1.0,
          y: btn.matches(':hover') ? -3 : 0,
          duration: 0.15,
          ease: 'back.out(2)'
        });
      }
    };

    btn.addEventListener('pointerup', releaseSpring);
    btn.addEventListener('pointercancel', releaseSpring);
  });

  // 24. 3 Step Cards Sequential Scroll Reveal & 3D Mouse Tilt
  const payrollStepCards = document.querySelectorAll('.payroll-step-card');
  const payrollStepsGrids = document.querySelectorAll('.payroll-steps-grid');

  if (payrollStepsGrids.length > 0) {
    if ('IntersectionObserver' in window) {
      const stepsGridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('steps-revealed', 'active');
            const parentSection = entry.target.closest('.payroll-steps-section, .qp-steps-section');
            if (parentSection) parentSection.classList.add('steps-revealed', 'active');
            const cards = entry.target.querySelectorAll('.payroll-step-card');
            cards.forEach((card, idx) => {
              setTimeout(() => {
                card.classList.add('card-revealed');
              }, idx * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px' // Trigger when cards reach top 80% of viewport
      });

      payrollStepsGrids.forEach(grid => stepsGridObserver.observe(grid));
    } else {
      payrollStepsGrids.forEach(grid => {
        grid.classList.add('steps-revealed', 'active');
        grid.querySelectorAll('.payroll-step-card').forEach(card => card.classList.add('card-revealed'));
      });
    }
  }

  // 3D Mouse Tilt for Step Cards on Hover
  payrollStepCards.forEach(card => {
    let tiltTicking = false;
    card.addEventListener('mousemove', (e) => {
      if (!tiltTicking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const cardWidth = rect.width;
          const cardHeight = rect.height;
          const mouseX = e.clientX - rect.left - cardWidth / 2;
          const mouseY = e.clientY - rect.top - cardHeight / 2;

          // Subtle tilt (+/- 4deg)
          const rotateX = (-mouseY / (cardHeight / 2)) * 4;
          const rotateY = (mouseX / (cardWidth / 2)) * 4;

          card.style.transform = `perspective(1000px) translateY(-8px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
          tiltTicking = false;
        });
        tiltTicking = true;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 23. Full-Width Dark Navy Consultation Banner Scroll Entrance & Stagger
  const consultBanners = document.querySelectorAll('.not-sure-section, .payroll-consult-banner');
  if (consultBanners.length > 0) {
    if ('IntersectionObserver' in window) {
      const bannerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active', 'is-revealed', 'banner-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px' // triggers smoothly as user scrolls into view
      });

      consultBanners.forEach(banner => bannerObserver.observe(banner));
    } else {
      consultBanners.forEach(banner => banner.classList.add('active', 'is-revealed', 'banner-revealed'));
    }
  }

  // 24. Testimonials Section – 'RATINGS' Eyebrow, 'Trusted by Our Clients' Mask, 3 Review Cards Waterfall & Star Cascade
  const testimonialSections = document.querySelectorAll('.testimonials-section');
  if (testimonialSections.length > 0) {
    if ('IntersectionObserver' in window) {
      const testimonialsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active', 'is-revealed', 'ratings-revealed');
            const eyebrow = entry.target.querySelector('.ratings-eyebrow');
            const maskInner = entry.target.querySelector('.ratings-mask-inner');
            const cards = entry.target.querySelectorAll('.testimonial-card');

            if (typeof gsap !== 'undefined') {
              if (eyebrow) {
                gsap.fromTo(eyebrow,
                  { letterSpacing: '0.08em', opacity: 0 },
                  { letterSpacing: '0.2em', opacity: 0.6, duration: 0.5, ease: 'power2.out' }
                );
              }
              if (maskInner) {
                gsap.fromTo(maskInner,
                  { y: '100%', opacity: 0 },
                  { y: '0%', opacity: 1, duration: 0.7, delay: 0.1, ease: 'power3.out' }
                );
              }
              if (cards.length > 0) {
                gsap.fromTo(cards,
                  { y: 45, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    stagger: 0.15,
                    delay: 0.25,
                    ease: 'power3.out',
                    onComplete: () => {
                      cards.forEach(card => card.classList.add('card-settled'));
                    }
                  }
                );

                cards.forEach((card, cIdx) => {
                  const stars = card.querySelectorAll('.star-rating svg');
                  const copyElements = card.querySelectorAll('.reviewer-name, .testimonial-text');

                  // Review Copy Fade (y: 12px to 0, opacity: 0 to 1, duration: 0.45s)
                  if (copyElements.length > 0) {
                    gsap.fromTo(copyElements,
                      { y: 12, opacity: 0 },
                      { y: 0, opacity: 1, duration: 0.45, delay: 0.55 + cIdx * 0.15, ease: 'power2.out' }
                    );
                  }

                  // Star Rating Cascade (scale: 0 -> 1.25 -> 1.0, duration: 0.3s, stagger: 0.04s, ease: back.out(2))
                  if (stars.length > 0) {
                    gsap.fromTo(stars,
                      { scale: 0, opacity: 0 },
                      {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        stagger: 0.04,
                        delay: 0.75 + cIdx * 0.15,
                        ease: 'back.out(2)'
                      }
                    );
                  }
                });
              }
            } else {
              cards.forEach((card, idx) => {
                setTimeout(() => {
                  card.classList.add('card-revealed', 'active');
                }, idx * 150);
              });
            }
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -25% 0px' // triggers when section reaches top 75% of viewport
      });

      testimonialSections.forEach(sec => testimonialsObserver.observe(sec));
    } else {
      testimonialSections.forEach(sec => {
        sec.classList.add('active', 'is-revealed', 'ratings-revealed');
        sec.querySelectorAll('.testimonial-card').forEach(card => card.classList.add('card-revealed', 'active'));
      });
    }
  }

  // 25. FAQs Section Heading Kinetic Mask & 8 Accordion Cards Sequential Waterfall (stagger: 0.08s, y: 30px to 0, opacity: 0 to 1, duration: 0.6s, ease: power3.out)
  const faqSections = document.querySelectorAll('.faq-section, #faqs');
  if (faqSections.length > 0) {
    if ('IntersectionObserver' in window) {
      const faqHeadingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active', 'is-revealed', 'faq-title-revealed', 'faq-cards-revealed');
            const maskInners = entry.target.querySelectorAll('.faq-mask-inner');
            const faqItems = entry.target.querySelectorAll('.faq-item');

            if (typeof gsap !== 'undefined') {
              if (maskInners.length > 0) {
                gsap.fromTo(maskInners,
                  { y: '100%', opacity: 0 },
                  { y: '0%', opacity: 1, duration: 0.7, ease: 'power3.out' }
                );
              }
              if (faqItems.length > 0) {
                gsap.fromTo(faqItems,
                  { y: 30, opacity: 0, borderColor: 'rgba(0, 136, 255, 0.45)' },
                  {
                    y: 0,
                    opacity: 1,
                    borderColor: '#e2e8f0',
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.1
                  }
                );
              }
            } else {
              faqItems.forEach((item, idx) => {
                setTimeout(() => {
                  item.classList.add('card-revealed');
                }, idx * 80);
              });
            }
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -25% 0px' // triggers when section reaches top 75% of viewport
      });

      faqSections.forEach(sec => faqHeadingObserver.observe(sec));
    } else {
      faqSections.forEach(sec => {
        sec.classList.add('active', 'is-revealed', 'faq-title-revealed', 'faq-cards-revealed');
        sec.querySelectorAll('.faq-item').forEach(item => item.classList.add('card-revealed'));
      });
    }
  }

  // 26. Business Formation Hero – Kinetic Mask Reveal, Subheading Fade/Slide & CTA Pop
  const bizMaskInners = document.querySelectorAll('.biz-mask-inner');
  const bizSubtext = document.querySelector('.biz-hero-subtext');
  const bizHeroCta = document.querySelector('#bizFormationHeroSection .btn-primary, #bizFormationHeroSection a[href*="business-formation-form"]');
  const bizHeroBg = document.querySelector('#bizFormationHeroSection .hero-bg-video, #bizFormationHeroSection .hero-video-container');
  const bizHeroSection = document.querySelector('#bizFormationHeroSection');

  if (typeof gsap !== 'undefined') {
    // 1. Headline Mask Entrance (y: 100% -> 0%, duration: 0.85s, ease: cubic-bezier(0.16, 1, 0.3, 1))
    if (bizMaskInners.length > 0) {
      gsap.fromTo(bizMaskInners,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          delay: 0.1,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }
      );
    }

    // 2. Subtext Drift & Fade In (y: 20px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s)
    if (bizSubtext) {
      gsap.fromTo(bizSubtext,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out'
        }
      );
    }

    // 3. Central 'GET STARTED' Button Elastic Pop (scale: 0.88 -> 1.0, duration: 0.45s, ease: back.out(1.7))
    if (bizHeroCta) {
      gsap.fromTo(bizHeroCta,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1.0,
          opacity: 1,
          duration: 0.45,
          delay: 0.4,
          ease: 'back.out(1.7)'
        }
      );
    }

    // 4. Hero Background Depth Parallax (yPercent: 18, scrub: 1)
    if (bizHeroBg && bizHeroSection && typeof ScrollTrigger !== 'undefined') {
      gsap.to(bizHeroBg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: bizHeroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  // 27. "What's included?" 7 Cards Staggered 3D Elevation & Grid Reveal Animation
  const whatsIncludedSection = document.querySelector('#whatsIncludedSection, .whats-included-section');
  if (whatsIncludedSection) {
    const includedCards = whatsIncludedSection.querySelectorAll('.included-card');
    const includedTitle = whatsIncludedSection.querySelector('.whats-included-title');
    let hasAnimated = false;

    const runWhatsIncludedEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      whatsIncludedSection.classList.add('is-revealed', 'active');

      if (typeof gsap !== 'undefined') {
        // 1. Title reveals smoothly
        if (includedTitle) {
          gsap.fromTo(includedTitle,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }
          );
        }

        // 2. Cards stagger smoothly into their grid positions
        if (includedCards.length > 0) {
          gsap.fromTo(includedCards,
            { y: 40, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
              onComplete: () => {
                gsap.set(includedCards, { clearProps: 'transform,opacity' });
              }
            }
          );
        }
      } else {
        if (includedTitle) includedTitle.style.opacity = '1';
        includedCards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      }
    };

    if ('IntersectionObserver' in window) {
      const whatsIncludedObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runWhatsIncludedEntrance();
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
      });

      whatsIncludedObserver.observe(whatsIncludedSection);
    } else {
      runWhatsIncludedEntrance();
    }
  }

  // 28. "Bundle options" 3-Card Pricing Stagger & Price Digit Roll Animation
  const bundleSection = document.querySelector('#bundleOptionsSection, .bundle-pricing-section');
  if (bundleSection) {
    const bundleCards = bundleSection.querySelectorAll('.pricing-grid-3 .plan-card');
    const bundleMaskInner = bundleSection.querySelector('.bundle-mask-inner');
    const bundleSubtext = bundleSection.querySelector('.bundle-subtext');
    let hasAnimated = false;

    // Helper to format number with comma
    const formatNumber = num => Math.round(num).toLocaleString('en-US');

    const animatePriceRoll = (card, targetPrice) => {
      const priceDigitEl = card.querySelector('.price-digit');
      if (!priceDigitEl) return;

      const duration = 500; // 0.5s rapid counter roll
      const startTime = performance.now();
      const startVal = Math.floor(targetPrice * 0.15); // Start roll from ~15% of value

      const updateCounter = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo for brisk initial spin settling into final price
        const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.round(startVal + (targetPrice - startVal) * easeVal);
        priceDigitEl.textContent = formatNumber(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          priceDigitEl.textContent = formatNumber(targetPrice);
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const runBundleEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      bundleSection.classList.add('is-revealed');

      // 1. Kinetic Header Reveal (Headline mask + Subtitle)
      if (typeof gsap !== 'undefined') {
        if (bundleMaskInner) {
          gsap.fromTo(bundleMaskInner,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.7, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        }
        if (bundleSubtext) {
          gsap.fromTo(bundleSubtext,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        }

        // 2. 3-Card Pricing Bundle Stagger (y: 50px to 0, scale: 0.95 to 1, opacity: 0 to 1, stagger: 0.15s)
        gsap.fromTo(bundleCards,
          { y: 50, scale: 0.95, opacity: 0 },
          {
            y: 0,
            scale: 1.0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            onComplete: () => {
              // Ensure clean inline styles so hover scales work uninterrupted
              gsap.set(bundleCards, { clearProps: 'transform,opacity' });
            }
          }
        );

        // 3. Price Counter Roll & Feature List Waterfall
        bundleCards.forEach((card, idx) => {
          const priceContainer = card.querySelector('.plan-price-val');
          const targetPrice = priceContainer ? parseInt(priceContainer.getAttribute('data-target-price'), 10) || 399 : 399;

          // Trigger price roll as card locks into place
          setTimeout(() => {
            animatePriceRoll(card, targetPrice);
          }, (idx * 150) + 300);

          // Feature list cascade
          const featureItems = card.querySelectorAll('.plan-features-list li');
          if (featureItems.length > 0) {
            gsap.fromTo(featureItems,
              { y: 8, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.03,
                delay: (idx * 0.15) + 0.2,
                ease: 'power2.out'
              }
            );
          }
        });
      } else {
        // Fallback without GSAP
        bundleCards.forEach((card, idx) => {
          const priceContainer = card.querySelector('.plan-price-val');
          const targetPrice = priceContainer ? parseInt(priceContainer.getAttribute('data-target-price'), 10) || 399 : 399;
          setTimeout(() => animatePriceRoll(card, targetPrice), (idx * 150) + 200);
        });
      }
    };

    // IntersectionObserver triggered when section reaches top 75% of viewport
    const bundleObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runBundleEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -25% 0px', // triggers when top 75% of viewport is reached
      threshold: 0.05
    });

    bundleObserver.observe(bundleSection);
  }

  // 29. "À La Carte Add-Ons" Card Container & 4-Category Waterfall Entrance
  const alacarteContainer = document.querySelector('#alacarteSection, .alacarte-container');
  if (alacarteContainer) {
    const maskInner = alacarteContainer.querySelector('.alacarte-mask-inner');
    const subtext = alacarteContainer.querySelector('.alacarte-subtext');
    const categoryBlocks = alacarteContainer.querySelectorAll('.alacarte-category-block');
    const noteBox = alacarteContainer.querySelector('.alacarte-note-box');
    let hasAnimated = false;

    const runAlacarteEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      alacarteContainer.classList.add('is-revealed');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        // 1. Container lifts into view with smooth spring physics
        tl.fromTo(alacarteContainer,
          { y: 40, scale: 0.98, opacity: 0 },
          { y: 0, scale: 1.0, opacity: 1, duration: 0.75, ease: 'power3.out' }
        );

        // 2. Title & Subtitle Cascade
        if (maskInner) {
          tl.fromTo(maskInner,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.6, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            0.15
          );
        }
        if (subtext) {
          tl.fromTo(subtext,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
            0.3
          );
        }

        // 3. 4-Category Grid & Bullet List Cascade
        if (categoryBlocks.length > 0) {
          tl.fromTo(categoryBlocks,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
            0.4
          );

          categoryBlocks.forEach((block, bIdx) => {
            const items = block.querySelectorAll('.alacarte-item');
            if (items.length > 0) {
              tl.fromTo(items,
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'power2.out' },
                0.5 + (bIdx * 0.1)
              );
            }
          });
        }

        // 4. Bottom Important Note Callout Box Reveal
        if (noteBox) {
          tl.fromTo(noteBox,
            { y: 15, scale: 0.98, opacity: 0 },
            { y: 0, scale: 1.0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.1'
          );
        }
      }
    };

    const alacarteObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAlacarteEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -25% 0px', // triggers when top 75% of viewport is reached
      threshold: 0.05
    });

    alacarteObserver.observe(alacarteContainer);
  }

  // 30. "How it works" 4-Card Center-Stack to Lateral Spread Deck Animation (GSAP ScrollTrigger)
  const bizFormationStepsSection = document.querySelector('#howItWorksStepsSection, .qp-steps-section');
  if (bizFormationStepsSection) {
    const stepsTitleMask = bizFormationStepsSection.querySelector('.steps-mask-inner');
    const deckCards = bizFormationStepsSection.querySelectorAll('.deck-card, .qp-step-card');
    const card1 = bizFormationStepsSection.querySelector('.step-1');
    const card2 = bizFormationStepsSection.querySelector('.step-2');
    const card3 = bizFormationStepsSection.querySelector('.step-3');
    const card4 = bizFormationStepsSection.querySelector('.step-4');
    const badges = bizFormationStepsSection.querySelectorAll('.qp-step-circle-badge');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // Desktop & Tablet (> 768px): Center-Stack to Lateral Fan-Out Spread with Bi-directional Scrub
      mm.add("(min-width: 769px)", () => {
        // Initial Stack Order and subtle rotation angles for a physical deck look
        if (card1) gsap.set(card1, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: 0, scale: 1.0, zIndex: 4, opacity: 1 });
        if (card2) gsap.set(card2, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, x: 0, y: 6, rotation: 3, scale: 0.96, zIndex: 3, opacity: 1 });
        if (card3) gsap.set(card3, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, x: 0, y: 12, rotation: -3, scale: 0.92, zIndex: 2, opacity: 1 });
        if (card4) gsap.set(card4, { left: '50%', top: '50%', xPercent: -50, yPercent: -50, x: 0, y: 18, rotation: 5, scale: 0.88, zIndex: 1, opacity: 1 });
        if (badges.length > 0) gsap.set(badges, { scale: 0.8 });

        // Heading Entrance Reveal
        if (stepsTitleMask) {
          gsap.fromTo(stepsTitleMask,
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.7,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: bizFormationStepsSection,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        // Lateral Fan-Out Spread Entrance Animation (triggers smoothly as section enters viewport)
        const runDeckSpreadAnimation = () => {
          const deckTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' }
          });

          // 1. Cards smoothly fan out from the center stack to 4 columns
          if (card1) deckTimeline.to(card1, { xPercent: -205, rotation: 0, scale: 1.0, y: 0, duration: 0.8 }, 0.1);
          if (card2) deckTimeline.to(card2, { xPercent: -102, rotation: 0, scale: 1.0, y: 0, duration: 0.8 }, 0.18);
          if (card3) deckTimeline.to(card3, { xPercent: 2, rotation: 0, scale: 1.0, y: 0, duration: 0.8 }, 0.26);
          if (card4) deckTimeline.to(card4, { xPercent: 105, rotation: 0, scale: 1.0, y: 0, duration: 0.8 }, 0.34);

          // 2. Node Number Badges Spring Elastic Pop & Aura Glow Activation
          if (badges.length > 0) {
            deckTimeline.to(badges, {
              scale: 1.2,
              duration: 0.25,
              stagger: 0.08,
              ease: 'power2.out'
            }, 0.65);
            deckTimeline.to(badges, {
              scale: 1.0,
              duration: 0.3,
              stagger: 0.08,
              ease: 'back.out(2)'
            }, 0.85);
          }
        };

        ScrollTrigger.create({
          trigger: bizFormationStepsSection,
          start: 'top 80%',
          onEnter: () => runDeckSpreadAnimation(),
          once: true
        });

        // 3. Interactive Hover Magnet, 3D Cursor Tilt Perspective & Sibling Dimming
        deckCards.forEach(card => {
          card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -6; // max ±6 deg
            const tiltY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.05) translateY(-10px)`;
            card.style.zIndex = '20';
            card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.14)';

            // Subtly dim sibling cards
            deckCards.forEach(sibling => {
              if (sibling !== card) {
                sibling.style.opacity = '0.55';
              }
            });
          });

          card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex = '';
            card.style.boxShadow = '';

            deckCards.forEach(sibling => {
              sibling.style.opacity = '1';
            });
          });
        });

        return () => {
          deckTimeline.kill();
          deckCards.forEach(c => gsap.set(c, { clearProps: 'all' }));
        };
      });

      // Mobile Fallback (< 768px): Native responsive grid with staggered fade
      mm.add("(max-width: 768px)", () => {
        deckCards.forEach(c => gsap.set(c, { clearProps: 'all' }));
        if (stepsTitleMask) gsap.set(stepsTitleMask, { clearProps: 'all' });
        if (badges.length > 0) gsap.set(badges, { clearProps: 'all' });

        gsap.fromTo(deckCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bizFormationStepsSection,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    } else {
      // Non-GSAP Fallback
      bizFormationStepsSection.classList.add('is-revealed');
      deckCards.forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
    }
  }

  // 31. Dark Consultation Banner & 'START THE PROCESS TODAY' CTA
  const consultationBanner = document.querySelector('#consultationBannerSection, .consultation-banner-section');
  if (consultationBanner) {
    const bannerTitle = consultationBanner.querySelector('.banner-title');
    const bannerSubtext = consultationBanner.querySelector('.banner-subtext');
    const ctaButton = consultationBanner.querySelector('.btn-cyan-pill');
    let hasAnimated = false;

    const runBannerEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      consultationBanner.classList.add('is-revealed');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' }
        });

        // 1. Banner slide-in
        tl.fromTo(consultationBanner,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          0
        );

        // 2. Headline & Subtitle fade & slide
        if (bannerTitle || bannerSubtext) {
          const bannerText = [bannerTitle, bannerSubtext].filter(Boolean);
          tl.fromTo(bannerText,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
            0.15
          );
        }

        // 3. CTA Pill Button Pop
        if (ctaButton) {
          tl.fromTo(ctaButton,
            { scale: 0.88, opacity: 0 },
            { scale: 1.0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' },
            0.4
          );
        }
      }
    };

    const bannerObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runBannerEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -20% 0px', // triggers when top 80% of viewport is reached
      threshold: 0.05
    });

    bannerObserver.observe(consultationBanner);
  }

  // 32. FAQs Split Section – Bottom-to-Top 3D Kinetic Tilt Domino Flip & Accordion Suite
  const faqSplitSection = document.querySelector('#faqs, .qp-faq-split-section');
  if (faqSplitSection) {
    const faqTitleMask = faqSplitSection.querySelector('.faq-mask-inner');
    const splitLeft = faqSplitSection.querySelector('.qp-split-left');
    const splitRight = faqSplitSection.querySelector('.qp-split-right');
    const faqItems = faqSplitSection.querySelectorAll('.faq-item');
    const faqFootnote = faqSplitSection.querySelector('.faq-footnote');
    const card3dWrapper = faqSplitSection.querySelector('#faq3dCard, .faq-3d-card-wrapper');
    const card3dInner = faqSplitSection.querySelector('.faq-3d-card-inner');

    // 3D Cursor-driven Mouse Parallax Tilt (rotateX/rotateY: ±8 deg)
    if (card3dWrapper && card3dInner) {
      card3dWrapper.addEventListener('mousemove', e => {
        const rect = card3dWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8; // max ±8 deg
        const rotateY = ((x - centerX) / centerX) * 8;

        card3dInner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card3dWrapper.addEventListener('mouseleave', () => {
        card3dInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Heading Mask Entrance (bi-directional)
      if (faqTitleMask) {
        gsap.fromTo(faqTitleMask,
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.7,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: faqSplitSection,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }

      // 2. Right Graphic Entrance (bi-directional)
      if (splitRight) {
        gsap.fromTo(splitRight,
          { x: 40, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1.0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: faqSplitSection,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }

      // 3. Editorial Bottom-to-Top Stagger Entrance with 3D Kinetic Tilt Domino Flip (y: 65px -> 0, rotateX: 18deg -> 0deg)
      if (faqItems.length > 0) {
        gsap.fromTo(faqItems,
          {
            y: 65,
            opacity: 0,
            rotateX: 18,
            transformOrigin: 'bottom center',
            transformPerspective: 1000
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: splitLeft || faqSplitSection,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
              onEnter: () => faqSplitSection.classList.add('is-revealed')
            }
          }
        );
      }

      // 4. Footnote Fade-In (bi-directional)
      if (faqFootnote) {
        gsap.fromTo(faqFootnote,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: splitLeft || faqSplitSection,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    } else {
      // Non-GSAP Fallback
      faqSplitSection.classList.add('is-revealed');
      faqItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
    }
  }

  // 33. Tax Resources Hero Background Cinematic Scale & Parallax Depth
  const taxHeroSection = document.querySelector('#taxResourcesHeroSection, .tax-resources-hero-section');
  if (taxHeroSection) {
    const taxBgImg = taxHeroSection.querySelector('.tax-hero-bg-img');
    const taxOverlay = taxHeroSection.querySelector('.tax-hero-overlay');
    const taxTitleMask = taxHeroSection.querySelector('.tax-mask-inner');
    const taxSubtext = taxHeroSection.querySelector('.tax-hero-subtext');

    taxHeroSection.classList.add('is-revealed');

    if (typeof gsap !== 'undefined') {
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Initial Scale & Overlay Cross-Fade
      if (taxBgImg) {
        heroTl.fromTo(taxBgImg,
          { scale: 1.08 },
          { scale: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }
      if (taxOverlay) {
        heroTl.fromTo(taxOverlay,
          { opacity: 0.65 },
          { opacity: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      // 2. Headline Reveal & Subtitle Float
      if (taxTitleMask) {
        heroTl.fromTo(taxTitleMask,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.8, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          0.2
        );
      }
      if (taxSubtext) {
        heroTl.fromTo(taxSubtext,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.4
        );
      }

      // 3. Scroll Parallax: Decoupled depth rate on background layer
      if (typeof ScrollTrigger !== 'undefined' && taxBgImg) {
        gsap.to(taxBgImg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: taxHeroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    }
  }

  // 34. "General Tax Info" Section Title & 3-Card Article Waterfall Stagger
  const generalTaxSection = document.querySelector('#generalTaxInfoSection, .general-tax-info-section');
  if (generalTaxSection) {
    const infoTitleMask = generalTaxSection.querySelector('.tax-info-mask-inner');
    const articleCards = generalTaxSection.querySelectorAll('.tax-article-card');
    let hasAnimated = false;

    const runGeneralTaxEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      generalTaxSection.classList.add('is-revealed');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        // 1. Heading Mask Reveal
        if (infoTitleMask) {
          tl.fromTo(infoTitleMask,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.7, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            0
          );
        }

        // 2. 3 Cards Waterfall Stagger
        if (articleCards.length > 0) {
          tl.fromTo(articleCards,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.15,
              ease: 'power3.out',
              onComplete: () => {
                articleCards.forEach(card => card.classList.add('is-revealed'));
              }
            },
            0.15
          );

          // 3. Tag & Metadata Cascade
          articleCards.forEach((card, idx) => {
            const metaElements = card.querySelectorAll('.article-tag-badge, .article-date, .article-heading, .article-excerpt');
            if (metaElements.length > 0) {
              tl.fromTo(metaElements,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
                0.3 + (idx * 0.15)
              );
            }
          });
        }
      }
    };

    const generalTaxObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runGeneralTaxEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -25% 0px', // triggers when top 75% of viewport is reached
      threshold: 0.05
    });

    generalTaxObserver.observe(generalTaxSection);
  }

  // 35. Newsletter Subscription Card 3D Pop
  const newsletterSection = document.querySelector('#newsletterBannerSection, .newsletter-banner-section');
  if (newsletterSection) {
    const newsletterCard = newsletterSection.querySelector('#newsletterCardPop, .newsletter-card-pop');
    let hasAnimated = false;

    const runNewsletterEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (newsletterCard) {
        newsletterCard.classList.add('is-revealed');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(newsletterCard,
            { y: 45, scale: 0.95, opacity: 0 },
            { y: 0, scale: 1.0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
          );
        }
      }
    };

    const newsletterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runNewsletterEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -20% 0px', // triggers when top 80% of viewport is reached
      threshold: 0.05
    });

    newsletterObserver.observe(newsletterSection);
  }

  // 36. "How Our Online Portal Makes Filing Easier" 10-Feature Matrix Stagger & Icon Pop
  const portalFeaturesSection = document.querySelector('#portalFeaturesSection, .portal-features-section');
  if (portalFeaturesSection) {
    const portalTitleMask = portalFeaturesSection.querySelector('.portal-mask-inner');
    const featureItems = portalFeaturesSection.querySelectorAll('.portal-feature-item');
    let hasAnimated = false;

    const runPortalEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      portalFeaturesSection.classList.add('is-revealed');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        // 1. Heading Mask Reveal
        if (portalTitleMask) {
          tl.fromTo(portalTitleMask,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.7, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            0
          );
        }

        // 2. 10 Features Matrix Waterfall Stagger
        if (featureItems.length > 0) {
          tl.fromTo(featureItems,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.07,
              ease: 'power3.out',
              onComplete: () => {
                featureItems.forEach(item => item.classList.add('is-revealed'));
              }
            },
            0.15
          );

          // 3. Icon Pop & Text Drift
          featureItems.forEach((item, idx) => {
            const iconWrapper = item.querySelector('.portal-icon-wrapper');
            const heading = item.querySelector('.portal-feature-heading');
            const desc = item.querySelector('.portal-feature-desc');

            if (iconWrapper) {
              tl.fromTo(iconWrapper,
                { scale: 0 },
                { scale: 1.0, duration: 0.35, ease: 'back.out(2)' },
                0.25 + (idx * 0.07)
              );
            }

            if (heading || desc) {
              const textNodes = [heading, desc].filter(Boolean);
              tl.fromTo(textNodes,
                { y: 8, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
                0.3 + (idx * 0.07)
              );
            }
          });
        }
      }
    };

    const portalObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runPortalEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -25% 0px', // triggers when top 75% of viewport is reached
      threshold: 0.05
    });

    portalObserver.observe(portalFeaturesSection);
  }

  // 37. Contact Hero Cinematic Scale, Parallax Depth, & 3 Contact Badges Pop
  const contactHeroSection = document.querySelector('#contactHeroSection, .contact-hero-section');
  if (contactHeroSection) {
    const contactBgImg = contactHeroSection.querySelector('.contact-hero-bg-img');
    const contactOverlay = contactHeroSection.querySelector('.contact-hero-overlay');
    const contactNodes = contactHeroSection.querySelectorAll('.contact-node-item');

    if (typeof gsap !== 'undefined') {
      const contactHeroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Scale & Overlay Entrance
      if (contactBgImg) {
        contactHeroTl.fromTo(contactBgImg,
          { scale: 1.08 },
          { scale: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      if (contactOverlay) {
        contactHeroTl.fromTo(contactOverlay,
          { opacity: 0.65 },
          { opacity: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      // 2. 3 Contact Badges Stagger Pop & Text Slide
      if (contactNodes.length > 0) {
        contactNodes.forEach((node, idx) => {
          const circleBadge = node.querySelector('.contact-circle-badge');
          const nodeLabel = node.querySelector('.contact-node-label');

          contactHeroTl.to(node, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            onComplete: () => node.classList.add('is-revealed')
          }, 0.2 + (idx * 0.15));

          if (circleBadge) {
            contactHeroTl.fromTo(circleBadge,
              { scale: 0, opacity: 0 },
              { scale: 1.0, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
              0.2 + (idx * 0.15)
            );
          }

          if (nodeLabel) {
            contactHeroTl.fromTo(nodeLabel,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              0.3 + (idx * 0.15)
            );
          }
        });
      }

      // 3. Scroll Parallax: Decoupled depth rate on background layer
      if (typeof ScrollTrigger !== 'undefined' && contactBgImg) {
        gsap.to(contactBgImg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: contactHeroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    }
  }

  // 38. 'Get In Touch' Section Reveal, Form Cascade, & 3D Tilt Parallax Card
  const getInTouchSection = document.querySelector('#getInTouchSection, .get-in-touch-section');
  if (getInTouchSection) {
    const touchTitleMask = getInTouchSection.querySelector('.touch-mask-inner');
    const touchMedia = getInTouchSection.querySelector('.get-in-touch-media');
    const touchFormCol = getInTouchSection.querySelector('.get-in-touch-form-col');
    const formFields = getInTouchSection.querySelectorAll('.touch-form-container .form-group-glow');
    const sendBtn = getInTouchSection.querySelector('.btn-send-message');
    let hasAnimated = false;

    const runTouchEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      getInTouchSection.classList.add('is-revealed');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' }
        });

        // 1. Headline Reveal
        if (touchTitleMask) {
          tl.fromTo(touchTitleMask,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.7, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            0
          );
        }

        // 2. Split Media & Form Entrance
        if (touchMedia) {
          tl.fromTo(touchMedia,
            { x: -40, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              onComplete: () => touchMedia.classList.add('is-revealed')
            },
            0.15
          );
        }

        if (touchFormCol) {
          tl.fromTo(touchFormCol,
            { x: 30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              onComplete: () => touchFormCol.classList.add('is-revealed')
            },
            0.15
          );
        }

        // 3. Form Fields Sequential Waterfall Cascade
        if (formFields.length > 0) {
          tl.fromTo(formFields,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
              onComplete: () => {
                formFields.forEach(f => f.classList.add('is-revealed'));
              }
            },
            0.3
          );
        }

        // 4. 'SEND MESSAGE' Button Pop
        if (sendBtn) {
          tl.fromTo(sendBtn,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1.0,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(1.7)',
              onComplete: () => sendBtn.classList.add('is-revealed')
            },
            0.65
          );
        }
      }
    };

    const touchObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runTouchEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -25% 0px', // triggers when top 75% of viewport is reached
      threshold: 0.05
    });

    touchObserver.observe(getInTouchSection);

    // 5. Left Office Photo 3D Mouse Parallax Tilt
    if (touchMedia) {
      touchMedia.addEventListener('mousemove', (e) => {
        const rect = touchMedia.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max +-6deg
        const rotateY = ((x - centerX) / centerX) * 6;  // max +-6deg

        if (typeof gsap !== 'undefined') {
          gsap.to(touchMedia, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: 'power2.out',
            duration: 0.3
          });
        }
      });

      touchMedia.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(touchMedia, {
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out',
            duration: 0.5
          });
        }
      });
    }
  }

  // 39. FAQ Page Hero Cinematic Scale, Parallax Depth, Mask Cascade & Category Pills
  const faqHeroSection = document.querySelector('#faqHeroSection, .faq-page-hero');
  if (faqHeroSection) {
    const faqBgImg = faqHeroSection.querySelector('.faq-hero-bg-img');
    const faqOverlay = faqHeroSection.querySelector('.faq-hero-overlay');
    const faqEyebrow = faqHeroSection.querySelector('.faq-hero-eyebrow');
    const faqTitleMask = faqHeroSection.querySelector('.faq-hero-mask-title .faq-mask-inner');
    const faqSubtext = faqHeroSection.querySelector('.faq-hero-subtext');
    const faqCatPills = faqHeroSection.querySelectorAll('.faq-cat-pill');

    if (typeof gsap !== 'undefined') {
      const faqHeroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Background Imagery Scale & Corporate Blue Cross-fade
      if (faqBgImg) {
        faqHeroTl.fromTo(faqBgImg,
          { scale: 1.08 },
          { scale: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      if (faqOverlay) {
        faqHeroTl.fromTo(faqOverlay,
          { opacity: 0.65 },
          { opacity: 1.0, duration: 1.2, ease: 'power3.out' },
          0
        );
      }

      // 2. Eyebrow Label expanding letter-spacing tracking
      if (faqEyebrow) {
        faqHeroTl.fromTo(faqEyebrow,
          { letterSpacing: '0.1em', opacity: 0 },
          { letterSpacing: '0.22em', opacity: 0.85, duration: 0.5, ease: 'power2.out' },
          0.1
        );
      }

      // 3. Headline Reveal
      if (faqTitleMask) {
        faqHeroTl.fromTo(faqTitleMask,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          0.2
        );
      }

      // 4. Subtitle Paragraph Slide & Fade
      if (faqSubtext) {
        faqHeroTl.fromTo(faqSubtext,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
          0.35
        );
      }

      // 5. 6 Filter Category Pill Badges Stagger Entrance
      if (faqCatPills.length > 0) {
        faqHeroTl.fromTo(faqCatPills,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1.0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: 'back.out(1.7)',
            onComplete: () => {
              faqCatPills.forEach(pill => pill.classList.add('is-revealed'));
            }
          },
          0.45
        );
      }

      // 6. Scroll Parallax: Decoupled depth rate on background layer
      if (typeof ScrollTrigger !== 'undefined' && faqBgImg) {
        gsap.to(faqBgImg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: faqHeroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    }

    // Category Pill Active Toggle & Filter switching interaction
    if (faqCatPills.length > 0) {
      faqCatPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          const targetHref = pill.getAttribute('href');
          if (targetHref && targetHref.startsWith('#')) {
            e.preventDefault();
            faqCatPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const targetGroupId = targetHref.substring(1);
            const targetGroup = document.getElementById(targetGroupId);
            const allGroups = document.querySelectorAll('.faq-accordion-container > div[id]');

            if (targetGroup && typeof gsap !== 'undefined') {
              // Fade out other groups and highlight / scroll to target
              allGroups.forEach(group => {
                if (group.id !== targetGroupId) {
                  gsap.to(group, { opacity: 0.35, duration: 0.25 });
                } else {
                  gsap.to(group, { opacity: 1, duration: 0.25 });
                }
              });

              // Stagger items in selected category
              const targetItems = targetGroup.querySelectorAll('.faq-item');
              if (targetItems.length > 0) {
                gsap.fromTo(targetItems,
                  { y: 20, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
                );
              }

              // Smooth scroll to selected category with offset
              const targetOffset = targetGroup.getBoundingClientRect().top + window.pageYOffset - 120;
              window.scrollTo({ top: targetOffset, behavior: 'smooth' });
            }
          }
        });
      });
    }
  }

  // 40. FAQ Accordions Waterfall Entrance & Fluid Expansion Dynamics
  const faqMainSection = document.querySelector('.faq-main-section');
  if (faqMainSection) {
    const faqItems = faqMainSection.querySelectorAll('.faq-item');
    let hasAnimated = false;

    // 1. Scroll Waterfall Entrance
    const runFaqListEntrance = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (typeof gsap !== 'undefined' && faqItems.length > 0) {
        gsap.fromTo(faqItems,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            onComplete: () => {
              faqItems.forEach(item => item.classList.add('is-revealed'));
            }
          }
        );
      } else {
        faqItems.forEach(item => item.classList.add('is-revealed'));
      }
    };

    const faqListObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runFaqListEntrance();
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.05
    });

    faqListObserver.observe(faqMainSection);

    // Accordions handled by global section 5 handler
  }

  // 41. Universal Full-Width Scroll-Driven Curtain Unmask / Drawer Footer Reveal (GSAP ScrollTrigger)
  const siteFooter = document.querySelector('.site-footer, footer');
  const mainContent = document.querySelector('#main-content, main, .main-content-wrapper, .form-page-wrapper');

  if (siteFooter) {
    const footerContainer = siteFooter.querySelector('.container') || siteFooter;
    const footerCols = siteFooter.querySelectorAll('.footer-col, .footer-grid > *');

    // Link Dynamics: Cyan underline and hover text color brighten to #38BDF8
    const footerLinks = siteFooter.querySelectorAll('.footer-links a, .footer-sub-links a');
    footerLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.color = '#38BDF8';
      });
      link.addEventListener('mouseleave', () => {
        link.style.color = '';
      });
    });

    // GSAP ScrollTrigger Depth Parallax & Bi-Directional Curtain Reveal
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Bind GSAP ScrollTrigger to the bottom of #main-content (trigger: '#main-content', start: 'bottom bottom', end: '+=420px', scrub: 1)
      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: mainContent || siteFooter,
          start: 'bottom bottom',
          end: '+=420px',
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: () => siteFooter.classList.add('is-unmasked', 'active'),
          onLeaveBack: () => siteFooter.classList.remove('is-unmasked')
        }
      });

      // Negative parallax: yPercent: -15 to 0, scale: 0.95 to 1.0, opacity: 0.7 to 1.0
      footerTl.fromTo(footerContainer,
        { scale: 0.95, yPercent: -15, opacity: 0.7, transformOrigin: 'center bottom' },
        { scale: 1.0, yPercent: 0, opacity: 1.0, ease: 'none', duration: 1 }
      );

      // Stagger-fade in the footer link columns and contact metadata (stagger: 0.05s, y: 10px to 0)
      ScrollTrigger.create({
        trigger: siteFooter,
        start: 'top 85%',
        end: 'bottom bottom',
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          siteFooter.classList.add('active');
          if (footerCols.length > 0) {
            gsap.fromTo(footerCols,
              { opacity: 0.7, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
            );
          }
        },
        onLeaveBack: () => {
          siteFooter.classList.remove('active');
        }
      });
    } else {
      // Graceful fallback for non-GSAP environments
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            siteFooter.classList.add('active', 'is-revealed', 'is-unmasked');
          }
        });
      }, { threshold: 0.1 });
      footerObserver.observe(siteFooter);
    }
  }

  // 42. Homepage Hero Typography & Dual CTA Entrance (index.html)
  const indexHeroSection = document.querySelector('.qp-hero-section');
  if (indexHeroSection && typeof gsap !== 'undefined') {
    const heroBgImg = indexHeroSection.querySelector('.hero-bg-video, .hero-bg-img');
    const heroOverlay = indexHeroSection.querySelector('.hero-video-overlay');
    const heroTitleWords = indexHeroSection.querySelectorAll('.hero-mask-word');
    const heroDesc = indexHeroSection.querySelector('.qp-hero-desc');
    const heroBtnPrimary = indexHeroSection.querySelector('.hero-btn-primary, .btn-primary');
    const heroBtnSecondary = indexHeroSection.querySelector('.hero-btn-secondary, .btn-secondary');

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Background Scale (1.08 -> 1.0) & Overlay Gradient Fade (0.65 -> 1.0, 1.2s)
    if (heroBgImg) {
      heroTl.fromTo(heroBgImg,
        { scale: 1.08, transformOrigin: 'center center' },
        { scale: 1.0, duration: 1.2 },
        0
      );
    }
    if (heroOverlay) {
      heroTl.fromTo(heroOverlay,
        { opacity: 0.65 },
        { opacity: 1.0, duration: 1.2 },
        0
      );
    }

    // 2. Headline Reveal ('File Your Taxes / With Confidence') upward slide through overflow: hidden mask
    if (heroTitleWords.length > 0) {
      heroTl.fromTo(heroTitleWords,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
        0.15
      );
    }

    // 3. Subtitle Cascade
    if (heroDesc) {
      heroTl.fromTo(heroDesc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.35
      );
    }

    // 4. Dual CTA Button Pop
    if (heroBtnPrimary) {
      heroTl.fromTo(heroBtnPrimary,
        { scale: 0.88, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' },
        0.55
      );
    }
    if (heroBtnSecondary) {
      heroTl.fromTo(heroBtnSecondary,
        { scale: 0.88, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' },
        0.65
      );
    }
  }

  // 43. Sticky Scroll-Driven Split-Layout 6-Step Workflow ('How does QuickPrepare work?')
  const qpWorkflowSection = document.querySelector('#qpWorkflowSection, .qp-steps-section');
  if (qpWorkflowSection) {
    const activeBadge = qpWorkflowSection.querySelector('#qpActiveBadge, .qp-step-badge');
    const phaseLabel = qpWorkflowSection.querySelector('#qpPhaseLabel, .qp-phase-label');
    const phaseTitle = qpWorkflowSection.querySelector('#qpPhaseTitle, .qp-phase-title');
    const progressLine = qpWorkflowSection.querySelector('#qpProgressLineActive, .qp-progress-line-active');
    const progressNodes = qpWorkflowSection.querySelectorAll('.qp-p-node');
    const highlightTagText = qpWorkflowSection.querySelector('#qpTagText');
    const editorialCards = Array.from(qpWorkflowSection.querySelectorAll('.qp-editorial-card'));

    const stepData = [
      {
        step: 1,
        num: '01',
        title: 'Pay $200 & Intake',
        badgeColorClass: 'badge-color-1',
        color: '#007BFF',
        progressWidth: '16.66%',
        tag: 'Base $200 fee applied directly to your final package'
      },
      {
        step: 2,
        num: '02',
        title: 'Secure Upload Link',
        badgeColorClass: 'badge-color-2',
        color: '#6366F1',
        progressWidth: '33.33%',
        tag: 'Bank-level encrypted document portal with checklist'
      },
      {
        step: 3,
        num: '03',
        title: 'Document Upload',
        badgeColorClass: 'badge-color-3',
        color: '#8B5CF6',
        progressWidth: '50%',
        tag: 'Instant completeness check alerts if any file is missing'
      },
      {
        step: 4,
        num: '04',
        title: 'File Review & Final Quote',
        badgeColorClass: 'badge-color-4',
        color: '#D946EF',
        progressWidth: '66.66%',
        tag: 'Transparent calculation with deduction optimizations'
      },
      {
        step: 5,
        num: '05',
        title: 'Approval & Balance',
        badgeColorClass: 'badge-color-5',
        color: '#EF4444',
        progressWidth: '83.33%',
        tag: '$200 deposit fully credited, pay only upon satisfaction'
      },
      {
        step: 6,
        num: '06',
        title: 'Preparation & E-Filing',
        badgeColorClass: 'badge-color-6',
        color: '#10B981',
        progressWidth: '100%',
        tag: 'Direct IRS & State electronic submission with confirmation'
      }
    ];

    let currentStep = -1;

    function updateActiveStep(stepIndex) {
      if (stepIndex === currentStep) return;
      currentStep = stepIndex;

      const data = stepData[stepIndex];
      if (!data) return;

      // 1. Pop the active numbered circle badge on the left (scale: 0.8 -> 1.15 -> 1.0, duration: 0.4s, ease: back.out(2))
      if (activeBadge) {
        activeBadge.textContent = data.step;
        activeBadge.className = 'qp-step-badge ' + data.badgeColorClass;
        activeBadge.classList.remove('badge-pop');
        void activeBadge.offsetWidth; // Trigger reflow for animation restart
        activeBadge.classList.add('badge-pop');
      }

      // 2. Smoothly fade and drift the step headline and bottom callout text (y: 8px to 0, opacity: 0 to 1, duration: 0.25s)
      if (phaseLabel) {
        phaseLabel.textContent = `STEP ${data.num} OF 06`;
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(phaseLabel,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }
          );
        }
      }

      if (phaseTitle) {
        phaseTitle.textContent = data.title;
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(phaseTitle,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }
          );
        }
      }

      if (highlightTagText) {
        highlightTagText.textContent = data.tag;
        const tagContainer = qpWorkflowSection.querySelector('#qpStepHighlightTag');
        if (tagContainer && typeof gsap !== 'undefined') {
          gsap.fromTo(tagContainer,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }
          );
        }
      }

      // 3. Animate connected gradient progress line smoothly advancing (duration: 0.35s, ease: power2.out)
      if (progressLine) {
        if (typeof gsap !== 'undefined') {
          gsap.to(progressLine, {
            width: data.progressWidth,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          progressLine.style.width = data.progressWidth;
        }
      }

      // Step Nodes: Color-activate completed and active nodes, leaving future steps in light gray (#CBD5E1)
      progressNodes.forEach((node, idx) => {
        if (idx <= stepIndex) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });

      // 4. Right-Side Focus & Dimming Effect: active card full opacity 1, siblings dimmed to 0.35
      editorialCards.forEach((card, idx) => {
        if (idx === stepIndex) {
          card.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { opacity: 1, scale: 1.02, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
        } else {
          card.classList.remove('active');
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { opacity: 0.35, scale: 1.0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
        }
      });
    }

    // Continuous real-time viewport focus synchronization
    function syncActiveStepByScroll() {
      if (window.innerWidth < 768) return;

      const viewportFocus = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      editorialCards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        // Calculate distance between center of card and viewport focus line
        const cardCenter = rect.top + rect.height * 0.4;
        const distance = Math.abs(cardCenter - viewportFocus);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      updateActiveStep(closestIdx);
    }

    // Default Starting State (Initial Load): Reset to Step 1 of 6
    updateActiveStep(0);

    // Click on progress nodes (1, 2, 3, 4, 5, 6) to smoothly scroll up/down directly to that step
    progressNodes.forEach((node, index) => {
      node.style.cursor = 'pointer';
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', `Scroll to step ${index + 1}`);

      node.addEventListener('click', (e) => {
        e.preventDefault();
        const targetCard = editorialCards[index];
        if (targetCard) {
          updateActiveStep(index);
          const headerOffset = 140;
          const cardRect = targetCard.getBoundingClientRect();
          const targetPosition = window.pageYOffset + cardRect.top - headerOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Click on the active badge to jump to next step
    if (activeBadge) {
      activeBadge.style.cursor = 'pointer';
      activeBadge.setAttribute('title', 'Click to advance step');
      activeBadge.addEventListener('click', () => {
        const nextIndex = (currentStep + 1) % stepData.length;
        const targetCard = editorialCards[nextIndex];
        if (targetCard) {
          updateActiveStep(nextIndex);
          const headerOffset = 140;
          const cardRect = targetCard.getBoundingClientRect();
          const targetPosition = window.pageYOffset + cardRect.top - headerOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }

    // ScrollTrigger real-time scrub & window scroll bindings
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: qpWorkflowSection,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => syncActiveStepByScroll()
      });
    }

    window.addEventListener('scroll', () => {
      syncActiveStepByScroll();
    }, { passive: true });

    window.addEventListener('resize', () => {
      syncActiveStepByScroll();
    }, { passive: true });

    // Initial check after load
    setTimeout(() => {
      syncActiveStepByScroll();
    }, 100);
  }

  // 44. Active QR Code Scanner Laser Animation Loop
  const qrLines = document.querySelectorAll('.qr-scanner-line, .qr-scan-line');
  qrLines.forEach((line) => {
    if (typeof gsap !== 'undefined') {
      const box = line.closest('.qr-code-box, .wa-qr-box');
      const boxHeight = box ? box.offsetHeight || 198 : 198;
      const targetY = Math.max(boxHeight - 6, 170);

      gsap.fromTo(line,
        { top: 0, y: 0 },
        {
          y: targetY,
          duration: 2.2,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true
        }
      );
    }
  });
});

/* ==========================================================================
   45. Privacy Policy Cinematic Hero, Parallax, Section Cascades & Links
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const privacyHero = document.querySelector('.privacy-hero');
  if (!privacyHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = privacyHero.querySelector('.privacy-hero-bg');
  const heroOverlay = privacyHero.querySelector('.privacy-hero-overlay');
  const heroTitle = privacyHero.querySelector('.privacy-hero-title');
  const heroMeta = privacyHero.querySelector('.privacy-hero-meta');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: privacyHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline & Meta Subtext Mask Reveal
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // 4. Legal Section Titles & Divider Rule Cascade
  const policySections = document.querySelectorAll('.policy-section');
  if (policySections.length > 0 && typeof ScrollTrigger !== 'undefined') {
    policySections.forEach((section) => {
      const heading = section.querySelector('h2');
      const divider = section.querySelector('.policy-divider');
      const bodyItems = section.querySelectorAll('p, ul, h3');

      // Prepare initial states
      if (heading) gsap.set(heading, { y: 15, opacity: 0 });
      if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left' });
      if (bodyItems.length > 0) gsap.set(bodyItems, { y: 10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (heading) {
        tl.to(heading, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 0);
      }

      if (divider) {
        tl.to(divider, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0);
      }

      if (bodyItems.length > 0) {
        tl.to(bodyItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out'
        }, heading ? 0.12 : 0);
      }
    });
  }
});

/* ==========================================================================
   46. Terms and Conditions Hero, Parallax, Intro Card & Section Cascades
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const termsHero = document.querySelector('.terms-hero');
  if (!termsHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = termsHero.querySelector('.terms-hero-bg');
  const heroOverlay = termsHero.querySelector('.terms-hero-overlay');
  const heroTitle = termsHero.querySelector('.terms-hero-title');
  const heroMeta = termsHero.querySelector('.terms-hero-meta');
  const introCard = document.querySelector('.intro-agreement-card');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: termsHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline Reveal: y: 100% -> 0%, opacity: 0 -> 1 (duration: 0.75s, cubic-bezier)
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // Introductory Agreement Card Entrance: y: 25px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s, ease: power2.out
  if (introCard) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }
  }

  // 4. Legal Section Titles & Divider Rule Cascade
  const termsSections = document.querySelectorAll('.terms-section');
  if (termsSections.length > 0 && typeof ScrollTrigger !== 'undefined') {
    termsSections.forEach((section) => {
      const heading = section.querySelector('h2');
      const divider = section.querySelector('.terms-divider');
      const bodyItems = section.querySelectorAll('p, ul');

      // Prepare initial states
      if (heading) gsap.set(heading, { y: 15, opacity: 0 });
      if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left' });
      if (bodyItems.length > 0) gsap.set(bodyItems, { y: 10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (heading) {
        tl.to(heading, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 0);
      }

      if (divider) {
        tl.to(divider, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0);
      }

      if (bodyItems.length > 0) {
        tl.to(bodyItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out'
        }, heading ? 0.12 : 0);
      }
    });
  }
});

/* ==========================================================================
   47. Payment Policy Hero, Parallax, Preamble Card & Section Cascades
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const paymentHero = document.querySelector('.payment-hero');
  if (!paymentHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = paymentHero.querySelector('.payment-hero-bg');
  const heroOverlay = paymentHero.querySelector('.payment-hero-overlay');
  const heroTitle = paymentHero.querySelector('.payment-hero-title');
  const heroMeta = paymentHero.querySelector('.payment-hero-meta');
  const introCard = document.querySelector('.intro-preamble-card');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: paymentHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline Reveal: y: 100% -> 0%, opacity: 0 -> 1 (duration: 0.75s, cubic-bezier)
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // Introductory Preamble Card Entrance: y: 25px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s, ease: power2.out
  if (introCard) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }
  }

  // 4. Payment Policy Section Titles & Divider Rule Cascade
  const paymentSections = document.querySelectorAll('.payment-section');
  if (paymentSections.length > 0 && typeof ScrollTrigger !== 'undefined') {
    paymentSections.forEach((section) => {
      const heading = section.querySelector('h2');
      const divider = section.querySelector('.payment-divider');
      const bodyItems = section.querySelectorAll('p, ul');

      // Prepare initial states
      if (heading) gsap.set(heading, { y: 15, opacity: 0 });
      if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left' });
      if (bodyItems.length > 0) gsap.set(bodyItems, { y: 10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (heading) {
        tl.to(heading, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 0);
      }

      if (divider) {
        tl.to(divider, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0);
      }

      if (bodyItems.length > 0) {
        tl.to(bodyItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out'
        }, heading ? 0.12 : 0);
      }
    });
  }
});

/* ==========================================================================
   48. Information Security Policy Hero, Parallax, Statement Card & Section Cascades
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const securityHero = document.querySelector('.security-hero');
  if (!securityHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = securityHero.querySelector('.security-hero-bg');
  const heroOverlay = securityHero.querySelector('.security-hero-overlay');
  const heroTitle = securityHero.querySelector('.security-hero-title');
  const heroMeta = securityHero.querySelector('.security-hero-meta');
  const introCard = document.querySelector('.intro-statement-card');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: securityHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline Reveal: y: 100% -> 0%, opacity: 0 -> 1 (duration: 0.75s, cubic-bezier)
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // Introductory Statement Card Entrance: y: 25px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s, ease: power2.out
  if (introCard) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }
  }

  // 4. Numbered Security Policy Section Titles & Divider Rule Cascade
  const securitySections = document.querySelectorAll('.security-section');
  if (securitySections.length > 0 && typeof ScrollTrigger !== 'undefined') {
    securitySections.forEach((section) => {
      const heading = section.querySelector('h2');
      const divider = section.querySelector('.security-divider');
      const bodyItems = section.querySelectorAll('p, ul');

      // Prepare initial states
      if (heading) gsap.set(heading, { y: 15, opacity: 0 });
      if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left' });
      if (bodyItems.length > 0) gsap.set(bodyItems, { y: 10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (heading) {
        tl.to(heading, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 0);
      }

      if (divider) {
        tl.to(divider, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0);
      }

      if (bodyItems.length > 0) {
        tl.to(bodyItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out'
        }, heading ? 0.12 : 0);
      }
    });
  }
});

/* ==========================================================================
   49. Disclaimer Hero, Parallax, Intro Card & Section Cascades
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const disclaimerHero = document.querySelector('.disclaimer-hero');
  if (!disclaimerHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = disclaimerHero.querySelector('.disclaimer-hero-bg');
  const heroOverlay = disclaimerHero.querySelector('.disclaimer-hero-overlay');
  const heroTitle = disclaimerHero.querySelector('.disclaimer-hero-title');
  const heroMeta = disclaimerHero.querySelector('.disclaimer-hero-meta');
  const introCard = document.querySelector('.intro-disclaimer-card');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: disclaimerHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline Reveal: y: 100% -> 0%, opacity: 0 -> 1 (duration: 0.75s, cubic-bezier)
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // Introductory Disclaimer Card Entrance: y: 25px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s, ease: power2.out
  if (introCard) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }
  }

  // 4. Disclaimer Document Card & Items Cascade
  const disclaimerContainer = document.querySelector('.disclaimer-card-container');
  if (disclaimerContainer && typeof ScrollTrigger !== 'undefined') {
    const lead = disclaimerContainer.querySelector('.disclaimer-lead');
    const dividers = disclaimerContainer.querySelectorAll('.disclaimer-divider');
    const listItems = disclaimerContainer.querySelectorAll('.disclaimer-list li');
    const contactText = disclaimerContainer.querySelector('.disclaimer-contact-text');

    if (lead) gsap.set(lead, { y: 20, opacity: 0 });
    if (dividers.length > 0) gsap.set(dividers, { scaleX: 0, transformOrigin: 'left' });
    if (listItems.length > 0) gsap.set(listItems, { y: 15, opacity: 0 });
    if (contactText) gsap.set(contactText, { y: 15, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: disclaimerContainer,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    if (lead) {
      tl.to(lead, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, 0);
    }

    if (dividers.length > 0) {
      tl.to(dividers, {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.inOut'
      }, 0.1);
    }

    if (listItems.length > 0) {
      tl.to(listItems, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.2);
    }

    if (contactText) {
      tl.to(contactText, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.4);
    }
  }
});

/* ==========================================================================
   50. Service Expectations Hero, Parallax, Intro Card & Section Cascades
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const expectationsHero = document.querySelector('.expectations-hero');
  if (!expectationsHero || typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const heroBg = expectationsHero.querySelector('.expectations-hero-bg');
  const heroOverlay = expectationsHero.querySelector('.expectations-hero-overlay');
  const heroTitle = expectationsHero.querySelector('.expectations-hero-title');
  const heroMeta = expectationsHero.querySelector('.expectations-hero-meta');
  const introCard = document.querySelector('.intro-expectations-card');

  // 1. Scale & Overlay Entrance: scale: 1.08 -> 1.0, overlay: 0.65 -> 1.0 (duration: 1.2s, ease: power3.out)
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  if (heroOverlay) {
    gsap.fromTo(heroOverlay,
      { opacity: 0.65 },
      { opacity: 1.0, duration: 1.2, ease: 'power3.out' }
    );
  }

  // 2. Scroll Parallax: yPercent: 18, scrub: 1
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: expectationsHero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 3. Hero Headline Reveal: y: 100% -> 0%, opacity: 0 -> 1 (duration: 0.75s, cubic-bezier)
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }

  if (heroMeta) {
    gsap.fromTo(heroMeta,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 0.85, duration: 0.5, delay: 0.2, ease: 'power2.out' }
    );
  }

  // Introductory Expectations Card Entrance: y: 25px -> 0, opacity: 0 -> 1, duration: 0.6s, delay: 0.2s, ease: power2.out
  if (introCard) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introCard,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    } else {
      gsap.fromTo(introCard,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );
    }
  }

  // 4. Section Titles & Divider Rule Cascade
  const expectationsSections = document.querySelectorAll('.expectations-section');
  if (expectationsSections.length > 0 && typeof ScrollTrigger !== 'undefined') {
    expectationsSections.forEach((section) => {
      const heading = section.querySelector('h2');
      const divider = section.querySelector('.expectations-divider');
      const bodyItems = section.querySelectorAll('p, ul');

      // Prepare initial states
      if (heading) gsap.set(heading, { y: 15, opacity: 0 });
      if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: 'left' });
      if (bodyItems.length > 0) gsap.set(bodyItems, { y: 10, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (heading) {
        tl.to(heading, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, 0);
      }

      if (divider) {
        tl.to(divider, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0);
      }

      if (bodyItems.length > 0) {
        tl.to(bodyItems, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out'
        }, heading ? 0.12 : 0);
      }
    });
  }
});

/* ==========================================================================
   51. Scroll-Driven Rising Sheet / Curtain Overlap Transition (GSAP ScrollTrigger)
   Applies to: payroll-services, bookkeeping-services, business-formation,
               contact, faqs — pages using .sheet-hero-anchor + .content-sheet
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ── Target only pages that opted in with .sheet-hero-anchor ──────────────
  if (typeof ScrollTrigger.clearScrollMemory === 'function') {
    ScrollTrigger.clearScrollMemory('manual');
  }
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const heroSection = document.querySelector('.sheet-hero-anchor');
  const contentSheet = document.querySelector('.content-sheet');

  if (!heroSection || !contentSheet) return; // Gracefully exit on non-target pages

  // Resolve animatable child targets inside the hero
  const heroBg  = heroSection.querySelector(
    '.hero-bg-video, .payroll-hero-bg-img, .bookkeeping-hero-bg-img, ' +
    '.contact-hero-bg-img, .faq-hero-bg-img, img'
  );
  const heroInner = heroSection.querySelector('.qp-hero-text, .faq-hero-content, .container');
  const heroBtn   = heroSection.querySelector(
    '.btn-primary, .payroll-hero-cta-btn, .bookkeeping-hero-cta-btn, ' +
    '.biz-hero-cta-btn, .faq-hero-cta-btn, [class*="hero-cta"]'
  );

  // ─── 1. Pin the hero while the sheet rises ───────────────────────────────
  //   pinSpacing: false prevents a layout gap after the pinned element.
  ScrollTrigger.create({
    trigger: heroSection,
    start:   'top top',
    end:     '+=60%',
    pin:     true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true
  });

  // ─── 2. White sheet slides upward: yPercent 20 → 0 (scrub, bi-directional) ─
  //   immediateRender: false ensures the FROM state isn't applied at page load
  gsap.fromTo(contentSheet,
    { yPercent: 20 },
    {
      yPercent: 0,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: heroSection,
        start:   'top top',
        end:     '+=60%',
        scrub:   1,
        invalidateOnRefresh: true
      }
    }
  );

  // ─── 3. Hero background recedes (scale + opacity + parallax lift) ─────────
  if (heroBg) {
    gsap.fromTo(heroBg,
      { scale: 1.0, opacity: 1.0, yPercent: 0 },
      {
        scale:    0.93,
        opacity:  0.45,
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start:   'top top',
          end:     '+=60%',
          scrub:   1,
          invalidateOnRefresh: true
        }
      }
    );
  }

  // ─── 4. Hero CTA button recedes in sync with background ──────────────────
  if (heroBtn) {
    gsap.fromTo(heroBtn,
      { scale: 1.0, opacity: 1.0 },
      {
        scale:   0.93,
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start:   'top top',
          end:     '+=60%',
          scrub:   1,
          invalidateOnRefresh: true
        }
      }
    );
  }

  // ─── 5. Hero inner text fades & lifts back as sheet arrives ─────────────
  if (heroInner) {
    gsap.fromTo(heroInner,
      { y: 0, opacity: 1 },
      {
        y:       -40,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start:   'top top',
          end:     '+=60%',
          scrub:   1,
          invalidateOnRefresh: true
        }
      }
    );
  }

  // ─── 6. Staggered card entrance once the sheet clears the viewport edge ──
  const entryCards = contentSheet.querySelectorAll(
    '.payroll-step-card, .faq-group-block, ' +
    '.contact-node-item, .get-in-touch-split > *, ' +
    '.testimonial-card, .qp-step-card, .qp-step-item'
  );
  if (entryCards.length > 0) {
    gsap.fromTo(entryCards,
      { y: 36, opacity: 0, immediateRender: false },
      {
        y:               0,
        opacity:         1,
        duration:        0.65,
        stagger:         0.07,
        ease:            'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger:       contentSheet,
          start:         'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }
});



