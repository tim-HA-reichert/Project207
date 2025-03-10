class Recipe{
    constructor(id, authorID, recipeTitle, servings, mealType, nationality, ingredients, cookingTime, difficulty, instructions){
        this.authorID = authorID;
        this.recipeTitle = recipeTitle;
        this.servings = servings
        this.cookingTime = cookingTime;
        this.difficulty = difficulty; 
        this.mealType = mealType;
        this.nationality = nationality;
        this.ingredients = ingredients;
        this.instructions = instructions;
    }

    read(id){};
    update(id, authorID){};
    deletion(id, authorID){};


}