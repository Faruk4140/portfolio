/**
 * ============================================================================
 * FARUK SAYYAD - PORTFOLIO CORE SCRIPTS
 * Navigation, Modal Management, Resume Verification, Form Validation & Accessibility
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility (Global helper)
  // --------------------------------------------------------------------------
  window.showToast = function (message, type = 'info', duration = 4200) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 2. DOM Ready Setup
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    
    // --- Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // --- Header Scrolled State ---
    const header = document.getElementById('header');
    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (mobileToggle && primaryNav) {
      mobileToggle.addEventListener('click', function () {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('nav-open');
      });

      // Close mobile menu when a nav link is clicked
      const navLinks = primaryNav.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function () {
          if (primaryNav.classList.contains('nav-open')) {
            primaryNav.classList.remove('nav-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    // --- Active Navigation Link on Scroll (IntersectionObserver) ---
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.primary-nav .nav-link');

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(sec => sectionObserver.observe(sec));
    }

    // --- Copy Email to Clipboard ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', function () {
        const email = 'faruksayyad451@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email)
            .then(() => {
              window.showToast('Email address copied to clipboard: ' + email, 'success');
            })
            .catch(() => {
              fallbackCopyText(email);
            });
        } else {
          fallbackCopyText(email);
        }
      });
    }

    function fallbackCopyText(text) {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        window.showToast('Email address copied to clipboard: ' + text, 'success');
      } catch (e) {
        window.showToast('Unable to copy automatically. Email: ' + text, 'info');
      }
      document.body.removeChild(tempInput);
    }

    // ------------------------------------------------------------------------
    // 3. Resume Download Notification
    // ------------------------------------------------------------------------
    const resumeButtons = document.querySelectorAll('.resume-action-btn');
    resumeButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        window.showToast('Downloading Faruk Sayyad Resume (PDF)...', 'success');
      });
    });

    // ------------------------------------------------------------------------
    // 3b. Evidra Hackathon Project Configuration & Action Handler
    // Faruk Sayyad: Paste your Hackathon Certificate, Live Demo, or GitHub URLs below.
    // Leaving a URL empty ("") will show an informative, recruiter-friendly toast notice.
    // ------------------------------------------------------------------------
    const EVIDRA_CONFIG = {
      title: 'Evidra – The Placement Hub',
      category: 'Hackathon Project | Placement & Career Technology',
      type: 'Web Application / Placement Platform',
      role: 'Hackathon Participant / Project Contributor',
      // 1. Certificate URL: (e.g. 'assets/Evidra_Certificate.pdf' or verified certificate link)
      certificateUrl: '',
      // 2. Live Demo URL: (e.g. 'https://evidra-placement-hub.vercel.app' or model demo link)
      liveDemoUrl: '',
      // 3. Optional secondary Model URL
      modelUrl: '',
      // 4. GitHub Repository URL: (e.g. 'https://github.com/Faruk4040/Evidra-Placement-Hub')
      githubUrl: '',
      // User-friendly feedback messages
      messages: {
        certificatePending: 'Evidra Hackathon Certificate link will be updated upon official issuance. Check back soon!',
        demoPending: 'Evidra Live Demo / Model link will be added once deployment is live. Stay tuned!',
        codePending: 'Evidra GitHub repository is being prepared for public release. Repository link coming soon!'
      }
    };
    window.EVIDRA_CONFIG = EVIDRA_CONFIG;

    function handleEvidraAction(actionType) {
      if (actionType === 'certificate') {
        const url = (EVIDRA_CONFIG.certificateUrl || '').trim();
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.showToast(EVIDRA_CONFIG.messages.certificatePending, 'info');
        }
      } else if (actionType === 'demo' || actionType === 'model') {
        const url = (EVIDRA_CONFIG.liveDemoUrl || EVIDRA_CONFIG.modelUrl || '').trim();
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.showToast(EVIDRA_CONFIG.messages.demoPending, 'info');
        }
      } else if (actionType === 'code' || actionType === 'github') {
        const url = (EVIDRA_CONFIG.githubUrl || '').trim();
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.showToast(EVIDRA_CONFIG.messages.codePending, 'info');
        }
      }
    }

    // ------------------------------------------------------------------------
    // 4. Project Details Modal Logic
    // ------------------------------------------------------------------------
    const projectModal = document.getElementById('project-modal');
    const projectModalClose = document.getElementById('project-modal-close');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalIcon = document.getElementById('project-modal-icon');
    const projectModalBody = document.getElementById('project-modal-body');

    const PROJECT_DETAILS = {
      evidra: {
        title: 'Evidra – The Placement Hub · Hackathon Case Study',
        icon: '🎓',
        content: `
          <div class="modal-project-content">
            <div class="case-study-hero">
              <span class="case-study-badge" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#fbbf24;">Hackathon Project · Placement &amp; Career Technology</span>
              <p class="modal-lead-text">
                A centralized placement operations and career readiness platform engineered during a hackathon to unify campus recruitment workflows, automate student eligibility verification, and structure interview preparation tracking.
              </p>
            </div>

            <div class="case-study-grid">
              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">01</span>
                  <h4 class="case-study-heading">Problem Statement</h4>
                </div>
                <p>
                  During campus recruitment cycles, critical company announcements, eligibility criteria (CGPA cutoffs, department restrictions, active backlogs), test schedules, and preparation materials are scattered across disparate noticeboards, spreadsheets, and group chats. Students frequently miss application windows or experience uncertainty regarding their eligibility status.
                </p>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">02</span>
                  <h4 class="case-study-heading">Project Overview &amp; Architecture</h4>
                </div>
                <p>
                  Engineered under rapid hackathon prototyping cycles, Evidra delivers a cohesive single-pane platform that consolidates company drives, matches company rules against student profiles, and organizes interview preparation:
                </p>
                <ul class="case-study-list">
                  <li><strong>Drive Management:</strong> Structured repository of recruitment drives with role specifications, CTC packages, and deadlines.</li>
                  <li><strong>Eligibility Engine:</strong> Instant client-side verification evaluating GPA, department, and backlog criteria.</li>
                  <li><strong>Preparation Hub:</strong> Milestone tracking for aptitude tests, core CS fundamentals, and technical interview roadmaps.</li>
                  <li><strong>Client-Side Persistence:</strong> LocalStorage caching ensuring zero-lag access and state preservation without server overhead.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">03</span>
                  <h4 class="case-study-heading">My Contribution &amp; Role</h4>
                </div>
                <p>
                  <strong>Role: Hackathon Participant / Project Contributor</strong>
                </p>
                <ul class="case-study-list">
                  <li>Designed and built the responsive frontend layout using modern CSS Grid and Flexbox.</li>
                  <li>Architected the client-side student eligibility verification logic comparing academic criteria.</li>
                  <li>Engineered the placement drive filtering interface and search mechanism.</li>
                  <li>Implemented browser LocalStorage state management to persist student checklist milestones.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">04</span>
                  <h4 class="case-study-heading">Tools &amp; Technologies</h4>
                </div>
                <div class="case-study-tech-tags">
                  <span class="tech-pill">HTML5 Semantic Elements</span>
                  <span class="tech-pill">CSS3 &amp; CSS Variables</span>
                  <span class="tech-pill">Vanilla JavaScript (ES6+)</span>
                  <span class="tech-pill">Web Storage API (LocalStorage)</span>
                  <span class="tech-pill">Responsive UI/UX</span>
                  <span class="tech-pill">Git &amp; GitHub</span>
                </div>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">05</span>
                  <h4 class="case-study-heading">Key Implemented Features</h4>
                </div>
                <ul class="case-study-list">
                  <li><strong>Dynamic Drive Feed:</strong> Categorized schedule of campus drives with real-time countdowns.</li>
                  <li><strong>Eligibility Checking:</strong> Real-time match scoring indicating whether a student qualifies for specific drives.</li>
                  <li><strong>Readiness Checklist:</strong> Trackable study checklists for aptitude, coding DSA, and system interviews.</li>
                  <li><strong>Fast Client Search:</strong> Instant keyword filtering across companies, role categories, and status tags.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">06</span>
                  <h4 class="case-study-heading">Hackathon Learnings &amp; Outcomes</h4>
                </div>
                <p>
                  Strengthened rapid prototyping speed, team collaboration under deadline pressure, user-centric problem modeling for campus peers, and dependable client-side state handling without backend dependencies.
                </p>
              </div>

              <div class="case-study-card full-width-card" style="border:1px solid rgba(245,158,11,0.3); background:rgba(245,158,11,0.06);">
                <div class="case-study-header">
                  <span class="case-study-step-num" style="background:rgba(245,158,11,0.2); border-color:#fbbf24; color:#fbbf24;">07</span>
                  <h4 class="case-study-heading" style="color:#fbbf24;">Project Action Links &amp; Verification</h4>
                </div>
                <p style="margin-bottom:12px; font-size:0.875rem; color:var(--text-secondary);">
                  Access the hackathon project resources below. All links are centrally managed via the verified project configuration:
                </p>
                <div class="case-study-actions-group" style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
                  <button type="button" class="btn btn-sm btn-primary" id="evidra-modal-demo-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    <span>Live Demo / Open Model</span>
                  </button>

                  <button type="button" class="btn btn-sm btn-outline evidra-action-cert" id="evidra-modal-cert-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15" aria-hidden="true">
                      <circle cx="12" cy="8" r="6"/>
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                    <span>View Hackathon Certificate</span>
                  </button>

                  <button type="button" class="btn btn-sm btn-outline" id="evidra-modal-code-btn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>View Source Code</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="modal-actions-between" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <span style="font-size:0.8125rem; color:var(--text-muted);">
                Status: Completed Hackathon Project · Contributor
              </span>

              <div class="modal-actions-right">
                <button type="button" class="btn btn-ghost" id="project-modal-inner-close">Close Case Study</button>
              </div>
            </div>
          </div>
        `
      },
      analytics: {
        title: 'Retail Sales & Performance Analytics Engine - Case Study',
        icon: '📊',
        content: `
          <div class="modal-project-content">
            <div class="case-study-hero">
              <span class="case-study-badge">Data Analytics &amp; Visualization</span>
              <p class="modal-lead-text">
                An interactive client-side analytical dashboard and KPI evaluation engine built to process commercial transaction records, compute financial metrics, and dynamically update Chart.js visualizations with custom CSV dataset ingestion.
              </p>
            </div>

            <div class="case-study-grid">
              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">01</span>
                  <h4 class="case-study-heading">Problem Statement</h4>
                </div>
                <p>
                  Business stakeholders frequently struggle to synthesize multi-dimensional retail records into actionable operational decisions. Static spreadsheets lack immediate responsiveness, making it difficult to detect seasonal revenue swings, regional sales discrepancies, or underperforming product categories.
                </p>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">02</span>
                  <h4 class="case-study-heading">Solution &amp; Architecture</h4>
                </div>
                <p>
                  Engineered an end-to-end client-side data analytics pipeline with zero external server dependencies:
                </p>
                <ul class="case-study-list">
                  <li><strong>Data Layer:</strong> Multi-dimensional array structures with automated date parsing and numerical sanitization.</li>
                  <li><strong>Aggregation Engine:</strong> Dynamic grouping algorithms calculating Gross Sales, Net Profit, Profit Margins, and Units Sold per territory/category.</li>
                  <li><strong>Visualization Layer:</strong> Interactive dual-axis Chart.js trend charts, categorical profit bars, and regional distribution doughnuts.</li>
                  <li><strong>Dynamic CSV Ingestion:</strong> RFC-4180 compliant client-side CSV parser with automatic column mapping and validation.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">03</span>
                  <h4 class="case-study-heading">Tools &amp; Technologies</h4>
                </div>
                <div class="case-study-tech-tags">
                  <span class="tech-pill">Python (Data Modeling Concepts)</span>
                  <span class="tech-pill">SQL Logic (Aggregation &amp; Filtering)</span>
                  <span class="tech-pill">Chart.js 4.4</span>
                  <span class="tech-pill">Vanilla JavaScript (ES6+)</span>
                  <span class="tech-pill">HTML5 &amp; CSS3 Variables</span>
                  <span class="tech-pill">Client-Side CSV Parsing</span>
                </div>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">04</span>
                  <h4 class="case-study-heading">Key Implemented Features</h4>
                </div>
                <ul class="case-study-list">
                  <li><strong>Instant KPI Recalculation:</strong> Filters dynamically recompute top-line revenue, net profit margin (%), and volume across all records.</li>
                  <li><strong>Custom CSV Dataset Upload:</strong> Drag &amp; drop any valid CSV dataset to recalculate real-time metrics and charts immediately.</li>
                  <li><strong>Responsive Visualizations:</strong> Fully adaptive charts with custom currency tooltips, accessible legends, and theme adaptation.</li>
                  <li><strong>Zero-Dependency Execution:</strong> Runs 100% in browser memory with guaranteed data privacy and low latency.</li>
                </ul>
              </div>

              <div class="case-study-card full-width-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">05</span>
                  <h4 class="case-study-heading">Verified Outcomes &amp; Technical Learnings</h4>
                </div>
                <p>
                  Demonstrates applied competency in practical exploratory data analysis (EDA), business logic aggregation, dynamic DOM/Canvas coordination, and user experience design for analytical applications.
                </p>
              </div>
            </div>

            <div class="modal-actions-between" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <a href="#analytics" class="btn btn-primary" id="case-study-try-btn">
                <span>Try Live Dashboard Engine</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </a>

              <div class="modal-actions-right">
                <a href="https://github.com/Faruk4040" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                  <span>GitHub Profile</span>
                </a>
                <button type="button" class="btn btn-ghost" id="project-modal-inner-close">Close Case Study</button>
              </div>
            </div>
          </div>
        `
      },
      smartexpense: {
        title: 'SmartExpense Manager - Case Study',
        icon: '💳',
        content: `
          <div class="modal-project-content">
            <div class="case-study-hero">
              <span class="case-study-badge">Web Application &amp; Personal Finance</span>
              <p class="modal-lead-text">
                A lightweight, responsive expense tracking and budget management web application engineered to give individuals clear visibility over recurring expenditures and balance allocations.
              </p>
            </div>

            <div class="case-study-grid">
              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">01</span>
                  <h4 class="case-study-heading">Problem Statement</h4>
                </div>
                <p>
                  Managing personal finances across multiple everyday categories often leads to spending leakage when tracking tools are cumbersome, slow to load, or overly complex for simple everyday entries.
                </p>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">02</span>
                  <h4 class="case-study-heading">Solution &amp; Architecture</h4>
                </div>
                <p>
                  Built a client-side single-page budgeting application using semantic HTML5, modern CSS3 Flexbox/Grid, and modular JavaScript:
                </p>
                <ul class="case-study-list">
                  <li><strong>State Management:</strong> In-memory array of transaction objects with unique IDs and category mappings.</li>
                  <li><strong>DOM Sync Engine:</strong> Efficient DOM node insertion and deletion without unnecessary layout thrashing.</li>
                  <li><strong>Calculation Engine:</strong> Real-time ledger tallying income, expenses, and net balance on each state mutation.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">03</span>
                  <h4 class="case-study-heading">Tools &amp; Technologies</h4>
                </div>
                <div class="case-study-tech-tags">
                  <span class="tech-pill">HTML5 (Semantic Markup)</span>
                  <span class="tech-pill">CSS3 (Custom Properties &amp; Flexbox)</span>
                  <span class="tech-pill">JavaScript ES6+</span>
                  <span class="tech-pill">DOM Manipulation</span>
                  <span class="tech-pill">Responsive Design</span>
                </div>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">04</span>
                  <h4 class="case-study-heading">Key Implemented Features</h4>
                </div>
                <ul class="case-study-list">
                  <li><strong>Categorized Ledger:</strong> Classifies items into Utilities, Groceries, Travel, Education, and Leisure.</li>
                  <li><strong>Instant Summaries:</strong> Automatic balance re-calculations upon adding or removing transactions.</li>
                  <li><strong>Input Form Validation:</strong> Sanitizes numerical amounts and mandates descriptive labels.</li>
                  <li><strong>Mobile-Optimized Layout:</strong> Designed for one-handed thumb interaction on mobile devices.</li>
                </ul>
              </div>

              <div class="case-study-card full-width-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">05</span>
                  <h4 class="case-study-heading">Verified Outcomes &amp; Technical Learnings</h4>
                </div>
                <p>
                  Strengthened hands-on proficiency with event delegation, JavaScript array methods (reduce, filter, map), resilient user input verification, and clean responsive CSS architectures.
                </p>
              </div>
            </div>

            <div class="modal-actions-between" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <a href="https://github.com/Faruk4040" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <span>View GitHub Profile</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </a>

              <div class="modal-actions-right">
                <button type="button" class="btn btn-outline" id="project-modal-inner-close">Close Case Study</button>
              </div>
            </div>
          </div>
        `
      },
      myntra: {
        title: 'Myntra Clone - Case Study',
        icon: '🛍️',
        content: `
          <div class="modal-project-content">
            <div class="case-study-hero">
              <span class="case-study-badge">Frontend Web Architecture</span>
              <p class="modal-lead-text">
                A responsive e-commerce web application inspired by the UI/UX architecture of major fashion shopping platforms, developed using pure HTML, CSS, and JavaScript.
              </p>
            </div>

            <div class="case-study-grid">
              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">01</span>
                  <h4 class="case-study-heading">Problem Statement</h4>
                </div>
                <p>
                  Commercial e-commerce interfaces require intricate visual hierarchy, multi-tiered navigation bars, card consistency, and seamless viewport adaptation without degrading performance or layout alignment.
                </p>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">02</span>
                  <h4 class="case-study-heading">Solution &amp; Architecture</h4>
                </div>
                <p>
                  Constructed a modular frontend architecture replicating the core layout principles of retail platforms:
                </p>
                <ul class="case-study-list">
                  <li><strong>Header &amp; Navigation:</strong> Multi-tiered category bar with search and action icons.</li>
                  <li><strong>Card Architecture:</strong> Component-like product card modules with price tags, badges, and discount labels.</li>
                  <li><strong>Media Queries:</strong> Breakpoints tailored for desktop widescreen, standard tablet, and mobile smartphones.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">03</span>
                  <h4 class="case-study-heading">Tools &amp; Technologies</h4>
                </div>
                <div class="case-study-tech-tags">
                  <span class="tech-pill">HTML5</span>
                  <span class="tech-pill">CSS3 (Grid &amp; Flexbox)</span>
                  <span class="tech-pill">JavaScript ES6</span>
                  <span class="tech-pill">Responsive Web Design</span>
                </div>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">04</span>
                  <h4 class="case-study-heading">Key Implemented Features</h4>
                </div>
                <ul class="case-study-list">
                  <li><strong>Responsive Product Showcase:</strong> Fluid catalog grid that scales seamlessly across all devices.</li>
                  <li><strong>Interactive Navigation:</strong> Drawer menu for mobile screens and sticky desktop category navigation.</li>
                  <li><strong>Consistent Card Layouts:</strong> Uniform aspect ratios and responsive typography.</li>
                </ul>
              </div>

              <div class="case-study-card full-width-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">05</span>
                  <h4 class="case-study-heading">Verified Outcomes &amp; Disclaimer</h4>
                </div>
                <p>
                  Cultivated deep practical experience in e-commerce UI patterns, responsive grid systems, and clean CSS component design.
                </p>
                <p style="font-size:0.8125rem; color:#94a3b8; font-style:italic; margin-top:8px;">
                  * Educational project inspired by Myntra UI. Not affiliated with or endorsed by Myntra Designs Pvt. Ltd.
                </p>
              </div>
            </div>

            <div class="modal-actions-between" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <a href="https://github.com/Faruk4040/Myntra-Clone" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <span>View GitHub Repository</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
              </a>

              <div class="modal-actions-right">
                <button type="button" class="btn btn-outline" id="project-modal-inner-close">Close Case Study</button>
              </div>
            </div>
          </div>
        `
      },
      studentmanagement: {
        title: 'Student Academic & Performance Management System',
        icon: '💻',
        content: `
          <div class="modal-project-content">
            <div class="case-study-hero">
              <span class="case-study-badge">Object-Oriented Programming &amp; DSA</span>
              <p class="modal-lead-text">
                A structured academic data and performance tracking system engineered in Java and C++ during B.Tech coursework to organize student profiles, calculate cumulative GPAs (CGPA/SGPA), perform algorithmic search/sorting, and maintain file records.
              </p>
            </div>

            <div class="case-study-grid">
              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">01</span>
                  <h4 class="case-study-heading">Problem Statement</h4>
                </div>
                <p>
                  Institutional record keeping requires strict integrity guarantees: ensuring student grades conform to university grading scales, grade point averages (CGPA/SGPA) are computed accurately according to credit weightings, and records survive program termination.
                </p>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">02</span>
                  <h4 class="case-study-heading">Solution &amp; Architecture</h4>
                </div>
                <p>
                  Engineered an object-oriented system following modular design principles:
                </p>
                <ul class="case-study-list">
                  <li><strong>Class Hierarchy:</strong> Separate abstractions for Person, Student, Course, and AcademicTranscript.</li>
                  <li><strong>Data Structures:</strong> Dynamic collections and arrays optimized for quick lookups and sequential file persistence.</li>
                  <li><strong>Algorithmic Operations:</strong> Binary search algorithms on sorted student IDs, rank calculation, and sorting by GPA.</li>
                  <li><strong>File I/O Persistence:</strong> Structured file stream handlers ensuring persistence across program executions.</li>
                </ul>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">03</span>
                  <h4 class="case-study-heading">Tools &amp; Technologies</h4>
                </div>
                <div class="case-study-tech-tags">
                  <span class="tech-pill">Java</span>
                  <span class="tech-pill">C++</span>
                  <span class="tech-pill">Object-Oriented Programming (OOP)</span>
                  <span class="tech-pill">Data Structures &amp; Algorithms (DSA)</span>
                  <span class="tech-pill">File I/O Streams</span>
                  <span class="tech-pill">Defensive Programming</span>
                </div>
              </div>

              <div class="case-study-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">04</span>
                  <h4 class="case-study-heading">Key Implemented Features</h4>
                </div>
                <ul class="case-study-list">
                  <li><strong>Academic GPA Engine:</strong> Automated calculation of weighted course grade points and semester averages.</li>
                  <li><strong>Fast Search &amp; Filter:</strong> Algorithmic retrieval of student records by Roll Number, Name, or Branch.</li>
                  <li><strong>Persistent Storage:</strong> Saves, reads, and updates records into structured disk files with error recovery.</li>
                  <li><strong>Input Verification:</strong> Defensive checks guarding against invalid credit counts, duplicate roll numbers, and out-of-range marks.</li>
                </ul>
              </div>

              <div class="case-study-card full-width-card">
                <div class="case-study-header">
                  <span class="case-study-step-num">05</span>
                  <h4 class="case-study-heading">Verified Outcomes &amp; Coursework Learnings</h4>
                </div>
                <p>
                  Reinforced foundational understanding of OOP paradigms (abstraction, encapsulation, polymorphism), computational complexity analysis (Big-O), memory safety, and dependable file stream operations.
                </p>
              </div>
            </div>

            <div class="modal-actions-between" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
              <a href="https://github.com/Faruk4040" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <span>View GitHub Profile</span>
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </a>

              <div class="modal-actions-right">
                <button type="button" class="btn btn-outline" id="project-modal-inner-close">Close Case Study</button>
              </div>
            </div>
          </div>
        `
      }
    };

    function openProjectModal(projectId) {
      const details = PROJECT_DETAILS[projectId];
      if (!details || !projectModal) return;

      if (projectModalTitle) projectModalTitle.textContent = details.title;
      if (projectModalIcon) projectModalIcon.textContent = details.icon;
      if (projectModalBody) {
        projectModalBody.innerHTML = details.content;
        
        // Attach inner close button handler
        const innerClose = document.getElementById('project-modal-inner-close');
        if (innerClose) innerClose.addEventListener('click', closeProjectModal);

        // Attach try live demo handler if present
        const tryLiveBtn = document.getElementById('case-study-try-btn');
        if (tryLiveBtn) {
          tryLiveBtn.addEventListener('click', () => {
            closeProjectModal();
          });
        }

        // Attach Evidra modal action listeners if present
        const modalCertBtn = document.getElementById('evidra-modal-cert-btn');
        if (modalCertBtn) {
          modalCertBtn.addEventListener('click', () => handleEvidraAction('certificate'));
        }
        const modalDemoBtn = document.getElementById('evidra-modal-demo-btn');
        if (modalDemoBtn) {
          modalDemoBtn.addEventListener('click', () => handleEvidraAction('demo'));
        }
        const modalCodeBtn = document.getElementById('evidra-modal-code-btn');
        if (modalCodeBtn) {
          modalCodeBtn.addEventListener('click', () => handleEvidraAction('code'));
        }
      }

      projectModal.hidden = false;
      projectModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
      if (!projectModal) return;
      projectModal.classList.remove('is-active');
      projectModal.hidden = true;
      document.body.style.overflow = '';
    }

    if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
    if (projectModal) {
      projectModal.addEventListener('click', function (e) {
        if (e.target === projectModal) closeProjectModal();
      });
    }

    // Attach to View Case Study buttons
    const detailButtons = document.querySelectorAll('.view-project-details-btn');
    detailButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const pId = btn.getAttribute('data-project-id');
        openProjectModal(pId);
      });
    });

    // Wire Evidra Card Action Buttons
    const evidraCardCertBtn = document.getElementById('evidra-card-cert-btn');
    if (evidraCardCertBtn) {
      evidraCardCertBtn.addEventListener('click', () => handleEvidraAction('certificate'));
    }
    const evidraCardDemoBtn = document.getElementById('evidra-card-demo-btn');
    if (evidraCardDemoBtn) {
      evidraCardDemoBtn.addEventListener('click', () => handleEvidraAction('demo'));
    }
    const evidraCardCodeBtn = document.getElementById('evidra-card-code-btn');
    if (evidraCardCodeBtn) {
      evidraCardCodeBtn.addEventListener('click', () => handleEvidraAction('code'));
    }

    // ------------------------------------------------------------------------
    // 4b. Recruiter Credentials Snapshot Modal Logic
    // ------------------------------------------------------------------------
    const credentialsModal = document.getElementById('credentials-modal');
    const credentialsModalClose = document.getElementById('credentials-modal-close');
    const credentialsModalInnerClose = document.getElementById('credentials-modal-inner-close');
    const previewResumeBtns = document.querySelectorAll('.preview-resume-btn');

    function openCredentialsModal() {
      if (!credentialsModal) return;
      credentialsModal.hidden = false;
      credentialsModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeCredentialsModal() {
      if (!credentialsModal) return;
      credentialsModal.classList.remove('is-active');
      credentialsModal.hidden = true;
      document.body.style.overflow = '';
    }

    previewResumeBtns.forEach(btn => {
      btn.addEventListener('click', openCredentialsModal);
    });

    if (credentialsModalClose) credentialsModalClose.addEventListener('click', closeCredentialsModal);
    if (credentialsModalInnerClose) credentialsModalInnerClose.addEventListener('click', closeCredentialsModal);
    if (credentialsModal) {
      credentialsModal.addEventListener('click', function (e) {
        if (e.target === credentialsModal) closeCredentialsModal();
      });
    }

    // Global Escape Key Modal Closer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
        closeCredentialsModal();
      }
    });

    // ------------------------------------------------------------------------
    // 4c. Project Category Filter System
    // ------------------------------------------------------------------------
    (function initProjectFilters() {
      const filterBtns = document.querySelectorAll('.project-filter-btn');
      const projectCards = document.querySelectorAll('#projects-grid .project-card');

      if (!filterBtns.length || !projectCards.length) return;

      filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
          const filterValue = btn.getAttribute('data-filter');

          // Update active tab buttons
          filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          // Smoothly filter project cards
          projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              card.style.display = '';
              requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = '';
              });
            } else {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.96)';
              setTimeout(() => {
                if (btn.getAttribute('data-filter') !== 'all' && card.getAttribute('data-category') !== btn.getAttribute('data-filter')) {
                  card.style.display = 'none';
                }
              }, 220);
            }
          });
        });
      });
    })();

    // ------------------------------------------------------------------------
    // 4d. Dark / Light Theme Toggle Engine with Persistent Preference
    // ------------------------------------------------------------------------
    (function initThemeEngine() {
      const themeToggle = document.getElementById('theme-toggle');
      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem('faruk_portfolio_theme');
      } catch (e) {}

      let currentTheme = savedTheme === 'light' ? 'light' : 'dark';

      function applyTheme(theme) {
        currentTheme = theme;
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
          if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            themeToggle.setAttribute('title', 'Switch to dark theme');
            themeToggle.classList.add('is-light');
          }
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
          if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
            themeToggle.setAttribute('title', 'Switch to light theme');
            themeToggle.classList.remove('is-light');
          }
        }

        try {
          localStorage.setItem('faruk_portfolio_theme', theme);
        } catch (e) {}

        // Notify dashboard.js and other components to update chart colors
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
      }

      // Initial apply
      applyTheme(currentTheme);

      if (themeToggle) {
        themeToggle.addEventListener('click', function () {
          const currentDOMTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          const nextTheme = currentDOMTheme === 'light' ? 'dark' : 'light';
          applyTheme(nextTheme);
          window.showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`, 'info', 2200);
        });
      }

      // Respect OS theme changes if user hasn't explicitly set preference
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
          let explicitTheme = null;
          try {
            explicitTheme = localStorage.getItem('faruk_portfolio_theme');
          } catch (err) {}
          if (!explicitTheme) {
            applyTheme(e.matches ? 'light' : 'dark');
          }
        });
      }
    })();

    // ------------------------------------------------------------------------
    // 5. Contact Form Validation & Submission
    // ------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const senderName = document.getElementById('sender-name');
    const senderEmail = document.getElementById('sender-email');
    const senderSubject = document.getElementById('sender-subject');
    const senderMessage = document.getElementById('sender-message');

    function validateEmail(email) {
      // Standard email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(input, isValid) {
      if (isValid) {
        input.classList.remove('is-invalid');
      } else {
        input.classList.add('is-invalid');
      }
      return isValid;
    }

    if (senderName) {
      senderName.addEventListener('blur', () => {
        validateField(senderName, senderName.value.trim().length >= 2);
      });
    }

    if (senderEmail) {
      senderEmail.addEventListener('blur', () => {
        validateField(senderEmail, validateEmail(senderEmail.value.trim()));
      });
    }

    if (senderSubject) {
      senderSubject.addEventListener('blur', () => {
        validateField(senderSubject, senderSubject.value.trim().length >= 4);
      });
    }

    if (senderMessage) {
      senderMessage.addEventListener('blur', () => {
        validateField(senderMessage, senderMessage.value.trim().length >= 10);
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isNameValid = validateField(senderName, senderName && senderName.value.trim().length >= 2);
        const isEmailValid = validateField(senderEmail, senderEmail && validateEmail(senderEmail.value.trim()));
        const isSubjectValid = validateField(senderSubject, senderSubject && senderSubject.value.trim().length >= 4);
        const isMessageValid = validateField(senderMessage, senderMessage && senderMessage.value.trim().length >= 10);

        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
          window.showToast('Please correct the highlighted fields before sending.', 'error');
          return;
        }

        const nameVal = senderName.value.trim();
        const emailVal = senderEmail.value.trim();
        const subjectVal = senderSubject.value.trim();
        const messageVal = senderMessage.value.trim();

        // Construct formatted mailto body
        const mailBody = `Hello Faruk,

Name: ${nameVal}
Email: ${emailVal}

Message:
${messageVal}

----------------------------------------
Sent from Faruk Sayyad Portfolio Contact Form`;

        const mailtoUri = `mailto:faruksayyad451@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(mailBody)}`;

        // Open user's email client
        window.location.href = mailtoUri;

        window.showToast('Opening your email client to deliver your message to Faruk Sayyad!', 'success', 5000);

        // Reset form inputs after sending
        contactForm.reset();
        [senderName, senderEmail, senderSubject, senderMessage].forEach(inp => {
          if (inp) inp.classList.remove('is-invalid');
        });
      });
    }

    // ------------------------------------------------------------------------
    // 6. Global Modal Close on Backdrop Click or ESC Key
    // ------------------------------------------------------------------------
    const allModals = [projectModal, document.getElementById('csv-modal')].filter(Boolean);

    allModals.forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.remove('is-active');
          modal.hidden = true;
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        allModals.forEach(modal => {
          if (modal.classList.contains('is-active')) {
            modal.classList.remove('is-active');
            modal.hidden = true;
          }
        });
      }
    });

    // ------------------------------------------------------------------------
    // 7. Top Scroll Progress Indicator Engine
    // ------------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
      function updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
          scrollProgressBar.style.transform = `scaleX(${progress})`;
        }
      }
      window.addEventListener('scroll', updateScrollProgress, { passive: true });
      updateScrollProgress();
    }

    // ------------------------------------------------------------------------
    // 8. Interactive Background Canvas (Lightweight Data Constellation)
    // ------------------------------------------------------------------------
    (function initBackgroundCanvas() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReducedMotion) {
        canvas.style.display = 'none';
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      let mouse = { x: null, y: null, radius: 120 };
      let isPointerActive = false;

      const isMobile = window.innerWidth <= 768;
      const particleCount = isMobile ? 18 : 42;
      const maxDistance = isMobile ? 90 : 135;

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.42;
          this.vy = (Math.random() - 0.5) * 0.42;
          this.baseRadius = Math.random() * 1.5 + 1;
          this.radius = this.baseRadius;
          this.alpha = Math.random() * 0.45 + 0.25;
          this.pulseSpeed = Math.random() * 0.02 + 0.01;
          this.pulseAngle = Math.random() * Math.PI * 2;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;

          // Pulse
          this.pulseAngle += this.pulseSpeed;
          this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.5;

          // Subtle pointer interaction
          if (isPointerActive && mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouse.radius && dist > 0) {
              const force = (mouse.radius - dist) / mouse.radius;
              this.x -= (dx / dist) * force * 1.3;
              this.y -= (dy / dist) * force * 1.3;
            }
          }
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(this.radius, 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
          ctx.fill();
        }
      }

      const particles = Array.from({ length: particleCount }, () => new Particle());

      function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.2;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      let animationFrameId = null;
      let isRunning = true;

      function render() {
        if (!isRunning) return;
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
          p.update();
          p.draw();
        });
        connectParticles();

        animationFrameId = requestAnimationFrame(render);
      }

      window.addEventListener('mousemove', (e) => {
        isPointerActive = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        isPointerActive = false;
        mouse.x = null;
        mouse.y = null;
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
          particles.forEach(p => p.reset());
        }, 200);
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          isRunning = false;
          cancelAnimationFrame(animationFrameId);
        } else {
          if (!isRunning) {
            isRunning = true;
            render();
          }
        }
      });

      render();
    })();

    // ------------------------------------------------------------------------
    // 9. Premium Custom Studio Cursor (Desktop Only)
    // ------------------------------------------------------------------------
    (function initCustomCursor() {
      const cursorDot = document.getElementById('cursor-dot');
      const cursorRing = document.getElementById('cursor-ring');
      if (!cursorDot || !cursorRing) return;

      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!isFinePointer || isReducedMotion) {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
        return;
      }

      document.body.classList.add('has-custom-cursor');

      let mouseX = -100;
      let mouseY = -100;
      let ringX = -100;
      let ringY = -100;
      let isVisible = false;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
          isVisible = true;
          cursorDot.style.opacity = '1';
          cursorRing.style.opacity = '1';
        }
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        isVisible = false;
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      });

      window.addEventListener('mousedown', () => {
        cursorRing.classList.add('cursor-active');
      });

      window.addEventListener('mouseup', () => {
        cursorRing.classList.remove('cursor-active');
      });

      function animateRing() {
        if (isVisible) {
          ringX += (mouseX - ringX) * 0.2;
          ringY += (mouseY - ringY) * 0.2;
          cursorRing.style.left = `${ringX}px`;
          cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateRing);
      }
      animateRing();

      const hoverTargets = 'a, button, input, select, textarea, .project-card, .focus-area-card, .interactive-chip, .hero-highlight-card, .about-feature-card, .contact-card';
      document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
      });
    })();

    // ------------------------------------------------------------------------
    // 10. Scroll Reveal Engine (IntersectionObserver)
    // ------------------------------------------------------------------------
    (function initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (!revealElements.length) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      });

      revealElements.forEach(el => revealObserver.observe(el));
    })();

    // ------------------------------------------------------------------------
    // 11. Interactive 3D Tilt & Light Sheen Engine (Cards & Profile)
    // ------------------------------------------------------------------------
    (function initCardTilt() {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isFinePointer || isReducedMotion) return;

      const tiltCards = document.querySelectorAll('.tilt-card, .parallax-card');

      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = -((y - centerY) / centerY) * 4.5;
          const rotateY = ((x - centerX) / centerX) * 4.5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
        });
      });
    })();

    // ------------------------------------------------------------------------
    // 12. Animated CGPA Counter Engine
    // ------------------------------------------------------------------------
    (function initCgpaCounters() {
      const counters = document.querySelectorAll('#hero-cgpa-counter, #education-cgpa-counter');
      if (!counters.length) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReducedMotion || !('IntersectionObserver' in window)) {
        return;
      }

      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      function animateCounter(el) {
        const target = 9.28;
        const duration = 1200;
        const startTime = performance.now();
        const isHero = el.id === 'hero-cgpa-counter';

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = (target * ease).toFixed(2);

          el.textContent = isHero ? `${current} CGPA` : current;

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = isHero ? `9.28 CGPA` : `9.28`;
          }
        }
        requestAnimationFrame(update);
      }

      counters.forEach(c => counterObserver.observe(c));
    })();

  });

})();
