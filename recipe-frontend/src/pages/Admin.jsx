import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleBan = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await api.put(`/users/${userId}/ban`);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to ban user");
    }
  };

  if (user?.role !== "admin") {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Admin access only. Log in as an admin user.</p>;
  }

  return (
    <div style={{ maxWidth: 500, margin: "30px auto", padding: "0 20px" }}>
      <h1>Admin Dashboard</h1>
      <h3>Ban a User</h3>
      <form onSubmit={handleBan}>
        <input
  placeholder="User ID or username to ban"
  value={userId}
  onChange={(e) => setUserId(e.target.value)}
  required
  style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
/>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>Ban User</button>
      </form>
    </div>
  );
}

export default Admin;