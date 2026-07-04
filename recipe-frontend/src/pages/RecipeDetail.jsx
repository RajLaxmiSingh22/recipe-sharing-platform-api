import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconHeart, IconEdit, IconTrash, IconStar, IconSoup } from "@tabler/icons-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
    Promise.all([api.get(`/recipes/${id}`), api.get(`/reviews/${id}`)])
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
      loadRecipe();
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

  const handleDelete = async () => {
    if (!window.confirm("Delete this recipe permanently?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!recipe) return <p className="text-center text-gray-500 mt-10">Recipe not found.</p>;

  const isOwner = user?.id === recipe.userId;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {recipe.coverImage ? (
        <img
          src={recipe.coverImage}
          alt={recipe.title}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
          <IconSoup size={36} className="text-orange-600" />
        </div>
      )}

      <h1 className="text-xl font-medium mb-1">{recipe.title}</h1>
      <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
      <p className="text-sm text-gray-400 mb-3">
        Prep {recipe.prepTime} min · Cook {recipe.cookTime} min · Serves {recipe.servings} · {recipe.difficultyLevel}
      </p>
      <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
        <IconStar size={14} className="text-amber-400 fill-amber-400" /> {recipe.avgRating} ({recipe.reviewsCount} reviews)
      </p>

      <div className="flex gap-2 mb-6">
        {user && (
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border ${
              isFavorited ? "border-red-300 text-red-600" : "border-gray-200"
            }`}
          >
            <IconHeart size={15} fill={isFavorited ? "currentColor" : "none"} />
            {isFavorited ? "Favorited" : "Favorite"}
          </button>
        )}
        {isOwner && (
          <>
            <button
              onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200"
            >
              <IconEdit size={15} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-red-600"
            >
              <IconTrash size={15} /> Delete
            </button>
          </>
        )}
      </div>

      <p className="font-medium text-sm mb-2">Ingredients</p>
      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        {recipe.ingredients?.map((ing) => (
          <li key={ing.id}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      <p className="font-medium text-sm mb-2">Instructions</p>
      <ol className="text-sm text-gray-600 mb-6 space-y-1 list-decimal list-inside">
        {recipe.instructions?.map((step) => (
          <li key={step.id}>{step.description}</li>
        ))}
      </ol>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="font-medium text-sm mb-3">Reviews · {recipe.avgRating} average</p>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="flex gap-2.5 items-start mb-3">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {r.reviewer?.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{r.reviewer?.username}</span>{" "}
                  <IconStar size={12} className="inline text-amber-400 fill-amber-400 -mt-0.5" /> {r.rating}
                </p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleReviewSubmit}>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full h-9 px-2 rounded-lg border border-gray-200 text-sm mb-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts on this recipe"
            className="w-full p-2 rounded-lg border border-gray-200 text-sm min-h-[60px] mb-2"
          />
          {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">Submit review</button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 italic">Log in to leave a review.</p>
      )}
    </div>
  );
}

export default RecipeDetail;