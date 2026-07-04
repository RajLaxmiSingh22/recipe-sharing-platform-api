import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/recipes?search=${query}`);
      setRecipes(res.data.recipes);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search);
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>
      <h1>Recipes</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: "70%" }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {recipes.map((r) => (
            <Link key={r.id} to={`/recipes/${r.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
                <h3>{r.title}</h3>
                <p>{r.description}</p>
                <small>⭐ {r.avgRating} ({r.reviewsCount} reviews) · {r.difficultyLevel} · {r.prepTime + r.cookTime} min</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;