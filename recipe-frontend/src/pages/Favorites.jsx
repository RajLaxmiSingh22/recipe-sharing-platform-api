import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconStar, IconHeart, IconSoup, IconSalad, IconCake } from "@tabler/icons-react";
import api from "../api/axios";

const CATEGORY_ICONS = [IconSoup, IconSalad, IconCake];
const CATEGORY_BG = ["bg-orange-50", "bg-green-50", "bg-purple-50"];
const CATEGORY_TEXT = ["text-orange-600", "text-green-600", "text-purple-600"];

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/favorites")
      .then((res) => setFavorites(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">My favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-sm text-gray-500">
          No favorites yet. Tap the heart on any recipe to save it here.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {favorites.map((r, i) => {
            const Icon = CATEGORY_ICONS[i % 3];
            return (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors relative"
              >
                <IconHeart
                  size={16}
                  className="absolute top-2 right-2 text-red-500 z-10"
                  fill="currentColor"
                />
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

export default Favorites;