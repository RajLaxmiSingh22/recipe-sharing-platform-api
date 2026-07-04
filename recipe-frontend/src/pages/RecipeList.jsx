import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconSearch, IconStar, IconSoup, IconSalad, IconCake, IconLeaf, IconHeart } from "@tabler/icons-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORY_ICONS = [IconSoup, IconSalad, IconCake];
const CATEGORY_BG = ["bg-orange-50", "bg-green-50", "bg-purple-50"];
const CATEGORY_TEXT = ["text-orange-600", "text-green-600", "text-purple-600"];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "Vegetarian", label: "Vegetarian", category: "Vegetarian", icon: IconLeaf },
  { key: "Vegan", label: "Vegan", category: "Vegan" },
  { key: "Easy", label: "Easy", difficulty: "Easy" },
  { key: "under30", label: "Under 30 min" },
];

function RecipeList() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadFavoriteIds = async () => {
    if (!user) return;
    try {
      const res = await api.get("/favorites");
      setFavoritedIds(new Set(res.data.map((r) => r.id)));
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const fetchRecipes = async (query = "", filterKey = activeFilter) => {
    setLoading(true);
    try {
      const filter = FILTERS.find((f) => f.key === filterKey);
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (filter?.category) params.append("category", filter.category);
      if (filter?.difficulty) params.append("difficulty", filter.difficulty);

      const res = await api.get(`/recipes?${params.toString()}`);
      let results = res.data.recipes;

      if (filterKey === "under30") {
        results = results.filter((r) => r.prepTime + r.cookTime <= 30);
      }

      setRecipes(results);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    loadFavoriteIds();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(search, activeFilter);
  };

  const handleFilterClick = (key) => {
    setActiveFilter(key);
    fetchRecipes(search, key);
  };

  const toggleFavorite = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      await api.post(`/favorites/${recipeId}`);
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId);
        return next;
      });
    } catch (err) {
      console.error("Toggle favorite failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes, ingredients..."
          className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <IconSearch size={18} />
        </button>
      </form>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => handleFilterClick(f.key)}
              className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                isActive ? "bg-blue-50 text-blue-700" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {Icon && <Icon size={13} />}
              {f.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500 text-sm">No recipes found for this filter.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {recipes.map((r, i) => {
            const Icon = CATEGORY_ICONS[i % 3];
            const isFav = favoritedIds.has(r.id);
            return (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="block relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                {user && (
                  <button
                    onClick={(e) => toggleFavorite(e, r.id)}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  >
                    <IconHeart
                      size={15}
                      className={isFav ? "text-red-500" : "text-gray-400"}
                      fill={isFav ? "currentColor" : "none"}
                    />
                  </button>
                )}
                {r.coverImage ? (
                  <img src={r.coverImage} alt={r.title} className="h-24 w-full object-cover" />
                ) : (
                  <div className={`h-24 flex items-center justify-center ${CATEGORY_BG[i % 3]}`}>
                    <Icon size={28} className={CATEGORY_TEXT[i % 3]} />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-medium text-sm mb-1 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400 mb-1.5">
                    {r.prepTime + r.cookTime} min · {r.difficultyLevel}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <IconStar size={13} className="text-amber-400 fill-amber-400" /> {r.avgRating} · {r.reviewsCount} reviews
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipeList;