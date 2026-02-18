/**
 * ------------------------------------------------------------------
 * STATE MANAGEMENT
 * ------------------------------------------------------------------
 */
const appState = {
    currentView: 'view-splash',
    currentClass: null,
    currentSection: null,
    slideIndex: 0,
    quizScore: 0,
    quizIndex: 0,
    soundEnabled: true // Default to true
};

/**
 * ------------------------------------------------------------------
 * SERVICE WORKER REGISTRATION (PWA)
 * ------------------------------------------------------------------
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

/**
 * ------------------------------------------------------------------
 * SVG FACTORY (The Visual Engine)
 * ------------------------------------------------------------------
 */

// Helper to calculate coordinates on a circle
function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function createPieSlicePath(startPercent, endPercent) {
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

    // SVG Path: Move to center (0,0) -> Line to start -> Arc to end -> Close
    return `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

function renderSVG(type, params) {
    if (type === 'fraction' || type === 'whole') {
        const { numerator, denominator, color, label } = params;
        
        let paths = '';
        
        if (type === 'whole') {
             paths = `<circle cx="0" cy="0" r="1" fill="${color}" stroke="#fff" stroke-width="0.05" />`;
        } else {
            // Draw all slices, but highlight the numerator amount
            for(let i=0; i<denominator; i++) {
                const start = i / denominator;
                const end = (i + 1) / denominator;
                const isActive = i < numerator;
                const sliceColor = isActive ? color : '#eee';
                paths += `<path d="${createPieSlicePath(start, end)}" fill="${sliceColor}" stroke="#fff" stroke-width="0.05" />`;
            }
        }

        // Add Label Text centered
        const textTag = label ? `<text x="0" y="0.2" text-anchor="middle" font-size="0.5" fill="#333" font-weight="bold" style="pointer-events:none;">${label}</text>` : '';

        return `
            <svg viewBox="-1.1 -1.1 2.2 2.2" style="transform: rotate(-90deg); overflow: visible; width:100%; height:100%; max-width:200px; max-height:200px;">
                <filter id="shadow"><feDropShadow dx="0.05" dy="0.05" stdDeviation="0.05" flood-opacity="0.3"/></filter>
                <g filter="url(#shadow)">${paths}</g>
                <g transform="rotate(90)">${textTag}</g>
            </svg>
        `;
    }
}

/**
 * ------------------------------------------------------------------
 * AUDIO ENGINE (Synthesizer)
 * ------------------------------------------------------------------
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!appState.soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(554, now + 0.1); // C#5
        osc.frequency.setValueAtTime(659, now + 0.2); // E5
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    }
}

/**
 * ------------------------------------------------------------------
 * NAVIGATION LOGIC
 * ------------------------------------------------------------------
 */
function switchView(viewId) {
    document.querySelectorAll('.view-container').forEach(el => el.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    appState.currentView = viewId;
    playSound('click');
}

function renderContent(section) {
    appState.currentSection = section;
    const container = document.getElementById('dynamic-content');
    container.innerHTML = '';
    
    // Update sidebar active state
    document.querySelectorAll('.btn-nav').forEach(b => {
        b.classList.toggle('active', b.dataset.section === section);
    });

    const data = curriculumData[appState.currentClass];

    if (section === 'tujuan') {
        container.innerHTML = `<div class="slide-container">${data.tujuan}</div>`;
    } 
    else if (section === 'materi') {
        appState.slideIndex = 0;
        renderSlide(container, data.slides);
    }
    else if (section === 'game') {
        initGame(container, data.gameLevel);
    }
    else if (section === 'kuis') {
        appState.quizScore = 0;
        appState.quizIndex = 0;
        renderQuiz(container, data.quiz);
    }
}

/**
 * ------------------------------------------------------------------
 * MODULE: SLIDES
 * ------------------------------------------------------------------
 */
function renderSlide(container, slides) {
    const slide = slides[appState.slideIndex];
    const svgHTML = renderSVG(slide.visualType, slide);

    const html = `
        <div class="slide-container">
            <div class="slide-text">
                <h2 style="font-size: 2.5rem; color: var(--color-blue-dark); margin: 0 0 1rem 0;">${slide.title}</h2>
                <p style="margin:0;">${slide.text}</p>
                <div class="slide-controls">
                    <button class="btn btn-primary" id="prev-slide" ${appState.slideIndex === 0 ? 'disabled style="opacity:0.5"' : ''}>⬅ Kembali</button>
                    <button class="btn btn-primary" id="next-slide">${appState.slideIndex === slides.length-1 ? 'Main Game! 🎮' : 'Lanjut ➡'}</button>
                </div>
            </div>
            <div class="slide-visual">
                ${svgHTML}
            </div>
        </div>
    `;
    container.innerHTML = html;

    // Bind events
    document.getElementById('prev-slide').onclick = () => {
        if(appState.slideIndex > 0) {
            appState.slideIndex--;
            renderSlide(container, slides);
            playSound('click');
        }
    };
    document.getElementById('next-slide').onclick = () => {
        if(appState.slideIndex < slides.length - 1) {
            appState.slideIndex++;
            renderSlide(container, slides);
            playSound('click');
        } else {
            // FINISHED SLIDES -> GO TO GAME
            renderContent('game');
            playSound('correct'); // Positive reinforcement
        }
    };
}

/**
 * ------------------------------------------------------------------
 * MODULE: GAME (DRAG & DROP)
 * ------------------------------------------------------------------
 */
function initGame(container, gameConfig) {
    // Game HTML Structure
    container.innerHTML = `
        <div class="game-area">
            <h2 style="text-align:center; padding-top:10px; margin: 0.5rem;">${gameConfig.title}</h2>
            <p style="text-align:center; font-size:1.2rem; margin: 0.5rem;">${gameConfig.instruction}</p>
            
            <div class="drop-zone" id="plate">
                <span style="font-size: 3rem; opacity: 0.3;">🍽</span>
            </div>
            
            <div id="draggables-container">
                <!-- Items injected here -->
            </div>
            
            <div id="game-feedback" class="hidden" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:2rem; border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.3); text-align:center; z-index: 1001; border: 4px solid var(--color-grass);">
                <h1 style="color: var(--color-grass-dark); font-size: 3rem;">Benar! 🎉</h1>
                <button class="btn btn-primary" onclick="renderContent('kuis')">Lanjut ke Kuis</button>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    const plate = document.getElementById('plate');

    // Create Draggable Items
    gameConfig.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.dataset.id = item.id;
        
        // Use SVG Factory
        div.innerHTML = renderSVG('fraction', { 
            numerator: 1, 
            denominator: item.denominator, 
            color: item.color, 
            label: item.label 
        });

        // Add to Flex Container (Relative positioning handled by flow)
        draggablesContainer.appendChild(div);

        // Attach Pointer Events
        setupDrag(div, plate, gameConfig.targetValue);
    });
}

