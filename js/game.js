// js/game.js

import problemGenerator from './problems.js';
import rewardSystem from './rewards.js';
import player from './player.js';

class Game {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeAudio();
        this.isGameActive = false;
        this.timerInterval = null;
        this.isProcessingAnswer = false;
        this.canSubmitAnswer = true;
        this.levelTimeBonuses = 0;
        this.levelSpeedBonuses = 0;
    }

    initializeElements() {
        try {
            this.elements = {
                mainMenu: document.getElementById('main-menu'),
                gameScreen: document.getElementById('game-screen'),
                levelComplete: document.getElementById('level-complete'),
                instructionsModal: document.getElementById('instructions-modal'),
                mathProblem: document.getElementById('math-problem'),
                answerInput: document.getElementById('answer-input'),
                submitButton: document.getElementById('submit-answer'),
                levelStats: document.getElementById('level-stats'),
                achievementUnlocked: document.querySelector('.achievement-unlocked'),
                achievementDetails: document.getElementById('achievement-details'),
                planetDisplay: document.getElementById('planet-display'),
                timer: document.getElementById('timer'),
                level: document.querySelector('#level span'),
                gameArea: document.getElementById('game-area')
            };

            // Validate critical elements
            for (const [key, element] of Object.entries(this.elements)) {
                if (!element) {
                    console.error(`Critical element not found: ${key}`);
                }
            }
        } catch (error) {
            console.error('Error initializing game elements:', error);
        }
    }

    initializeEventListeners() {
        try {
            // Button listeners
            document.getElementById('start-button')?.addEventListener('click', () => this.startGame());
            document.getElementById('instructions-button')?.addEventListener('click', () => this.showInstructions());
            document.getElementById('close-instructions')?.addEventListener('click', () => this.hideInstructions());
            document.getElementById('next-level')?.addEventListener('click', () => this.nextLevel());

            // Game input listeners
            this.elements.submitButton?.addEventListener('click', () => this.checkAnswer());
            this.elements.answerInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.checkAnswer();
                }
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    initializeAudio() {
        try {
            this.sounds = {
                correct: document.getElementById('sound-correct'),
                wrong: document.getElementById('sound-wrong'),
                crystal: document.getElementById('sound-crystal'),
                levelup: document.getElementById('sound-levelup'),
                achievement: document.getElementById('sound-achievement'),
                background: document.getElementById('background-music')
            };

            // Set all audio volumes
            Object.values(this.sounds).forEach(sound => {
                if (sound) {
                    sound.volume = 0.3;
                }
            });
            if (this.sounds.background) {
                this.sounds.background.volume = 0.1;
            }
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    startGame() {
        try {
            this.isGameActive = true;
            this.canSubmitAnswer = true;
            this.levelTimeBonuses = 0;
            this.levelSpeedBonuses = 0;
            this.elements.mainMenu.classList.add('hidden');
            this.elements.gameScreen.classList.remove('hidden');
            player.reset();
            problemGenerator.setDifficulty(1);
            this.updatePlanetDisplay();
            this.generateProblem();
            this.playBackgroundMusic();
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }

    playBackgroundMusic() {
        if (this.sounds.background) {
            this.sounds.background.play().catch(error => {
                console.log('Background music autoplay prevented:', error);
            });
        }
    }

    showInstructions() {
        this.elements.instructionsModal?.classList.remove('hidden');
    }

    hideInstructions() {
        this.elements.instructionsModal?.classList.add('hidden');
    }

    generateProblem() {
        if (!this.isGameActive) return;

        try {
            const problem = problemGenerator.generateProblem();
            this.elements.mathProblem.textContent = `${problem.num1} × ${problem.num2} = ?`;
            this.elements.answerInput.value = '';
            this.elements.answerInput.focus();
        } catch (error) {
            console.error('Error generating problem:', error);
        }
    }

    updatePlanetDisplay() {
        try {
            const planetTypes = [
                'planet-red',
                'planet-blue',
                'planet-green',
                'planet-purple',
                'planet-orange'
            ];

            const planetClass = planetTypes[(player.level - 1) % planetTypes.length];
            this.elements.planetDisplay.className = '';
            this.elements.planetDisplay.classList.add('planet-display', planetClass);
            this.elements.level.textContent = player.level;
        } catch (error) {
            console.error('Error updating planet display:', error);
        }
    }

    startTimerChallenge() {
        try {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }

            let timeLeft = 30;
            this.elements.timer.classList.remove('hidden');
            this.elements.timer.classList.remove('warning');
            this.elements.timer.querySelector('span').textContent = timeLeft;

            this.timerInterval = setInterval(() => {
                timeLeft--;
                this.elements.timer.querySelector('span').textContent = timeLeft;

                if (timeLeft <= 10) {
                    this.elements.timer.classList.add('warning');
                }

                if (timeLeft <= 0) {
                    this.endTimerChallenge();
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting timer challenge:', error);
        }
    }

    endTimerChallenge() {
        try {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            this.elements.timer.classList.add('hidden');
            this.elements.timer.classList.remove('warning');

            if (this.isGameActive && player.crystals < 5) {
                this.handleTimerExpired();
            }
        } catch (error) {
            console.error('Error ending timer challenge:', error);
        }
    }

    showBonus(text, type = 'points') {
        try {
            let bonusContainer = document.getElementById('bonus-container');
            if (!bonusContainer) {
                bonusContainer = document.createElement('div');
                bonusContainer.id = 'bonus-container';
                document.getElementById('game-area').appendChild(bonusContainer);
            }

            const bonusDisplay = document.createElement('div');
            bonusDisplay.className = 'time-bonus';
            bonusDisplay.textContent = text;

            switch (type) {
                case 'speed':
                    bonusDisplay.classList.add('bonus-speed');
                    break;
                case 'streak':
                    bonusDisplay.classList.add('bonus-streak');
                    break;
                case 'time':
                    bonusDisplay.classList.add('bonus-time');
                    break;
                case 'points':
                    bonusDisplay.classList.add('bonus-points');
                    break;
            }

            bonusContainer.appendChild(bonusDisplay);

            setTimeout(() => {
                if (bonusDisplay && bonusDisplay.parentNode) {
                    bonusDisplay.remove();
                }
            }, 2600);
        } catch (error) {
            console.error('Error showing bonus:', error);
        }
    }

    async checkAnswer() {
        if (!this.isGameActive || this.isProcessingAnswer || !this.canSubmitAnswer) return;

        const userAnswer = parseInt(this.elements.answerInput.value);
        if (isNaN(userAnswer)) return;

        try {
            this.isProcessingAnswer = true;
            this.canSubmitAnswer = false;

            const problem = problemGenerator.lastProblem;
            const timeTaken = problemGenerator.getTimeTaken();

            if (userAnswer === problem.answer) {
                await this.handleCorrectAnswer(timeTaken);
            } else {
                await this.handleWrongAnswer();
            }
        } catch (error) {
            console.error('Error checking answer:', error);
        } finally {
            this.isProcessingAnswer = false;
        }
    }

    async handleCorrectAnswer(timeTaken) {
        try {
            const streak = player.updateStreak(true);
            let totalBonus = 0;
            let speedBonus = 0;
            let timeBonus = 0;
            let multiplier = 1;

            // Calculate speed bonus based on answer time
            if (timeTaken < 2) {
                speedBonus = 50;
                this.showBonus('Lightning Fast! +50', 'speed');
            } else if (timeTaken < 3) {
                speedBonus = 30;
                this.showBonus('Super Fast! +30', 'speed');
            } else if (timeTaken < 4) {
                speedBonus = 20;
                this.showBonus('Quick! +20', 'speed');
            }

            this.levelSpeedBonuses += speedBonus;

            // Calculate streak multiplier and show it
            if (streak >= 10) {
                multiplier = 4;
                this.showBonus('4x Streak!', 'streak');
            } else if (streak >= 5) {
                multiplier = 3;
                this.showBonus('3x Streak!', 'streak');
            } else if (streak >= 3) {
                multiplier = 2;
                this.showBonus('2x Streak!', 'streak');
            }

            // Calculate time bonus for timed levels
            if (this.timerInterval) {
                const timeLeft = parseInt(this.elements.timer.querySelector('span').textContent);
                timeBonus = rewardSystem.calculateTimeBonus(timeLeft);
                if (timeBonus > 0) {
                    this.showBonus(`Time Bonus: +${timeBonus}`, 'time');
                    this.levelTimeBonuses += timeBonus;
                }
            }

            // Calculate total points
            const basePoints = 10;
            totalBonus = speedBonus + timeBonus;
            const totalPoints = (basePoints + totalBonus) * multiplier;

            // Show total points gained
            this.showBonus(`+${totalPoints} Points!`, 'points');

            player.updateScore(totalPoints);

            // Visual and audio feedback
            this.sounds.correct?.play();
            this.elements.mathProblem.classList.add('correct-answer');

            // Check achievements
            const newAchievements = rewardSystem.checkAchievements(streak, timeTaken, 1);
            if (newAchievements.length > 0) {
                this.showAchievements(newAchievements);
                this.sounds.achievement?.play();
            }

            // Handle level completion or prepare next problem
            if (player.collectCrystal()) {
                await this.completeLevel();
            } else {
                await this.prepareNextProblem();
            }
        } catch (error) {
            console.error('Error handling correct answer:', error);
            this.canSubmitAnswer = true;
        }
    }

    async handleWrongAnswer() {
        try {
            player.updateStreak(false);
            this.sounds.wrong?.play();
            this.elements.mathProblem.classList.add('wrong-answer');

            await new Promise(resolve => setTimeout(resolve, 500));
            this.elements.mathProblem.classList.remove('wrong-answer');
            this.elements.answerInput.value = '';
            this.canSubmitAnswer = true;
            this.elements.answerInput.focus();
        } catch (error) {
            console.error('Error handling wrong answer:', error);
            this.canSubmitAnswer = true;
        }
    }

    async prepareNextProblem() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.elements.mathProblem.classList.remove('correct-answer');
            this.elements.answerInput.value = '';
            this.generateProblem();
            this.canSubmitAnswer = true;
            this.elements.answerInput.focus();
        } catch (error) {
            console.error('Error preparing next problem:', error);
            this.canSubmitAnswer = true;
        }
    }

    async completeLevel() {
        try {
            this.endTimerChallenge();
            this.isGameActive = false;
            this.canSubmitAnswer = false;
            this.sounds.levelup?.play();
            this.elements.levelComplete.classList.remove('hidden');

            // Create detailed stats display
            let statsText = [
                `Final Score: ${player.score}`,
                `Streak: ${player.streak}`,
                `Speed Bonuses: +${this.levelSpeedBonuses}`
            ];

            // Add time bonus info for timed levels
            if (player.level % 2 === 0) {
                statsText.push(`Time Bonuses: +${this.levelTimeBonuses}`);
            }

            this.elements.levelStats.textContent = statsText.join(' | ');
        } catch (error) {
            console.error('Error completing level:', error);
        }
    }

    nextLevel() {
        try {
            this.elements.levelComplete.classList.add('hidden');
            this.elements.achievementUnlocked.classList.add('hidden');
            player.levelUp();
            problemGenerator.setDifficulty(player.level);
            this.isGameActive = true;
            this.canSubmitAnswer = true;
            this.levelTimeBonuses = 0;
            this.levelSpeedBonuses = 0;

            if (player.level % 2 === 0) {
                setTimeout(() => {
                    this.startTimerChallenge();
                }, 500);
            }

            this.updatePlanetDisplay();
            this.generateProblem();
        } catch (error) {
            console.error('Error starting next level:', error);
        }
    }

    showAchievements(achievements) {
        try {
            this.elements.achievementUnlocked.classList.remove('hidden');
            this.elements.achievementDetails.innerHTML = achievements
                .map(achievement => `
                    <div class="achievement">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                `).join('');
        } catch (error) {
            console.error('Error showing achievements:', error);
        }
    }

    handleTimerExpired() {
        try {
            this.isGameActive = false;
            this.canSubmitAnswer = false;
            this.elements.levelComplete.classList.remove('hidden');

            const statsText = [
                `Time's Up!`,
                `Final Score: ${player.score}`,
                `Crystals: ${player.crystals}`,
                `Speed Bonuses: +${this.levelSpeedBonuses}`,
                `Time Bonuses: +${this.levelTimeBonuses}`
            ];

            this.elements.levelStats.textContent = statsText.join(' | ');
        } catch (error) {
            console.error('Error handling timer expiration:', error);
        }
    }
}

// Initialize and export game instance
const game = new Game();
export default game;