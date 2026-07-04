-- ============================================================
-- RECIPE PLATFORM — CLEAN DEMO SEED DATA
-- Run this AFTER your cleanup DELETE statements.
-- Uses pgcrypto's bcrypt-compatible crypt() so these users can
-- actually log in through your real /api/auth/login endpoint.
-- Every seeded user's password is: Demo@1234
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- USERS ----------
INSERT INTO users (username, email, password_hash, bio, is_banned, role, created_at, updated_at)
VALUES
  ('priya_kitchen', 'priya@example.com', crypt('Demo@1234', gen_salt('bf')), 'Home cook sharing family recipes from Punjab.', false, 'user', now(), now()),
  ('chef_arjun', 'arjun@example.com', crypt('Demo@1234', gen_salt('bf')), 'Professional chef, 10 years in South Indian cuisine.', false, 'user', now(), now()),
  ('healthy_with_neha', 'neha@example.com', crypt('Demo@1234', gen_salt('bf')), 'Nutritionist. I make healthy eating actually taste good.', false, 'user', now(), now()),
  ('baker_rohan', 'rohan@example.com', crypt('Demo@1234', gen_salt('bf')), 'Self-taught baker. Desserts are my love language.', false, 'user', now(), now())
ON CONFLICT (email) DO NOTHING;

-- ---------- CATEGORIES ----------
INSERT INTO categories (name, slug) VALUES
  ('Vegetarian', 'vegetarian'),
  ('Vegan', 'vegan'),
  ('Desserts', 'desserts'),
  ('South Indian', 'south-indian'),
  ('Quick Meals', 'quick-meals')
ON CONFLICT (name) DO NOTHING;

-- ---------- RECIPES ----------
-- (cover_image left NULL on purpose — your frontend already renders a clean
--  colored category icon placeholder when there's no image, which looks
--  intentional rather than broken)

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, 'Paneer Butter Masala', 'Rich and creamy North Indian curry made with soft paneer cubes in a tomato-butter gravy.', 15, 25, 4, 'Medium', 0, 0, true, now(), now()
FROM users WHERE username = 'priya_kitchen';

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, 'Masala Dosa', 'Crispy fermented rice crepe filled with spiced potato masala, served with coconut chutney.', 20, 15, 2, 'Medium', 0, 0, true, now(), now()
FROM users WHERE username = 'chef_arjun';

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, 'Quinoa Power Bowl', 'Protein-packed quinoa bowl with roasted vegetables and a lemon-tahini dressing.', 10, 15, 2, 'Easy', 0, 0, true, now(), now()
FROM users WHERE username = 'healthy_with_neha';

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, 'Chocolate Lava Cake', 'Decadent individual chocolate cakes with a warm molten center. Restaurant-quality at home.', 15, 12, 4, 'Hard', 0, 0, true, now(), now()
FROM users WHERE username = 'baker_rohan';

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, 'Vegan Chickpea Curry', 'Hearty chickpea curry simmered in coconut milk and warm spices. Fully plant-based.', 10, 20, 3, 'Easy', 0, 0, true, now(), now()
FROM users WHERE username = 'healthy_with_neha';

INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty_level, avg_rating, reviews_count, is_published, created_at, updated_at)
SELECT id, '10-Minute Avocado Toast', 'Quick and satisfying breakfast with smashed avocado, chili flakes, and a poached egg.', 5, 5, 1, 'Easy', 0, 0, true, now(), now()
FROM users WHERE username = 'priya_kitchen';

-- ---------- LINK RECIPES TO CATEGORIES ----------
INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = 'Paneer Butter Masala' AND c.name = 'Vegetarian';

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = 'Masala Dosa' AND c.name IN ('Vegetarian', 'South Indian');

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = 'Quinoa Power Bowl' AND c.name IN ('Vegan', 'Quick Meals');

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = 'Chocolate Lava Cake' AND c.name = 'Desserts';

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = 'Vegan Chickpea Curry' AND c.name = 'Vegan';

INSERT INTO recipe_categories (recipe_id, category_id)
SELECT r.id, c.id FROM recipes r, categories c
WHERE r.title = '10-Minute Avocado Toast' AND c.name IN ('Vegetarian', 'Quick Meals');

