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

    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 2. DOM Ready Setup
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    
    // --- Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Header Scrolled State ---
    const header = document.getElementById('header');
    function handleScroll() {
      if (header) header.classList.toggle('scrolled', window.scrollY > 40);
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

      primaryNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (primaryNav.classList.contains('nav-open')) {
            primaryNav.classList.remove('nav-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    // --- Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.primary-nav .nav-link');

    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
              } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, { threshold: 0.25, rootMargin: '-60px 0px -50% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }

    // --- Copy Email to Clipboard ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', function () {
        const email = 'faruksayyad451@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            window.showToast('Email address copied to clipboard: ' + email, 'success');
          }).catch(() => fallbackCopyText(email));
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
        window.showToast('Email: ' + text, 'info');
      }
      document.body.removeChild(tempInput);
    }

    // --- Resume Download Notification ---
    document.querySelectorAll('.resume-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.showToast('Downloading Faruk Sayyad Resume (PDF)...', 'success');
      });
    });

    // ------------------------------------------------------------------------
    // 3b. Evidra Hackathon Project Configuration & Action Handler
    // ------------------------------------------------------------------------
    const EVIDRA_CONFIG = {
      title: 'Evidra – The Placement Hub',
      category: 'Hackathon Project | Placement & Career Technology',
      type: 'Web Application / Placement Platform',
      role: 'Hackathon Participant / Project Contributor',
      certificateUrl: '',
      liveDemoUrl: '',
      modelUrl: '',
      githubUrl: '',
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
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        else window.showToast(EVIDRA_CONFIG.messages.certificatePending, 'info');
      } else if (actionType === 'demo' || actionType === 'model') {
        const url = (EVIDRA_CONFIG.liveDemoUrl || EVIDRA_CONFIG.modelUrl || '').trim();
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        else window.showToast(EVIDRA_CONFIG.messages.demoPending, 'info');
      } else if (actionType === 'code' || actionType === 'github') {
        const url = (EVIDRA_CONFIG.githubUrl || '').trim();
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        else window.showToast(EVIDRA_CONFIG.messages.codePending, 'info');
      }
    }

    // ------------------------------------------------------------------------
    // 4. Unified Modal Manager
    // ------------------------------------------------------------------------
    function openModal(modalEl) {
      if (!modalEl) return;
      modalEl.hidden = false;
      modalEl.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(modalEl) {
      if (!modalEl) return;
      modalEl.classList.remove('is-active');
      modalEl.hidden = true;
      if (!document.querySelector('.modal-backdrop.is-active')) {
        document.body.style.overflow = '';
      }
    }

    // Global Modal Escape & Backdrop Listeners
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.is-active').forEach(closeModal);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        closeModal(e.target);
      } else if (e.target.closest('.modal-close-btn') || e.target.id === 'credentials-modal-inner-close') {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) closeModal(modal);
      }
    });

    // ------------------------------------------------------------------------
    // 4a. Case Study Modal System
    // ------------------------------------------------------------------------
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalIcon = document.getElementById('project-modal-icon');
    const projectModalBody = document.getElementById('project-modal-body');

    function renderCaseStudyHtml(p) {
      const badgeStyleAttr = p.badgeStyle ? ` style="${p.badgeStyle}"` : '';
      return `
        <div class="modal-project-content">
          <div class="case-study-hero">
            <span class="case-study-badge"${badgeStyleAttr}>${p.badge}</span>
            <p class="modal-lead-text">${p.lead}</p>
          </div>
          <div class="case-study-grid">
            ${p.cards.map((c, i) => {
              const num = c.num || String(i + 1).padStart(2, '0');
              const fullClass = c.fullWidth ? ' full-width-card' : '';
              const cardStyleAttr = c.cardStyle ? ` style="${c.cardStyle}"` : '';
              const numStyleAttr = c.numStyle ? ` style="${c.numStyle}"` : '';
              const headingStyleAttr = c.headingStyle ? ` style="${c.headingStyle}"` : '';
              
              let body = '';
              if (c.intro) body += `<p>${c.intro}</p>`;
              if (c.p) body += `<p>${c.p}</p>`;
              if (c.list && c.list.length) {
                body += `<ul class="case-study-list">${c.list.map(li => `<li>${li}</li>`).join('')}</ul>`;
              }
              if (c.techTags && c.techTags.length) {
                body += `<div class="case-study-tech-tags">${c.techTags.map(t => `<span class="tech-pill">${t}</span>`).join('')}</div>`;
              }
              if (c.extraHtml) body += c.extraHtml;

              return `
                <div class="case-study-card${fullClass}"${cardStyleAttr}>
                  <div class="case-study-header">
                    <span class="case-study-step-num"${numStyleAttr}>${num}</span>
                    <h4 class="case-study-heading"${headingStyleAttr}>${c.heading}</h4>
                  </div>
                  ${body}
                </div>
              `;
            }).join('')}
          </div>
          ${p.footerHtml || ''}
        </div>
      `;
    }

    const CASE_STUDIES_DATA = {
  "evidra": {
    "title": "Evidra – The Placement Hub · Hackathon Case Study",
    "icon": "🎓",
    "badge": "Hackathon Project · Placement & Career Technology",
    "badgeStyle": "background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#fbbf24;",
    "lead": "A centralized placement operations and career readiness platform engineered during a hackathon to unify campus recruitment workflows, automate student eligibility verification, and structure interview preparation tracking.",
    "cards": [
      {
        "num": "01",
        "heading": "Problem Statement",
        "p": "During campus recruitment cycles, critical company announcements, eligibility criteria (CGPA cutoffs, department restrictions, active backlogs), test schedules, and preparation materials are scattered across disparate noticeboards, spreadsheets, and group chats. Students frequently miss application windows or experience uncertainty regarding their eligibility status."
      },
      {
        "num": "02",
        "heading": "Project Overview & Architecture",
        "intro": "Engineered under rapid hackathon prototyping cycles, Evidra delivers a cohesive single-pane platform that consolidates company drives, matches company rules against student profiles, and organizes interview preparation:",
        "list": [
          "<strong>Drive Management:</strong> Structured repository of recruitment drives with role specifications, CTC packages, and deadlines.",
          "<strong>Eligibility Engine:</strong> Instant client-side verification evaluating GPA, department, and backlog criteria.",
          "<strong>Preparation Hub:</strong> Milestone tracking for aptitude tests, core CS fundamentals, and technical interview roadmaps.",
          "<strong>Client-Side Persistence:</strong> LocalStorage caching ensuring zero-lag access and state preservation without server overhead."
        ]
      },
      {
        "num": "03",
        "heading": "My Contribution & Role",
        "intro": "<strong>Role: Hackathon Participant / Project Contributor</strong>",
        "list": [
          "Designed and built the responsive frontend layout using modern CSS Grid and Flexbox.",
          "Architected the client-side student eligibility verification logic comparing academic criteria.",
          "Engineered the placement drive filtering interface and search mechanism.",
          "Implemented browser LocalStorage state management to persist student checklist milestones."
        ]
      },
      {
        "num": "04",
        "heading": "Tools & Technologies",
        "techTags": [
          "HTML5 Semantic Elements",
          "CSS3 & CSS Variables",
          "Vanilla JavaScript (ES6+)",
          "Web Storage API (LocalStorage)",
          "Responsive UI/UX",
          "Git & GitHub"
        ]
      },
      {
        "num": "05",
        "heading": "Key Implemented Features",
        "list": [
          "<strong>Dynamic Drive Feed:</strong> Categorized schedule of campus drives with real-time countdowns.",
          "<strong>Eligibility Checking:</strong> Real-time match scoring indicating whether a student qualifies for specific drives.",
          "<strong>Readiness Checklist:</strong> Trackable study checklists for aptitude, coding DSA, and system interviews.",
          "<strong>Fast Client Search:</strong> Instant keyword filtering across companies, role categories, and status tags."
        ]
      },
      {
        "num": "06",
        "heading": "Hackathon Learnings & Outcomes",
        "p": "Strengthened rapid prototyping speed, team collaboration under deadline pressure, user-centric problem modeling for campus peers, and dependable client-side state handling without backend dependencies."
      },
      {
        "num": "07",
        "heading": "Project Action Links & Verification",
        "fullWidth": true,
        "cardStyle": "border:1px solid rgba(245,158,11,0.3); background:rgba(245,158,11,0.06);",
        "numStyle": "background:rgba(245,158,11,0.2); border-color:#fbbf24; color:#fbbf24;",
        "headingStyle": "color:#fbbf24;",
        "intro": "Access the hackathon project resources below. All links are centrally managed via the verified project configuration:",
        "extraHtml": "\n          <div class=\"case-study-actions-group\" style=\"display:flex; flex-wrap:wrap; gap:12px; align-items:center;\">\n            <button type=\"button\" class=\"btn btn-sm btn-primary\" id=\"evidra-modal-demo-btn\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"15\" height=\"15\" aria-hidden=\"true\"><polygon points=\"5 3 19 12 5 21 5 3\"/></svg>\n              <span>Live Demo / Open Model</span>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-outline evidra-action-cert\" id=\"evidra-modal-cert-btn\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"15\" height=\"15\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"8\" r=\"6\"/><path d=\"M15.477 12.89L17 22l-5-3-5 3 1.523-9.11\"/></svg>\n              <span>View Hackathon Certificate</span>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-outline\" id=\"evidra-modal-code-btn\">\n              <svg viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"15\" height=\"15\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z\"/></svg>\n              <span>View Source Code</span>\n            </button>\n          </div>\n        "
      }
    ],
    "footerHtml": "\n      <div class=\"modal-actions-between\" style=\"margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);\">\n        <span style=\"font-size:0.8125rem; color:var(--text-muted);\">Status: Completed Hackathon Project · Contributor</span>\n        <div class=\"modal-actions-right\">\n          <button type=\"button\" class=\"btn btn-ghost\" id=\"project-modal-inner-close\">Close Case Study</button>\n        </div>\n      </div>\n    "
  },
  "analytics": {
    "title": "Retail Sales & Performance Analytics Engine - Case Study",
    "icon": "📊",
    "badge": "Data Analytics & Visualization",
    "lead": "An interactive client-side analytical dashboard and KPI evaluation engine built to process commercial transaction records, compute financial metrics, and dynamically update Chart.js visualizations with custom CSV dataset ingestion.",
    "cards": [
      {
        "num": "01",
        "heading": "Problem Statement",
        "p": "Business stakeholders frequently struggle to synthesize multi-dimensional retail records into actionable operational decisions. Static spreadsheets lack immediate responsiveness, making it difficult to detect seasonal revenue swings, regional sales discrepancies, or underperforming product categories."
      },
      {
        "num": "02",
        "heading": "Solution & Architecture",
        "intro": "Engineered an end-to-end client-side data analytics pipeline with zero external server dependencies:",
        "list": [
          "<strong>Data Layer:</strong> Multi-dimensional array structures with automated date parsing and numerical sanitization.",
          "<strong>Aggregation Engine:</strong> Dynamic grouping algorithms calculating Gross Sales, Net Profit, Profit Margins, and Units Sold per territory/category.",
          "<strong>Visualization Layer:</strong> Interactive dual-axis Chart.js trend charts, categorical profit bars, and regional distribution doughnuts.",
          "<strong>Dynamic CSV Ingestion:</strong> RFC-4180 compliant client-side CSV parser with automatic column mapping and validation."
        ]
      },
      {
        "num": "03",
        "heading": "Tools & Technologies",
        "techTags": [
          "Python (Data Modeling Concepts)",
          "SQL Logic (Aggregation & Filtering)",
          "Chart.js 4.4",
          "Vanilla JavaScript (ES6+)",
          "HTML5 & CSS3 Variables",
          "Client-Side CSV Parsing"
        ]
      },
      {
        "num": "04",
        "heading": "Key Implemented Features",
        "list": [
          "<strong>Instant KPI Recalculation:</strong> Filters dynamically recompute top-line revenue, net profit margin (%), and volume across all records.",
          "<strong>Custom CSV Dataset Upload:</strong> Drag & drop any valid CSV dataset to recalculate real-time metrics and charts immediately.",
          "<strong>Responsive Visualizations:</strong> Fully adaptive charts with custom currency tooltips, accessible legends, and theme adaptation.",
          "<strong>Zero-Dependency Execution:</strong> Runs 100% in browser memory with guaranteed data privacy and low latency."
        ]
      },
      {
        "num": "05",
        "heading": "Verified Outcomes & Technical Learnings",
        "fullWidth": true,
        "p": "Demonstrates applied competency in practical exploratory data analysis (EDA), business logic aggregation, dynamic DOM/Canvas coordination, and user experience design for analytical applications."
      }
    ],
    "footerHtml": "\n      <div class=\"modal-actions-between\" style=\"margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);\">\n        <a href=\"#analytics\" class=\"btn btn-primary\" id=\"case-study-try-btn\">\n          <span>Try Live Dashboard Engine</span>\n          <svg viewBox=\"0 0 20 20\" fill=\"currentColor\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z\" clip-rule=\"evenodd\"/></svg>\n        </a>\n        <div class=\"modal-actions-right\">\n          <a href=\"https://github.com/Faruk4040\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"btn btn-outline\"><span>GitHub Profile</span></a>\n          <button type=\"button\" class=\"btn btn-ghost\" id=\"project-modal-inner-close\">Close Case Study</button>\n        </div>\n      </div>\n    "
  },
  "smartexpense": {
    "title": "SmartExpense Manager - Case Study",
    "icon": "💳",
    "badge": "Web Application & Personal Finance",
    "lead": "A lightweight, responsive expense tracking and budget management web application engineered to give individuals clear visibility over recurring expenditures and balance allocations.",
    "cards": [
      {
        "num": "01",
        "heading": "Problem Statement",
        "p": "Managing personal finances across multiple everyday categories often leads to spending leakage when tracking tools are cumbersome, slow to load, or overly complex for simple everyday entries."
      },
      {
        "num": "02",
        "heading": "Solution & Architecture",
        "intro": "Developed a streamlined client-side financial manager prioritizing speed, keyboard accessibility, and immediate visual feedback:",
        "list": [
          "<strong>State Management:</strong> In-memory array objects tracking entries with timestamps, category codes, and numerical amounts.",
          "<strong>DOM Synchronization:</strong> Event-driven architecture recalculating totals immediately upon record creation or deletion.",
          "<strong>Defensive Validation:</strong> Input guardrails enforcing non-empty descriptions, valid positive currency amounts, and date constraints.",
          "<strong>Responsive Interface:</strong> Fluid CSS Flexbox/Grid layouts adapting seamlessly to mobile and desktop screens."
        ]
      },
      {
        "num": "03",
        "heading": "Tools & Technologies",
        "techTags": [
          "HTML5",
          "CSS3",
          "JavaScript (ES6+)",
          "DOM Manipulation",
          "Event Architecture",
          "Responsive Design"
        ]
      },
      {
        "num": "04",
        "heading": "Key Implemented Features",
        "list": [
          "<strong>Category Classification:</strong> Organize expenses across Food, Utilities, Transport, Entertainment, and Miscellaneous.",
          "<strong>Live Balance Computation:</strong> Instant evaluation of total spending with categorical sub-totals.",
          "<strong>Entry History Table:</strong> Structured display of past transactions with intuitive delete/manage actions.",
          "<strong>Form Validation:</strong> Strict client-side boundary checking providing instant user feedback."
        ]
      },
      {
        "num": "05",
        "heading": "Verified Outcomes & Technical Learnings",
        "fullWidth": true,
        "p": "Strengthened foundational proficiency in vanilla DOM manipulation, event bubbling, data model synchronization, and clean component-driven JavaScript architecture without framework bloat."
      }
    ],
    "footerHtml": "\n      <div class=\"modal-actions-between\" style=\"margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);\">\n        <a href=\"https://github.com/Faruk4040\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"btn btn-primary\">\n          <span>View GitHub Profile</span>\n          <svg viewBox=\"0 0 20 20\" fill=\"currentColor\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z\" clip-rule=\"evenodd\"/></svg>\n        </a>\n        <div class=\"modal-actions-right\">\n          <button type=\"button\" class=\"btn btn-outline\" id=\"project-modal-inner-close\">Close Case Study</button>\n        </div>\n      </div>\n    "
  },
  "myntra": {
    "title": "Myntra Clone - Case Study",
    "icon": "🛍️",
    "badge": "Frontend Engineering & E-Commerce UI",
    "lead": "A responsive fashion storefront interface inspired by commercial e-commerce applications, emphasizing modern component design, clean product cards, and responsive multi-tiered navigation.",
    "cards": [
      {
        "num": "01",
        "heading": "Problem Statement",
        "p": "Commercial retail platforms demand intricate user interfaces that gracefully present rich product catalogs, navigation hierarchies, and brand promotional banners without confusing visitors."
      },
      {
        "num": "02",
        "heading": "Solution & Architecture",
        "intro": "Recreated the core user experience patterns of modern online fashion retail platforms:",
        "list": [
          "<strong>Component Architecture:</strong> Reusable product card structures featuring pricing tiers, product titles, and brand imagery.",
          "<strong>Multi-Level Header:</strong> Category navigation bar mirroring the UX patterns of production retail web apps.",
          "<strong>Responsive Grid Systems:</strong> Media query breakpoints maintaining optimal grid columns across smartphones, tablets, and wide screens.",
          "<strong>Interactive Micro-States:</strong> Hover transitions, interactive CTA buttons, and interactive card states."
        ]
      },
      {
        "num": "03",
        "heading": "Tools & Technologies",
        "techTags": [
          "HTML5 Semantic Elements",
          "CSS3 Flexbox & Grid",
          "Vanilla JavaScript",
          "UI/UX Design Systems",
          "Responsive Web Design",
          "Cross-Browser Compatibility"
        ]
      },
      {
        "num": "04",
        "heading": "Key Implemented Features",
        "list": [
          "<strong>Fashion Catalog Feed:</strong> Styled product displays featuring prices, discounts, and item details.",
          "<strong>Header & Category Navigation:</strong> Clean navigation structure for Men, Women, Kids, and Home categories.",
          "<strong>Mobile Friendly Drawer:</strong> Adaptive mobile menu toggle for accessible viewing on handheld devices.",
          "<strong>Fast Static Loading:</strong> Lightweight static assets delivering instant first-contentful-paint (FCP)."
        ]
      },
      {
        "num": "05",
        "heading": "Verified Outcomes & Disclaimer",
        "fullWidth": true,
        "p": "Educational frontend clone engineered to master commercial UI/UX paradigms, layout responsiveness, and CSS architecture. *Not affiliated with or endorsed by Myntra."
      }
    ],
    "footerHtml": "\n      <div class=\"modal-actions-between\" style=\"margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);\">\n        <a href=\"https://github.com/Faruk4040/Myntra-Clone\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"btn btn-primary\">\n          <span>View Verified GitHub Repository</span>\n          <svg viewBox=\"0 0 20 20\" fill=\"currentColor\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z\" clip-rule=\"evenodd\"/></svg>\n        </a>\n        <div class=\"modal-actions-right\">\n          <button type=\"button\" class=\"btn btn-outline\" id=\"project-modal-inner-close\">Close Case Study</button>\n        </div>\n      </div>\n    "
  }
};

    const PROJECT_DETAILS = {};
    Object.keys(CASE_STUDIES_DATA).forEach(key => {
      const data = CASE_STUDIES_DATA[key];
      PROJECT_DETAILS[key] = {
        title: data.title,
        icon: data.icon,
        content: renderCaseStudyHtml(data)
      };
    });

    function openProjectModal(projectId) {
      const details = PROJECT_DETAILS[projectId];
      if (!details || !projectModal) return;

      if (projectModalTitle) projectModalTitle.textContent = details.title;
      if (projectModalIcon) projectModalIcon.textContent = details.icon;
      if (projectModalBody) {
        projectModalBody.innerHTML = details.content;
        
        const innerClose = document.getElementById('project-modal-inner-close');
        if (innerClose) innerClose.addEventListener('click', closeProjectModal);

        const tryLiveBtn = document.getElementById('case-study-try-btn');
        if (tryLiveBtn) tryLiveBtn.addEventListener('click', closeProjectModal);

        const modalCertBtn = document.getElementById('evidra-modal-cert-btn');
        if (modalCertBtn) modalCertBtn.addEventListener('click', () => handleEvidraAction('certificate'));

        const modalDemoBtn = document.getElementById('evidra-modal-demo-btn');
        if (modalDemoBtn) modalDemoBtn.addEventListener('click', () => handleEvidraAction('demo'));

        const modalCodeBtn = document.getElementById('evidra-modal-code-btn');
        if (modalCodeBtn) modalCodeBtn.addEventListener('click', () => handleEvidraAction('code'));
      }

      openModal(projectModal);
    }

    function closeProjectModal() {
      closeModal(projectModal);
    }

    // Attach to View Case Study buttons
    document.querySelectorAll('.view-project-details-btn').forEach(btn => {
      btn.addEventListener('click', () => openProjectModal(btn.getAttribute('data-project-id')));
    });

    // Wire Evidra Card Action Buttons
    const evidraCardCertBtn = document.getElementById('evidra-card-cert-btn');
    if (evidraCardCertBtn) evidraCardCertBtn.addEventListener('click', () => handleEvidraAction('certificate'));

    const evidraCardDemoBtn = document.getElementById('evidra-card-demo-btn');
    if (evidraCardDemoBtn) evidraCardDemoBtn.addEventListener('click', () => handleEvidraAction('demo'));

    const evidraCardCodeBtn = document.getElementById('evidra-card-code-btn');
    if (evidraCardCodeBtn) evidraCardCodeBtn.addEventListener('click', () => handleEvidraAction('code'));

    // ------------------------------------------------------------------------
    // 4b. Recruiter Credentials Snapshot Modal Logic
    // ------------------------------------------------------------------------
    const credentialsModal = document.getElementById('credentials-modal');

    function openCredentialsModal() {
      openModal(credentialsModal);
    }

    function closeCredentialsModal() {
      closeModal(credentialsModal);
    }

    document.querySelectorAll('.preview-resume-btn').forEach(btn => {
      btn.addEventListener('click', openCredentialsModal);
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

          filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

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

      function applyTheme(theme, isUserAction = false) {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
          if (themeToggle) {
            themeToggle.classList.add('is-light');
            themeToggle.setAttribute('aria-pressed', 'true');
            themeToggle.setAttribute('aria-label', 'Switch to Dark mode (currently Light mode)');
          }
          if (isUserAction && window.showToast) {
            window.showToast('Switched to Light mode', 'info', 2200);
          }
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.classList.remove('light-theme');
          document.body.classList.add('dark-theme');
          if (themeToggle) {
            themeToggle.classList.remove('is-light');
            themeToggle.setAttribute('aria-pressed', 'false');
            themeToggle.setAttribute('aria-label', 'Switch to Light mode (currently Dark mode)');
          }
          if (isUserAction && window.showToast) {
            window.showToast('Switched to Dark mode', 'info', 2200);
          }
        }

        try {
          localStorage.setItem('faruk_portfolio_theme', theme);
        } catch (e) {}

        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
      }

      applyTheme(currentTheme, false);

      if (themeToggle) {
        themeToggle.addEventListener('click', function () {
          currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
          applyTheme(currentTheme, true);
        });
      }
    })();

    // ------------------------------------------------------------------------
    // 5. Contact Form Validation & Submission
    // ------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      const statusBox = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      function showStatus(message, type) {
        if (!statusBox) return;
        statusBox.textContent = message;
        statusBox.className = `form-status status-${type}`;
        statusBox.style.display = 'block';
      }

      function hideStatus() {
        if (statusBox) statusBox.style.display = 'none';
      }

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        hideStatus();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (!name || !name.value.trim()) {
          showStatus('Please provide your name.', 'error');
          if (name) name.focus();
          return;
        }

        if (!email || !email.value.trim()) {
          showStatus('Please enter your email address.', 'error');
          if (email) email.focus();
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          showStatus('Please provide a valid email format (e.g. name@domain.com).', 'error');
          email.focus();
          return;
        }

        if (!message || !message.value.trim()) {
          showStatus('Please include a message or inquiry details.', 'error');
          if (message) message.focus();
          return;
        }

        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending Message...</span>';
        }

        setTimeout(() => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
          showStatus('Thank you! Your message has been prepared. You can also reach me directly at faruksayyad451@gmail.com.', 'success');
          window.showToast('Message sent! Faruk will get back to you shortly.', 'success');
        }, 650);
      });
    }

    // ------------------------------------------------------------------------
    // 6. Top Scroll Progress Indicator Engine
    // ------------------------------------------------------------------------
    (function initScrollProgress() {
      const progressBar = document.getElementById('scroll-progress');
      if (!progressBar) return;

      function updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
      }

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    })();

    // ------------------------------------------------------------------------
    // 7. Interactive Background Canvas (Lightweight Data Constellation)
    // ------------------------------------------------------------------------
    (function initBackgroundCanvas() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

          this.pulseAngle += this.pulseSpeed;
          this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.5;

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
      let isVisible = true;

      function animate() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        connectParticles();

        animationFrameId = requestAnimationFrame(animate);
      }

      function handleResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles.forEach(p => p.reset());
      }
      window.addEventListener('resize', handleResize, { passive: true });

      window.addEventListener('mousemove', (e) => {
        isPointerActive = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        isPointerActive = false;
        mouse.x = null;
        mouse.y = null;
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) {
          if (!animationFrameId) animate();
        } else {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });

      animate();
    })();

    // ------------------------------------------------------------------------
    // 8. Custom Studio Cursor (Desktop Only)
    // ------------------------------------------------------------------------
    (function initCustomCursor() {
      const cursorDot = document.getElementById('custom-cursor-dot');
      const cursorRing = document.getElementById('custom-cursor-ring');

      if (!cursorDot || !cursorRing) return;

      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isTouch || isReduced) {
        cursorDot.style.display = 'none';
        cursorRing.style.display = 'none';
        return;
      }

      let mouseX = -100, mouseY = -100;
      let ringX = -100, ringY = -100;
      let isMoving = false;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
          isMoving = true;
          cursorDot.style.opacity = '1';
          cursorRing.style.opacity = '1';
        }
      }, { passive: true });

      function renderCursor() {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(renderCursor);
      }
      requestAnimationFrame(renderCursor);

      const interactiveSelector = 'a, button, input, select, textarea, .project-card, .tilt-card, [role="button"]';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
          cursorRing.classList.add('cursor-hover');
        }
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
          cursorRing.classList.remove('cursor-hover');
        }
      });

      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        isMoving = false;
      });
    })();

    // ------------------------------------------------------------------------
    // 9. Scroll Reveal Engine (IntersectionObserver)
    // ------------------------------------------------------------------------
    (function initScrollReveal() {
      const revealItems = document.querySelectorAll('.reveal-on-scroll');
      if (!revealItems.length) return;

      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealItems.forEach(item => revealObserver.observe(item));
      } else {
        revealItems.forEach(item => item.classList.add('is-revealed'));
      }
    })();

    // ------------------------------------------------------------------------
    // 10. Interactive 3D Tilt & Light Sheen Engine
    // ------------------------------------------------------------------------
    (function initTiltEngine() {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tiltCards = document.querySelectorAll('.tilt-card');
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    })();

    // ------------------------------------------------------------------------
    // 11. Animated CGPA Counter Engine
    // ------------------------------------------------------------------------
    (function initCgpaCounter() {
      const counters = document.querySelectorAll('[data-target]');
      if (!counters.length) return;

      if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseFloat(el.getAttribute('data-target')) || 9.28;
              let current = 0;
              const duration = 1400;
              const startTime = performance.now();

              function updateNum(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                current = (easeOut * target);

                el.textContent = current.toFixed(2);

                if (progress < 1) {
                  requestAnimationFrame(updateNum);
                } else {
                  el.textContent = target.toFixed(2);
                }
              }

              requestAnimationFrame(updateNum);
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
      }
    })();

  });
})();
