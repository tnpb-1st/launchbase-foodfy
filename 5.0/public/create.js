const ingredientsContainer = document.querySelector('.ingredient');
const stepsContainer = document.querySelector('.steps');
const stepsButton = document.querySelector('#steps-button');
const ingredientButton = document.querySelector('#ingredient-button');
const ingredients = document.querySelectorAll('#ingredient-item');
const steps = document.querySelectorAll('#step-item');

function addItems() {
    ingredientButton.addEventListener('click',() => {
        let newIngredient = document.createElement('input');
        newIngredient.type = 'text';
        newIngredient.name = 'ingredients[]';
        ingredientsContainer.appendChild(newIngredient);
    });

    stepsButton.addEventListener('click',() => {
        let newStep = document.createElement('input');
        newStep.type = 'text';
        newStep.name = 'preparation[]';
        stepsContainer.appendChild(newStep);
    });
}

function removeItems() {
    for (let ingredient of ingredients) {
        if (ingredient.value == "") {
            ingredient.remove();
        }
    }

    for (let step of steps) {
        if (step.value == "") {
            step.remove();
        }
    }
}

if (location.pathname.includes('/admin/recipes/create')) {
    addItems();
    removeItems();
}