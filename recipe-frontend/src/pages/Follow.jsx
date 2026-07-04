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
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">Follow users</h1>

      <form onSubmit={handleFollow} className="flex gap-2 mb-6">
        <input
          placeholder="User ID or username to follow"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm"
        />
        <button className="bg-gray-900 text-white px-4 rounded-lg text-sm">Follow</button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <p className="font-medium text-sm mb-2">Following</p>
      {following.length === 0 ? (
        <p className="text-sm text-gray-500">You're not following anyone yet.</p>
      ) : (
        following.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-2.5 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                {u.username?.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-sm">{u.username}</p>
            </div>
            <button
              onClick={() => handleUnfollow(u.id)}
              className="text-xs px-3 py-1 rounded-lg border border-gray-200"
            >
              Unfollow
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Follow;