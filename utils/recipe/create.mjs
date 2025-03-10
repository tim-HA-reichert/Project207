export const createNewRecipe = (aNewRecipe, difficulties, mealTypes) => {
    const validDifficulties = Object.values(difficulties);
    const validMealTypes = Object.values(mealTypes); 

    if (!aNewRecipe.recipeTitle || !aNewRecipe.difficulty || !aNewRecipe.mealType) {
        throw new Error("Cannot create recipe: title, difficulty, and mealType are mandatory fields");
    }
    
    if (!validDifficulties.includes(aNewRecipe.difficulty.toLowerCase())) {
        throw new Error(`Please choose a difficulty. Must be one of: ${validDifficulties.join(', ')}`);
    }

    if (!validMealTypes.includes(aNewRecipe.mealType.toLowerCase())) {
        throw new Error(`Gotta have a mealtype, man. Must be one of: ${validMealTypes.join(', ')}`);
    }

    if (aNewRecipe.ingredients && !Array.isArray(aNewRecipe.ingredients)) {
            throw new Error("Ingredients must be an array");
        }
    

    const newRecipe = {
        recipeTitle: aNewRecipe.recipeTitle,
        servings: aNewRecipe.servings,
        cookingTime: aNewRecipe.cookingTime,
        difficulty: difficulties[aNewRecipe.difficulty.toLowerCase()],
        mealType: mealTypes[aNewRecipe.mealType.toLowerCase()],
        nationality: aNewRecipe.nationality,
        ingredients: aNewRecipe.ingredients || [],
        instructions: aNewRecipe.instructions || []
    }

    return newRecipe
}
