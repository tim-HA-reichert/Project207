export default class RecipeModel {
    constructor(recipeData = {}) {
        this.title = recipeData.title;
        this.servings = recipeData.servings;
        this.cookingTime = recipeData.cookingTime;
        this.difficulty = recipeData.difficulty;
        this.mealType = recipeData.mealType;
        this.nationality = recipeData.nationality;
        this.ingredients = recipeData.ingredients;
        this.instructions = recipeData.instructions;
    }

    recipeData(){
        const recipeData = {
            title: this.title,
            servings: this.servings,
            cookingTime: this.cookingTime,
            difficulty: this.difficulty,
            mealType: this.mealType,
            nationality: this.nationality,
            ingredients: this.ingredients,
            instructions: this.instructions
        };
        return recipeData
    }
}