// js/rewards.js

class RewardSystem {
    constructor() {
        this.achievements = [
            { id: 'streak3', name: 'Triple Streak!', description: '3 correct answers in a row', unlocked: false },
            { id: 'streak5', name: 'Super Streak!', description: '5 correct answers in a row', unlocked: false },
            { id: 'streak10', name: 'Math Master!', description: '10 correct answers in a row', unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Answer correctly in under 3 seconds', unlocked: false },
            { id: 'crystal_collector', name: 'Crystal Collector', description: 'Collect 20 crystals total', unlocked: false }
        ];

        this.crystalColors = {
            normal: '#00ff00',
            streak3: '#3366ff',
            streak5: '#ff33cc',
            streak10: '#ffcc00'
        };

        this.totalCrystals = 0;
    }

    calculateScore(basePoints, streak, timeTaken) {
        let multiplier = 1;
        let timeBonus = 0;

        // Streak multiplier
        if (streak >= 10) multiplier = 4;
        else if (streak >= 5) multiplier = 3;
        else if (streak >= 3) multiplier = 2;

        // Time bonus (if answered within 5 seconds)
        if (timeTaken < 3) timeBonus = 50;
        else if (timeTaken < 5) timeBonus = 30;

        return Math.floor((basePoints + timeBonus) * multiplier);
    }

    getCrystalColor(streak) {
        if (streak >= 10) return this.crystalColors.streak10;
        if (streak >= 5) return this.crystalColors.streak5;
        if (streak >= 3) return this.crystalColors.streak3;
        return this.crystalColors.normal;
    }

    checkAchievements(streak, timeTaken, crystalsCollected) {
        const newAchievements = [];
        
        // Check streak achievements
        if (streak >= 3 && !this.achievements[0].unlocked) {
            this.achievements[0].unlocked = true;
            newAchievements.push(this.achievements[0]);
        }
        if (streak >= 5 && !this.achievements[1].unlocked) {
            this.achievements[1].unlocked = true;
            newAchievements.push(this.achievements[1]);
        }
        if (streak >= 10 && !this.achievements[2].unlocked) {
            this.achievements[2].unlocked = true;
            newAchievements.push(this.achievements[2]);
        }

        // Check speed achievement
        if (timeTaken < 3 && !this.achievements[3].unlocked) {
            this.achievements[3].unlocked = true;
            newAchievements.push(this.achievements[3]);
        }

        // Check total crystals achievement
        this.totalCrystals += crystalsCollected;
        if (this.totalCrystals >= 20 && !this.achievements[4].unlocked) {
            this.achievements[4].unlocked = true;
            newAchievements.push(this.achievements[4]);
        }

        return newAchievements;
    }

    getUnlockedAchievements() {
        return this.achievements.filter(achievement => achievement.unlocked);
    }

    calculateTimeBonus(timeLeft) {
        // Big bonus for very quick answers
        if (timeLeft >= 25) return 50; 
        if (timeLeft >= 20) return 30;
        if (timeLeft >= 15) return 20;
        if (timeLeft >= 10) return 10;
        return 0;
    }
}

export default new RewardSystem();