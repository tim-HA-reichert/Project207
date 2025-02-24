export const findRecipeById = (aCollectionOfRecipes, aRecipeID) => {
    const idToFind = parseInt(aRecipeID);
    const recipe = aCollectionOfRecipes.find(recipe => recipe.id === idToFind);
return recipe;
}

export const searchRecipes = (aCollectionOfRecipes, searchParams) => {
return aCollectionOfRecipes.filter(recipe => {
  for (const [searchField, searchValue] of Object.entries(searchParams)) {

    if(searchField === "ingredients"){
        const searchIngredients = searchValue.split(",")
            .map(ingredient => ingredient.trim().toLowerCase());

        const hasIngredient = searchIngredients.every(ingredient => 
                recipe.ingredients.some(
                    element => element.name.toLowerCase().includes(searchIngredients)
        )
    );
        if(!hasIngredient){
            return false
        } 
            continue
    }
    
    const valueInRecipe = String(recipe[searchField]).toLowerCase();
    const valueToFind = String(searchValue).toLowerCase();
    
    if (!valueInRecipe.includes(valueToFind)) {
      return false;
    }
  }
  return true
});
};