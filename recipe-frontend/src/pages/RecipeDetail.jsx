import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);

  const loadRecipe = () => {
    api.get(`/recipes/${id}`).then((res) => setRecipe(res.data));
  };

  const loadReviews = () => {
    api.get(`/reviews/${id}`).then((res) => setReviews(res.data));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/recipes/${id}`),
      api.get(`/reviews/${id}`),
    ])
      .then(([recipeRes, reviewsRes]) => {
        setRecipe(recipeRes.data);
        setReviews(reviewsRes.data);
      })
      .catch((err) => console.error("Failed to load recipe:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    try {
      await api.post(`/reviews/${id}`, { rating: Number(rating), comment });
      setComment("");
      loadReviews();
      loadRecipe(); // refresh avgRating
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const res = await api.post(`/favorites/${id}`);
      setIsFavorited(res.data.favorited);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!recipe) return <p style={{ textAlign: "center" }}>Recipe not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: "0 20px" }}>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <p>
        <strong>Prep:</strong> {recipe.prepTime} min · <strong>Cook:</strong> {recipe.cookTime} min ·{" "}
        <strong>Servings:</strong> {recipe.servings} · <strong>Difficulty:</strong> {recipe.difficultyLevel}
      </p>
      <p>⭐ {recipe.avgRating} ({recipe.reviewsCount} reviews)</p>

      {user && (
        <button onClick={handleFavoriteToggle} style={{ padding: "8px 16px", marginBottom: 20 }}>
          {isFavorited ? "💔 Remove Favorite" : "❤️ Add to Favorites"}
        </button>
      )}

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients?.map((ing) => (
          <li key={ing.id}>{ing.quantity} {ing.unit} {ing.name}</li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <ol>
        {recipe.instructions?.map((step) => (
          <li key={step.id}>{step.description}</li>
        ))}
      </ol>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
            <strong>{r.reviewer?.username}</strong> — ⭐ {r.rating}
            <p>{r.comment}</p>
          </div>
        ))
      )}

      {user ? (
        <form onSubmit={handleReviewSubmit} style={{ marginTop: 20 }}>
          <h4>Leave a Review</h4>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: 8, marginBottom: 8 }}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <br />
          <textarea
            placeholder="Your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", padding: 8, minHeight: 60, marginBottom: 8 }}
          />
          {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}
          <button type="submit" style={{ padding: "8px 16px" }}>Submit Review</button>
        </form>
      ) : (
        <p><em>Log in to leave a review.</em></p>
      )}
    </div>
  );
}

export default RecipeDetail;