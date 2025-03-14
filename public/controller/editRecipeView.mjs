import TemplateManager from "../modules/templateManager.mjs";
import { updateRecipe, getRecipeById } from "../modules/apiHandler.mjs";
import renderAllRecipes from "./showAllRecipeView.mjs";

const editTemplateFile = "./views/editRecipeView.html";
const recipeTemplateFile = "./views/recipeView.html"; 

export default async function renderEditRecipeView(recipeId) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("App container not found");
        return null;
    }
    
    try {
        // Clear the container
        appContainer.innerHTML = '';
        
        // Create a flex container for side-by-side layout
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.gap = '20px';
        flexContainer.style.margin = '20px 0';
        appContainer.appendChild(flexContainer);
        
        
        // Create container for edit form
        const editFormContainer = document.createElement('div');
        editFormContainer.className = 'edit-form-container';
        editFormContainer.style.flex = '2';
        editFormContainer.style.minWidth = '500px';
        flexContainer.appendChild(editFormContainer);
        
        // Get recipe data first (we'll need it for both views)
        const recipe = await getRecipeById(recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found`);
        }
        
        // 1. Load and render the original recipe in the left container
        const recipeTemplate = await TemplateManager.fetchTemplate(recipeTemplateFile);
            TemplateManager.cloneRecipeTemplate(recipeTemplate, originalRecipeContainer, recipe);
            
            const editButtons = originalRecipeContainer.querySelectorAll('.edit-button, .button-container');
            editButtons.forEach(button => button.remove());
  
        
        // 2. Load and render the edit form in the right container
        const editTemplate = await TemplateManager.fetchTemplate(editTemplateFile);
        if (editTemplate) {
            if (editTemplate.tagName === 'TEMPLATE') {
                const fragment = editTemplate.content.cloneNode(true);
                editFormContainer.appendChild(fragment);
            } else {
                const clone = editTemplate.cloneNode(true);
                editFormContainer.appendChild(clone);
            }
            setupFormHandlers(recipe);
        } else {
            console.error("Failed to load edit recipe template");
            editFormContainer.innerHTML = '<div class="error">Failed to load edit form</div>';
        }
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering edit recipe view:", error);
        appContainer.innerHTML = '<div class="error">Error loading edit recipe form. Please try again later.</div>';
        return appContainer;
    }
}



function addIngredientToList(ingredient, listElement) {
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
        listElement.removeChild(item);
        updateIngredientsAndInstructions();
    });
    
    item.appendChild(removeBtn);
    listElement.appendChild(item);
}

function addInstructionToList(instruction, index, listElement) {
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
        listElement.removeChild(item);
        
        // Renumber the steps
        const stepItems = listElement.querySelectorAll('.list-item');
        stepItems.forEach((step, idx) => {
            step.querySelector('.step-number').textContent = `Step ${idx + 1}: `;
        });
        
        updateIngredientsAndInstructions();
    });
    
    item.appendChild(removeBtn);
    listElement.appendChild(item);
}

// Update hidden fields with current list contents
function updateIngredientsAndInstructions() {
    // Get the current ingredients from the DOM
    const ingredientsList = document.getElementById('ingredients-list');
    const ingredients = [];
    
    if (ingredientsList) {
        ingredientsList.querySelectorAll('.list-item span:first-child').forEach(span => {
            ingredients.push(span.textContent);
        });
    }
    
    const instructionsList = document.getElementById('instructions-list');
    const instructions = [];
    
    if (instructionsList) {
        instructionsList.querySelectorAll('.list-item').forEach(item => {
            // Skip the step number span, get just the instruction text
            const spans = item.querySelectorAll('span');
            if (spans.length > 1) {
                instructions.push(spans[1].textContent);
            }
        });
    }

    updateHiddenFields(ingredients, instructions);
}

function updateHiddenFields(ingredients, instructions) {
    const ingredientsData = document.getElementById('ingredients-data');
    const instructionsData = document.getElementById('instructions-data');
    
    if (ingredientsData) {
        ingredientsData.value = JSON.stringify(ingredients);
    }
    
    if (instructionsData) {
        instructionsData.value = JSON.stringify(instructions);
    }
}


function setupFormHandlers(recipe) {
    // Store initial ingredients and instructions
    let ingredients = [...(recipe.ingredients || [])];
    let instructions = [...(recipe.instructions || [])];
    
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientQuantityInput = document.getElementById('new-ingredient-quantity');
    const ingredientNameInput = document.getElementById('new-ingredient-name');
    const ingredientsList = document.getElementById('ingredients-list');
    
    if (addIngredientBtn && ingredientQuantityInput && ingredientNameInput && ingredientsList) {
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
            
            addIngredientToList(ingredientText, ingredientsList);
            
            // Clear inputs
            ingredientQuantityInput.value = '';
            ingredientNameInput.value = '';
            
            updateHiddenFields(ingredients, instructions);
        });
    }
    
    // Add instruction button
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionInput = document.getElementById('new-instruction');
    const instructionsList = document.getElementById('instructions-list');
    
    if (addInstructionBtn && instructionInput && instructionsList) {
        addInstructionBtn.addEventListener('click', function() {
            const instructionText = instructionInput.value.trim();
            
            if (!instructionText) {
                alert('Please enter an instruction');
                return;
            }
            
            instructions.push(instructionText);
            
            addInstructionToList(instructionText, instructions.length - 1, instructionsList);
            
            // Clear input
            instructionInput.value = '';
            
            updateHiddenFields(ingredients, instructions);
        });
    }
    
    // Form submission
    const form = document.getElementById('edit-recipe-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Ensure we have at least one ingredient and instruction
            if (ingredients.length === 0) {
                alert('Please add at least one ingredient');
                return;
            }
            
            if (instructions.length === 0) {
                alert('Please add at least one instruction');
                return;
            }
            
            // Get form data
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
                const updatedRecipe = await updateRecipe(recipeData);
                
                // Get the flex container and remove everything
                const flexContainer = document.querySelector('.edit-flex-container');
                if (flexContainer) {
                    flexContainer.innerHTML = `
                        <div class="success-message" style="flex: 1; padding: 20px; text-align: center;">
                            <h2>Recipe Updated Successfully!</h2>
                            <p>Your recipe "${updatedRecipe.title}" has been saved.</p>
                            <button type="button" id="back-to-list-btn" style="padding: 10px 20px; margin-top: 15px;">Back to Recipes</button>
                        </div>
                    `;
                    
                    document.getElementById('back-to-list-btn')?.addEventListener('click', async function() {
                        await renderAllRecipes();
                    });
                } else {
                    // Fallback if flex container not found
                    form.innerHTML = `
                        <div class="success-message">
                            <h2>Recipe Updated Successfully!</h2>
                            <p>Your recipe "${updatedRecipe.title}" has been saved.</p>
                            <button type="button" id="back-to-list-btn">Back to Recipes</button>
                        </div>
                    `;
                    
                    document.getElementById('back-to-list-btn')?.addEventListener('click', async function() {
                        await renderAllRecipes();
                    });
                }
            } catch (error) {
                console.error('Error updating recipe:', error);
            }
        });
    }
}