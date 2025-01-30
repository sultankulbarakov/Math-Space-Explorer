// js/player.js

class Player {
    constructor() {
        this.reset();

        this.initializeElements();

        this.updateDisplay();
    }

    initializeElements() {
        try {
            this.elements = {
                level: document.querySelector('#level span'),
                score: document.querySelector('#score span'),
                streak: document.querySelector('#streak span'),
                crystals: document.querySelector('#crystals-collected span'),
                timer: document.querySelector('#timer'),
                timerValue: document.querySelector('#timer span')
            };

            // Validate that all elements exist
            for (const [key, element] of Object.entries(this.elements)) {
                if (!element) {
                    console.error(`Required element not found: ${key}`);
                }
            }
        } catch (error) {
            console.error('Error initializing player elements:', error);
        }
    }

    updateScore(points) {
        try {
            if (typeof points !== 'number' || points < 0) {
                throw new Error('Invalid points value');
            }
            this.score += points;
            this.elements.score.textContent = this.score;
        } catch (error) {
            console.error('Error updating score:', error);
        }
    }

    updateStreak(correct) {
        try {
            if (correct) {
                this.streak++;
            } else {
                this.streak = 0;
            }
            this.elements.streak.textContent = this.streak;
            return this.streak;
        } catch (error) {
            console.error('Error updating streak:', error);
            return 0;
        }
    }

    collectCrystal() {
        try {
            // Increment crystal count
            this.crystals++;

            // Cap crystals at 5
            if (this.crystals > 5) {
                this.crystals = 5;
            }

            // Update display
            this.elements.crystals.textContent = this.crystals;

            // Return true if level is complete (5 crystals collected)
            return this.crystals >= 5;
        } catch (error) {
            console.error('Error collecting crystal:', error);
            return false;
        }
    }

    levelUp() {
        try {
            this.level++;
            this.crystals = 0;

            // Reset timer state for new level
            this.isTimerActive = false;
            this.timeLeft = 30;

            this.updateDisplay();
        } catch (error) {
            console.error('Error during level up:', error);
        }
    }

    startTimer() {
        try {
            // Clear any existing timer
            this.stopTimer();

            this.isTimerActive = true;
            this.timeLeft = 30;

            // Show timer element
            if (this.elements.timer) {
                this.elements.timer.classList.remove('hidden');
            }

            // Start countdown
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                if (this.elements.timerValue) {
                    this.elements.timerValue.textContent = this.timeLeft;
                }

                // Add warning class when time is running low
                if (this.timeLeft <= 10) {
                    this.elements.timer.classList.add('warning');
                }

                if (this.timeLeft <= 0) {
                    this.stopTimer();
                    // Emit game over event
                    document.dispatchEvent(new CustomEvent('gameTimerExpired'));
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    }

    stopTimer() {
        try {
            this.isTimerActive = false;
            clearInterval(this.timerInterval);

            if (this.elements.timer) {
                this.elements.timer.classList.add('hidden');
                this.elements.timer.classList.remove('warning');
            }
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    }

    updateDisplay() {
        try {
            // Update all display elements
            if (this.elements.level) this.elements.level.textContent = this.level;
            if (this.elements.score) this.elements.score.textContent = this.score;
            if (this.elements.streak) this.elements.streak.textContent = this.streak;
            if (this.elements.crystals) this.elements.crystals.textContent = this.crystals;

            // Update timer display if active
            if (this.isTimerActive && this.elements.timerValue) {
                this.elements.timerValue.textContent = this.timeLeft;
            }
        } catch (error) {
            console.error('Error updating display:', error);
        }
    }

    reset() {
        // Reset all player state
        this.score = 0;
        this.streak = 0;
        this.crystals = 0;
        this.level = 1;
        this.isTimerActive = false;
        this.timeLeft = 30;

        // Clear any active timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Update the display
        this.updateDisplay();
    }

    updateTimer(timeLeft) {
        try {
            if (typeof timeLeft !== 'number' || timeLeft < 0) {
                throw new Error('Invalid time value');
            }

            if (this.elements.timer && this.elements.timerValue) {
                // Add warning class when time is low
                if (timeLeft <= 10) {
                    this.elements.timer.classList.add('warning');
                } else {
                    this.elements.timer.classList.remove('warning');
                }

                // Update timer display
                this.elements.timerValue.textContent = timeLeft;
            }
        } catch (error) {
            console.error('Error updating timer:', error);
        }
    }

    // Getter methods for game state
    getScore() { return this.score; }
    getStreak() { return this.streak; }
    getCrystals() { return this.crystals; }
    getLevel() { return this.level; }
    getTimeLeft() { return this.timeLeft; }
    isTimerRunning() { return this.isTimerActive; }
}

// Export a single instance of the Player class
export default new Player();