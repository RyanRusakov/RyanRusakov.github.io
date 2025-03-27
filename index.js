let noteInterval;
let isRunning = false;
const intervalTime = 5000; // 5 seconds
let progress = 0;
let progressInterval;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function* uniqueNoteGenerator() {
    const notes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'a#', 'c#', 'd#', 'f#', 'g#'];
    let shuffledNotes = [...notes];
    shuffleArray(shuffledNotes);
    let index = 0;

    while (true) {
        if (index >= shuffledNotes.length) {
            shuffleArray(shuffledNotes);
            index = 0;
        }
        yield shuffledNotes[index++];
    }
}

function* uniqueAGGenerator() {
    const notes = ['a', 'e', 'E'];
    let shuffledNotes = [...notes];
    shuffleArray(shuffledNotes);
    let index = 0;

    while (true) {
        if (index >= shuffledNotes.length) {
            shuffleArray(shuffledNotes);
            index = 0;
        }
        yield shuffledNotes[index++];
    }
}

const noteGen = uniqueNoteGenerator();
const agGen = uniqueAGGenerator();

function generateNotes() {
    const note = noteGen.next().value;
    const agNote = agGen.next().value;
    
    document.getElementById("output").innerHTML = `
        <span class="left">${agNote} <span class="label">String</span></span> 
        <span class="right">${note} <span class="label">Note</span></span>
    `;

    // Reset progress bar
    resetProgressBar();
}

function resetProgressBar() {
    progress = 0;
    document.getElementById("progressBar").style.width = "0%"; // Reset progress bar to 0%
}

// Function to update progress bar
function updateProgressBar() {
    progress += 100 / (intervalTime / 100); // Increase progress
    document.getElementById("progressBar").style.width = `${progress}%`;

    if (progress >= 100) {
        progress = 0; // Reset progress when full
        document.getElementById("progressBar").style.width = "0%"; // Ensure reset to 0%
    }
}

document.getElementById("generateButton").addEventListener("click", function() {
    // Reset the timer and progress bar when "Generate" button is clicked
    clearInterval(noteInterval); // Clear the current interval
    clearInterval(progressInterval); // Clear the current progress interval
    generateNotes(); // Generate notes (resets progress bar)
    if (isRunning) { // If the timer is running, restart the interval
        noteInterval = setInterval(generateNotes, intervalTime);
        progressInterval = setInterval(updateProgressBar, 100);
    }
});

// Start/Stop Auto Generation
document.getElementById("toggleButton").addEventListener("click", function () {
    const progressContainer = document.querySelector(".progress-container"); // Reference the progress container here
    const outputElement = document.getElementById("output");

    if (!isRunning) {
        // Start the interval
        noteInterval = setInterval(generateNotes, intervalTime);
        progressInterval = setInterval(updateProgressBar, 100); // Update progress bar every 100ms
        this.textContent = "Stop Timer";

        // Show progress bar when timer starts
        progressContainer.style.display = "block";
        outputElement.style.borderBottom = "none"; // Remove the border
    } else {
        // Stop the interval
        clearInterval(noteInterval);
        clearInterval(progressInterval);
        this.textContent = "Start Timer";

        // Hide progress bar when timer stops
        progressContainer.style.display = "none";
        
        // Reset progress bar immediately
        resetProgressBar();
        outputElement.style.borderBottom = "4px solid #2a2a2a"; // Set a bottom border
    }
    isRunning = !isRunning;
});