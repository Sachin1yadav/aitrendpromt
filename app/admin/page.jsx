"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPrompt, updatePrompt, deletePrompt, getAllPrompts } from "@/lib/api";
import { Save, Trash2, Plus, Edit, X } from "lucide-react";

// Component for managing multiple image URLs
function ImageUrlList({ images, onChange, label, placeholder }) {
  const addImage = () => {
    onChange([...images, ""]);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>
      <div className="space-y-2">
        {images.length === 0 ? (
          <div className="text-sm text-gray-500 italic py-2">
            No images added. Click "Add Image" to add one.
          </div>
        ) : (
          images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder={placeholder || `Image URL ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    bestModel: "ChatGPT",
    modelRatings: {
      chatgpt: "average",
      gemini: "average",
      midjourney: "average",
      leonardo: "average"
    },
    prompt: "",
    beforeImage: "",
    afterImage: "",
    exampleImages: [],
    imgshoulduse: [],
    tags: [],
    category: "new",
    filters: {
      primaryCategory: null,
      style: [],
      pose: [],
      background: [],
      god: null
    }
  });

  useEffect(() => {
    // Check if admin secret is stored
    const stored = localStorage.getItem("adminSecret");
    if (stored) {
      setAdminSecret(stored);
      setIsAuthenticated(true);
      loadPrompts(stored);
    }
  }, []);

  const handleLogin = () => {
    if (adminSecret) {
      localStorage.setItem("adminSecret", adminSecret);
      setIsAuthenticated(true);
      loadPrompts(adminSecret);
    }
  };

  const loadPrompts = async (secret) => {
    setLoading(true);
    try {
      const data = await getAllPrompts();
      setPrompts(data);
    } catch (error) {
      alert("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("modelRatings.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        modelRatings: { ...prev.modelRatings, [key]: value }
      }));
    } else if (name.startsWith("filters.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        filters: { ...prev.filters, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  // Handle image arrays - filter out empty strings before saving
  const prepareFormData = (data) => {
    return {
      ...data,
      exampleImages: data.exampleImages.filter(img => img.trim() !== ""),
      imgshoulduse: data.imgshoulduse.filter(img => img.trim() !== "")
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare form data - remove empty image URLs
      const preparedData = prepareFormData(formData);
      
      let result;
      if (editingSlug) {
        result = await updatePrompt(editingSlug, preparedData, adminSecret);
      } else {
        result = await createPrompt(preparedData, adminSecret);
      }

      if (result.success) {
        alert(editingSlug ? "Prompt updated successfully!" : "Prompt created successfully!");
        resetForm();
        loadPrompts(adminSecret);
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prompt) => {
    setFormData(prompt);
    setEditingSlug(prompt.slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    setLoading(true);
    try {
      const result = await deletePrompt(slug, adminSecret);
      if (result.success) {
        alert("Prompt deleted successfully!");
        loadPrompts(adminSecret);
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
      bestModel: "ChatGPT",
      modelRatings: {
        chatgpt: "average",
        gemini: "average",
        midjourney: "average",
        leonardo: "average"
      },
      prompt: "",
      beforeImage: "",
      afterImage: "",
      exampleImages: [],
      imgshoulduse: [],
      tags: [],
      category: "new",
      filters: {
        primaryCategory: null,
        style: [],
        pose: [],
        background: [],
        god: null
      }
    });
    setEditingSlug(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin secret"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                localStorage.removeItem("adminSecret");
                setIsAuthenticated(false);
                setAdminSecret("");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Site
            </a>
          </div>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingSlug ? "Edit Prompt" : "Create New Prompt"}
            </h2>
            {editingSlug && (
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (auto-generated if empty)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ghibli-saree"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="trending">🔥 Trending</option>
                  <option value="new">🆕 New</option>
                  <option value="archive">📦 Archive</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose the category for this prompt
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Text *
              </label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Before Image URL *
                </label>
                <input
                  type="url"
                  name="beforeImage"
                  value={formData.beforeImage}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  After Image URL *
                </label>
                <input
                  type="url"
                  name="afterImage"
                  value={formData.afterImage}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <ImageUrlList
                images={formData.exampleImages}
                onChange={(images) => setFormData(prev => ({ ...prev, exampleImages: images }))}
                label="Example Output Images"
                placeholder="https://example.com/example-image.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add example output images that show the result of using this prompt
              </p>
            </div>

            <div>
              <ImageUrlList
                images={formData.imgshoulduse}
                onChange={(images) => setFormData(prev => ({ ...prev, imgshoulduse: images }))}
                label="Images You Should Use"
                placeholder="https://example.com/input-image.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add input images that users should use when generating with this prompt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayInput("tags", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="anime, ghibli, portrait"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best Model *
                </label>
                <select
                  name="bestModel"
                  value={formData.bestModel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ChatGPT">ChatGPT</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Midjourney">Midjourney</option>
                  <option value="Leonardo">Leonardo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Category
                </label>
                <select
                  name="filters.primaryCategory"
                  value={formData.filters.primaryCategory || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                  <option value="baby">Baby</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                  <option value="with-god">With God</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="pet">Pet</option>
                  <option value="cartoon-anime">Cartoon / Anime</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ChatGPT
                </label>
                <select
                  name="modelRatings.chatgpt"
                  value={formData.modelRatings.chatgpt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="best">Best</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="not_recommended">Not Recommended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gemini
                </label>
                <select
                  name="modelRatings.gemini"
                  value={formData.modelRatings.gemini}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="best">Best</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="not_recommended">Not Recommended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Midjourney
                </label>
                <select
                  name="modelRatings.midjourney"
                  value={formData.modelRatings.midjourney}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="best">Best</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="not_recommended">Not Recommended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leonardo
                </label>
                <select
                  name="modelRatings.leonardo"
                  value={formData.modelRatings.leonardo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="best">Best</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="not_recommended">Not Recommended</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingSlug ? "Update Prompt" : "Create Prompt"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prompts List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Prompts ({prompts.length})</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt._id || prompt.slug}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{prompt.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {prompt.category}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {prompt.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(prompt)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

