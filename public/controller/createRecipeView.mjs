import TemplateManager from "../modules/templateManager.mjs";
import { createRecipe } from "../modules/apiHandler.mjs";

const templateFile = "./views/createRecipeView.html";

export default async function renderCreateRecipeView() {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("App container not found");
        return null;
    }
    
    try {
        appContainer.innerHTML = '';
        
        const template = await TemplateManager.fetchTemplate(templateFile);
        if (!template) {
            console.error("Failed to load create recipe template.");
            return null;
        }
        
        TemplateManager.cloneRecipeTemplate(template, appContainer);
        
        setupFormHandlers();
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering create recipe view:", error);
        appContainer.innerHTML = '<div class="error">Error loading create recipe form. Please try again later.</div>';
        return appContainer;
    }
}

function setupFormHandlers() {
    const form = document.getElementById('create-recipe-form');

    const ingredientQuantityInput = document.getElementById('new-ingredient-quantity');
    const ingredientNameInput = document.getElementById('new-ingredient-name');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const ingredientsData = document.getElementById('ingredients-data');

    const instructionInput = document.getElementById('new-instruction');
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionsList = document.getElementById('instructions-list');
    const instructionsData = document.getElementById('instructions-data');

    let ingredients = [];
    let instructions = [];

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
            title: formData.get('title'),
            servings: parseInt(formData.get('servings')),
            cookingTime: parseInt(formData.get('cookingtime')),
            difficulty: formData.get('difficulty'),
            mealType: formData.get('mealtype'),
            nationality: formData.get('nationality'),
            ingredients: ingredients,
            instructions: instructions
        };
        console.log("Submitting recipe data:", recipeData); // Debug log to see the data being sent
        // Submit the recipe
        try {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Creating...';
            submitButton.disabled = true;
            
            const savedRecipe = await createRecipe(recipeData);
            
            form.innerHTML = `
                <div class="success-message">
                    <h2>Recipe Created Successfully!</h2>
                    <p>Your recipe "${savedRecipe.title}" has been saved.</p>
                    <button type="button" id="create-another-btn">Create Another Recipe</button>
                </div>
            `;
            
            document.getElementById('create-another-btn').addEventListener('click', function() {
                renderCreateRecipeView();
            });
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    });
}