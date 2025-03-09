CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    servings INTEGER,
    cookingTime INTEGER,
    difficulty VARCHAR(50),
    mealType VARCHAR(50),
    nationality VARCHAR(50),
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);