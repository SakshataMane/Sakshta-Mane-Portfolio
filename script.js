/* ==========================================================================
   INTERACTIVE LOGIC: QA & Software Testing Theme Script for Sakshata Mane
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM INSPECT & QA MODE TOGGLE ---
    const qaModeToggle = document.getElementById('qa-mode-toggle');
    const debugHud = document.getElementById('debug-hud');
    const hudClose = document.getElementById('hud-close');
    const nodeCountSpan = document.getElementById('node-count');
    const body = document.body;

    // Dynamically annotate sections with tag names for the QA Inspect HUD hover tooltips
    const sectionsToInspect = [
        { selector: 'header.navbar', tag: '<header.navbar>' },
        { selector: '#hero', tag: '<section#hero.hero-section>' },
        { selector: '#qa-sandbox', tag: '<section#qa-sandbox.qa-sandbox-section>' },
        { selector: '#skills', tag: '<section#skills.skills-section>' },
        { selector: '#experience', tag: '<section#experience.experience-section>' },
        { selector: '#projects', tag: '<section#projects.projects-section>' },
        { selector: '#education', tag: '<section#education.education-section>' },
        { selector: '#contact', tag: '<section#contact.contact-section>' },
        { selector: 'footer.footer', tag: '<footer.footer>' },
        { selector: '.visual-card', tag: '<div.visual-card.console-log>' },
        { selector: '.skills-grid', tag: '<div.skills-grid.grid-layout>' },
        { selector: '.timeline', tag: '<div.timeline.career-path>' },
        { selector: '.contact-form-wrapper', tag: '<div.contact-form-wrapper>' }
    ];

    sectionsToInspect.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.setAttribute('data-dom-inspect', item.tag);
        }
    });

    // Update node count in the HUD
    const allElements = document.querySelectorAll('*');
    if (nodeCountSpan) {
        nodeCountSpan.textContent = allElements.length;
    }

    // Toggle inspect mode function
    function toggleQaInspectMode() {
        body.classList.toggle('qa-inspect-mode');
        debugHud.classList.toggle('hidden');
        
        // Update inspect button state
        if (body.classList.contains('qa-inspect-mode')) {
            qaModeToggle.innerHTML = '<i class="fa-solid fa-square-check"></i> <span>Stop Inspect</span>';
            qaModeToggle.style.backgroundColor = 'var(--accent-sage)';
            qaModeToggle.style.color = '#FFFFFF';
            logToConsole('[SYSTEM] QA Page Inspector activated. Hover over sections to see DOM structures.');
        } else {
            resetInspectBtn();
            logToConsole('[SYSTEM] QA Page Inspector deactivated.');
        }
    }

    function resetInspectBtn() {
        qaModeToggle.innerHTML = '<i class="fa-solid fa-bug"></i> <span>Inspect Page</span>';
        qaModeToggle.style.backgroundColor = '';
        qaModeToggle.style.color = '';
    }

    if (qaModeToggle) {
        qaModeToggle.addEventListener('click', toggleQaInspectMode);
    }
    if (hudClose) {
        hudClose.addEventListener('click', () => {
            body.classList.remove('qa-inspect-mode');
            debugHud.classList.add('hidden');
            resetInspectBtn();
            logToConsole('[SYSTEM] QA Page Inspector closed.');
        });
    }

    // --- 2. QA SANDBOX (BUG HUNTER MINI-GAME) ---
    const bugsCountText = document.getElementById('bugs-found-count');
    const sandboxLog = document.getElementById('sandbox-log');
    const qualityFill = document.getElementById('quality-fill');
    const qualityPct = document.getElementById('quality-pct');
    const successModal = document.getElementById('qa-success-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    
    // Tracks state of found bugs
    const bugsFound = {
        '1': { found: false, description: 'UI Defect: Overlapping transaction amount badge.', name: 'BUG-01 (UI)' },
        '2': { found: false, description: 'Content Typo: "proccessed" / "destinatiton" spelling errors.', name: 'BUG-02 (Content)' },
        '3': { found: false, description: 'Logic Error: Calculation sum incorrect ($100.00 + $5.00 = $125.00).', name: 'BUG-03 (Logic)' },
        '4': { found: false, description: 'Functional Defect: Inactive Get Exchange Rate button triggers dead event.', name: 'BUG-04 (Functional)' }
    };
    
    let totalBugsFoundCount = 0;

    // Helper to print messages in the console log terminal
    function logToConsole(message, type = 'info') {
        if (!sandboxLog) return;
        
        // Remove waiting placeholder
        const waitingLine = sandboxLog.querySelector('.log-waiting');
        if (waitingLine) {
            waitingLine.remove();
        }

        const logLine = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString();
        
        if (type === 'success') {
            logLine.className = 'log-success';
            logLine.innerHTML = `[${timestamp}] <span class="c-tag">[PASS]</span> ${message}`;
        } else if (type === 'error') {
            logLine.className = 'log-error';
            logLine.innerHTML = `[${timestamp}] <span class="c-tag">[FAIL]</span> ${message}`;
        } else {
            logLine.className = 'log-init';
            logLine.innerHTML = `[${timestamp}] <span class="c-tag">[INFO]</span> ${message}`;
        }
        
        sandboxLog.appendChild(logLine);
        sandboxLog.scrollTop = sandboxLog.scrollHeight; // Auto-scroll to bottom
    }

    // Attach click listeners to bug elements
    const bugElements = document.querySelectorAll('.bug-element');
    bugElements.forEach(el => {
        el.addEventListener('click', (e) => {
            // Prevent multiple actions
            e.stopPropagation();
            
            const bugId = el.getAttribute('data-bug-id');
            const bug = bugsFound[bugId];
            
            if (bug && !bug.found) {
                bug.found = true;
                el.classList.add('bug-found');
                totalBugsFoundCount++;
                
                // Update text counter
                if (bugsCountText) {
                    bugsCountText.textContent = totalBugsFoundCount;
                }
                
                // Log to terminal
                logToConsole(`Defect Resolved! ${bug.name}: ${bug.description}`, 'success');
                
                // Update Health Progress Bar
                updateBuildHealth();
                
                // Check if all bugs are captured
                if (totalBugsFoundCount === 4) {
                    logToConsole('All defects resolved! Running build sanity check...', 'success');
                    setTimeout(() => {
                        logToConsole('[SYSTEM] Build health 100%. Quality assurance clearance approved for production release.', 'success');
                        // Show modal
                        if (successModal) {
                            successModal.classList.remove('hidden');
                        }
                    }, 1000);
                }
            }
        });
    });

    // Reset build health visual bar
    function updateBuildHealth() {
        if (!qualityFill || !qualityPct) return;
        
        let pct = 25; // Base state
        let healthLabel = '25% (CRITICAL BUILD)';
        let color = 'var(--error)';
        
        if (totalBugsFoundCount === 1) {
            pct = 45;
            healthLabel = '45% (STABILITY RISK)';
            color = 'var(--warning)';
        } else if (totalBugsFoundCount === 2) {
            pct = 65;
            healthLabel = '65% (UNSTABLE BUILD)';
            color = 'var(--warning)';
        } else if (totalBugsFoundCount === 3) {
            pct = 85;
            healthLabel = '85% (STAGING STABLE)';
            color = 'var(--accent-sage)';
        } else if (totalBugsFoundCount === 4) {
            pct = 100;
            healthLabel = '100% (STABLE BUILD)';
            color = 'var(--success)';
        }
        
        qualityFill.style.width = `${pct}%`;
        qualityFill.style.backgroundColor = color;
        qualityPct.textContent = healthLabel;
    }

    // Modal Close
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.classList.add('hidden');
            }
        });
    }

    // --- 3. PROJECT FILTER LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // Initial hide animation state
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else if (card.classList.contains(filterValue)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                    
                    // Fade back in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                }, 300);
            });
        });
    });

    // --- 4. FORM QA VALIDATION THEME ---
    const form = document.getElementById('qa-contact-form');
    const inputName = document.getElementById('contact-name');
    const inputEmail = document.getElementById('contact-email');
    const textMessage = document.getElementById('contact-message');
    
    const valName = document.getElementById('val-name');
    const valEmail = document.getElementById('val-email');
    const valMessage = document.getElementById('val-message');
    const formTestStatus = document.getElementById('form-test-status');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('btn-submit');

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Monitor input changes
    function validateField(input, feedbackEl, assertionText, validationFn) {
        if (!input || !feedbackEl) return false;
        
        const value = input.value.trim();
        const resultSpan = feedbackEl.querySelector('.val-result');
        
        if (value === '') {
            resultSpan.className = 'val-result val-neutral';
            resultSpan.textContent = 'PENDING';
            return false;
        }

        const isValid = validationFn(value);
        
        if (isValid) {
            resultSpan.className = 'val-result val-pass';
            resultSpan.textContent = 'PASSED';
            return true;
        } else {
            resultSpan.className = 'val-result val-fail';
            resultSpan.textContent = 'FAILED';
            return false;
        }
    }

    if (inputName) {
        inputName.addEventListener('input', () => {
            validateField(inputName, valName, 'Assert: name.length > 0', (val) => val.length > 0);
            updateFormStatus();
        });
    }

    if (inputEmail) {
        inputEmail.addEventListener('input', () => {
            validateField(inputEmail, valEmail, 'Assert: email.matches(regex)', (val) => emailRegex.test(val));
            updateFormStatus();
        });
    }

    if (textMessage) {
        textMessage.addEventListener('input', () => {
            validateField(textMessage, valMessage, 'Assert: message.words >= 3', (val) => {
                const words = val.split(/\s+/).filter(w => w.length > 0);
                return words.length >= 3;
            });
            updateFormStatus();
        });
    }

    function updateFormStatus() {
        if (!formTestStatus) return;

        const isNameOk = inputName.value.trim().length > 0;
        const isEmailOk = emailRegex.test(inputEmail.value.trim());
        const isMsgOk = textMessage.value.trim().split(/\s+/).filter(w => w.length > 0).length >= 3;

        if (inputName.value.trim() === '' && inputEmail.value.trim() === '' && textMessage.value.trim() === '') {
            formTestStatus.className = 'test-status-pill';
            formTestStatus.textContent = 'Status: Standby';
            return;
        }

        if (isNameOk && isEmailOk && isMsgOk) {
            formTestStatus.className = 'test-status-pill pass';
            formTestStatus.textContent = 'Status: PASSED';
        } else {
            formTestStatus.className = 'test-status-pill fail';
            formTestStatus.textContent = 'Status: FAILED';
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = inputName.value.trim().length > 0;
            const isEmailValid = emailRegex.test(inputEmail.value.trim());
            const wordCount = textMessage.value.trim().split(/\s+/).filter(w => w.length > 0).length;
            const isMsgValid = wordCount >= 3;

            if (isNameValid && isEmailValid && isMsgValid) {
                // Submit Simulation
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running Integration Tests...';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Run SendMessage() Action';
                    
                    formAlert.className = 'alert-box success';
                    formAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Integration Test Passed!</strong> Your message has been routed successfully. Sakshata will get back to you shortly.';
                    formAlert.classList.remove('hidden');
                    
                    // Reset Form
                    form.reset();
                    
                    // Reset validation tags
                    document.querySelectorAll('.val-result').forEach(span => {
                        span.className = 'val-result val-neutral';
                        span.textContent = 'PENDING';
                    });
                    if (formTestStatus) {
                        formTestStatus.className = 'test-status-pill';
                        formTestStatus.textContent = 'Status: Standby';
                    }
                    
                    // Hide alert after 5s
                    setTimeout(() => {
                        formAlert.classList.add('hidden');
                    }, 6000);
                    
                }, 1500);
            } else {
                formAlert.className = 'alert-box error';
                formAlert.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <strong>Assert Failed!</strong> Please correct the errors in the form fields before running the test.';
                formAlert.classList.remove('hidden');
            }
        });
    }

    // --- 5. SCROLL PROGRESS & ACTIVE LINK HIGHLIGHTS ---
    const progressEl = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPct = (window.scrollY / scrollHeight) * 100;
        if (progressEl) {
            progressEl.style.width = `${scrollPct}%`;
        }

        // Navbar scroll class elevation
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Highlight Active Link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. MOBILE HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const menuLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu on link click
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 7. SCROLL INTERSECTION OBSERVER FOR FADE ANIMATIONS ---
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 8. QA ARTIFACTS VAULT MODAL LOGIC ---
    const artifactsModal = document.getElementById('qa-artifacts-modal');
    const closeArtifactsBtn = document.getElementById('btn-close-artifacts');
    const artifactModalTitle = document.getElementById('artifact-modal-title');
    const inspectButtons = document.querySelectorAll('.btn-artifacts-inspect');
    
    const artTabBtns = document.querySelectorAll('.art-tab-btn');
    const artTabPanels = document.querySelectorAll('.art-tab-panel');
    
    const tabCases = document.getElementById('art-tab-content-cases');
    const tabDefects = document.getElementById('art-tab-content-defects');
    const tabRtm = document.getElementById('art-tab-content-rtm');

    // Data Store for Project Artifacts
    const artifactsData = {
        cms: {
            title: "College Management System Validation Logs",
            cases: `
                <div class="qa-table-wrapper">
                    <table class="qa-table">
                        <thead>
                            <tr>
                                <th>Test Case ID</th>
                                <th>Description</th>
                                <th>Test Steps</th>
                                <th>Expected Result</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>CMS-TC-001</strong></td>
                                <td>Verify student admission form submission with valid inputs.</td>
                                <td>1. Navigate to Admission form.<br>2. Enter valid details.<br>3. Click Submit.</td>
                                <td>Form submitted successfully; DB inserts record.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>CMS-TC-002</strong></td>
                                <td>Verify email format validation in admission form.</td>
                                <td>1. Enter 'invalid-email-format' in Email field.<br>2. Submit form.</td>
                                <td>Inline validation error displays: "Enter a valid email".</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>CMS-TC-003</strong></td>
                                <td>Verify Fee submission invoice PDF generation.</td>
                                <td>1. Pay tuition fees.<br>2. Click 'Download Invoice'.</td>
                                <td>PDF generated with correct fees, transaction ID, and name.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>CMS-TC-004</strong></td>
                                <td>Verify student attendance search filter by Date Range.</td>
                                <td>1. Enter Start Date & End Date.<br>2. Click Filter.</td>
                                <td>Displays attendance records only within the selected range.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            defects: `
                <div class="jira-defect-card">
                    <div class="jira-header">
                        <span class="jira-key">CMS-BUG-07 (High Severity)</span>
                        <span class="jira-status-resolved">Retested & Closed</span>
                    </div>
                    <div class="jira-title">Fee payment gateway page freezes on slow 3G/2G connections</div>
                    <div class="jira-details-grid">
                        <div class="jira-field"><span>Component</span><strong>Fee Module</strong></div>
                        <div class="jira-field"><span>Environment</span><strong>Mobile & Web Webkit</strong></div>
                        <div class="jira-field"><span>Reporter</span><strong>Sakshata Mane</strong></div>
                        <div class="jira-field"><span>Assignee</span><strong>Dev. Team Lead</strong></div>
                    </div>
                    <div class="jira-description">
                        <p><strong>Description:</strong> When executing transaction payments on throttled networks (Fast 3G/Slow 3G), the checkout container freezes upon redirection, preventing confirmation callback.</p>
                        <p><strong>Steps to Reproduce:</strong></p>
                        <ul class="jira-steps">
                            <li>Throttle browser connection to 'Slow 3G' via DevTools.</li>
                            <li>Navigate to Fee payment page and trigger test payment checkout.</li>
                            <li>Observe loading spinner freezes and transaction times out without server callback.</li>
                        </ul>
                        <div class="jira-expected">
                            <strong>Expected Result:</strong> An elegant timeout error message should display, letting the user retry the operation, while reclaiming connection resources.
                        </div>
                    </div>
                </div>
            `,
            rtm: `
                <div class="qa-table-wrapper">
                    <table class="qa-table rtm-table">
                        <thead>
                            <tr>
                                <th>Requirement ID</th>
                                <th>Requirement Description</th>
                                <th>Test Case ID(s)</th>
                                <th>Associated Defect ID</th>
                                <th>Validation Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>REQ-CMS-AD-01</strong></td>
                                <td>System must accept online admission submissions and validate data.</td>
                                <td>CMS-TC-001, CMS-TC-002</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-CMS-FE-04</strong></td>
                                <td>System must process payment transfers and render receipts.</td>
                                <td>CMS-TC-003</td>
                                <td>CMS-BUG-07</td>
                                <td><span class="badge-pass">RE-TESTED PASS</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-CMS-AT-09</strong></td>
                                <td>Admin must be able to filter attendance logs.</td>
                                <td>CMS-TC-004</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        lms: {
            title: "Learning Management System (LMS) Testing Logs",
            cases: `
                <div class="qa-table-wrapper">
                    <table class="qa-table">
                        <thead>
                            <tr>
                                <th>Test Case ID</th>
                                <th>Description</th>
                                <th>Test Steps</th>
                                <th>Expected Result</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>LMS-TC-012</strong></td>
                                <td>Verify quiz auto-submits upon timer expiration.</td>
                                <td>1. Start quiz.<br>2. Wait for duration to count down to 00:00.<br>3. Check submission page.</td>
                                <td>Quiz halts immediately and auto-submits current inputs to server.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>LMS-TC-013</strong></td>
                                <td>Validate API response code and schema for /api/v1/courses.</td>
                                <td>1. Send GET request via Postman.<br>2. Assert status code & schema fields.</td>
                                <td>Status is 200 OK; response schema matches defined JSON structure.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>LMS-TC-014</strong></td>
                                <td>Verify JMeter response latency under concurrent quiz stress.</td>
                                <td>1. Load JMeter test script.<br>2. Generate 100 threads/sec load.<br>3. Run test.</td>
                                <td>95% of requests return response times under 1.5 seconds.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>LMS-TC-015</strong></td>
                                <td>Verify Course Video progress bar syncing on session reload.</td>
                                <td>1. Play course video to 05:42.<br>2. Log out & log back in.<br>3. Open course.</td>
                                <td>Video resumes playback exactly at 05:42 progress state.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            defects: `
                <div class="jira-defect-card">
                    <div class="jira-header">
                        <span class="jira-key">LMS-BUG-19 (Medium Severity)</span>
                        <span class="jira-status-resolved">Retested & Closed</span>
                    </div>
                    <div class="jira-title">Response latency of course API endpoint exceeds 2.5 seconds at 50 requests/sec</div>
                    <div class="jira-details-grid">
                        <div class="jira-field"><span>Component</span><strong>Course API Layer</strong></div>
                        <div class="jira-field"><span>Environment</span><strong>Staging Server (API-v1)</strong></div>
                        <div class="jira-field"><span>Reporter</span><strong>Sakshata Mane</strong></div>
                        <div class="jira-field"><span>Assignee</span><strong>Backend Developer</strong></div>
                    </div>
                    <div class="jira-description">
                        <p><strong>Description:</strong> Performance evaluation using Apache JMeter identified a high response latency on GET request `/api/v1/courses` during concurrently loaded threads (50 users/sec).</p>
                        <p><strong>Steps to Reproduce:</strong></p>
                        <ul class="jira-steps">
                            <li>Configure Postman collection or JMeter project thread count to 50 concurrent loops.</li>
                            <li>Point destination host to API endpoint.</li>
                            <li>Run load thread and inspect response times in listener graphs.</li>
                        </ul>
                        <div class="jira-expected">
                            <strong>Expected Result:</strong> API response should remain &lt; 1.0 second under ordinary load limits. Backend caching needs to be activated.
                        </div>
                    </div>
                </div>
            `,
            rtm: `
                <div class="qa-table-wrapper">
                    <table class="qa-table rtm-table">
                        <thead>
                            <tr>
                                <th>Requirement ID</th>
                                <th>Requirement Description</th>
                                <th>Test Case ID(s)</th>
                                <th>Associated Defect ID</th>
                                <th>Validation Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>REQ-LMS-QZ-03</strong></td>
                                <td>Quiz must enforce strict timing checks and handle submissions.</td>
                                <td>LMS-TC-012</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-LMS-AP-08</strong></td>
                                <td>API layers must feed course grids reliably under loads.</td>
                                <td>LMS-TC-013, LMS-TC-014</td>
                                <td>LMS-BUG-19</td>
                                <td><span class="badge-pass">RE-TESTED PASS</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-LMS-VD-05</strong></td>
                                <td>System must cache video playback status for active sessions.</td>
                                <td>LMS-TC-015</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        mobile: {
            title: "Mobile App Validation (Android & iOS)",
            cases: `
                <div class="qa-table-wrapper">
                    <table class="qa-table">
                        <thead>
                            <tr>
                                <th>Test Case ID</th>
                                <th>Description</th>
                                <th>Test Steps</th>
                                <th>Expected Result</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>MOB-TC-004</strong></td>
                                <td>Verify screen responsiveness on multiple screen ratios.</td>
                                <td>1. Launch app on Pixel 8 (Android) & iPhone 15 (iOS).<br>2. Verify key menu structures.</td>
                                <td>No layout breaks or overlapping text layers observed.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>MOB-TC-005</strong></td>
                                <td>Verify video cache state during network transition states.</td>
                                <td>1. Play lecture video.<br>2. Toggle network off.<br>3. Reconnect internet.</td>
                                <td>App streams offline buffered states, then auto-syncs without crashing.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                            <tr>
                                <td><strong>MOB-TC-006</strong></td>
                                <td>Verify Push Notification redirection to course module.</td>
                                <td>1. Send mock push notification alert.<br>2. Tap notification.</td>
                                <td>App wakes up and opens destination course view immediately.</td>
                                <td><span class="badge-pass">PASSED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            defects: `
                <div class="jira-defect-card">
                    <div class="jira-header">
                        <span class="jira-key">MOB-BUG-03 (Critical Severity)</span>
                        <span class="jira-status-resolved">Retested & Closed</span>
                    </div>
                    <div class="jira-title">App crashes when switching quickly between landscape and portrait orientations during video playback</div>
                    <div class="jira-details-grid">
                        <div class="jira-field"><span>Component</span><strong>Video Rendering Engine</strong></div>
                        <div class="jira-field"><span>Environment</span><strong>Android 14 (API 34) & iOS 17</strong></div>
                        <div class="jira-field"><span>Reporter</span><strong>Sakshata Mane</strong></div>
                        <div class="jira-field"><span>Assignee</span><strong>Mobile Engineer</strong></div>
                    </div>
                    <div class="jira-description">
                        <p><strong>Description:</strong> While playing mp4 streaming files inside mobile modules, shifting screen aspect ratio configurations too quickly crashes the rendering thread with a NullPointer exception.</p>
                        <p><strong>Steps to Reproduce:</strong></p>
                        <ul class="jira-steps">
                            <li>Open course video streaming viewport.</li>
                            <li>Rotate device from portrait to landscape and back within 1 second.</li>
                            <li>Observe app execution freezes, dumps stack trace, and shuts down.</li>
                        </ul>
                        <div class="jira-expected">
                            <strong>Expected Result:</strong> Activity instance state must handle orientation modifications gracefully without breaking the layout or crashing thread executions.
                        </div>
                    </div>
                </div>
            `,
            rtm: `
                <div class="qa-table-wrapper">
                    <table class="qa-table rtm-table">
                        <thead>
                            <tr>
                                <th>Requirement ID</th>
                                <th>Requirement Description</th>
                                <th>Test Case ID(s)</th>
                                <th>Associated Defect ID</th>
                                <th>Validation Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>REQ-MOB-UI-01</strong></td>
                                <td>App layouts must scale across modern phone ratios.</td>
                                <td>MOB-TC-004</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-MOB-VD-08</strong></td>
                                <td>Video streaming viewport must preserve orientation states.</td>
                                <td>MOB-TC-005</td>
                                <td>MOB-BUG-03</td>
                                <td><span class="badge-pass">RE-TESTED PASS</span></td>
                            </tr>
                            <tr>
                                <td><strong>REQ-MOB-NT-02</strong></td>
                                <td>System must catch and redirect wake push actions.</td>
                                <td>MOB-TC-006</td>
                                <td>None</td>
                                <td><span class="badge-pass">COMPLETED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        }
    };

    // Open Modal Action
    inspectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectType = btn.getAttribute('data-qa-project');
            const data = artifactsData[projectType];
            
            if (data) {
                // Populate Modal Data
                artifactModalTitle.textContent = data.title;
                tabCases.innerHTML = data.cases;
                tabDefects.innerHTML = data.defects;
                tabRtm.innerHTML = data.rtm;
                
                // Show modal
                artifactsModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Disable page scrolling
                
                // Reset active tabs
                resetArtifactTabs();
            }
        });
    });

    // Close Modal Action
    if (closeArtifactsBtn) {
        closeArtifactsBtn.addEventListener('click', () => {
            artifactsModal.classList.add('hidden');
            document.body.style.overflow = ''; // Re-enable page scrolling
        });
    }

    // Modal Outer Click Close
    window.addEventListener('click', (e) => {
        if (e.target === artifactsModal) {
            artifactsModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Reset Tabs back to first state (Test Cases)
    function resetArtifactTabs() {
        artTabBtns.forEach(btn => btn.classList.remove('active'));
        artTabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Select first active
        document.querySelector('.art-tab-btn[data-art-tab="cases"]').classList.add('active');
        tabCases.classList.add('active');
    }

    // Tab Navigation Logic
    artTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from buttons
            artTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch panel active state
            const targetTab = btn.getAttribute('data-art-tab');
            artTabPanels.forEach(panel => panel.classList.remove('active'));
            
            if (targetTab === 'cases') tabCases.classList.add('active');
            if (targetTab === 'defects') tabDefects.classList.add('active');
            if (targetTab === 'rtm') tabRtm.classList.add('active');
        });
    });

    // --- 9. NEW SECTION ANNOTATIONS ---
    const extraSections = [
        { selector: '#about', tag: '<section#about.about-section>' },
        { selector: '#why-hire', tag: '<section#why-hire.why-hire-section>' },
        { selector: '#services', tag: '<section#services.services-section>' }
    ];
    extraSections.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.setAttribute('data-dom-inspect', item.tag);
        }
    });

    // --- 10. PAGE LOADER LOGIC ---
    startStatsCounters();
    startTypingAnimation();
    initSkillBars();

    // --- 11. DARK MODE THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    // --- 12. HERO TYPING ANIMATION ---
    const roles = ["Manual Testing Engineer", "QA Engineer", "Software Test Engineer"];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    const typingTextEl = document.getElementById('typing-text');
    let isDeleting = false;
    let typingSpeed = 100;

    function startTypingAnimation() {
        if (!typingTextEl) return;
        
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            typingTextEl.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typingTextEl.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; // normal typing
        }
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // pause at end of word
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before next word
        }
        
        setTimeout(startTypingAnimation, typingSpeed);
    }

    // --- 13. STATS COUNT-UP ANIMATION ---
    let statsAnimated = false;
    function startStatsCounters() {
        if (statsAnimated) return;
        const statCardsSection = document.getElementById('about');
        if (!statCardsSection) return;
        
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statCardsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-num');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-val'));
            const duration = 1500;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(progress * target);
                
                counter.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // --- 14. SKILL PROGRESS BARS TRIGGER ---
    function initSkillBars() {
        const skillsSection = document.getElementById('skills');
        const progressFills = document.querySelectorAll('.skill-progress-fill');
        if (!skillsSection || progressFills.length === 0) return;
        
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-progress');
                        fill.style.width = targetWidth;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(skillsSection);
    }

    // --- 15. FLOATING BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
