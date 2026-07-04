import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconToolsKitchen2 } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, email, password, "");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-50 rounded-xl p-6">
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <IconToolsKitchen2 size={20} className="text-blue-700" />
          </div>
          <p className="font-medium text-base">Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="text-sm text-gray-600 block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            required
            className="w-full h-10 px-3 mb-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <label className="text-sm text-gray-600 block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="w-full h-10 px-3 mb-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <label className="text-sm text-gray-600 block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            className="w-full h-10 px-3 mb-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium mb-3"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;