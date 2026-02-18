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
    soundEnabled: true,
    gameScore: 0,
    // Scale Game Specific
    scaleTarget: null,
    scaleLocked: false
};

/**
 * ------------------------------------------------------------------
 * SVG FACTORY
 * ------------------------------------------------------------------
 */
function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function createPieSlicePath(startPercent, endPercent) {
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    return `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

function renderSVG(type, params) {
    if (type === 'text' || type === 'card') {
        const { label, color } = params;
        return `
            <svg viewBox="0 0 200 200" style="overflow: visible; width:100%; height:100%; max-width:200px; max-height:200px;">
                <defs><filter id="shadow-card"><feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.2"/></filter></defs>
                <rect x="10" y="10" width="180" height="180" rx="20" fill="${color || '#fff'}" stroke="${color ? 'white' : '#ccc'}" stroke-width="4" filter="url(#shadow-card)"/>
                <text x="100" y="110" text-anchor="middle" dominant-baseline="middle" font-size="50" font-weight="bold" fill="white" style="text-shadow: 2px 2px 0px rgba(0,0,0,0.1);">${label}</text>
            </svg>
        `;
    }
    const { numerator = 1, denominator = 1, color = '#4FB0C6', label } = params;
    let paths = '';
    if (type === 'whole') {
         paths = `<circle cx="0" cy="0" r="1" fill="${color}" stroke="#fff" stroke-width="0.05" />`;
    } else {
        for(let i=0; i<denominator; i++) {
            const start = i / denominator;
            const end = (i + 1) / denominator;
            const isActive = i < numerator;
            const sliceColor = isActive ? color : '#eee';
            paths += `<path d="${createPieSlicePath(start, end)}" fill="${sliceColor}" stroke="#fff" stroke-width="0.05" />`;
        }
    }
    const textTag = label ? `<text x="0" y="0.2" text-anchor="middle" font-size="0.5" fill="#333" font-weight="bold" style="pointer-events:none;">${label}</text>` : '';
    return `
        <svg viewBox="-1.1 -1.1 2.2 2.2" style="transform: rotate(-90deg); overflow: visible; width:100%; height:100%; max-width:200px; max-height:200px;">
            <filter id="shadow"><feDropShadow dx="0.05" dy="0.05" stdDeviation="0.05" flood-opacity="0.3"/></filter>
            <g filter="url(#shadow)">${paths}</g>
            <g transform="rotate(90)">${textTag}</g>
        </svg>
    `;
}

/**
 * ------------------------------------------------------------------
 * AUDIO ENGINE
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
        osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(554, now + 0.1); osc.frequency.setValueAtTime(659, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    }
}

/**
 * ------------------------------------------------------------------
 * NAVIGATION & RENDER
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
    document.querySelectorAll('.btn-nav').forEach(b => b.classList.toggle('active', b.dataset.section === section));

    const data = curriculumData[appState.currentClass];
    if (section === 'tujuan') container.innerHTML = `<div class="slide-container">${data.tujuan}</div>`;
    else if (section === 'materi') { appState.slideIndex = 0; renderSlide(container, data.slides); }
    else if (section === 'game') initGame(container, data.gameLevel);
    else if (section === 'kuis') { appState.quizScore = 0; appState.quizIndex = 0; renderQuiz(container, data.quiz); }
}

function renderSlide(container, slides) {
    const slide = slides[appState.slideIndex];
    const html = `
        <div class="slide-container">
            <div class="slide-text">
                <h2 style="color: var(--color-blue-dark);">${slide.title}</h2>
                <p>${slide.text}</p>
                <div class="slide-controls">
                    <button class="btn btn-primary" id="prev-slide" ${appState.slideIndex === 0 ? 'disabled' : ''}>⬅</button>
                    <button class="btn btn-primary" id="next-slide">${appState.slideIndex === slides.length-1 ? 'Main! 🎮' : '➡'}</button>
                </div>
            </div>
            <div class="slide-visual">${renderSVG(slide.visualType, slide)}</div>
        </div>
    `;
    container.innerHTML = html;
    document.getElementById('prev-slide').onclick = () => { if(appState.slideIndex > 0) { appState.slideIndex--; renderSlide(container, slides); }};
    document.getElementById('next-slide').onclick = () => { if(appState.slideIndex < slides.length - 1) { appState.slideIndex++; renderSlide(container, slides); } else renderContent('game'); };
}

/**
 * ------------------------------------------------------------------
 * HELPER: GHOST DRAG ENGINE (ROBUST FIX)
 * ------------------------------------------------------------------
 */
function setupUniversalDrag(element, onMove, onDrop) {
    // We attach the start listener to the element itself
    element.addEventListener('pointerdown', handleDragStart);

    function handleDragStart(e) {
        if (appState.scaleLocked) return;
        
        // Prevent default touch actions (scrolling)
        e.preventDefault();
        
        playSound('click');

        // 1. Calculate Offsets
        const rect = element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // 2. Create Ghost Element (The one that moves)
        // We clone the element to visualy represent the drag
        const ghost = element.cloneNode(true);
        ghost.classList.add('drag-ghost'); // See CSS
        ghost.style.position = 'fixed';
        ghost.style.left = rect.left + 'px';
        ghost.style.top = rect.top + 'px';
        ghost.style.width = rect.width + 'px';
        ghost.style.height = rect.height + 'px';
        ghost.style.zIndex = '99999';
        ghost.style.pointerEvents = 'none'; // Critical: allows hit testing beneath
        ghost.style.opacity = '0.9';
        ghost.style.margin = '0';
        document.body.appendChild(ghost);

        // 3. Hide Original (But keep layout space)
        element.style.opacity = '0';
        
        // 4. Global Event Listeners (Track mouse anywhere)
        const moveHandler = (moveEvent) => {
            const x = moveEvent.clientX - offsetX;
            const y = moveEvent.clientY - offsetY;
            ghost.style.left = x + 'px';
            ghost.style.top = y + 'px';

            // Hit Testing for Highlight logic
            // We pass the ghost (visual) coordinates to the callback
            if (onMove) onMove(moveEvent, ghost);
        };

        const upHandler = (upEvent) => {
            // Cleanup listeners immediately
            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', upHandler);

            // Execute Drop Logic
            // onDrop checks logic. If true, it means drop accepted.
            const success = onDrop ? onDrop(upEvent, ghost) : false;

            if (success) {
                // Drop successful: Ghost removed by consumer or just remove it
                ghost.remove();
                // Original element usually removed or hidden by game logic
            } else {
                // Drop failed: Revert animation
                const currentRect = ghost.getBoundingClientRect();
                const originalRect = element.getBoundingClientRect();
                
                // Animate ghost back to start
                ghost.style.transition = 'all 0.3s ease-out';
                ghost.style.left = originalRect.left + 'px';
                ghost.style.top = originalRect.top + 'px';
                
                // When animation ends
                setTimeout(() => {
                    ghost.remove();
                    element.style.opacity = '1';
                }, 300);
            }
        };

        // Attach to window to catch release outside element
        window.addEventListener('pointermove', moveHandler);
        window.addEventListener('pointerup', upHandler);
    }
}

/**
 * ------------------------------------------------------------------
 * GAMES
 * ------------------------------------------------------------------
 */
function initGame(container, gameConfig) {
    if (gameConfig.type === 'scales') initScalesGame(container, gameConfig);
    else initDefaultGame(container, gameConfig);
}

// === CLASS 4: SCALES GAME ===
function initScalesGame(container, gameConfig) {
    appState.scaleLocked = false;
    
    // Pick random target
    const randomTarget = gameConfig.targets[Math.floor(Math.random() * gameConfig.targets.length)];
    appState.scaleTarget = randomTarget;

    // Filter draggables
    let possibleCorrects = gameConfig.draggables.filter(d => 
        Math.abs(d.val - randomTarget.val) < 0.001 && d.label !== randomTarget.label
    );
    // Fallback if strict filter is too strict
    if (possibleCorrects.length === 0) possibleCorrects = gameConfig.draggables.filter(d => Math.abs(d.val - randomTarget.val) < 0.001);

    let distractors = gameConfig.draggables.filter(d => 
        Math.abs(d.val - randomTarget.val) > 0.001
    );

    // Build pool: 1 Correct + 5 Distractors
    const pool = [
        possibleCorrects[Math.floor(Math.random() * possibleCorrects.length)],
        ...distractors.sort(() => Math.random() - 0.5).slice(0, 5)
    ].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="game-area">
            <div class="game-header">
                <h2>${gameConfig.title}</h2>
                <div class="score-board">Skor: ${appState.gameScore}</div>
            </div>
            <div class="scale-wrapper" style="z-index: 10;">
                <div class="scale-system">
                    <div class="scale-beam" id="beam">
                        <div class="scale-pan-container pan-left" id="pan-left-container">
                             <div class="scale-chain"></div>
                             <div class="scale-pan">${renderSVG(randomTarget.type, randomTarget)}</div>
                        </div>
                        <div class="scale-pan-container pan-right" id="pan-right-container">
                             <div class="scale-chain"></div>
                             <div class="scale-pan" id="pan-right"></div>
                             <div class="scale-drop-target" id="scale-drop-zone"></div>
                        </div>
                    </div>
                    <div class="scale-base"></div>
                </div>
            </div>
            <div id="draggables-container"></div>
            <div id="game-feedback" class="hidden modal-overlay">
                <div class="modal-content">
                    <h1>Seimbang! 🎉</h1>
                    <button class="btn btn-primary" onclick="appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class4'].gameLevel)">Lanjut ➡</button>
                    <button class="btn btn-sm" onclick="renderContent('kuis')">Kuis</button>
                </div>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    
    pool.forEach(item => {
        if(!item) return;
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.innerHTML = renderSVG(item.type, item);
        draggablesContainer.appendChild(div);
        
        setupUniversalDrag(div, 
            // On Move (Highlight)
            (e, ghostEl) => {
                const dropZone = document.getElementById('scale-drop-zone');
                const panRight = document.getElementById('pan-right');
                
                const ghostRect = ghostEl.getBoundingClientRect();
                const zoneRect = dropZone.getBoundingClientRect();
                
                // Hit test
                const overlap = isOverlapping(ghostRect, zoneRect);
                panRight.classList.toggle('highlight-pan', overlap);
                
                // Physics Preview
                if (overlap) {
                    const draggedVal = parseFloat(div.dataset.value);
                    updateScaleTilt(appState.scaleTarget.val, draggedVal);
                } else {
                    updateScaleTilt(appState.scaleTarget.val, 0);
                }
            },
            // On Drop
            (e, ghostEl) => {
                const dropZone = document.getElementById('scale-drop-zone');
                const panRight = document.getElementById('pan-right');
                
                const ghostRect = ghostEl.getBoundingClientRect();
                const zoneRect = dropZone.getBoundingClientRect();
                
                // Clean highlight
                panRight.classList.remove('highlight-pan');

                if (isOverlapping(ghostRect, zoneRect)) {
                    appState.scaleLocked = true;
                    const draggedVal = parseFloat(div.dataset.value);
                    const targetVal = appState.scaleTarget.val;
                    
                    updateScaleTilt(targetVal, draggedVal);

                    if (Math.abs(draggedVal - targetVal) < 0.001) {
                        playSound('correct');
                        // Render result in pan
                        panRight.innerHTML = `<div class="scale-item-placed">${div.innerHTML}</div>`;
                        div.style.display = 'none'; // Hide original
                        setTimeout(() => document.getElementById('game-feedback').classList.remove('hidden'), 1000);
                        return true;
                    } else {
                        playSound('wrong');
                        setTimeout(() => {
                            updateScaleTilt(targetVal, 0);
                            appState.scaleLocked = false;
                        }, 1200);
                        return false; 
                    }
                }
                return false;
            }
        );
    });

    updateScaleTilt(appState.scaleTarget.val, 0);
}

function updateScaleTilt(leftVal, rightVal) {
    const beam = document.getElementById('beam');
    const panLeft = document.getElementById('pan-left-container');
    const panRight = document.getElementById('pan-right-container');
    
    const diff = rightVal - leftVal;
    const angle = Math.max(-20, Math.min(20, diff * 40)); 

    beam.style.transform = `rotate(${angle}deg)`;
    panLeft.style.transform = `rotate(${-angle}deg)`;
    panRight.style.transform = `rotate(${-angle}deg)`;
}

// === CLASS 2: DEFAULT GAME (REPLAYABLE) ===
function initDefaultGame(container, gameConfig) {
    const randomTarget = gameConfig.targets[Math.floor(Math.random() * gameConfig.targets.length)];
    appState.scaleTarget = randomTarget;
    
    const instruction = gameConfig.instruction.replace('[TARGET]', randomTarget.label);

    container.innerHTML = `
        <div class="game-area">
            <div class="game-header">
                <h2>${gameConfig.title}</h2>
                <div class="score-board">Skor: ${appState.gameScore}</div>
            </div>
            <p style="text-align:center; font-size:1.2rem;">${instruction}</p>
            <div class="drop-zone" id="plate"><span style="font-size: 3rem; opacity: 0.3;">${gameConfig.targetIcon}</span></div>
            <div id="draggables-container"></div>
            <div id="game-feedback" class="hidden modal-overlay">
                <div class="modal-content">
                    <h1>Mantap! 🍕</h1>
                    <button class="btn btn-primary" onclick="appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class2'].gameLevel)">Lanjut Round Baru ➡</button>
                    <button class="btn btn-sm" onclick="renderContent('kuis')">Ke Kuis</button>
                </div>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    const plate = document.getElementById('plate');

    // Build Pool
    let possibleCorrects = gameConfig.items.filter(d => Math.abs(d.val - randomTarget.val) < 0.001);
    let distractors = gameConfig.items.filter(d => Math.abs(d.val - randomTarget.val) > 0.001);
    if (possibleCorrects.length === 0) possibleCorrects = [gameConfig.items[0]]; 

    const pool = [
        possibleCorrects[Math.floor(Math.random() * possibleCorrects.length)],
        ...distractors.sort(() => Math.random() - 0.5).slice(0, 5)
    ].sort(() => Math.random() - 0.5);

    pool.forEach((item) => {
        if(!item) return;
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.innerHTML = renderSVG(item.type || 'fraction', item);
        draggablesContainer.appendChild(div);
        
        setupUniversalDrag(div,
            // On Move
            (e, ghostEl) => {
                const zoneRect = plate.getBoundingClientRect();
                const ghostRect = ghostEl.getBoundingClientRect();
                const overlap = isOverlapping(ghostRect, zoneRect);
                plate.classList.toggle('hovered', overlap);
            },
            // On Drop
            (e, ghostEl) => {
                const zoneRect = plate.getBoundingClientRect();
                const ghostRect = ghostEl.getBoundingClientRect();
                const overlap = isOverlapping(ghostRect, zoneRect);
                plate.classList.remove('hovered');

                if (overlap) {
                    const val = parseFloat(div.dataset.value);
                    if (Math.abs(val - randomTarget.val) < 0.001) {
                        playSound('correct');
                        plate.innerHTML = div.innerHTML; 
                        div.style.display = 'none';
                        setTimeout(() => document.getElementById('game-feedback').classList.remove('hidden'), 500);
                        return true;
                    } else {
                        playSound('wrong');
                        plate.classList.add('shake');
                        setTimeout(() => plate.classList.remove('shake'), 500);
                        return false;
                    }
                }
                return false;
            }
        );
    });
}

