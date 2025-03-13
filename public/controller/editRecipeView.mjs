import TemplateManager from "../modules/templateManager.mjs";
import { updateRecipe, getRecipeById } from "../modules/apiHandler.mjs";

const templateFile = "./views/editRecipeView.html";

export default async function renderEditRecipeView(recipeId) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("App container not found");
        return null;
    }
    
    try {
        appContainer.innerHTML = '';
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        if (!template) {
            console.error("Failed to load edit recipe template.");
            return null;
        }
        
        TemplateManager.cloneRecipeTemplate(template, appContainer);
        
        const recipe = await getRecipeById(recipeId);
        
        populateRecipeForm(recipe);
        
        setupFormHandlers(recipe);
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering edit recipe view:", error);
        appContainer.innerHTML = '<div class="error">Error loading edit recipe form. Please try again later.</div>';
        return appContainer;
    }
}

function populateRecipeForm(recipe) {
    document.getElementById('recipe-title').value = recipe.title;
    document.getElementById('recipe-servings').value = recipe.servings;
    document.getElementById('recipe-cookingtime').value = recipe.cookingtime;
    document.getElementById('recipe-difficulty').value = recipe.difficulty;
    document.getElementById('create-mealtype').value = recipe.mealtype;
    document.getElementById('create-nationality').value = recipe.nationality;

    const ingredientsList = document.getElementById('ingredients-list');
    const ingredientsData = document.getElementById('ingredients-data');
    const ingredients = recipe.ingredients || [];
    
    ingredients.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'list-item';

        const itemText = document.createElement('span');
        itemText.textContent = ingredient;
        item.appendChild(itemText);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.type = 'button';
        
        removeBtn.addEventListener('click', function() {
            ingredientsList.removeChild(item);
            updateHiddenFields();
        });
        
        item.appendChild(removeBtn);
        ingredientsList.appendChild(item);
    });

    const instructionsList = document.getElementById('instructions-list');
    const instructionsData = document.getElementById('instructions-data');
    const instructions = recipe.instructions || [];
    
    instructions.forEach((instruction, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        
        const stepNumber = document.createElement('span');
        stepNumber.className = 'step-number';
        stepNumber.textContent = `Step ${index + 1}: `;
        item.appendChild(stepNumber);
        
        const itemText = document.createElement('span');
        itemText.textContent = instruction;
        item.appendChild(itemText);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.type = 'button';
        
        removeBtn.addEventListener('click', function() {
            instructionsList.removeChild(item);
            
            const stepItems = instructionsList.querySelectorAll('.list-item');
            stepItems.forEach((step, idx) => {
                step.querySelector('.step-number').textContent = `Step ${idx + 1}: `;
            });
            
            updateHiddenFields();
        });
        
        item.appendChild(removeBtn);
        instructionsList.appendChild(item);
    });

    updateHiddenFields();
}

function setupFormHandlers(recipe) {
    const form = document.getElementById('edit-recipe-form');

    const ingredientQuantityInput = document.getElementById('new-ingredient-quantity');
    const ingredientNameInput = document.getElementById('new-ingredient-name');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const ingredientsData = document.getElementById('ingredients-data');

    const instructionInput = document.getElementById('new-instruction');
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionsList = document.getElementById('instructions-list');
    const instructionsData = document.getElementById('instructions-data');

    let ingredients = recipe.ingredients || [];
    let instructions = recipe.instructions || [];

    function updateHiddenFields() {
        ingredientsData.value = JSON.stringify(ingredients);
        instructionsData.value = JSON.stringify(instructions);
    }
    
    addIngredientBtn.addEventListener('click', function() {
        const quantity = ingredientQuantityInput.value.trim();
        const name = ingredientNameInput.value.trim();
        
        if (!quantity) {
            alert('Please enter ingredient quantity');
            return;
        }
        
        if (!name) {
            alert('Please enter ingredient name');
            return;
        }
        
        const ingredientText = `${quantity} ${name}`;
        
        ingredients.push(ingredientText);
        
        const item = document.createElement('div');
        item.className = 'list-item';

        const itemText = document.createElement('span');
        itemText.textContent = ingredientText;
        item.appendChild(itemText);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.type = 'button';
        
        removeBtn.addEventListener('click', function() {
            const index = ingredients.indexOf(ingredientText);
            if (index !== -1) {
                ingredients.splice(index, 1);
            }
            
            ingredientsList.removeChild(item);
            
            updateHiddenFields();
        });
        
        item.appendChild(removeBtn);
        
        ingredientsList.appendChild(item);
        
        ingredientQuantityInput.value = '';
        ingredientNameInput.value = '';
        
        updateHiddenFields();
    });
    
    addInstructionBtn.addEventListener('click', function() {
        const instructionText = instructionInput.value.trim();
        
        if (!instructionText) {
            return; 
        }
        
        instructions.push(instructionText);
        
        const item = document.createElement('div');
        item.className = 'list-item';
        
        const stepNumber = document.createElement('span');
        stepNumber.className = 'step-number';
        stepNumber.textContent = `Step ${instructions.length}: `;
        item.appendChild(stepNumber);
        
        const itemText = document.createElement('span');
        itemText.textContent = instructionText;
        item.appendChild(itemText);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.type = 'button';
        
        removeBtn.addEventListener('click', function() {
            const index = instructions.indexOf(instructionText);
            if (index !== -1) {
                instructions.splice(index, 1);
            }
            
            instructionsList.removeChild(item);
            
            const stepItems = instructionsList.querySelectorAll('.list-item');
            stepItems.forEach((step, idx) => {
                step.querySelector('.step-number').textContent = `Step ${idx + 1}: `;
            });
            
            updateHiddenFields();
        });
        
        item.appendChild(removeBtn);
        
        instructionsList.appendChild(item);
        
        instructionInput.value = '';
        
        updateHiddenFields();
    });



    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (ingredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }
        
        if (instructions.length === 0) {
            alert('Please add at least one instruction');
            return;
        }
        
        const formData = new FormData(form);
        const recipeData = {
            recipe_id: recipe.recipe_id,
            title: formData.get('title'),
            servings: parseInt(formData.get('servings')),
            cookingtime: parseInt(formData.get('cookingtime')),
            difficulty: formData.get('difficulty'),
            mealtype: formData.get('mealtype'),
            nationality: formData.get('nationality'),
            ingredients: ingredients,
            instructions: instructions
        };
        
        try {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Updating...';
            submitButton.disabled = true;
            
            const updatedRecipe = await updateRecipe(recipeData);
            
            form.innerHTML = `
                <div class="success-message">
                    <h2>Recipe Updated Successfully!</h2>
                    <p>Your recipe "${updatedRecipe.title}" has been saved.</p>
                    <button type="button" id="view-recipe-btn">View Recipe</button>
                </div>
            `;
            
            document.getElementById('view-recipe-btn').addEventListener('click', function() {

                window.location.href = `/recipe/${updatedRecipe.id}`;
            });
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    });
}