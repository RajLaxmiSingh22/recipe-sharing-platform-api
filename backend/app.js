import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routers/auth.routes.js";
import recipeRoutes from "./src/routers/recipe.routes.js";
import reviewRoutes from "./src/routers/review.routes.js";
import favoriteRoutes from "./src/routers/favorite.routes.js";
import collectionRoutes from "./src/routers/collection.routes.js";
import userRoutes from "./src/routers/user.routes.js";
import followRoutes from "./src/routers/follow.routes.js";
import feedRoutes from "./src/routers/feed.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Recipe Platform API');
});


app.get('/sync', async (req, res) => {
  await sequelize.sync({ force: true });
  res.send('Database synchronized');
});


app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/users", userRoutes);

app.use("/api/follows", followRoutes);
app.use("/api/feed", feedRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;