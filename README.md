# 🍳 Recipe Sharing Platform — Backend API

A full-stack recipe management and social sharing platform where users can create, browse, review, and organize recipes — with authentication, cloud image storage, and social features like following and activity feeds.

Built as a production-style backend to demonstrate real-world API design, relational database modeling, and secure authentication — not a tutorial clone.

---

## 🚀 Live Demo

- **Frontend:** [link once deployed]
- **Backend API:** [link once deployed]
- **API Documentation (Postman Collection):** See `/docs/Recipe_Platform_API.postman_collection.json`

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing
- Cloudinary for cloud image storage
- Multer for multipart file uploads

**Frontend**
- React.js (Vite)
- React Router
- Axios
- Context API for auth state management

**Tooling**
- Postman for API testing (40+ automated test assertions)
- Git / GitHub for version control

---

## ✨ Features

### Authentication & Profiles
- User registration & login with JWT
- Password hashing with bcrypt (10 salt rounds)
- Duplicate email/username validation
- Profile view & update endpoints
- Role-based access control (`user` / `admin`)

### Recipe Management
- Create recipes with ingredients, step-by-step instructions, and cover images
- Cloudinary integration for image upload (in-memory buffer via Multer, no local disk writes)
- Edit / delete own recipes (owner-only, admin override)
- Soft-delete support (paranoid mode via Sequelize)

### Browse, Search & Filter
- Full recipe listing with pagination
- Keyword search (case-insensitive, `ILIKE`)
- Filter by category and difficulty level

### Favorites & Collections
- Toggle favorite recipes
- Create custom collections (e.g. "Weeknight Dinners")
- Add recipes to collections

### Ratings & Reviews
- One review per user per recipe (enforced via unique constraint)
- Auto-recalculated average rating & review count on the recipe
- Prevents duplicate reviews (409 Conflict)

### Social Features
- Follow / unfollow other users (self-referencing many-to-many relationship)
- Follow/unfollow works by numeric ID **or** username
- Personalized activity feed showing recipes & reviews from followed users

### Admin Dashboard
- Ban users (accepts ID or username)
- Recipe moderation (soft-delete any recipe)
- Protected via `isAdmin` middleware

---

## 🗄️ Database Schema

PostgreSQL with 13 relational tables:

```
users
recipes
recipe_ingredients
recipe_instructions
recipe_images
categories
recipe_categories       (join table — many-to-many)
reviews
favorites               (join table — many-to-many)
collections
collection_recipes      (join table — many-to-many)
follows                 (join table — self-referencing many-to-many)
activity_feed
```

**Key design decisions:**
- **Soft deletes** (`paranoid: true`) on `users` and `recipes` — admin "deletion" preserves data integrity instead of cascading destructive deletes
- **Denormalized `avgRating` / `reviewsCount`** on the `recipes` table — recalculated on every review write, avoiding expensive `AVG()` joins on every recipe read
- **Self-referencing many-to-many** for `follows` — models Instagram-style follower/following without a separate `followers` array anti-pattern
- Full schema SQL available in `database.sql`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/users/me` | Get own profile | Yes |
| PUT | `/api/users/me` | Update own profile | Yes |
| GET | `/api/users/me/recipes` | Get own recipes | Yes |
| PUT | `/api/users/:id/ban` | Ban a user (ID or username) | Admin |
| GET | `/api/recipes` | Browse/search/filter recipes | No |
| POST | `/api/recipes` | Create recipe (with image) | Yes |
| GET | `/api/recipes/:id` | Get recipe detail | No |
| PUT | `/api/recipes/:id` | Update own recipe | Yes |
| DELETE | `/api/recipes/:id` | Delete own recipe (or admin) | Yes |
| POST | `/api/reviews/:recipeId` | Add review | Yes |
| GET | `/api/reviews/:recipeId` | Get recipe reviews | No |
| DELETE | `/api/reviews/:id` | Delete own review | Yes |
| POST | `/api/favorites/:recipeId` | Toggle favorite | Yes |
| GET | `/api/favorites` | Get own favorites | Yes |
| POST | `/api/collections` | Create collection | Yes |
| POST | `/api/collections/:collectionId/recipes/:recipeId` | Add recipe to collection | Yes |
| GET | `/api/collections` | Get own collections | Yes |
| POST | `/api/follows/:userId` | Follow a user (ID or username) | Yes |
| DELETE | `/api/follows/:userId` | Unfollow a user | Yes |
| GET | `/api/follows/following` | Get who you follow | Yes |
| GET | `/api/follows/followers` | Get your followers | Yes |
| GET | `/api/feed` | Get activity feed | Yes |

Full request/response examples available in the Postman collection.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/recipe-sharing-platform-api.git
cd recipe-sharing-platform-api
npm install
```

### 2. Set up environment variables
Create a `.env` file in the root:
```env
PORT=8080
DATABASE_URL=postgresql://username:password@localhost:5432/recipe_platform
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Set up the database
```bash
createdb recipe_platform
psql -d recipe_platform -f database.sql
```

### 4. Run the server
```bash
npm run dev
```
Server runs on `http://localhost:8080`

### 5. Run the frontend (separate repo/folder)
```bash
cd recipe-frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🧪 Testing

A full Postman collection with **40+ automated assertions** covers:
- Auth (register, login, invalid credentials, duplicate detection)
- Recipe CRUD + Cloudinary upload verification
- Reviews (including duplicate-review rejection)
- Favorites & Collections
- Follow/Unfollow (including self-follow and duplicate-follow rejection)
- Activity Feed
- Admin actions
- Security checks (missing token → 401, invalid token → 401, unauthorized delete → 403)

Import `docs/Recipe_Platform_API.postman_collection.json` into Postman and run the full collection.

---

## 🔒 Known Limitations & Next Steps

Being transparent about what's not yet production-hardened:

- [ ] No rate limiting on auth endpoints (planned: `express-rate-limit`)
- [ ] JWTs are long-lived with no refresh/rotation mechanism
- [ ] No automated CI pipeline yet (GitHub Actions planned)
- [ ] No unit tests (only integration tests via Postman) — Jest/Supertest planned
- [ ] Not yet deployed to production infrastructure

---

## 👤 Author

**Rajlaxmi Singh**
Backend Software Engineer | Node.js · Express · PostgreSQL · MongoDB
[LinkedIn](https://linkedin.com/in/raj-laxmi) · [GitHub](https://github.com/rmhere55)

---

## 📄 License

This project is for portfolio/educational purposes.