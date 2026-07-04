import { useState, useEffect } from "react";
import api from "../api/axios";

function Follow() {
  const [userId, setUserId] = useState("");
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState("");

  const loadFollowing = () => {
    api.get("/follows/following").then((res) => setFollowing(res.data));
  };

  useEffect(() => {
    loadFollowing();
  }, []);

  const handleFollow = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/follows/${userId}`);
      setUserId("");
      loadFollowing();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to follow user");
    }
  };

  const handleUnfollow = async (id) => {
    await api.delete(`/follows/${id}`);
    loadFollowing();
  };

  return (
    <div style={{ maxWidth: 500, margin: "30px auto", padding: "0 20px" }}>
      <h1>Follow Users</h1>
      <form onSubmit={handleFollow} style={{ marginBottom: 20 }}>
        <input
          placeholder="User ID to follow"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{ padding: 8, width: "70%" }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Follow</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Following</h3>
      {following.length === 0 ? (
        <p>You're not following anyone yet.</p>
      ) : (
        following.map((u) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span>{u.username}</span>
            <button onClick={() => handleUnfollow(u.id)}>Unfollow</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Follow;