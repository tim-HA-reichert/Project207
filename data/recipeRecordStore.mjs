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

    async searchFor(searchTerms) {
        const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];

        console.log("searchFor" + " " +searchTerms)
 
        const whereClauses = terms.map((term, index) => `(
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
        WHERE ${whereClauses.join(' OR ')}
        `;
    
        const values = terms.map(term => `%${term}%`);
    
        return await db.read(query, ...values);
    }
    update(){
        
    }

    remove(){

    }

}