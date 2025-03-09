import RecordStoreInterface from "./abstractRecordStoreInterface.mjs";
import * as db from './db.mjs';

class StoreRecipeRecord extends RecordStoreInterface {

    async create(recipe){
        const query = `
            INSERT INTO recipes (
                title,
                servings,
                cookingTime,
                difficulty,
                mealType,
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

    read(){

    }

    update(){
        
    }

    remove(){

    }

}