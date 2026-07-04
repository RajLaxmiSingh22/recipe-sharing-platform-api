import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/recipes/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/recipes/${id}`, {
        title: form.title,
        description: form.description,
        prepTime: form.prepTime,
        cookTime: form.cookTime,
        servings: form.servings,
        difficultyLevel: form.difficultyLevel,
      });
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update recipe");
    }
  };

  const inputClass = "w-full h-10 px-3 mb-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  if (!form) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">Edit recipe</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg border border-gray-200 text-sm min-h-[60px]"
        />
        <div className="flex gap-2 mb-3">
          <input name="prepTime" type="number" value={form.prepTime} onChange={handleChange} className={`${inputClass} mb-0`} />
          <input name="cookTime" type="number" value={form.cookTime} onChange={handleChange} className={`${inputClass} mb-0`} />
          <input name="servings" type="number" value={form.servings} onChange={handleChange} className={`${inputClass} mb-0`} />
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium">
          Save changes
        </button>
      </form>
    </div>
  );
}

export default EditRecipe;