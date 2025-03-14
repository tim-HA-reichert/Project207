CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    servings INTEGER,
    cookingtime INTEGER,
    difficulty VARCHAR(50),
    mealtype VARCHAR(50),
    nationality VARCHAR(50),
    ingredients JSONB,
    instructions JSONB
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
