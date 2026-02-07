// Continuous Music Manager
const musicFile = 'bg-music.mp3';
const storageKey = 'bgMusicTime';
const isPlayingKey = 'bgMusicPlaying';

let audio = new Audio(musicFile);
audio.loop = true;
audio.volume = 0.5; // Starts at 50% volume

// Restore time
const savedTime = localStorage.getItem(storageKey);
if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
}

// Function to start music (call on interaction)
window.startMusic = function () {
    audio.play().then(() => {
        localStorage.setItem(isPlayingKey, 'true');
    }).catch(err => console.log("Autoplay blocked:", err));
}

// Save time periodically
setInterval(() => {
    if (!audio.paused) {
        localStorage.setItem(storageKey, audio.currentTime);
    }
}, 1000);

// Save time on unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem(storageKey, audio.currentTime);
});

// Auto-start if previously playing (for page navigation)
if (localStorage.getItem(isPlayingKey) === 'true') {
    // Try to auto-play, usually works if user interacted with domain before
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Auto-play prevented. Waiting for interaction.");
            // Add a one-time click listener to body to resume
            document.body.addEventListener('click', () => {
                startMusic();
            }, { once: true });
        });
    }
}

// BFCache / Back Button Handling
window.addEventListener('pageshow', (event) => {
    // Check if music should be playing but is currently paused
    if (localStorage.getItem(isPlayingKey) === 'true' && audio.paused) {
        const savedTime = localStorage.getItem(storageKey);
        if (savedTime) audio.currentTime = parseFloat(savedTime);
        audio.play().catch(e => console.log("BFCache Autoplay prevented", e));
    }
});
