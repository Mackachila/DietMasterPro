#include <stdio.h>

int main() {
    float height, weight, bmi;

    // Input height (in meters) and weight (in kg)
    printf("Enter your height in meters: ");
    scanf("%f", &height);
    printf("Enter your weight in kilograms: ");
    scanf("%f", &weight);

    // Calculate BMI
    bmi = weight / (height * height);

    // Display the BMI
    printf("Your BMI is: %.2f\n", bmi);

    // Classification and health risk comments
    if (bmi < 18.5) {
        printf("Classification: Underweight\n");
        printf("Health Risk: Minimal\n");
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        printf("Classification: Normal\n");
        printf("Health Risk: Minimal\n");
    } else if (bmi >= 25 && bmi <= 29.9) {
        printf("Classification: Overweight\n");
        printf("Health Risk: Increased\n");
    } else if (bmi >= 30 && bmi <= 34.9) {
        printf("Classification: Obese\n");
        printf("Health Risk: High\n");
    } else if (bmi >= 35 && bmi <= 39.9) {
        printf("Classification: Severely Obese\n");
        printf("Health Risk: Very High\n");
    } else {
        printf("Classification: Morbidly Obese\n");
        printf("Health Risk: Extremely High\n");
    }

    return 0;
}


#include <stdio.h>

int main() {
    int sum = 0, count = 0;
    float average;

    // Loop through even numbers from 20 to 50
    for (int i = 20; i <= 50; i += 2) {
        sum += i;
        count++;
    }

    // Calculate average
    average = (float)sum / count;

    // Display the results
    printf("Total of even numbers from 20 to 50: %d\n", sum);
    printf("Average of even numbers from 20 to 50: %.2f\n", average);

    return 0;
}
