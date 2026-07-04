import { useState, useEffect, useMemo } from "react";
import { IconTrash, IconSearch } from "@tabler/icons-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const [userFilter, setUserFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);

  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipePage, setRecipePage] = useState(1);

  const loadData = async () => {
    try {
      const [usersRes, recipesRes] = await Promise.all([
        api.get("/users"),
        api.get("/recipes?limit=100"),
      ]);
      setUsers(usersRes.data);
      setRecipes(recipesRes.data.recipes);
    } catch (err) {
      setError("Failed to load admin data");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadData();
  }, [user]);

  const handleToggleBan = async (u) => {
    try {
      await api.put(`/users/${u.id}/${u.isBanned ? "unban" : "ban"}`);
      loadData();
    } catch (err) {
      console.error("Ban toggle failed:", err);
    }
  };

  const handleRemoveRecipe = async (id) => {
    if (!window.confirm("Remove this recipe?")) return;
    await api.delete(`/recipes/${id}`);
    loadData();
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus =
        userFilter === "all" ? true : userFilter === "banned" ? u.isBanned : !u.isBanned;
      const matchesSearch =
        !userSearch ||
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [users, userFilter, userSearch]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const author = r.author?.username || "";
      return (
        !recipeSearch ||
        r.title?.toLowerCase().includes(recipeSearch.toLowerCase()) ||
        author.toLowerCase().includes(recipeSearch.toLowerCase())
      );
    });
  }, [recipes, recipeSearch]);

  const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);
  const pagedRecipes = filteredRecipes.slice((recipePage - 1) * PAGE_SIZE, recipePage * PAGE_SIZE);
  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const recipeTotalPages = Math.max(1, Math.ceil(filteredRecipes.length / PAGE_SIZE));

  if (user?.role !== "admin") {
    return <p className="text-center text-gray-500 mt-16">Admin access only. Log in as an admin user.</p>;
  }

  const bannedCount = users.filter((u) => u.isBanned).length;

  const statCard = (label, value, onClick, isActive) => (
    <button
      onClick={onClick}
      className={`text-left rounded-lg p-4 ${isActive ? "bg-blue-50 ring-2 ring-blue-200" : "bg-gray-50"}`}
    >
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-5">Admin dashboard</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {statCard("Total users", users.length, () => { setUserFilter("all"); setUserPage(1); }, userFilter === "all")}
        {statCard("Recipes", recipes.length, () => document.getElementById("recipe-mod")?.scrollIntoView({ behavior: "smooth" }), false)}
        {statCard("Banned", bannedCount, () => { setUserFilter("banned"); setUserPage(1); }, userFilter === "banned")}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-sm">User management</p>
        <div className="flex gap-1">
          {["all", "active", "banned"].map((f) => (
            <button
              key={f}
              onClick={() => { setUserFilter(f); setUserPage(1); }}
              className={`text-xs px-2.5 py-1 rounded-lg ${userFilter === f ? "bg-blue-50 text-blue-700" : "text-gray-500"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-3">
        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={userSearch}
          onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
          placeholder="Search by username or email..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm"
        />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
        {pagedUsers.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">No users match this search.</p>
        ) : (
          pagedUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                  {u.username?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm">{u.username}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg ${
                    u.isBanned ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                  }`}
                >
                  {u.isBanned ? "Banned" : "Active"}
                </span>
                <button
                  onClick={() => handleToggleBan(u)}
                  className={`text-xs px-3 py-1 rounded-lg border border-gray-200 ${u.isBanned ? "" : "text-red-600"}`}
                >
                  {u.isBanned ? "Unban" : "Ban"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {userTotalPages > 1 && (
        <div className="flex items-center justify-between mb-8 text-sm text-gray-500">
          <span>Page {userPage} of {userTotalPages}</span>
          <div className="flex gap-2">
            <button disabled={userPage === 1} onClick={() => setUserPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">
              Previous
            </button>
            <button disabled={userPage === userTotalPages} onClick={() => setUserPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}

      <p id="recipe-mod" className="font-medium text-sm mb-2">Recipe moderation</p>
      <div className="relative mb-3">
        <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={recipeSearch}
          onChange={(e) => { setRecipeSearch(e.target.value); setRecipePage(1); }}
          placeholder="Search by recipe title or author..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm"
        />
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
        {pagedRecipes.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">No recipes match this search.</p>
        ) : (
          pagedRecipes.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 last:border-0">
              <div>
                <p className="text-sm">{r.title}</p>
                <p className="text-xs text-gray-400">by {r.author?.username || `user #${r.userId}`}</p>
              </div>
              <button
                onClick={() => handleRemoveRecipe(r.id)}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg border border-gray-200 text-red-600"
              >
                <IconTrash size={13} /> Remove
              </button>
            </div>
          ))
        )}
      </div>

      {recipeTotalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {recipePage} of {recipeTotalPages}</span>
          <div className="flex gap-2">
            <button disabled={recipePage === 1} onClick={() => setRecipePage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">
              Previous
            </button>
            <button disabled={recipePage === recipeTotalPages} onClick={() => setRecipePage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;