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
        flexContainer.className = 'edit-flex-container';
        flexContainer.style.display = 'flex';
        flexContainer.style.gap = '20px';
        flexContainer.style.margin = '20px 0';
        appContainer.appendChild(flexContainer);

        const originalRecipeContainer = document.createElement('div');
        originalRecipeContainer.className = 'original-recipe-container';
        originalRecipeContainer.style.flex = '1';
        originalRecipeContainer.style.border = '1px solid #ddd';
        originalRecipeContainer.style.borderRadius = '5px';
        originalRecipeContainer.style.padding = '15px';
        flexContainer.appendChild(originalRecipeContainer);
        
        // Create container for edit form
        const editFormContainer = document.createElement('div');
        editFormContainer.className = 'edit-form-container';
        editFormContainer.style.flex = '2';
        editFormContainer.style.minWidth = '500px';
        flexContainer.appendChild(editFormContainer);
        
        const recipe = await getRecipeById(recipeId);
        console.log("Fetched recipe:", recipe);
        if (!recipe) {
            throw new Error(`Recipe with ID ${recipeId} not found`);
        }
        
        // Format recipe data for template
        const templateData = {
            recipe_id: recipe.recipe_id || "undefined id",
            title: recipe.title || "Untitled Recipe",
            servings: recipe.servings || 1,
            cookingtime: recipe.cookingtime || 0,
            difficulty: recipe.difficulty || "not specified",
            mealtype: recipe.mealtype || "not specified",
            nationality: recipe.nationality || "not specified",
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions : []
        };

        // Render the original recipe on the left side
        const originalRecipeTemplate = await TemplateManager.fetchTemplate(recipeTemplateFile);
        TemplateManager.cloneRecipeTemplate(originalRecipeTemplate, originalRecipeContainer, templateData);
        
        // Make the original recipe view editable
        makeIngredientsEditable(originalRecipeContainer, recipe);
        makeInstructionsEditable(originalRecipeContainer, recipe);
        
        // Remove unnecessary buttons from original view
        const editButtons = originalRecipeContainer.querySelectorAll('.edit-button, .button-container');
        editButtons.forEach(button => button.remove());
        
        // Load and render the edit form on the right side
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

// Function to make ingredients editable in the original recipe view
function makeIngredientsEditable(container, recipe) {
    const ingredientsList = container.querySelector('.recipe-ingredients ul');
    if (!ingredientsList) return;
    
    // Clear existing ingredients
    ingredientsList.innerHTML = '';
    
    // Recreate each ingredient with remove buttons
    if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach((ingredient) => {
            const li = document.createElement('li');
            li.className = 'editable-ingredient';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '8px';
            
            const span = document.createElement('span');
            span.textContent = ingredient;
            li.appendChild(span);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-ingredient-btn';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.padding = '2px 8px';
            removeBtn.style.backgroundColor = '#ff4d4d';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '3px';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                ingredientsList.removeChild(li);
                syncViewsData();
            });
            
            li.appendChild(removeBtn);
            ingredientsList.appendChild(li);
        });
    }
    
    // Update the section title to indicate it's editable
    const ingredientsHeader = container.querySelector('.recipe-ingredients h3');
    if (ingredientsHeader) {
        ingredientsHeader.textContent = 'Ingredients (click Remove to delete)';
        ingredientsHeader.style.color = '#4a89dc';
    }
}

