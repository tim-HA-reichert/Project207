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