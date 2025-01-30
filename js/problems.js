// js/problems.js

class ProblemGenerator {
    constructor() {
        this.lastProblem = null;
        this.difficultyLevel = 1;
        this.usedProblems = new Set();
        this.maxProblemsPerLevel = 20;

        // Define difficulty ranges
        this.difficultyRanges = {
            1: { min: 2, max: 5 },   // Level 1: 2x2 to 5x5
            2: { min: 3, max: 6 },   // Level 2: 3x3 to 6x6
            3: { min: 4, max: 7 },   // Level 3: 4x4 to 7x7
            4: { min: 5, max: 8 },   // Level 4: 5x5 to 8x8
            5: { min: 6, max: 9 },   // Level 5: 6x6 to 9x9
            6: { min: 7, max: 10 },  // Level 6: 7x7 to 10x10
            7: { min: 8, max: 11 },  // Level 7: 8x8 to 11x11
            8: { min: 9, max: 12 },  // Level 8: 9x9 to 12x12
            9: { min: 10, max: 13 }, // Level 9: 10x10 to 13x13
            10: { min: 11, max: 14 } // Level 10: 11x11 to 14x14
        };
    }

    generateProblem() {
        try {
            // Clear used problems if we're close to the limit
            if (this.usedProblems.size >= this.maxProblemsPerLevel) {
                this.usedProblems.clear();
            }

            const range = this.getDifficultyRange();
            let num1, num2, problemString;
            let attempts = 0;
            // Prevent infinite loops
            const maxAttempts = 50; 

            do {
                // Generate numbers within the current difficulty range
                num1 = this.getRandomNumber(range.min, range.max);
                num2 = this.getRandomNumber(range.min, range.max);
                problemString = `${num1}-${num2}`;
                attempts++;

                // Break loop if we've tried too many times
                if (attempts >= maxAttempts) {
                    console.warn('Max attempts reached, clearing used problems');
                    this.usedProblems.clear();
                    break;
                }
            } while (this.usedProblems.has(problemString));

            // Add to used problems set
            this.usedProblems.add(problemString);

            // Create and store the problem
            this.lastProblem = {
                num1,
                num2,
                answer: num1 * num2,
                timeStarted: Date.now(),
                difficulty: this.difficultyLevel
            };

            return this.lastProblem;
        } catch (error) {
            console.error('Error generating problem:', error);
            // Return a simple fallback problem
            return this.generateFallbackProblem();
        }
    }

    getDifficultyRange() {
        // Get the range for current difficulty level or default to level 1
        return this.difficultyRanges[this.difficultyLevel] || this.difficultyRanges[1];
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateFallbackProblem() {
        // Generate a simple problem if normal generation fails
        return {
            num1: 2,
            num2: 2,
            answer: 4,
            timeStarted: Date.now(),
            difficulty: 1
        };
    }

    setDifficulty(level) {
        try {
            // Ensure level is within valid range
            this.difficultyLevel = Math.min(Math.max(1, level), 10);

            // Clear used problems when difficulty changes
            this.usedProblems.clear();

            // Update max problems based on difficulty
            this.maxProblemsPerLevel = 20 + (this.difficultyLevel * 5);

            return this.difficultyLevel;
        } catch (error) {
            console.error('Error setting difficulty:', error);
            this.difficultyLevel = 1;
            return 1;
        }
    }

    getTimeTaken() {
        try {
            if (!this.lastProblem || !this.lastProblem.timeStarted) {
                return 0;
            }
            return (Date.now() - this.lastProblem.timeStarted) / 1000; 
        } catch (error) {
            console.error('Error calculating time taken:', error);
            return 0;
        }
    }

    getCurrentDifficulty() {
        return this.difficultyLevel;
    }

    getUsedProblemsCount() {
        return this.usedProblems.size;
    }

    clearUsedProblems() {
        this.usedProblems.clear();
    }

    validateProblem(num1, num2, answer) {
        return num1 * num2 === answer;
    }
}

export default new ProblemGenerator();