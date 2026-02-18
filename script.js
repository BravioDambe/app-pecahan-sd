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
    scaleLocked: false,
    // Lab Game Specific
    labProblem: null
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
    const { numerator = 1, denominator = 1, color = '#4FB0C6', label } = params;

    // CARD / TEXT (Also used for Price Tags)
    if (type === 'text' || type === 'card') {
        return `
            <svg viewBox="0 0 200 200" style="overflow: visible; width:100%; height:100%;">
                <rect x="10" y="10" width="180" height="180" rx="20" fill="${color || '#fff'}" stroke="#ccc" stroke-width="4"/>
                <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="40" font-weight="bold" fill="white" style="text-shadow: 2px 2px 0px rgba(0,0,0,0.1);">
                    ${label.split('\n').map((t, i) => `<tspan x="100" dy="${i === 0 ? 0 : 45}">${t}</tspan>`).join('')}
                </text>
            </svg>
        `;
    }

    // BOX (For Market Product)
    if (type === 'box') {
        return `
            <svg viewBox="0 0 200 200" style="overflow: visible; width:100%; height:100%;">
                <rect x="20" y="40" width="160" height="140" rx="5" fill="${color}" stroke="#3E2723" stroke-width="2"/>
                <polygon points="20,40 50,10 210,10 180,40" fill="#8D6E63" stroke="#3E2723" stroke-width="2"/>
                <polygon points="180,40 210,10 210,150 180,180" fill="#6D4C41" stroke="#3E2723" stroke-width="2"/>
                <text x="100" y="120" text-anchor="middle" font-size="30" font-weight="bold" fill="white" style="text-shadow: 1px 1px 0 #000;">${label}</text>
            </svg>
        `;
    }

    // BEAKER (For Class 5 Lab)
    if (type === 'beaker') {
        const heightPct = (numerator / denominator) * 140; // Max liquid height 140
        return `
            <svg viewBox="0 0 100 200" style="overflow: visible; width:100%; height:100%;">
                <!-- Glass -->
                <path d="M 10 10 L 10 180 Q 10 200 30 200 L 70 200 Q 90 200 90 180 L 90 10" fill="rgba(255,255,255,0.3)" stroke="#555" stroke-width="4" />
                <!-- Liquid -->
                <rect x="15" y="${190 - heightPct}" width="70" height="${heightPct}" rx="5" fill="${color}" opacity="0.8">
                    <animate attributeName="height" from="0" to="${heightPct}" dur="1s" fill="freeze" />
                    <animate attributeName="y" from="190" to="${190 - heightPct}" dur="1s" fill="freeze" />
                </rect>
                <!-- Graduations -->
                <line x1="20" y1="50" x2="40" y2="50" stroke="#555" stroke-width="2" opacity="0.5"/>
                <line x1="20" y1="120" x2="40" y2="120" stroke="#555" stroke-width="2" opacity="0.5"/>
                <!-- Label -->
                <text x="50" y="100" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">${numerator}/${denominator}</text>
            </svg>
        `;
    }

    // PIE CHART
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
        <svg viewBox="-1.1 -1.1 2.2 2.2" style="transform: rotate(-90deg); overflow: visible; width:100%; height:100%;">
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
// ✅ FIX 1: Don't create AudioContext at load time — create it lazily on first interaction
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}