-- ---------- INGREDIENTS (sample for 2 recipes — enough for a real demo click-through) ----------
INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT id, 'Paneer', 250, 'g' FROM recipes WHERE title = 'Paneer Butter Masala'
UNION ALL SELECT id, 'Butter', 2, 'tbsp' FROM recipes WHERE title = 'Paneer Butter Masala'
UNION ALL SELECT id, 'Tomato puree', 1, 'cup' FROM recipes WHERE title = 'Paneer Butter Masala'
UNION ALL SELECT id, 'Fresh cream', 3, 'tbsp' FROM recipes WHERE title = 'Paneer Butter Masala';

INSERT INTO instructions (recipe_id, step_number, description)
SELECT id, 1, 'Lightly pan-fry the paneer cubes until golden, then set aside.' FROM recipes WHERE title = 'Paneer Butter Masala'
UNION ALL SELECT id, 2, 'Sauté butter and tomato puree until the raw smell disappears.' FROM recipes WHERE title = 'Paneer Butter Masala'
UNION ALL SELECT id, 3, 'Add cream and spices, simmer for 5 minutes, then fold in the paneer.' FROM recipes WHERE title = 'Paneer Butter Masala';

INSERT INTO ingredients (recipe_id, name, quantity, unit)
SELECT id, 'Chickpeas', 400, 'g' FROM recipes WHERE title = 'Vegan Chickpea Curry'
UNION ALL SELECT id, 'Coconut milk', 1, 'cup' FROM recipes WHERE title = 'Vegan Chickpea Curry'
UNION ALL SELECT id, 'Onion', 1, 'pieces' FROM recipes WHERE title = 'Vegan Chickpea Curry';

INSERT INTO instructions (recipe_id, step_number, description)
SELECT id, 1, 'Sauté onions until translucent, add spices and cook for 1 minute.' FROM recipes WHERE title = 'Vegan Chickpea Curry'
UNION ALL SELECT id, 2, 'Add chickpeas and coconut milk, simmer for 15 minutes.' FROM recipes WHERE title = 'Vegan Chickpea Curry';

-- ---------- REVIEWS (also updates avg_rating / reviews_count for realism) ----------
INSERT INTO reviews (recipe_id, user_id, rating, comment, created_at)
SELECT r.id, u.id, 5, 'Made this for dinner last night, absolutely restaurant quality!', now()
FROM recipes r, users u WHERE r.title = 'Paneer Butter Masala' AND u.username = 'chef_arjun';

INSERT INTO reviews (recipe_id, user_id, rating, comment, created_at)
SELECT r.id, u.id, 4, 'Great flavor, took me a bit longer than 12 minutes to cook.', now()
FROM recipes r, users u WHERE r.title = 'Chocolate Lava Cake' AND u.username = 'priya_kitchen';

UPDATE recipes SET avg_rating = 5.0, reviews_count = 1 WHERE title = 'Paneer Butter Masala';
UPDATE recipes SET avg_rating = 4.0, reviews_count = 1 WHERE title = 'Chocolate Lava Cake';

-- ---------- FOLLOWS ----------
INSERT INTO follows (follower_id, following_id, created_at)
SELECT a.id, b.id, now() FROM users a, users b WHERE a.username = 'priya_kitchen' AND b.username = 'chef_arjun';

INSERT INTO follows (follower_id, following_id, created_at)
SELECT a.id, b.id, now() FROM users a, users b WHERE a.username = 'priya_kitchen' AND b.username = 'healthy_with_neha';

-- ---------- ACTIVITY FEED (so priya_kitchen's feed shows real activity) ----------
INSERT INTO activity_feed (user_id, action_type, recipe_id, created_at)
SELECT u.id, 'recipe_created', r.id, now()
FROM users u, recipes r WHERE u.username = 'chef_arjun' AND r.title = 'Masala Dosa';

INSERT INTO activity_feed (user_id, action_type, recipe_id, created_at)
SELECT u.id, 'recipe_created', r.id, now()
FROM users u, recipes r WHERE u.username = 'healthy_with_neha' AND r.title = 'Vegan Chickpea Curry';

-- ============================================================
-- Done. Login credentials for any seeded account:
--   email:    priya@example.com  (or arjun@ / neha@ / rohan@)
--   password: Demo@1234
-- ============================================================