function setupDrag(element, targetZone, targetValue) {
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

    element.onpointerdown = function(e) {
        isDragging = true;
        element.setPointerCapture(e.pointerId);
        
        // Record start pointer position
        startX = e.clientX;
        startY = e.clientY;
        
        // We use transform for movement, so reset any transition
        element.style.transition = 'none';
        element.style.zIndex = 1000;
        
        playSound('click');
    };

    element.onpointermove = function(e) {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Move visually
        element.style.transform = `translate(${dx}px, ${dy}px)`;
        
        // Simple collision detection (visual feedback)
        const itemRect = element.getBoundingClientRect();
        const zoneRect = targetZone.getBoundingClientRect();
        
        if (isOverlapping(itemRect, zoneRect)) {
            targetZone.classList.add('hovered');
        } else {
            targetZone.classList.remove('hovered');
        }
    };

    element.onpointerup = function(e) {
        if (!isDragging) return;
        isDragging = false;
        element.releasePointerCapture(e.pointerId);
        element.style.zIndex = '';
        targetZone.classList.remove('hovered');

        const itemRect = element.getBoundingClientRect();
        const zoneRect = targetZone.getBoundingClientRect();

        if (isOverlapping(itemRect, zoneRect)) {
            const val = parseFloat(element.dataset.value);
            if (val === targetValue) {
                // CORRECT
                playSound('correct');
                element.classList.add('snapped'); // Hide the dragged item
                
                // Show visual in plate (cloned)
                targetZone.innerHTML = element.innerHTML;
                
                document.getElementById('game-feedback').classList.remove('hidden');
                document.body.style.backgroundColor = '#d4ffdc';
                setTimeout(() => document.body.style.backgroundColor = '#E0F7FA', 500);

            } else {
                // WRONG VALUE
                playSound('wrong');
                targetZone.classList.add('shake');
                setTimeout(() => targetZone.classList.remove('shake'), 500);
                springBack(element);
            }
        } else {
            // MISSED TARGET
            springBack(element);
        }
    };
}

