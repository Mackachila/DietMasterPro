const form = document.getElementById("userForm");
const resultsCard = document.getElementById("resultsCard");
const cardContent = document.getElementById("cardContent");
const resultsDiv = document.getElementById("results");
const errorMessage = document.getElementById("errorMessage");
const toggleCardButton = document.getElementById("toggleCard");

// Toggle card visibility
toggleCardButton.addEventListener("click", () => {
    cardContent.classList.toggle("show");
});

// Form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous error messages
    errorMessage.textContent = "";

    // Collect form data
    const formData = {
        health_conditions: document.getElementById("health_conditions").value,
        allergies: document.getElementById("allergies").value,
        favorite_meals: document.getElementById("favorite_meals").value,
    };

    try {
        // Send data to the backend
        const response = await fetch("/generate-meal-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                preferences: formData,
                meals: [
                    { name: "Pancakes", type: "breakfast", nutrition_info: "high_protein" },
                    { name: "Rice", type: "lunch", nutrition_info: "low_fat" },
                    { name: "Grilled Chicken", type: "dinner", nutrition_info: "low_sugar" },
                ],
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Something went wrong!");
        }

        // Display recommendations
        resultsDiv.innerHTML = `
            <p><strong>Breakfast:</strong> ${data.mealPlan.breakfast?.meal_name || "N/A"}</p>
            <p><strong>Lunch:</strong> ${data.mealPlan.lunch?.meal_name || "N/A"}</p>
            <p><strong>Dinner:</strong> ${data.mealPlan.dinner?.meal_name || "N/A"}</p>
            <p><strong>Supper:</strong> ${data.mealPlan.supper?.meal_name || "N/A"}</p>
        `;
        resultsCard.style.display = "block";
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});
