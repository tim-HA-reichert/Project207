import TemplateManager from "../modules/templateManager.mjs";
import { createRecipe } from "../modules/apiHandler.mjs";

const templateFile = "./views/createRecipeView.html";

async function renderCreateRecipeView() {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("App container not found");
        return null;
    }
    
    try {
        // Clear the container
        appContainer.innerHTML = '';
        
        // Fetch the template
        const template = await TemplateManager.fetchTemplate(templateFile);
        if (!template) {
            console.error("Failed to load create recipe template.");
            return null;
        }
        
        TemplateManager.cloneRecipeTemplate(template, appContainer);
        
        // Set up event handlers for the form
        setupFormHandlers();
        
        return appContainer;
    } catch (error) {
        console.error("Error rendering create recipe view:", error);
        appContainer.innerHTML = '<div class="error">Error loading create recipe form. Please try again later.</div>';
        return appContainer;
    }
}

function setupFormHandlers() {
    // Get form elements
    const form = document.getElementById('create-recipe-form');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const instructionsContainer = document.getElementById('instructions-container');
    
    // Set up ingredients handling
    const newIngredientInput = document.getElementById('new-ingredient');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const ingredientsData = document.getElementById('ingredients-data');
    
    // Set up instructions handling
    const newInstructionInput = document.getElementById('new-instruction');
    const addInstructionBtn = document.getElementById('add-instruction-btn');
    const instructionsList = document.getElementById('instructions-list');
    const instructionsData = document.getElementById('instructions-data');
    
    // Initialize empty arrays for ingredients and instructions
    let ingredients = [];
    let instructions = [];
    
    // Update hidden fields with JSON data
    function updateHiddenFields() {
        ingredientsData.value = JSON.stringify(ingredients);
        instructionsData.value = JSON.stringify(instructions);
    }
    
    // Add new ingredient
    addIngredientBtn.addEventListener('click', () => {
        const ingredientText = newIngredientInput.value.trim();
        if (ingredientText) {
            // Add to array
            ingredients.push(ingredientText);
            
            // Create UI element
            const item = document.createElement('div');
            item.className = 'list-item';
            
            const itemText = document.createElement('span');
            itemText.textContent = ingredientText;
            item.appendChild(itemText);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-item-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.type = 'button';
            removeBtn.addEventListener('click', () => {
                // Remove from array
                const index = ingredients.indexOf(ingredientText);
                if (index !== -1) {
                    ingredients.splice(index, 1);
                }
                
                // Remove from UI
                ingredientsList.removeChild(item);
                
                // Update hidden field
                updateHiddenFields();
            });
            
            item.appendChild(removeBtn);
            ingredientsList.appendChild(item);
            
            // Clear input
            newIngredientInput.value = '';
            
            // Update hidden field
            updateHiddenFields();
        }
    });
    
    // Add new instruction
    addInstructionBtn.addEventListener('click', () => {
        const instructionText = newInstructionInput.value.trim();
        if (instructionText) {
            // Add to array
            instructions.push(instructionText);
            
            // Create UI element
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
            removeBtn.addEventListener('click', () => {
                // Remove from array
                const index = instructions.indexOf(instructionText);
                if (index !== -1) {
                    instructions.splice(index, 1);
                }
                
                // Remove from UI
                instructionsList.removeChild(item);
                
                // Renumber steps
                const stepItems = instructionsList.querySelectorAll('.list-item');
                stepItems.forEach((step, idx) => {
                    step.querySelector('.step-number').textContent = `Step ${idx + 1}: `;
                });
                
                // Update hidden field
                updateHiddenFields();
            });
            
            item.appendChild(removeBtn);
            instructionsList.appendChild(item);
            
            // Clear input
            newInstructionInput.value = '';
            
            // Update hidden field
            updateHiddenFields();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Validate that at least one ingredient and instruction are added
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
            submitButton.textContent = 'Creating...';
            submitButton.disabled = true;
            
            const savedRecipe = await createRecipe(recipeData);
            
            // Show success message
            form.innerHTML = `
                <div class="success-message">
                    <h2>Recipe Created Successfully!</h2>
                    <p>Your recipe "${savedRecipe.title}" has been saved.</p>
                    <button type="button" id="view-recipe-btn">View Recipe</button>
                    <button type="button" id="create-another-btn">Create Another Recipe</button>
                </div>
            `;
            
            // Add event listeners to the success buttons
            document.getElementById('view-recipe-btn').addEventListener('click', () => {
                // Redirect to view the created recipe
                window.location.href = `#recipe/${savedRecipe._id}`;
            });
            
            document.getElementById('create-another-btn').addEventListener('click', () => {
                // Refresh the create recipe form
                renderCreateRecipeView();
            });
        } catch (error) {
            console.error('Error creating recipe:', error);
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = `Failed to create recipe: ${error.message || 'Unknown error'}`;
            form.prepend(errorMessage);
            
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

const createRecipeViewController = {
    view: renderCreateRecipeView
};

export default createRecipeViewController;