// ✅ FIX 2: Update playSound to use getAudioCtx()
function playSound(type) {
    if (!appState.soundEnabled) return;
    
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;

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

// ✅ FIX 3: Add playSound('click')
function renderContent(section) {
    playSound('click');
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
    
    // ✅ FIX 3: Add playSound('click')
    document.getElementById('prev-slide').onclick = () => { 
        playSound('click');
        if(appState.slideIndex > 0) { 
            appState.slideIndex--; 
            renderSlide(container, slides); 
        }
    };
    document.getElementById('next-slide').onclick = () => { 
        playSound('click');
        if(appState.slideIndex < slides.length - 1) { 
            appState.slideIndex++; 
            renderSlide(container, slides); 
        } else {
            renderContent('game'); 
        }
    };
}

/**
 * ------------------------------------------------------------------
 * HELPER: GHOST DRAG ENGINE
 * ------------------------------------------------------------------
 */
function setupUniversalDrag(element, onMove, onDrop) {
    element.addEventListener('pointerdown', handleDragStart);

    function handleDragStart(e) {
        if (appState.scaleLocked) return;
        e.preventDefault();
        playSound('click');

        const rect = element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const ghost = element.cloneNode(true);
        ghost.classList.add('drag-ghost');
        ghost.style.position = 'fixed';
        ghost.style.left = rect.left + 'px';
        ghost.style.top = rect.top + 'px';
        ghost.style.width = rect.width + 'px';
        ghost.style.height = rect.height + 'px';
        ghost.style.margin = '0';
        document.body.appendChild(ghost);

        element.style.opacity = '0'; // Hide original but keep space to prevent alignment shifts
        
        const moveHandler = (moveEvent) => {
            const x = moveEvent.clientX - offsetX;
            const y = moveEvent.clientY - offsetY;
            ghost.style.left = x + 'px';
            ghost.style.top = y + 'px';
            if (onMove) onMove(moveEvent, ghost);
        };

        const upHandler = (upEvent) => {
            window.removeEventListener('pointermove', moveHandler);
            window.removeEventListener('pointerup', upHandler);

            const success = onDrop ? onDrop(upEvent, ghost) : false;

            if (success) {
                ghost.remove();
                // If consumed, you might want to remove element, otherwise it stays hidden
            } else {
                // Revert animation
                const currentRect = ghost.getBoundingClientRect();
                const originalRect = element.getBoundingClientRect();
                
                ghost.style.transition = 'all 0.3s ease-out';
                ghost.style.left = originalRect.left + 'px';
                ghost.style.top = originalRect.top + 'px';
                
                setTimeout(() => {
                    ghost.remove();
                    element.style.opacity = '1';
                }, 300);
            }
        };

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
    else if (gameConfig.type === 'lab') initLabGame(container, gameConfig);
    else if (gameConfig.type === 'market') initMarketGame(container, gameConfig); // Added Class 6
    else initDefaultGame(container, gameConfig);
}

// === CLASS 6: MARKET GAME ===
// 🐛 Fix 2: Rectangular overlap helper
function isRectOverlapping(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function initMarketGame(container, gameConfig) {
    appState.scaleLocked = false;
    
    // Pick random problem
    const problem = gameConfig.problems[Math.floor(Math.random() * gameConfig.problems.length)];

    // Draggables: Answer + Distractors
    let pool = gameConfig.draggables.filter(d => d.val === problem.ans); // Correct
    if(pool.length === 0) pool = [ { val: problem.ans, label: ''+problem.ans } ]; // Fallback if correct not found
    
    // Add distractors
    const distractors = gameConfig.draggables.filter(d => d.val !== problem.ans)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    pool = [...pool, ...distractors].sort(() => Math.random() - 0.5);

    // 🐛 Fix 1 & 4: Restructure layout & shelf visual
    container.innerHTML = `
        <div class="game-area">
            <div class="game-header">
                <h2>${gameConfig.title}</h2>
                <div class="score-board">Skor: ${appState.gameScore}</div>
            </div>
            <p style="text-align:center; font-size:1.5rem; margin: 10px 0;">${gameConfig.instruction}</p>
            
            <div class="market-workspace">
                <div class="shelf-display">
                    <div class="product-box">
                        ${renderSVG('box', { color: '#795548', label: 'Harga:\n' + problem.price })}
                        <div class="discount-sticker">Diskon<br>${problem.discountLabel}</div>
                    </div>
                    <div class="market-shelf"></div>
                </div>
                <!-- 🐛 Fix 1: Larger, clearer drop zone -->
                <div class="price-tag-slot" id="price-slot">
                    <span style="opacity:0.6; font-size:1.2rem;">Tempel Harga<br>Akhir Disini</span>
                </div>
            </div>

            <div id="draggables-container"></div>
            
            <div id="game-feedback" class="hidden modal-overlay">
                <div class="modal-content">
                    <h1>Lunas! 💰</h1>
                    <button class="btn btn-primary" onclick="playSound('click'); appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class6'].gameLevel)">Belanja Lagi ➡</button>
                    <button class="btn btn-sm" onclick="playSound('click'); renderContent('kuis')">Kuis</button>
                </div>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    const priceSlot = document.getElementById('price-slot');

    pool.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.innerHTML = renderSVG('card', { label: item.label, color: '#4CAF50' }); // Green Money Color
        draggablesContainer.appendChild(div);

        setupUniversalDrag(div,
            (e, ghost) => {
                 const zoneRect = priceSlot.getBoundingClientRect();
                 const ghostRect = ghost.getBoundingClientRect();
                 // 🐛 Fix 2: Use rectangular overlap check
                 const overlap = isRectOverlapping(ghostRect, zoneRect);
                 priceSlot.style.borderColor = overlap ? '#FF9800' : '#999';
                 priceSlot.style.backgroundColor = overlap ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255,255,255,0.8)';
            },
            (e, ghost) => {
                const zoneRect = priceSlot.getBoundingClientRect();
                const ghostRect = ghost.getBoundingClientRect();
                // 🐛 Fix 2: Use rectangular overlap check
                if (isRectOverlapping(ghostRect, zoneRect)) {
                    const val = parseFloat(div.dataset.value);
                    if (Math.abs(val - problem.ans) < 0.001) {
                        playSound('correct');
                        priceSlot.innerHTML = `<span style="font-weight:bold; font-size:1.5rem; color:#2E7D32">${div.dataset.value}</span>`;
                        priceSlot.style.borderColor = '#4CAF50';
                        priceSlot.style.backgroundColor = '#E8F5E9';
                        div.style.display = 'none';
                        setTimeout(() => document.getElementById('game-feedback').classList.remove('hidden'), 500);
                        return true;
                    } else {
                        playSound('wrong');
                        priceSlot.style.backgroundColor = '#FFEBEE';
                        setTimeout(() => priceSlot.style.backgroundColor = 'rgba(255,255,255,0.8)', 500);
                        return false;
                    }
                }
                return false;
            }
        );
    });
}

// === CLASS 5: LAB GAME ===
function initLabGame(container, gameConfig) {
    appState.scaleLocked = false;
    
    // Pick random problem
    const problem = gameConfig.problems[Math.floor(Math.random() * gameConfig.problems.length)];
    appState.labProblem = problem;

    // Draggables: Answer + Distractors
    let pool = gameConfig.draggables.filter(d => Math.abs(d.val - problem.res.val) < 0.001); // Correct
    if(pool.length === 0) pool = [gameConfig.draggables[0]]; // Fallback
    
    // Add distractors
    const distractors = gameConfig.draggables.filter(d => Math.abs(d.val - problem.res.val) > 0.001)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    pool = [...pool, ...distractors].sort(() => Math.random() - 0.5);

    // ✅ FIX 3: Add playSound('click') to dynamic buttons
    container.innerHTML = `
        <div class="game-area">
            <div class="game-header">
                <h2>${gameConfig.title}</h2>
                <div class="score-board">Skor: ${appState.gameScore}</div>
            </div>
            <p style="text-align:center; font-size:1.5rem; margin: 10px 0;">${problem.display}</p>
            
            <div class="lab-workspace">
                <div class="beaker-stand">
                    ${renderSVG('beaker', {numerator: problem.a.n, denominator: problem.a.d, color: problem.a.color})}
                    <div style="text-align:center; font-weight:bold;">A</div>
                </div>
                <div style="font-size:3rem; font-weight:bold;">+</div>
                <div class="beaker-stand">
                    ${renderSVG('beaker', {numerator: problem.b.n, denominator: problem.b.d, color: problem.b.color})}
                    <div style="text-align:center; font-weight:bold;">B</div>
                </div>
                <div style="font-size:3rem; font-weight:bold;">=</div>
                <div class="beaker-stand" id="cauldron">
                    <!-- Drop Target -->
                    <div class="lab-drop-target">?</div>
                </div>
            </div>

            <div id="draggables-container"></div>
            
            <div id="game-feedback" class="hidden modal-overlay">
                <div class="modal-content">
                    <h1>Ramuan Berhasil! 🧪</h1>
                    <button class="btn btn-primary" onclick="playSound('click'); appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class5'].gameLevel)">Racik Lagi ➡</button>
                    <button class="btn btn-sm" onclick="playSound('click'); renderContent('kuis')">Kuis</button>
                </div>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    const cauldron = document.getElementById('cauldron');

    pool.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.innerHTML = renderSVG('beaker', item);
        draggablesContainer.appendChild(div);

        setupUniversalDrag(div,
            (e, ghost) => {
                 const zoneRect = cauldron.getBoundingClientRect();
                 const ghostRect = ghost.getBoundingClientRect();
                 const overlap = isOverlapping(ghostRect, zoneRect);
                 cauldron.style.borderColor = overlap ? '#FFDF64' : '#ccc';
            },
            (e, ghost) => {
                const zoneRect = cauldron.getBoundingClientRect();
                const ghostRect = ghost.getBoundingClientRect();
                if (isOverlapping(ghostRect, zoneRect)) {
                    const val = parseFloat(div.dataset.value);
                    if (Math.abs(val - problem.res.val) < 0.001) {
                        playSound('correct');
                        cauldron.innerHTML = div.innerHTML;
                        cauldron.style.borderColor = '#88D498';
                        div.style.display = 'none';
                        setTimeout(() => document.getElementById('game-feedback').classList.remove('hidden'), 500);
                        return true;
                    } else {
                        playSound('wrong');
                        return false;
                    }
                }
                return false;
            }
        );
    });
}

// === CLASS 4: SCALES GAME ===
function initScalesGame(container, gameConfig) {
    appState.scaleLocked = false;
    const randomTarget = gameConfig.targets[Math.floor(Math.random() * gameConfig.targets.length)];
    appState.scaleTarget = randomTarget;

    let possibleCorrects = gameConfig.draggables.filter(d => 
        Math.abs(d.val - randomTarget.val) < 0.001 && d.label !== randomTarget.label
    );
    if (possibleCorrects.length === 0) possibleCorrects = gameConfig.draggables.filter(d => Math.abs(d.val - randomTarget.val) < 0.001);
    
    let distractors = gameConfig.draggables.filter(d => Math.abs(d.val - randomTarget.val) > 0.001);

    const pool = [
        possibleCorrects[Math.floor(Math.random() * possibleCorrects.length)],
        ...distractors.sort(() => Math.random() - 0.5).slice(0, 5)
    ].sort(() => Math.random() - 0.5);

    // ✅ FIX 3: Add playSound('click') to dynamic buttons
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
                    <button class="btn btn-primary" onclick="playSound('click'); appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class4'].gameLevel)">Lanjut ➡</button>
                    <button class="btn btn-sm" onclick="playSound('click'); renderContent('kuis')">Kuis</button>
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
            (e, ghostEl) => {
                const dropZone = document.getElementById('scale-drop-zone');
                const panRight = document.getElementById('pan-right');
                const ghostRect = ghostEl.getBoundingClientRect();
                const zoneRect = dropZone.getBoundingClientRect();
                const overlap = isOverlapping(ghostRect, zoneRect);
                panRight.classList.toggle('highlight-pan', overlap);
                if (overlap) {
                    const draggedVal = parseFloat(div.dataset.value);
                    updateScaleTilt(appState.scaleTarget.val, draggedVal);
                } else {
                    updateScaleTilt(appState.scaleTarget.val, 0);
                }
            },
            (e, ghostEl) => {
                const dropZone = document.getElementById('scale-drop-zone');
                const panRight = document.getElementById('pan-right');
                const ghostRect = ghostEl.getBoundingClientRect();
                const zoneRect = dropZone.getBoundingClientRect();
                panRight.classList.remove('highlight-pan');
                if (isOverlapping(ghostRect, zoneRect)) {
                    appState.scaleLocked = true;
                    const draggedVal = parseFloat(div.dataset.value);
                    const targetVal = appState.scaleTarget.val;
                    updateScaleTilt(targetVal, draggedVal);
                    if (Math.abs(draggedVal - targetVal) < 0.001) {
                        playSound('correct');
                        panRight.innerHTML = `<div class="scale-item-placed">${div.innerHTML}</div>`;
                        div.style.display = 'none';
                        setTimeout(() => document.getElementById('game-feedback').classList.remove('hidden'), 1000);
                        return true;
                    } else {
                        playSound('wrong');
                        setTimeout(() => { updateScaleTilt(targetVal, 0); appState.scaleLocked = false; }, 1200);
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

// === CLASS 2: DEFAULT GAME ===
function initDefaultGame(container, gameConfig) {
    const randomTarget = gameConfig.targets[Math.floor(Math.random() * gameConfig.targets.length)];
    const instruction = gameConfig.instruction.replace('[TARGET]', randomTarget.label);

    // ✅ FIX 3: Add playSound('click') to dynamic buttons
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
                    <button class="btn btn-primary" onclick="playSound('click'); appState.gameScore++; initGame(document.getElementById('dynamic-content'), curriculumData['class2'].gameLevel)">Lanjut ➡</button>
                    <button class="btn btn-sm" onclick="playSound('click'); renderContent('kuis')">Ke Kuis</button>
                </div>
            </div>
        </div>
    `;

    const draggablesContainer = document.getElementById('draggables-container');
    const plate = document.getElementById('plate');

    let possibleCorrects = gameConfig.items.filter(d => Math.abs(d.val - randomTarget.val) < 0.001);
    if (possibleCorrects.length === 0) possibleCorrects = [gameConfig.items[0]]; 
    let distractors = gameConfig.items.filter(d => Math.abs(d.val - randomTarget.val) > 0.001);
    const pool = [possibleCorrects[0], ...distractors.slice(0, 5)].sort(() => Math.random() - 0.5);

    pool.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.dataset.value = item.val;
        div.innerHTML = renderSVG(item.type || 'fraction', item);
        draggablesContainer.appendChild(div);
        setupUniversalDrag(div,
            (e, ghost) => {
                const zoneRect = plate.getBoundingClientRect();
                const ghostRect = ghost.getBoundingClientRect();
                plate.classList.toggle('hovered', isOverlapping(ghostRect, zoneRect));
            },
            (e, ghost) => {
                const zoneRect = plate.getBoundingClientRect();
                const ghostRect = ghost.getBoundingClientRect();
                plate.classList.remove('hovered');
                if (isOverlapping(ghostRect, zoneRect)) {
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
    return Math.hypot(center1X - center2X, center1Y - center2Y) < Math.min(rect2.width, rect2.height) / 2;
}

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

// ✅ FIX 3: Add playSound('click')
window.handleQuizAnswer = (btn, isCorrect) => {
    playSound('click');
    document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
    if (isCorrect) { btn.classList.add('correct'); appState.quizScore++; playSound('correct'); }
    else { btn.classList.add('wrong'); playSound('wrong'); }
    setTimeout(() => {
        appState.quizIndex++;
        renderQuiz(document.getElementById('dynamic-content'), curriculumData[appState.currentClass].quiz);
    }, 1500);
};

document.addEventListener('DOMContentLoaded', () => {
    // ✅ FIX 4: Remove unlockAudio() call
    document.getElementById('btn-splash-start').onclick = () => {
        switchView('view-menu');
    };
    
    document.getElementById('btn-back-to-splash').onclick = () => switchView('view-splash');
    document.getElementById('btn-home').onclick = () => switchView('view-menu');

    // ✅ FIX 3: Add playSound('click')
    document.getElementById('btn-settings').onclick = () => {
        playSound('click');
        document.getElementById('modal-settings').classList.remove('hidden');
    };
    document.getElementById('btn-close-settings').onclick = () => {
        playSound('click');
        document.getElementById('modal-settings').classList.add('hidden');
    };
    document.getElementById('btn-toggle-sound').onclick = (e) => {
        playSound('click');
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