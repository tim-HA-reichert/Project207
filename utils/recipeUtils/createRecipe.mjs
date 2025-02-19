export const createNewRecipe = (aID, aName, aCollectionOfRecipes) => {
        const newRecipe = {
            id: aID,
            title: aName
        }

        aCollectionOfRecipes.push(newRecipe);
        
        return aCollectionOfRecipes;

}