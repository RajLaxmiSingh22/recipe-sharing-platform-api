import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconToolsKitchen2, IconStar } from "@tabler/icons-react";
import api from "../api/axios";

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/feed")
      .then((res) => setFeed(Array.isArray(res.data) ? res.data : res.data.feed || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">Activity feed</h1>
      {feed.length === 0 ? (
        <p className="text-sm text-gray-500">No activity yet. Follow some users to see their updates here.</p>
      ) : (
        feed.map((item) => (
          <div key={item.id} className="flex gap-2.5 py-2.5 border-b border-gray-200">
            {item.actionType === "recipe_created" ? (
              <IconToolsKitchen2 size={16} className="text-blue-700 mt-0.5" />
            ) : (
              <IconStar size={16} className="text-amber-400 fill-amber-400 mt-0.5" />
            )}
            <p className="text-sm">
              <span className="font-medium">{item.User?.username}</span>{" "}
              {item.actionType === "recipe_created" ? "posted a new recipe: " : "reviewed: "}
              {item.Recipe && (
                <Link to={`/recipes/${item.Recipe.id}`} className="text-blue-700">
                  {item.Recipe.title}
                </Link>
              )}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;