function isOverlapping(rect1, rect2) {
    const center1X = rect1.left + rect1.width / 2;
    const center1Y = rect1.top + rect1.height / 2;
    const center2X = rect2.left + rect2.width / 2;
    const center2Y = rect2.top + rect2.height / 2;
    const distance = Math.hypot(center1X - center2X, center1Y - center2Y);
    return distance < Math.min(rect2.width, rect2.height) / 2;
}

/**
 * ------------------------------------------------------------------
 * QUIZ
 * ------------------------------------------------------------------
 */
function renderQuiz(container, questions) {
    if (appState.quizIndex >= questions.length) {
        const scorePct = Math.round((appState.quizScore / questions.length) * 100);
        container.innerHTML = `
            <div class="quiz-container">
                <h1>${scorePct === 100 ? 'Sempurna!' : 'Bagus!'}</h1>
                <div style="font-size: 4rem; color: var(--color-blue); font-weight:bold;">${scorePct}</div>
                <button class="btn btn-primary" onclick="switchView('view-menu')">Selesai</button>
            </div>
        `;
        return;
    }

    const q = questions[appState.quizIndex];
    container.innerHTML = `
        <div class="quiz-container">
            <p>Pertanyaan ${appState.quizIndex + 1}</p>
            <div class="quiz-question">${q.q}</div>
            <div class="quiz-options">${q.options.map(opt => `<button class="btn btn-option" onclick="handleQuizAnswer(this, ${opt.correct})">${opt.label}</button>`).join('')}</div>
        </div>
    `;
}

