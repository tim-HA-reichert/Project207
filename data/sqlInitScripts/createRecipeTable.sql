CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    servings INTEGER,
    cooking_time INTEGER,
    difficulty VARCHAR(50),
    meal_type VARCHAR(50),
    nationality VARCHAR(50),
    ingredients JSONB,
    instructions JSONB
);
INSERT INTO recipes (title, servings, cooking_time, difficulty, meal_type, nationality, ingredients, instructions)
VALUES ('Spaghetti Bolognese', 4, 30, 'Easy', 'Dinner', 'Italian', '[{"ingredient": "Spaghetti", "quantity": "200g"}, {"ingredient": "Ground Beef", "quantity": "500g"}]', '[{"step": "Boil water"}, {"step": "Cook spaghetti"}]');


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE recipes ADD COLUMN author_id INTEGER REFERENCES users(user_id);