import ModelBadge from "./ModelBadge";

export default function ModelRatings({ prompt }) {
  const models = [
    { name: "ChatGPT", key: "chatgpt" },
    { name: "Gemini", key: "gemini" },
    { name: "Midjourney", key: "midjourney" },
    { name: "Leonardo", key: "leonardo" },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-gray-900">Best AI Model</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {models.map((model) => (
          <ModelBadge
            key={model.key}
            model={model.name}
            rating={prompt.modelRatings[model.key]}
            size="sm"
          />
        ))}
      </div>
      <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
        <p>
          <span className="font-semibold text-green-700">🟢 Works best</span> - Recommended
        </p>
        <p>
          <span className="font-semibold text-blue-700">🔵 Good</span> - Good results
        </p>
        <p>
          <span className="font-semibold text-yellow-700">🟡 Average</span> - Acceptable
        </p>
        <p>
          <span className="font-semibold text-red-700">🔴 Not recommended</span> - May not work well
        </p>
      </div>
    </div>
  );
}
