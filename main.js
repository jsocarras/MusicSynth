const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isAudioContextStarted = false;

// document.getElementById('start-button').addEventListener('click', function() {
//     document.getElementById('welcome-message').style.display = 'none';
// });

// document.getElementById('start-button').addEventListener('click', function() {
//     document.getElementById('welcome-message').style.display = 'none';
//     startAudioContext(); // Ensure audio context is started
//     playTwinkleTwinkle(); // Start playing the demo
// });

document.getElementById('start-button').addEventListener('click', function() {
    if (!this.classList.contains('clicked')) {
        this.classList.add('clicked'); // Add a class to the button when clicked
        this.disabled = true; // Disable the button to prevent multiple clicks
        startAudioContext(); // Ensure audio context is started
        playTwinkleTwinkle(); // Start playing the demo
    }
});



document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents the default touch event
        playNote(key.dataset.note);
    });
    // Keep the click listener for non-touch devices
    key.addEventListener('click', () => playNote(key.dataset.note));
});

function startAudioContext() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    isAudioContextStarted = true;
}

// Add this inside the playNote function, at the beginning
function playNote(note) {
    if (!isAudioContextStarted) startAudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const waveform = document.getElementById('waveform').value;
      oscillator.type = waveform;
      // oscillator.type = 'sine'; // You can experiment with different types like 'square', 'sawtooth', etc.
      oscillator.frequency.setValueAtTime(noteToFrequency(note), audioCtx.currentTime); // Convert note to frequency
      gainNode.gain.setValueAtTime(document.getElementById('volume').value, audioCtx.currentTime); // Set volume

      oscillator.start();
      const sustain = document.getElementById('sustain').value;
      oscillator.stop(audioCtx.currentTime + parseFloat(sustain));
      // oscillator.stop(audioCtx.currentTime + 1); // Note duration of 1 second

}

function noteToFrequency(note) {
    // Convert note to frequency (basic implementation)
    const noteFrequencies = {
        'C': 261.63, 'D': 293.66, 'E': 329.63,
        'F': 349.23, 'G': 392.00, 'A': 440.00,
        'B': 493.88, 'C-high': 523.25,
        // New octave
        'C2': 523.25, 'D2': 587.33, 'E2': 659.25,
        'F2': 698.46, 'G2': 783.99, 'A2': 880.00,
        'B2': 987.77, 'C2-high': 1046.50,
        // Add more notes
    };
    return noteFrequencies[note];
}

// Event listeners for keys
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => playNote(key.dataset.note));
});

function playTwinkleTwinkle() {
    let notes = ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'];
    let noteDuration = 1000; // Duration of each note in milliseconds

    notes.forEach((note, index) => {
        setTimeout(() => {
            playNote(note);
            highlightKey(note, noteDuration); // Pass note duration for highlighting
        }, noteDuration * index);
    });
}

function highlightKey(note, duration) {
    let key = document.querySelector(`.key[data-note="${note}"]`);
    key.classList.add('active');

    // Remove the 'active' class after the duration of the note
    setTimeout(() => {
        key.classList.remove('active');
    }, duration);
}


// Call this function to start the demo
// playTwinkleTwinkle();
