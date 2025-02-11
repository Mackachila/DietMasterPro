
const pool = require("./config/db")

// Function to get user preferences from the database
const getUserPreferences = async (userId) => {
    try {
        // Ensure destructuring from the tuple returned by pool.execute
        const [rows] = await pool.execute(
            `SELECT * FROM user_preferences WHERE id = ?`,
            [userId]
        );
        return rows[0]; // Return the first row of the result
    } catch (error) {
        throw new Error("Error fetching user preferences: " + error.message);
    }
};

// Function to generate a meal plan
const generateMealPlan = async (userId) => {
    try {
        const userPrefs = await getUserPreferences(userId);

        // Example logic for meal plan generation
        const mealPlan = {
            breakfast: { meal_name: "Porridge with milk", nutrition_info: "High in calcium" },
            lunch: { meal_name: "Grilled chicken with rice", nutrition_info: "High in protein" },
            dinner: { meal_name: "Vegetable soup", nutrition_info: "High in vitamins" },
            supper: { meal_name: "Banana smoothie", nutrition_info: "Rich in potassium" },
        };

        return mealPlan;
    } catch (error) {
        throw new Error("Error generating meal plan: " + error.message);
    }
};

module.exports = { generateMealPlan };
