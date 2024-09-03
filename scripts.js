let currentAudio = null;
let currentBPM = 120;
let loopTimeout = null;

const rhythms = {
rock: ['Loop/Rock/rockBackBeat_110.mp3', 'Loop/Rock/rockBrit_110.mp3', 'Loop/Rock/rockCrash_110.mp3', 'Loop/Rock/rockRetro_110.mp3', 'Loop/Rock/rockSimple_110.mp3'],
blues: ['Loop/Blues/BluesBackBasics_110.mp3', 'Loop/Blues/BluesBoulder_110.mp3', 'Loop/Blues/BluesMotown_110.mp3', 'Loop/Blues/BluesSlow_110.mp3', 'Loop/Blues/BluesStepside_110.mp3', 'Loop/Blues/BluesSwing_120.mp3'],
latin: ['Loop/Latin/LatinBeach_110.mp3', 'Loop/Latin/LatinBoardWalk_110.mp3', 'Loop/Latin/LatinCoast_110.mp3', 'Loop/Latin/LatinMiami_110.mp3', 'Loop/Latin/LatinStilts_110.mp3', 'Loop/Latin/LatinStormy_110.mp3'],
creole: ['Loop/Creole/CreoleBiguine_120.mp3', 'Loop/Creole/Creolekompa_86.mp3', 'Loop/Creole/CreoleMazurka_110.mp3', 'Loop/Creole/CreoleReggae_100.mp3', 'Loop/Creole/CreoleZouk_120.mp3']
};

function selectStyle(style) {
    localStorage.setItem('selectedStyle', style);
    window.location.href = 'style-page.html';
}

function loadRhythms() {
    const style = localStorage.getItem('selectedStyle');
    const rhythmsDiv = document.getElementById('rhythms');
    rhythms[style].forEach(rythme => {
        const button = document.createElement('button');
        button.textContent = rythme.split('/').pop();
        button.onclick = () => selectRythme(rythme, style);
        rhythmsDiv.appendChild(button);
    });
}

function selectRythme(rythme, style) {
    if (currentAudio) {
        currentAudio.pause();
        clearTimeout(loopTimeout);
    }
    currentAudio = new Audio(rythme);
    currentAudio.loop = false; // Désactiver la boucle automatique
    localStorage.setItem('selectedRythme', rythme);
    localStorage.setItem('selectedStyle', style);
    window.location.href = 'rythme-page.html';
}

function loadRythmePlayer() {
    const rythme = localStorage.getItem('selectedRythme');
    const style = localStorage.getItem('selectedStyle');
    if (rythme) {
        currentAudio = new Audio(rythme);
        currentAudio.loop = false; // Désactiver la boucle automatique
        document.getElementById('bpm').value = currentBPM;
        document.getElementById('bpmValue').textContent = currentBPM;
        document.getElementById('rythmeName').textContent = rythme.split('/').pop();
        
        const otherRhythmsDiv = document.getElementById('otherRhythms');
        otherRhythmsDiv.innerHTML = ''; // Clear previous buttons if any
        rhythms[style].forEach(otherRythme => {
            const button = document.createElement('button');
            button.textContent = otherRythme.split('/').pop();
            button.onclick = () => selectRythme(otherRythme, style);
            otherRhythmsDiv.appendChild(button);
        });
    }
}

function updateBPM(bpm) {
    currentBPM = bpm;
    document.getElementById('bpmValue').textContent = bpm;
    if (currentAudio) {
        currentAudio.playbackRate = bpm / 120;
    }
}

function togglePlayPause() {
    if (currentAudio) {
        if (currentAudio.paused) {
            playLoop();
            document.getElementById('playPauseButton').textContent = 'Pause';
        } else {
            currentAudio.pause();
            clearTimeout(loopTimeout);
            document.getElementById('playPauseButton').textContent = 'Play';
        }
    }
}

function playLoop() {
    if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.play();
        const loopDuration = (currentAudio.duration / (currentBPM / 120)) * 1000 - 50; // Rejouer 50ms avant la fin
        loopTimeout = setTimeout(playLoop, loopDuration);
    }
}

function goBackToIndex() {
    window.location.href = 'index.html';
}

function goBackToStyles() {
    window.location.href = 'style-page.html';
}

// Charger les rythmes ou le lecteur de rythme en fonction de la page
if (document.getElementById('rhythms')) {
    window.onload = loadRhythms;
} else if (document.getElementById('bpm')) {
    window.onload = loadRythmePlayer;
}