import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconFolder } from "@tabler/icons-react";
import api from "../api/axios";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadCollections = () => {
    api.get("/collections").then((res) => setCollections(res.data));
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/collections", { name, description });
      setName("");
      setDescription("");
      loadCollections();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create collection");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">My collections</h1>

      <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-4 mb-6">
        <input
          placeholder="Collection name (e.g. Desserts)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full h-10 px-3 mb-2 rounded-lg border border-gray-200 text-sm"
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-10 px-3 mb-2 rounded-lg border border-gray-200 text-sm"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
          Create collection
        </button>
      </form>

      {collections.length === 0 ? (
        <p className="text-sm text-gray-500">No collections yet. Create one above.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {collections.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-lg p-3">
              <IconFolder size={18} className="text-blue-700 mb-1.5" />
              <p className="font-medium text-sm mb-0.5">{c.name}</p>
              <p className="text-xs text-gray-500 mb-2">{c.recipes?.length || 0} recipes</p>
              {c.recipes?.map((r) => (
                <Link key={r.id} to={`/recipes/${r.id}`} className="block text-xs text-blue-700 mb-0.5">
                  {r.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;