// Function to make instructions editable in the original recipe view
function makeInstructionsEditable(container, recipe) {
    const instructionsList = container.querySelector('.recipe-instructions ol');
    if (!instructionsList) return;
    
    // Clear existing instructions
    instructionsList.innerHTML = '';
    
    // Recreate each instruction with remove buttons
    if (Array.isArray(recipe.instructions)) {
        recipe.instructions.forEach((instruction, index) => {
            const li = document.createElement('li');
            li.className = 'editable-instruction';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '12px';
            
            const span = document.createElement('span');
            span.textContent = instruction;
            li.appendChild(span);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-instruction-btn';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.padding = '2px 8px';
            removeBtn.style.backgroundColor = '#ff4d4d';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '3px';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                instructionsList.removeChild(li);
                syncViewsData();
            });
            
            li.appendChild(removeBtn);
            instructionsList.appendChild(li);
        });
    }
    
    // Update the section title to indicate it's editable
    const instructionsHeader = container.querySelector('.recipe-instructions h3');
    if (instructionsHeader) {
        instructionsHeader.textContent = 'Instructions (click Remove to delete)';
        instructionsHeader.style.color = '#4a89dc';
    }
}

// Common function to add an ingredient to the edit form list
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
        syncViewsData();
    });
    
    item.appendChild(removeBtn);
    listElement.appendChild(item);
}

// Common function to add an instruction to the edit form list
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
        
        syncViewsData();
    });
    
    item.appendChild(removeBtn);
    listElement.appendChild(item);
}

// Master function to synchronize data between views and update hidden fields
function syncViewsData() {
    // Get current data from the edit form
    const formIngredientsList = document.getElementById('ingredients-list');
    const formInstructionsList = document.getElementById('instructions-list');
    
    // Get current data from the original view
    const originalIngredientsUl = document.querySelector('.original-recipe-container .recipe-ingredients ul');
    const originalInstructionsOl = document.querySelector('.original-recipe-container .recipe-instructions ol');
    
    // Arrays to hold the current data
    let ingredients = [];
    let instructions = [];
    
    // Determine which view was modified and use that as the source of truth
    // For this example, we'll prioritize the edit form if it exists
    if (formIngredientsList && formInstructionsList) {
        // Get ingredients from form
        ingredients = Array.from(formIngredientsList.querySelectorAll('.list-item span:first-child'))
            .map(span => span.textContent);
            
        // Get instructions from form
        instructions = Array.from(formInstructionsList.querySelectorAll('.list-item'))
            .map(item => {
                const spans = item.querySelectorAll('span');
                return spans.length > 1 ? spans[1].textContent : '';
            })
            .filter(text => text);
    } else if (originalIngredientsUl && originalInstructionsOl) {
        // Get ingredients from original view
        ingredients = Array.from(originalIngredientsUl.querySelectorAll('li span:first-child'))
            .map(span => span.textContent);
            
        // Get instructions from original view
        instructions = Array.from(originalInstructionsOl.querySelectorAll('li span:first-child'))
            .map(span => span.textContent);
    }
    
    // Update hidden form fields
    updateHiddenFields(ingredients, instructions);
    
    // Update both views to ensure they are in sync
    updateViews(ingredients, instructions);
}

// Update the hidden form fields with current data
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

// Update both views with the current data
function updateViews(ingredients, instructions) {
    // Update the form view if it exists
    const formIngredientsList = document.getElementById('ingredients-list');
    const formInstructionsList = document.getElementById('instructions-list');
    
    if (formIngredientsList) {
        formIngredientsList.innerHTML = '';
        ingredients.forEach(ing => {
            addIngredientToList(ing, formIngredientsList);
        });
    }
    
    if (formInstructionsList) {
        formInstructionsList.innerHTML = '';
        instructions.forEach((inst, idx) => {
            addInstructionToList(inst, idx, formInstructionsList);
        });
    }
    
    // Update the original view if it exists
    const originalIngredientsUl = document.querySelector('.original-recipe-container .recipe-ingredients ul');
    const originalInstructionsOl = document.querySelector('.original-recipe-container .recipe-instructions ol');
    
    if (originalIngredientsUl) {
        originalIngredientsUl.innerHTML = '';
        ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.className = 'editable-ingredient';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '8px';
            
            const span = document.createElement('span');
            span.textContent = ing;
            li.appendChild(span);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-ingredient-btn';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.padding = '2px 8px';
            removeBtn.style.backgroundColor = '#ff4d4d';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '3px';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                originalIngredientsUl.removeChild(li);
                syncViewsData();
            });
            
            li.appendChild(removeBtn);
            originalIngredientsUl.appendChild(li);
        });
    }
    
    if (originalInstructionsOl) {
        originalInstructionsOl.innerHTML = '';
        instructions.forEach((inst, idx) => {
            const li = document.createElement('li');
            li.className = 'editable-instruction';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '12px';
            
            const span = document.createElement('span');
            span.textContent = inst;
            li.appendChild(span);
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-instruction-btn';
            removeBtn.style.marginLeft = '10px';
            removeBtn.style.padding = '2px 8px';
            removeBtn.style.backgroundColor = '#ff4d4d';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '3px';
            removeBtn.style.cursor = 'pointer';
            
            removeBtn.addEventListener('click', function() {
                originalInstructionsOl.removeChild(li);
                syncViewsData();
            });
            
            li.appendChild(removeBtn);
            originalInstructionsOl.appendChild(li);
        });
    }
}

