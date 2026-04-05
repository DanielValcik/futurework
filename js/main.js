/* ═══════════════════════════════════════════════════════════
   FUTURE OF PRODUCT TEAMS — Main Script
   Inspired by melboucierayane.com
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

    // ─── Theme Toggle ──────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');

    function setTheme(dark) {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(!isDark);
    });

    // ─── Preloader ─────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        initHeroAnimation();
    }, 2500);

    // ─── Hero Animation ────────────────────────────────────
    function initHeroAnimation() {
        const words = document.querySelectorAll('.hero-word');
        const sub = document.getElementById('hero-sub');
        const role = document.getElementById('hero-role');

        words.forEach((word, i) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, 200 + i * 60);
        });

        const totalWordTime = 200 + words.length * 60;
        setTimeout(() => sub.classList.add('animate'), totalWordTime + 200);
        setTimeout(() => role.classList.add('animate'), totalWordTime + 400);
    }

    // ─── Blur Fade Reveal ──────────────────────────────────
    const blurElements = document.querySelectorAll('.blur-fade');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => entry.target.classList.add('revealed'), delay * 1000);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '-80px 0px' }
    );
    blurElements.forEach((el) => revealObserver.observe(el));

    // ─── Scroll Progress ───────────────────────────────────
    const progressBar = document.querySelector('.scroll-progress-bar');

    // ─── Navbar ────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // ─── Scroll Sidebar ────────────────────────────────────
    const sidebar = document.getElementById('scroll-sidebar');
    const sidebarTrack = document.getElementById('sidebar-track');
    const sidebarCursor = document.getElementById('sidebar-cursor');
    const sidebarLabels = document.querySelectorAll('.sidebar-label');

    // Generate sidebar bars
    const BAR_COUNT = 76;
    const BAR_SPACING = 10;
    const TRACK_HEIGHT = BAR_COUNT * BAR_SPACING;
    const barWidths = [];
    const barElements = [];

    if (sidebarTrack) {
        const basePattern = [6, 10, 6, 14, 6, 30, 12, 6, 16, 6];
        for (let i = 0; i < BAR_COUNT; i++) {
            const bar = document.createElement('div');
            const baseW = basePattern[i % basePattern.length];
            barWidths.push(baseW);
            bar.style.cssText = `
                position: absolute; left: 0; height: 1px;
                top: ${i * BAR_SPACING}px;
                width: ${baseW}px;
                background-color: var(--gray-4);
                transition: background-color 150ms ${EASE}, width 150ms ${EASE};
            `;
            sidebarTrack.appendChild(bar);
            barElements.push(bar);
        }
        sidebarTrack.style.height = TRACK_HEIGHT + 'px';
        sidebarTrack.style.position = 'relative';
    }

    // Position sidebar labels based on where the cursor will be
    // when each section's top reaches the viewport top (below navbar)
    function updateSidebarLabelPositions() {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollRange = docHeight - winHeight;
        if (scrollRange <= 0) return;

        const navOffset = 60; // navbar height offset
        sidebarLabels.forEach((label) => {
            const section = document.getElementById(label.dataset.target);
            if (!section) return;
            // scrollY when section header is at the top of the viewport
            const scrollAtSection = Math.max(0, section.offsetTop - navOffset);
            const scrollPercent = Math.min(1, scrollAtSection / scrollRange);
            label.style.top = (scrollPercent * TRACK_HEIGHT) + 'px';
        });
    }

    // Calculate on load and resize
    updateSidebarLabelPositions();
    window.addEventListener('resize', updateSidebarLabelPositions);
    // Recalculate after images/fonts load (layout may shift)
    window.addEventListener('load', updateSidebarLabelPositions);

    // Sidebar label click handlers
    sidebarLabels.forEach((label) => {
        label.addEventListener('click', () => {
            const target = document.getElementById(label.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── Sections for nav link tracking ─────────────────────
    const sections = document.querySelectorAll('.section');

    // Smooth scroll for nav links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── Hub Explainer (Scroll-Driven) ─────────────────────
    const explainerDiagram = document.getElementById('explainer-diagram');
    const explainerSteps = document.querySelectorAll('.explainer-step');

    if (explainerDiagram && explainerSteps.length) {
        const stepObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const step = entry.target.dataset.step;
                        // Update diagram state
                        explainerDiagram.dataset.step = step;
                        // Update active step highlight
                        explainerSteps.forEach((s) => {
                            s.classList.toggle('active', s.dataset.step === step);
                        });
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: '-20% 0px -20% 0px',
            }
        );
        explainerSteps.forEach((step) => stepObserver.observe(step));
        // Set first step active by default
        explainerSteps[0].classList.add('active');
    }

    // ─── Evolution Timeline (scroll-driven, IO trigger-line) ──
    const evoPeople = document.getElementById('evo-people');
    const evoYear = document.getElementById('evo-year');
    const evoSize = document.getElementById('evo-size');
    const evoTech = document.getElementById('evo-tech');
    const evoEras = document.querySelectorAll('.evo-era');
    const evoVisInner = document.querySelector('.evo-vis-inner');

    let evoDots = [];
    const EVO_MAX_DOTS = 22;
    let evoCurrentIdx = -1;

    if (evoPeople && evoEras.length) {
        // Create dot elements
        for (let i = 0; i < EVO_MAX_DOTS; i++) {
            const dot = document.createElement('div');
            dot.className = 'evo-person';
            evoPeople.appendChild(dot);
            evoDots.push(dot);
        }

        function evoSetEra(index) {
            if (index === evoCurrentIdx) return;
            evoCurrentIdx = index;
            const era = evoEras[index];
            if (!era) return;

            const targetPeople = parseInt(era.dataset.people, 10) || 5;
            const isHubs = era.dataset.hubs === 'true';

            evoYear.textContent = era.dataset.year;
            evoSize.textContent = era.dataset.size;
            evoTech.textContent = era.dataset.tech;

            if (evoVisInner) {
                evoVisInner.classList.toggle('now', era.classList.contains('evo-era--now'));
            }

            evoDots.forEach((dot, i) => {
                const isHub = isHubs && i >= targetPeople && i < targetPeople + 6;
                if (i < targetPeople) {
                    dot.className = 'evo-person';
                    dot.style.transitionDelay = (i * 30) + 'ms';
                } else if (isHub) {
                    dot.className = 'evo-person hub-dot';
                    dot.style.transitionDelay = ((i - targetPeople) * 60 + 200) + 'ms';
                } else {
                    dot.className = 'evo-person hidden';
                    dot.style.transitionDelay = ((EVO_MAX_DOTS - i) * 20) + 'ms';
                }
            });

            evoEras.forEach((e, i) => e.classList.toggle('active', i === index));
        }

        // Trigger-line pattern: rootMargin shrinks viewport to a thin line at ~45% from top
        // When an era's edge crosses this line, it becomes active
        const evoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = Array.from(evoEras).indexOf(entry.target);
                        if (idx !== -1) evoSetEra(idx);
                    }
                });
            },
            { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
        );
        evoEras.forEach((era) => evoObserver.observe(era));

        // Set initial state
        evoSetEra(0);
    }

    // ─── Stat Counter Animation ────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number');
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    statNumbers.forEach((el) => counterObserver.observe(el));

    // ─── Scroll Handler ────────────────────────────────────
    let ticking = false;
    let heroHeight = window.innerHeight;
    window.addEventListener('resize', () => { heroHeight = window.innerHeight; });

    function onScroll() {
        const scrollY = window.scrollY;
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

        // Navbar
        if (scrollY > heroHeight * 0.5) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
        if (scrollY > heroHeight * 0.8) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll indicator: follows the same fade/blur as hero content
        // (handled below together with heroContent)

        // Hero scroll-out + Stats scroll-in (connected transition)
        const heroContent = document.getElementById('hero-content');
        const statsSection = document.getElementById('stats');
        if (heroContent && statsSection) {
            const scrollOutStart = winHeight * 0.08;
            const scrollOutEnd = winHeight * 0.55;
            const progress = Math.max(0, Math.min(1, (scrollY - scrollOutStart) / (scrollOutEnd - scrollOutStart)));

            // Hero text: scale up + blur + fade out
            heroContent.style.transform = `translateY(${progress * -30}px) scale(${1 + progress * 0.1})`;
            heroContent.style.filter = `blur(${progress * 14}px)`;
            heroContent.style.opacity = 1 - progress;

            // Scroll indicator: same blur + fade as hero text
            if (scrollIndicator && progress > 0) {
                scrollIndicator.style.animation = 'none';
                scrollIndicator.style.filter = `blur(${progress * 14}px)`;
                scrollIndicator.style.opacity = 1 - progress;
                scrollIndicator.style.visibility = progress >= 1 ? 'hidden' : 'visible';
            }

            // Stats: start small + invisible (far away), arrive to normal as hero fades
            const statsProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.7)); // starts at 30% of hero fade
            const statsScale = 0.85 + statsProgress * 0.15;   // 0.85 → 1.0 (comes from "behind")
            const statsBlur = (1 - statsProgress) * 6;         // 6px → 0
            const statsOpacity = statsProgress;

            statsSection.style.transform = `scale(${statsScale})`;
            statsSection.style.filter = `blur(${statsBlur}px)`;
            statsSection.style.opacity = statsOpacity;
        }

        // Sidebar
        if (sidebar) {
            if (scrollY > heroHeight) {
                sidebar.classList.add('visible');
            } else {
                sidebar.classList.remove('visible');
            }

            // Cursor position maps scroll progress to track height
            const cursorY = Math.min(scrollPercent * TRACK_HEIGHT, TRACK_HEIGHT);
            sidebarCursor.style.top = cursorY + 'px';

            // Highlight bars near cursor
            const cursorBarIndex = cursorY / BAR_SPACING;
            for (let i = 0; i < barElements.length; i++) {
                const dist = Math.abs(cursorBarIndex - i);
                const baseW = barWidths[i];
                if (dist < 5) {
                    const factor = (1 - Math.cos((1 - dist / 5) * Math.PI)) / 2;
                    barElements[i].style.width = (baseW + 22 * factor) + 'px';
                    barElements[i].style.backgroundColor = 'var(--accent)';
                } else {
                    barElements[i].style.width = baseW + 'px';
                    barElements[i].style.backgroundColor = (barWidths[i] >= 30) ? 'var(--gray-7)' : 'var(--gray-4)';
                }
            }

            // Update active section (sidebar labels + nav links)
            // A section is active when its top has scrolled past the navbar
            const activeLine = scrollY + 80;
            let activeId = null;
            sections.forEach((s) => {
                if (s.id && s.offsetTop <= activeLine) {
                    activeId = s.id;
                }
            });
            sidebarLabels.forEach((label) => {
                label.classList.toggle('active', label.dataset.target === activeId);
            });
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.dataset.section === activeId);
            });
        }

    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    });

    // Initial call
    onScroll();

    // ─── Architecture Diagram: Interactive Hover ─────────
    const archSvg = document.querySelector('.arch-svg');
    const archTeams = document.querySelectorAll('.arch-g-team[data-team]');

    // Map: team → which hubs it connects to
    const teamHubMap = {
        growth: ['design', 'content', 'insights', 'security'],
        wallet: ['design', 'insights', 'security'],
        trade: ['design', 'insights', 'experiment', 'security'],
        earn: ['content', 'insights', 'experiment', 'security'],
        foundation: ['design', 'content', 'localisation', 'security'],
    };

    function activateTeam(teamId) {
        if (!archSvg) return;
        archSvg.classList.add('has-active');

        // Activate team node
        document.querySelector(`.arch-g-team[data-team="${teamId}"]`)?.classList.add('active');
        // Activate orchestrator
        document.querySelector(`.arch-g-orch[data-team="${teamId}"]`)?.classList.add('active');
        // Activate team→orch line
        document.querySelector(`.arch-team-lines[data-team="${teamId}"]`)?.classList.add('active');
        // Activate orch→hub lines
        document.querySelector(`.arch-hub-lines[data-team="${teamId}"]`)?.classList.add('active');
        // Activate security lines
        document.querySelector('.arch-security-lines')?.classList.add('active');
        // Activate connected hubs
        (teamHubMap[teamId] || []).forEach((hub) => {
            document.querySelector(`.arch-g-hub[data-hub="${hub}"]`)?.classList.add('active');
        });
    }

    function deactivateAll() {
        if (!archSvg) return;
        archSvg.classList.remove('has-active');
        archSvg.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
    }

    archTeams.forEach((team) => {
        team.addEventListener('mouseenter', () => activateTeam(team.dataset.team));
        team.addEventListener('mouseleave', deactivateAll);
    });

    // ─── Workflow Simulator v2 ────────────────────────────────
    const sim2 = document.getElementById('sim2');
    const sim2Play = document.getElementById('sim2-play');
    const sim2Log = document.getElementById('sim2-log');
    const sim2Visual = document.getElementById('sim2-visual');
    const sim2StepLabel = document.getElementById('sim2-step-label');
    const sim2Dots = document.querySelectorAll('.sim2-dot');

    const SIM_STEPS = [
        {
            messages: [
                { role: 'orchestrator', label: 'Orchestrator', text: 'Redesign the onboarding flow. We\'re losing mobile users at step 3 — seed phrase backup is confusing them.' },
            ],
            panel: null,
            label: 'Orchestrator defines the problem',
            pauseAfterMsg: 1500,
            panelDelay: 500,
        },
        {
            messages: [
                { role: 'system', label: 'System', text: 'Routing to Insights Hub...' },
                { role: 'insights', label: 'Insights Hub', text: 'Analysis complete. Drop-off at step 3: 47%. Exit surveys: 68% cite seed phrase confusion. Mobile conversion 23% below desktop.' },
            ],
            panel: 'insights',
            label: 'Insights Hub — validating the problem',
            pauseAfterMsg: 1200,
            panelDelay: 4500,
        },
        {
            messages: [
                { role: 'system', label: 'System', text: 'Mandatory security pre-check...' },
                { role: 'security', label: 'Security Hub', text: 'Audit complete. Biometric auth OK. Seed phrase flow compliant. 1 condition: add clipboard access warning on mobile.' },
            ],
            panel: 'security',
            label: 'Security Hub — mandatory checkpoint',
            pauseAfterMsg: 1200,
            panelDelay: 4500,
        },
        {
            messages: [
                { role: 'system', label: 'System', text: 'Approved. Generating design variants...' },
                { role: 'design', label: 'Design Hub', text: '3 onboarding variants generated within component library. All respect design tokens and accessibility guidelines.' },
            ],
            panel: 'design',
            label: 'Design Hub — generating variants',
            pauseAfterMsg: 1200,
            panelDelay: 5000,
        },
        {
            messages: [
                { role: 'system', label: 'System', text: 'Generating copy for all UI states...' },
                { role: 'content', label: 'Content Hub', text: '14 copy strings generated. 2 FAQ articles flagged for update. Tone verified against brand guidelines.' },
            ],
            panel: 'content',
            label: 'Content Hub — writing copy',
            pauseAfterMsg: 1200,
            panelDelay: 4500,
        },
        {
            messages: [
                { role: 'system', label: 'System', text: 'Feeding results back to Insights Hub. Knowledge captured.' },
            ],
            panel: 'summary',
            label: 'Cycle complete',
            pauseAfterMsg: 800,
            panelDelay: 3000,
        },
    ];

    function sim2AddMsg(role, label, text) {
        const msg = document.createElement('div');
        msg.className = `sim2-msg sim2-msg--${role}`;
        msg.innerHTML = `<div class="sim2-msg-role">${label}</div><p></p>`;
        sim2Log.appendChild(msg);
        sim2Log.scrollTop = sim2Log.scrollHeight;
        const p = msg.querySelector('p');
        const speed = role === 'system' ? 20 : 30;
        return new Promise((resolve) => {
            let i = 0;
            p.innerHTML = '<span class="typing-cursor"></span>';
            const interval = setInterval(() => {
                i++;
                if (i >= text.length) {
                    p.textContent = text;
                    clearInterval(interval);
                    resolve();
                } else {
                    p.innerHTML = text.slice(0, i) + '<span class="typing-cursor"></span>';
                }
            }, speed);
        });
    }

    function sim2ShowPanel(name) {
        sim2Visual.querySelectorAll('.sim2-panel').forEach(p => { p.classList.remove('active'); });
        const panel = sim2Visual.querySelector(`[data-panel="${name}"]`);
        if (panel) {
            // Force re-trigger animation
            panel.style.animation = 'none';
            panel.offsetHeight; // reflow
            panel.style.animation = '';
            panel.classList.add('active');
        }
    }

    function sim2UpdateDots(step) {
        sim2Dots.forEach((d, i) => {
            d.classList.toggle('active', i === step);
            d.classList.toggle('done', i < step);
        });
    }

    async function sim2Run() {
        sim2.classList.add('playing');
        sim2Log.innerHTML = '';
        sim2ShowPanel('empty');

        for (let s = 0; s < SIM_STEPS.length; s++) {
            const step = SIM_STEPS[s];
            sim2StepLabel.textContent = `Step ${s + 1}/${SIM_STEPS.length} — ${step.label}`;
            sim2UpdateDots(s);

            // Type each message with pause between them
            for (let m = 0; m < step.messages.length; m++) {
                const msg = step.messages[m];
                await sim2AddMsg(msg.role, msg.label, msg.text);
                // Pause after each message to let it sink in
                await new Promise(r => setTimeout(r, step.pauseAfterMsg || 1200));
            }

            // Show visual panel (if any)
            if (step.panel) {
                sim2ShowPanel(step.panel);
                // Let people study the visual output
                await new Promise(r => setTimeout(r, step.panelDelay || 4000));
            } else {
                await new Promise(r => setTimeout(r, 1500));
            }
        }

        // Done
        sim2StepLabel.textContent = 'Complete — knowledge captured for the next project';
        sim2UpdateDots(SIM_STEPS.length);
        sim2.classList.remove('playing');
        sim2Play.querySelector('span').textContent = 'Replay';
    }

    if (sim2Play) {
        sim2Play.addEventListener('click', () => {
            if (sim2.classList.contains('playing')) return;
            sim2Play.querySelector('span').textContent = 'Running...';
            sim2Run();
        });
    }

    // ─── Hero Canvas: Particle Network ─────────────────────
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];
        let w, h;
        const PARTICLE_COUNT = 70;
        const CONNECT_DIST = 120;
        let animId;
        let mouseX = -1000, mouseY = -1000;

        function resizeCanvas() {
            w = heroCanvas.parentElement.offsetWidth;
            h = heroCanvas.parentElement.offsetHeight;
            heroCanvas.width = w * window.devicePixelRatio;
            heroCanvas.height = h * window.devicePixelRatio;
            heroCanvas.style.width = w + 'px';
            heroCanvas.style.height = h + 'px';
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.5 + 0.5,
                    accent: Math.random() < 0.15,
                });
            }
        }

        function getColor() {
            const isDark = document.documentElement.classList.contains('dark');
            return {
                dot: isDark ? 'rgba(140,140,140,' : 'rgba(160,160,160,',
                line: isDark ? 'rgba(140,140,140,' : 'rgba(180,180,180,',
                accent: isDark ? 'rgba(29,185,84,' : 'rgba(21,128,61,',
            };
        }

        function drawParticles() {
            ctx.clearRect(0, 0, w, h);
            const c = getColor();

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.2;
                        const isAccent = particles[i].accent || particles[j].accent;
                        ctx.strokeStyle = (isAccent ? c.accent : c.line) + alpha + ')';
                        ctx.lineWidth = isAccent ? 0.8 : 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (const p of particles) {
                const alpha = p.accent ? 0.6 : 0.3;
                ctx.fillStyle = (p.accent ? c.accent : c.dot) + alpha + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function updateParticles() {
            for (const p of particles) {
                // Slight mouse repulsion
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150 * 0.3;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Wrap around
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;
            }
        }

        function animLoop() {
            updateParticles();
            drawParticles();
            animId = requestAnimationFrame(animLoop);
        }

        // Mouse tracking on hero
        document.getElementById('hero').addEventListener('mousemove', (e) => {
            const rect = heroCanvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        document.getElementById('hero').addEventListener('mouseleave', () => {
            mouseX = -1000; mouseY = -1000;
        });

        // Start after preloader
        setTimeout(() => {
            resizeCanvas();
            initParticles();
            animLoop();
        }, 2600);

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // ─── Keyboard ──────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── 90s Easter Egg (curtain reveal) ──────────────────
    const mainCurtain = document.getElementById('main-curtain');
    const retro90s = document.getElementById('retro-90s');
    const retroSpacer = document.getElementById('retro-scroll-spacer');

    if (mainCurtain && retro90s && retroSpacer) {
        const onScrollRetro = () => {
            const spacerRect = retroSpacer.getBoundingClientRect();
            const revealProgress = Math.max(0, Math.min(1, 1 - spacerRect.top / window.innerHeight));

            if (revealProgress > 0) {
                const lift = revealProgress * window.innerHeight;
                mainCurtain.style.transform = `translateY(-${lift}px)`;
                mainCurtain.style.boxShadow = `0 ${20 - revealProgress * 20}px ${60 - revealProgress * 40}px rgba(0,0,0,${0.5 - revealProgress * 0.5})`;
                retro90s.classList.add('visible');
            } else {
                mainCurtain.style.transform = '';
                mainCurtain.style.boxShadow = '';
                retro90s.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', onScrollRetro, { passive: true });
    }

})();
