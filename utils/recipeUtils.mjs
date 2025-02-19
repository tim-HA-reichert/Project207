export const findRecipe = (aCollectionOfRecipes, aRecipeID) => {
    const idToFind = parseInt(aRecipeID);
    const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
    return recipe;
}

export const createNewRecipe = (aName, aCollectionOfRecipes) => {
    
    const existingIds = aCollectionOfRecipes.map(recipe => recipe.id);
    const newId = Math.max(...existingIds) + 1;

        const newRecipe = {
            id: newId,
            title: aName
        }

        aCollectionOfRecipes.push(newRecipe);
    return aCollectionOfRecipes;
}