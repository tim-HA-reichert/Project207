class Recipe{
    constructor(id, authorID, recipeTitle, nationality, cookingTime, difficulty){
        this.id = id;
        this.authorID = authorID;
        this.recipeTitle = recipeTitle;
        this.nationality = nationality;
        this.cookingTime = cookingTime;
        this.difficulty = difficulty; 
    }

    read(id){};
    update(id, authorID){};
    deletion(id, authorID){};


}