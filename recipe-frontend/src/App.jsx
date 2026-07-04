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
function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav
      style={{
        padding: 16,
        borderBottom: "1px solid #ccc",
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <Link to="/">Recipes</Link>
      {user && <Link to="/collections">My Collections</Link>}
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}

      {user && <Link to="/follow">Follow</Link>}
      {user && <Link to="/feed">Feed</Link>}
      <span style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
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
          <Route path="/collections" element={<Collections />} />
          <Route path="/admin" element={<Admin />} />

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
