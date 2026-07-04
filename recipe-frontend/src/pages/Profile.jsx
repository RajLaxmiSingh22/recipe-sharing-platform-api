import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconEdit, IconTrash, IconStar, IconSoup } from "@tabler/icons-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRecipes = () => api.get("/users/me/recipes").then((res) => setRecipes(res.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/users/me/recipes"),
      api.get("/follows/followers"),
      api.get("/follows/following"),
    ])
      .then(([recipesRes, followersRes, followingRes]) => {
        setRecipes(recipesRes.data);
        setFollowerCount(followersRes.data.length);
        setFollowingCount(followingRes.data.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe permanently?")) return;
    await api.delete(`/recipes/${id}`);
    loadRecipes();
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-base">{user?.username}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-lg font-medium">{recipes.length}</p>
          <p className="text-xs text-gray-500">Recipes</p>
        </div>
        <div>
          <p className="text-lg font-medium">{followerCount}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-lg font-medium">{followingCount}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
      </div>

      <p className="font-medium text-sm mb-3">My recipes</p>
      {recipes.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't posted any recipes yet.</p>
      ) : (
        <div className="space-y-2">
          {recipes.map((r) => (
            <div key={r.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
              <Link to={`/recipes/${r.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                {r.coverImage ? (
                  <img src={r.coverImage} alt={r.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <IconSoup size={18} className="text-orange-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <IconStar size={11} className="text-amber-400 fill-amber-400" /> {r.avgRating} · {r.reviewsCount} reviews
                  </p>
                </div>
              </Link>
              <div className="flex gap-2 flex-shrink-0 ml-2">
                <button onClick={() => navigate(`/edit-recipe/${r.id}`)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200">
                  <IconEdit size={14} />
                </button>
                <button onClick={() => handleDelete(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-red-600">
                  <IconTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;