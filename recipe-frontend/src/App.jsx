import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import Collections from "./pages/Collections";
import Admin from "./pages/Admin";
import Follow from "./pages/Follow";
import Feed from "./pages/Feed";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center gap-4 px-6 py-4 border-b border-gray-200">
      <Link to="/" className="font-medium">
        Recipes
      </Link>
      {user && (
        <Link to="/collections" className="text-sm text-gray-600">
          My collections
        </Link>
      )}
      {user && (
        <Link to="/favorites" className="text-sm text-gray-600">
          Favorites
        </Link>
      )}
      {user?.role === "admin" && (
        <Link to="/admin" className="text-sm text-gray-600">
          Admin
        </Link>
      )}
      {user && (
        <Link to="/follow" className="text-sm text-gray-600">
          Follow
        </Link>
      )}
      {user && (
        <Link to="/feed" className="text-sm text-gray-600">
          Feed
        </Link>
      )}
      {user && (
        <Link to="/create-recipe" className="text-sm text-blue-700">
          + New recipe
        </Link>
      )}

      <span className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <Link to="/profile" className="text-sm text-gray-500">
              Hi, {user.username}
            </Link>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-lg border border-gray-200">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">
              Login
            </Link>
            <Link to="/register" className="text-sm">
              Register
            </Link>
          </>
        )}
      </span>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/follow" element={<Follow />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;