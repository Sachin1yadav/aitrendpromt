import ModelBadge from "./ModelBadge";

export default function ModelRatings({ prompt }) {
  const models = [
    { name: "ChatGPT", key: "chatgpt" },
    { name: "Gemini", key: "gemini" },
    { name: "Midjourney", key: "midjourney" },
    { name: "Leonardo", key: "leonardo" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-bold text-gray-900">Best AI Model for this Trend</h3>
      <div className="flex flex-wrap gap-3 mb-6">
        {models.map((model) => (
          <ModelBadge
            key={model.key}
            model={model.name}
            rating={prompt.modelRatings[model.key]}
            size="md"
          />
        ))}
      </div>
      <div className="pt-5 border-t border-gray-100 space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-green-700">🟢 Works best</span> - Recommended for this trend
        </p>
        <p>
          <span className="font-semibold text-blue-700">🔵 Good</span> - Produces good results
        </p>
        <p>
          <span className="font-semibold text-yellow-700">🟡 Average</span> - Acceptable results
        </p>
        <p>
          <span className="font-semibold text-red-700">🔴 Not recommended</span> - May not produce desired results
        </p>
      </div>
    </div>
  );
}
