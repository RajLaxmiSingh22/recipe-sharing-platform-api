import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/feed")
      .then((res) => setFeed(Array.isArray(res.data) ? res.data : res.data.feed || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", padding: "0 20px" }}>
      <h1>Activity Feed</h1>
      {feed.length === 0 ? (
        <p>No activity yet. Follow some users to see their updates here.</p>
      ) : (
        feed.map((item) => (
          <div key={item.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <strong>{item.User?.username}</strong>{" "}
            {item.actionType === "recipe_created" ? "posted a new recipe: " : "reviewed: "}
            {item.Recipe && <Link to={`/recipes/${item.Recipe.id}`}>{item.Recipe.title}</Link>}
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;