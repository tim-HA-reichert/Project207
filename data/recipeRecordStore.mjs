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

    async searchFor(criteria = {}){
        let query = `SELECT * FROM recipes`;

        const whereConditions = [];
        const values = [];

        let paramCount = 1;

        if(criteria.mealType){
            whereConditions.push(`mealtype = $${paramCount++}`);
            values.push(criteria.mealType);
        }

        if(criteria.nationality){
            whereConditions.push(`nationality = $${paramCount++}`);
            values.push(criteria.nationality);
        }

        if(criteria.difficulty){
            whereConditions.push(`difficulty = $${paramCount++}`);
            values.push(criteria.difficulty);
        }

        if(criteria.cookingTime){
            whereConditions.push(`cookingtime = $${paramCount++}`);
            values.push(criteria.cookingTime);
        }

        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
          }
          
          return await db.read(query, ...values)
    }

    update(){
        
    }

    remove(){

    }

}