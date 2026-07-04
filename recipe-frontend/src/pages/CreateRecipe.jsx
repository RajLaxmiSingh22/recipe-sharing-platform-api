import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconUpload, IconPlus } from "@tabler/icons-react";
import api from "../api/axios";

function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [coverImage, setCoverImage] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState([{ stepNumber: 1, description: "" }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const updateIngredient = (i, field, value) => {
    const copy = [...ingredients];
    copy[i][field] = value;
    setIngredients(copy);
  };

  const addInstruction = () =>
    setInstructions([...instructions, { stepNumber: instructions.length + 1, description: "" }]);
  const updateInstruction = (i, value) => {
    const copy = [...instructions];
    copy[i].description = value;
    setInstructions(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("prepTime", prepTime);
      formData.append("cookTime", cookTime);
      formData.append("servings", servings);
      formData.append("difficultyLevel", difficultyLevel);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("instructions", JSON.stringify(instructions));
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await api.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/recipes/${res.data.recipe.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create recipe");
    }
  };

  const inputClass = "w-full h-10 px-3 mb-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-medium mb-4">Create a recipe</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Recipe title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 mb-3 rounded-lg border border-gray-200 text-sm min-h-[60px]"
        />

        <div className="flex gap-2 mb-3">
          <input type="number" placeholder="Prep min" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required className={`${inputClass} mb-0`} />
          <input type="number" placeholder="Cook min" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required className={`${inputClass} mb-0`} />
          <input type="number" placeholder="Servings" value={servings} onChange={(e) => setServings(e.target.value)} required className={`${inputClass} mb-0`} />
        </div>

        <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} className={inputClass}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label className="text-sm text-gray-600 block mb-1">Cover image</label>
        <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg py-6 mb-4 cursor-pointer hover:border-gray-400">
          <IconUpload size={20} className="text-gray-400 mb-1" />
          <span className="text-xs text-gray-400">{coverImage ? coverImage.name : "Upload cover photo"}</span>
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="hidden" />
        </label>

        <p className="font-medium text-sm mb-2">Ingredients</p>
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="Name" value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)} className={`${inputClass} mb-0`} />
            <input placeholder="Qty" value={ing.quantity} onChange={(e) => updateIngredient(i, "quantity", e.target.value)} className={`${inputClass} mb-0`} />
            <input placeholder="Unit" value={ing.unit} onChange={(e) => updateIngredient(i, "unit", e.target.value)} className={`${inputClass} mb-0`} />
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-sm text-blue-700 mb-4">
          <IconPlus size={14} /> Add ingredient
        </button>

        <p className="font-medium text-sm mb-2">Instructions</p>
        {instructions.map((step, i) => (
          <textarea
            key={i}
            placeholder={`Step ${i + 1}`}
            value={step.description}
            onChange={(e) => updateInstruction(i, e.target.value)}
            className="w-full p-3 mb-2 rounded-lg border border-gray-200 text-sm min-h-[40px]"
          />
        ))}
        <button type="button" onClick={addInstruction} className="flex items-center gap-1 text-sm text-blue-700 mb-6">
          <IconPlus size={14} /> Add step
        </button>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium">
          Publish recipe
        </button>
      </form>
    </div>
  );
}

export default CreateRecipe;