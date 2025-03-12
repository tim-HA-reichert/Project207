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
VALUES (
    'Classic American Cheeseburger with Seasoned Fries',
    4,
    35,
    'easy',
    'dinner',
    'American',
    '[
        {"ingredient": "1.5 lbs ground beef (80/20 blend)"},
        {"ingredient": "4 hamburger buns"},
        {"ingredient": "4 slices American cheese"},
        {"ingredient": "1 large onion, sliced"},
        {"ingredient": "2 tomatoes, sliced"},
        {"ingredient": "1 head lettuce, leaves separated"},
        {"ingredient": "4 tbsp ketchup"},
        {"ingredient": "3 tbsp mayonnaise"},
        {"ingredient": "2 tbsp mustard"},
        {"ingredient": "2 tbsp Worcestershire sauce"},
        {"ingredient": "2 tsp garlic powder"},
        {"ingredient": "4 large russet potatoes"},
        {"ingredient": "3 tbsp vegetable oil"},
        {"ingredient": "1 tbsp paprika"},
        {"ingredient": "1 tsp onion powder"},
        {"ingredient": "Salt and pepper to taste"}
    ]',
    '[
        {"step": "Preheat oven to 425°F (220°C). Cut potatoes into even wedges."},
        {"step": "In a large bowl, toss potato wedges with 2 tbsp oil, paprika, onion powder, 1 tsp garlic powder, salt and pepper."},
        {"step": "Arrange potatoes in a single layer on a baking sheet and bake for 25-30 minutes, turning halfway through."},
        {"step": "Meanwhile, in a large bowl, combine ground beef, Worcestershire sauce, 1 tsp garlic powder, salt, and pepper. Mix gently and form into 4 equal patties, making an indent in the center of each with your thumb."},
        {"step": "Heat a large skillet or grill over medium-high heat. Add 1 tbsp oil and cook patties for 4-5 minutes per side for medium doneness."},
        {"step": "Top each patty with a slice of cheese during the last minute of cooking. Cover to help cheese melt."},
        {"step": "Toast hamburger buns lightly if desired."},
        {"step": "Mix ketchup, mayonnaise, and mustard for the burger sauce."},
        {"step": "Assemble burgers with sauce, lettuce, tomato, patty, and onion slices."},
        {"step": "Serve immediately with the seasoned fries on the side."}
    ]'
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE recipes ADD COLUMN author_id INTEGER REFERENCES users(user_id);