function isOverlapping(rect1, rect2) {
    const distance = Math.hypot(
        (rect1.x + rect1.width/2) - (rect2.x + rect2.width/2),
        (rect1.y + rect1.height/2) - (rect2.y + rect2.height/2)
    );
    return distance < (rect2.width / 2); // Within radius roughly
}

function springBack(element) {
    // Revert transform to 0,0 (original flow position)
    element.style.transition = 'transform 0.3s ease-out';
    element.style.transform = 'translate(0px, 0px)';
}

/**
 * ------------------------------------------------------------------
 * MODULE: QUIZ
 * ------------------------------------------------------------------
 */
function renderQuiz(container, questions) {
    if (appState.quizIndex >= questions.length) {
        // End Screen
        const scorePct = Math.round((appState.quizScore / questions.length) * 100);
        let msg = scorePct === 100 ? "Luar Biasa!" : (scorePct > 60 ? "Bagus Sekali!" : "Tetap Semangat!");
        
        container.innerHTML = `
            <div class="quiz-container">
                <h1>${msg}</h1>
                <p>Nilai Kamu:</p>
                <div style="font-size: 5rem; color: var(--color-blue); font-weight:bold; margin: 1rem;">${scorePct}</div>
                <div style="margin-top: 2rem; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-primary" onclick="renderContent('materi')">Pelajari Lagi</button>
                    <button class="btn btn-primary" onclick="switchView('view-menu')">Menu Utama</button>
                </div>
            </div>
        `;
        playSound('correct');
        return;
    }

    const q = questions[appState.quizIndex];
    let optionsHTML = '';
    
    q.options.forEach((opt, idx) => {
        optionsHTML += `<button class="btn btn-option" onclick="handleQuizAnswer(this, ${opt.correct})">${opt.label}</button>`;
    });

    container.innerHTML = `
        <div class="quiz-container">
            <div style="margin-bottom:1rem; color:#888;">Pertanyaan ${appState.quizIndex + 1} / ${questions.length}</div>
            <div class="quiz-question">${q.q}</div>
            <div class="quiz-options">${optionsHTML}</div>
        </div>
    `;
}

window.handleQuizAnswer = function(btn, isCorrect) {
    const btns = document.querySelectorAll('.btn-option');
    btns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct');
        appState.quizScore++;
        playSound('correct');
    } else {
        btn.classList.add('wrong');
        playSound('wrong');
    }

    setTimeout(() => {
        appState.quizIndex++;
        renderQuiz(document.getElementById('dynamic-content'), curriculumData[appState.currentClass].quiz);
    }, 1500);
};

/**
 * ------------------------------------------------------------------
 * INITIALIZATION & EVENT LISTENERS
 * ------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Splash Start
    document.getElementById('btn-splash-start').addEventListener('click', () => {
        switchView('view-menu');
    });

    // Settings Modal Logic
    const modal = document.getElementById('modal-settings');
    const btnToggleSound = document.getElementById('btn-toggle-sound');

    document.getElementById('btn-settings').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    btnToggleSound.addEventListener('click', () => {
        appState.soundEnabled = !appState.soundEnabled;
        btnToggleSound.innerText = appState.soundEnabled ? 'Nyala 🔊' : 'Mati 🔇';
        if(appState.soundEnabled && audioCtx.state === 'suspended') audioCtx.resume();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        appState.slideIndex = 0;
        appState.quizIndex = 0;
        appState.quizScore = 0;
        alert('Progress berhasil direset!');
        modal.classList.add('hidden');
    });

    // Class Selection
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', () => {
            const classId = card.dataset.class;
            if (card.classList.contains('disabled')) return;

            appState.currentClass = classId;
            switchView('view-dashboard');
            renderContent('tujuan');
        });
    });

    // Dashboard Navigation
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', () => {
            renderContent(btn.dataset.section);
            playSound('click');
        });
    });

    // Back Buttons
    document.getElementById('btn-home').addEventListener('click', () => {
        switchView('view-menu');
    });
    
    document.getElementById('btn-back-to-splash').addEventListener('click', () => {
        switchView('view-splash');
    });
});