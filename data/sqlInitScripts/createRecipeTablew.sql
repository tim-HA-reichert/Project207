CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    servings INTEGER,
    cooking_time_minutes INTEGER,
    difficulty VARCHAR(50),
    time_of_cook VARCHAR(50),
    meal_type VARCHAR(50),
    nationality VARCHAR(50),
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);