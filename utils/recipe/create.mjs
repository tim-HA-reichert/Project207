export const createNewRecipe = (aCollectionOfRecipes, aNewRecipe, difficulties, mealTypes) => {
    const validDifficulties = Object.values(difficulties);
    const validMealTypes = Object.values(mealTypes); 

    if (!aNewRecipe.title || !aNewRecipe.difficulty || !aNewRecipe.mealType) {
        throw new Error("Cannot create recipe: title, difficulty, and mealType are mandatory fields");
    }
    
    if (!validDifficulties.includes(aNewRecipe.difficulty)) {
        throw new Error(`Please choose a difficulty. Must be one of: ${validDifficulties.join(', ')}`);
    }

    if (!validMealTypes.includes(aNewRecipe.mealType)) {
        throw new Error(`Gotta have a mealtype, man. Must be one of: ${validMealTypes.join(', ')}`);
    }

    if (aNewRecipe.ingredients) {
        if (!Array.isArray(aNewRecipe.ingredients)) {
            throw new Error("Ingredients must be an array");
        }
    }

    const existingIds = aCollectionOfRecipes.map(recipe => recipe.id);
    const newId = Math.max(...existingIds) + 1;

    const newRecipe = {
        id: newId,
        title: aNewRecipe.title,
        servings: aNewRecipe.servings,
        cookingTime: aNewRecipe.cookingTime,
        difficulty: difficulties[aNewRecipe.difficulty.toLowerCase()],
        mealType: mealTypes[aNewRecipe.mealType.toLowerCase()],
        nationality: aNewRecipe.nationality,
        ingredients: aNewRecipe.ingredients || []
    }

    aCollectionOfRecipes.push(newRecipe);
    return aCollectionOfRecipes;
}