window.handleQuizAnswer = (btn, isCorrect) => {
    document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
    if (isCorrect) { btn.classList.add('correct'); appState.quizScore++; playSound('correct'); }
    else { btn.classList.add('wrong'); playSound('wrong'); }
    setTimeout(() => {
        appState.quizIndex++;
        renderQuiz(document.getElementById('dynamic-content'), curriculumData[appState.currentClass].quiz);
    }, 1500);
};

/**
 * ------------------------------------------------------------------
 * INIT
 * ------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-splash-start').onclick = () => switchView('view-menu');
    document.getElementById('btn-back-to-splash').onclick = () => switchView('view-splash');
    document.getElementById('btn-home').onclick = () => switchView('view-menu');
    document.getElementById('btn-settings').onclick = () => document.getElementById('modal-settings').classList.remove('hidden');
    document.getElementById('btn-close-settings').onclick = () => document.getElementById('modal-settings').classList.add('hidden');
    document.getElementById('btn-toggle-sound').onclick = (e) => {
        appState.soundEnabled = !appState.soundEnabled;
        e.target.innerText = appState.soundEnabled ? 'Nyala 🔊' : 'Mati 🔇';
    };
    document.querySelectorAll('.class-card').forEach(card => {
        card.onclick = () => {
            if (card.classList.contains('disabled')) return;
            appState.currentClass = card.dataset.class;
            appState.gameScore = 0;
            switchView('view-dashboard');
            renderContent('tujuan');
        };
    });
    document.querySelectorAll('.btn-nav').forEach(btn => btn.onclick = () => renderContent(btn.dataset.section));
});