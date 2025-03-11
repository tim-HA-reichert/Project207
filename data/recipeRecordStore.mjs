import RecordStoreInterface from "./abstractRecordStoreInterface.mjs";
import * as db from './db.mjs';

export default class StoreRecipeRecord extends RecordStoreInterface {

    async create(recipe){
        const query = `
            INSERT INTO recipes (
                title,
                servings,
                cookingtime,
                difficulty,
                mealtype,
                nationality,
                ingredients,
                instructions
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values = [
            recipe.title, 
            recipe.servings, 
            recipe.cookingTime, 
            recipe.difficulty, 
            recipe.mealType, 
            recipe.nationality,
            JSON.stringify(recipe.ingredients || []),
            JSON.stringify(recipe.instructions || [])
        ]

        return await db.create(query, ...values);

    }

    async readAll(){
        let query = `SELECT * FROM recipes`;

        return await db.read(query);
    }

    async readById(recipeId){
        const query = `
        SELECT * FROM recipes
        WHERE recipe_id = $1
        `;

        return await db.read(query, ...[recipeId])
    }

    async searchFor(searchTerms) {
        const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];

        console.log("searchFor" + " " +searchTerms)
 
        const whereClauses = terms.map((_nothing, index) => `(
            LOWER(title) LIKE LOWER($${index + 1}) OR
            LOWER(CAST(servings AS TEXT)) LIKE LOWER($${index + 1}) OR
            LOWER(CAST(cookingTime AS TEXT)) LIKE LOWER($${index + 1}) OR
            LOWER(difficulty) LIKE LOWER($${index + 1}) OR
            LOWER(nationality) LIKE LOWER($${index + 1}) OR
            LOWER(ingredients::text) LIKE LOWER($${index + 1}) OR
            LOWER(instructions::text) LIKE LOWER($${index + 1})
        )`);
    
        const query = `
        SELECT *
        FROM recipes
        WHERE ${whereClauses.join(' AND ')}
        `;
    
        const values = terms.map(term => `%${term}%`);
    
        return await db.read(query, ...values);
    }

    async update(recipe_id, recipeChanges) {
        const query = `
            UPDATE recipes
            SET title = $1,
                servings = $2,
                cookingtime = $3,
                difficulty = $4,
                mealtype = $5,
                nationality = $6,
                ingredients = $7,
                instructions = $8
            WHERE recipe_id = $9
            RETURNING *
        `;
    
        const values = [
            recipeChanges.title, 
            recipeChanges.servings, 
            recipeChanges.cookingTime, 
            recipeChanges.difficulty, 
            recipeChanges.mealType, 
            recipeChanges.nationality,
            JSON.stringify(recipe.ingredients || []),
            JSON.stringify(recipe.instructions || []),
            recipe_id
        ];
    
        return await db.update(query, ...values);
    }

    async remove(recipeId){
        const query = `
        DELETE FROM recipes
        WHERE recipe_id = $1
        RETURNING *
        `;

        const values = [recipeId];

        return await db.remove(query, ...values);
    }

}