// Setup form handlers for the edit form
function setupFormHandlers(recipe) {
    // Initialize with recipe data
    let ingredients = [...(recipe.ingredients || [])];
    let instructions = [...(recipe.instructions || [])];
    
    // Setup the ingredients list in the form
    const ingredientsList = document.getElementById('ingredients-list');
    if (ingredientsList) {
        ingredientsList.innerHTML = '';
        ingredients.forEach(ing => {
            addIngredientToList(ing, ingredientsList);
        });
    }
    
    // Setup the instructions list in the form
    const instructionsList = document.getElementById('instructions-list');
    if (instructionsList) {
        instructionsList.innerHTML = '';
        instructions.forEach((inst, idx) => {
            addInstructionToList(inst, idx, instructionsList);
        });
    }
    
    // Add ingredient button handler
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientQuantityInput = document.getElementById('new-ingredient-quantity');
    const ingredientNameInput = document.getElementById('new-ingredient-name');
    
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
            
            // Add to the form list
            addIngredientToList(ingredientText, ingredientsList);
            
            // Clear inputs
            ingredientQuantityInput.value = '';
            ingredientNameInput.value = '';
            
            // Sync views and update hidden fields
            syncViewsData();
        });
    }
    
    // Add instruction button handler
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionInput = document.getElementById('new-instruction');
    
    if (addInstructionBtn && instructionInput && instructionsList) {
        addInstructionBtn.addEventListener('click', function() {
            const instructionText = instructionInput.value.trim();
            
            if (!instructionText) {
                alert('Please enter an instruction');
                return;
            }
            
            // Get current count to determine the index
            const currentCount = instructionsList.querySelectorAll('.list-item').length;
            
            // Add to the form list
            addInstructionToList(instructionText, currentCount, instructionsList);
            
            // Clear input
            instructionInput.value = '';
            
            // Sync views and update hidden fields
            syncViewsData();
        });
    }
    
    // Form submission handler
    const form = document.getElementById('edit-recipe-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Get the current data from hidden fields
            const ingredientsData = document.getElementById('ingredients-data');
            const instructionsData = document.getElementById('instructions-data');
            
            const currentIngredients = ingredientsData ? JSON.parse(ingredientsData.value || '[]') : [];
            const currentInstructions = instructionsData ? JSON.parse(instructionsData.value || '[]') : [];
            
            // Validation
            if (currentIngredients.length === 0) {
                alert('Please add at least one ingredient');
                return;
            }
            
            if (currentInstructions.length === 0) {
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
                ingredients: currentIngredients,
                instructions: currentInstructions
            };
            
            try {
                const updatedRecipe = await updateRecipe(recipeData.recipe_id, recipeData);
                
                // Display success message
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
                alert('Failed to update recipe. Please try again.');
            }
        });
    }
}