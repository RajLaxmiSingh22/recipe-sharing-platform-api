import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div style={{ maxWidth: 700, margin: "30px auto", padding: "0 20px" }}>
      <h1>My Collections</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: 30 }}>
        <input
          placeholder="Collection name (e.g. Desserts)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>Create Collection</button>
      </form>

      {collections.length === 0 ? (
        <p>No collections yet. Create one above.</p>
      ) : (
        collections.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <p><strong>{c.recipes?.length || 0}</strong> recipe(s) in this collection</p>
            {c.recipes?.map((r) => (
              <Link key={r.id} to={`/recipes/${r.id}`} style={{ display: "block" }}>{r.title}</Link>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Collections;