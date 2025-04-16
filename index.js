const startScreen = document.getElementById('start-screen');
const startBtn= document.getElementById("start-button");
const gameDiv= document.getElementById('game-container')
const mealImage=document.getElementById('meal-image')
const ingredientsDiv=document.getElementById('ingredients')
const instructDiv=document.getElementById('instructions')
const guessInput=document.getElementById('guess-input')
const guessBtn=document.getElementById('guess-button')
const guessFeedback=document.getElementById('feedback')
const resultDiv=document.getElementById('results-container')
const resultMessage=document.getElementById('result-message')
const scoreDisplay=document.getElementById('players-score')
const bonusMessage=document.getElementById('additional-result-message')
const mealScoreDiv=document.getElementById('meal-summary')
const restartBtn=document.getElementById('restart-btn')


let round =0;
let score =0;
let currentMeal = {};
let meals= [];

// Fetch meals from the API
function fetchRandomMeal() {
    return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => data.meals[0]); // Return the first meal from the API response
}



//Get image
function getMealImage(meal) {
    mealImage.src = meal.strMealThumb;
    mealImage.alt =meal.strMeal;
    guessInput.value='';
    guessFeedback.textContent='';

}

//Get ingredients
function getMealIngredients(meal) {
    ingredientsDiv.innerHTML = ''; // Clear previous ingredients
    const ul = document.createElement('ul'); 

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) { 
            const li = document.createElement('li');
            li.textContent = `${measure}  ${ingredient}`;
            ul.appendChild(li);
        }
    }

    ingredientsDiv.appendChild(ul);  
}


function getMealInstructions(meals){
    instructDiv.innerHTML=''; // Clear previous instructions
    const instructions = document.createElement('ol');
    const instructionsText= meals.strInstructions;
    let sentences= instructionsText.split('.');

    sentences.forEach((sentence) => {
        const listItem = document.createElement('li');
        let trimmed = sentence.trim();
    
        if (trimmed.length > 0) {
            const words = trimmed.split(' ');
    
            // Check if the first word is a number or "step"
            const firstWord = words[0].toLowerCase();
            if (!isNaN(firstWord) || firstWord === 'step') {
                return; // Skip this sentence
            }
    
            listItem.textContent = `${trimmed}.`;
            instructions.appendChild(listItem);
        }
    });
    
    instructDiv.appendChild(instructions);
    
}





//check guess
function checkGuess(guess) {
    const correctAnswer_1 = currentMeal.strCategory.toLowerCase();
    const correctAnswer_2 = currentMeal.strArea.toLowerCase();
    if (guess.toLowerCase() === correctAnswer_1) {
        score++;
        guessFeedback.textContent = 'Correct! 🎉';
        guessFeedback.style.color = 'green';
    } 

    else if (guess.toLowerCase() === correctAnswer_2){
        score++;
        guessFeedback.textContent = 'Correct! 🎉';
        guessFeedback.style.color = 'green';
    }
    else {
        
        guessFeedback.textContent = `Incorrect! The correct answer was ${correctAnswer_1 } or ${ correctAnswer_2}.`;
        guessFeedback.style.color = 'red';
            
    }
}

// StartButton
async function nextRound() {
    currentMeal = await fetchRandomMeal(); // Wait for the meal data to be fetched
    meals.push(currentMeal); // Add the fetched meal to the meals array
    getMealImage(currentMeal); // Display the fetched meal
    gameDiv.classList.remove('hidden'); // Show the game container
    getMealIngredients(currentMeal) // Display the ingredients
    getMealInstructions(currentMeal) // Display the instructions    
}

// submit button 
function restartGame(){
    resultDiv.classList.add('hidden');
    gameDiv.classList.add('hidden');
    startScreen.classList.remove('hidden');
}


// Display the results
function displayResults() {
    resultDiv.classList.remove('hidden');
    gameDiv.classList.add('hidden');
    mealScoreDiv.classList.add('hidden');
    switch (true){
        case (score ===3) :
            resultMessage.textContent = 'Congratulations! You got all answers correct! 🎉';
            bonusMessage.textContent = `Impressive..should we call you Gordon Ramsay?`;
            break;
        case (score === 2) :
            resultMessage.textContent = 'Great job! You got 2 answers correct! 🎉';
            bonusMessage.textContent = `You are a culinary genius!`;
            break;
        case (score === 1):
            resultMessage.textContent = 'Good effort! You got 1 answer correct! 🎉';
            bonusMessage.textContent = `You are on the right track!`;
            break;
        default:
            resultMessage.textContent = 'Better luck next time! You got no answers correct.';
            bonusMessage.textContent = `You're getting cooked...but hang in there!`
            break;
    }
    displayMealSummary(); // Call the function to display the meal summary

}

// meal summary 
function displayMealSummary() {
    mealScoreDiv.classList.remove('hidden');
    mealScoreDiv.innerHTML = ''; // Clear previous content

    meals.forEach((meal, index) => {
        const mealSummary = document.createElement('div');
        mealSummary.classList.add('meal-summary-item'); // You can style this in CSS

        // Create the meal image
        const image = document.createElement('img');
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;
        Image.title= meal.strMeal;
       

        // Create text summary
        const summaryText = document.createElement('p');
        summaryText.innerHTML = `
            <strong>Round ${index + 1}:</strong> ${meal.strMeal}
            <br>
            Category: <em>${meal.strCategory}</em><br>
            Area: <em>${meal.strArea}</em>
        `;

        mealSummary.appendChild(image);
        mealSummary.appendChild(summaryText);
        mealScoreDiv.appendChild(mealSummary);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // StartButton
    startBtn.addEventListener('click', async function startGame() {
        round = 0;
        score = 0;
        meals = [];
        startScreen.classList.add('hidden');
        resultDiv.classList.add('hidden');
        await nextRound(); // Ensure the first round starts after fetching the meal
    });

    // Submit button
    guessBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const guess = guessInput.value.trim();
        if (guess) {
            checkGuess(guess);
            round++;
            scoreDisplay.textContent = `${score}`;
            setTimeout(() => {
                if (round < 3) {
                    nextRound();
                } else {
                    displayResults();
                }
            }, 1000);
        }
    });

    // Restart button
    restartBtn.addEventListener('click', () => {
        restartGame();
    });
});

