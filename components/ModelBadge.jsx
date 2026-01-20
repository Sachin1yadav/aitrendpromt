import { CheckCircle2, Circle, AlertCircle, XCircle } from "lucide-react";

export default function ModelBadge({ model, rating, size = "md" }) {
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const ratingStyles = {
    best: "bg-green-50 text-green-700 border-green-200",
    good: "bg-blue-50 text-blue-700 border-blue-200",
    average: "bg-yellow-50 text-yellow-700 border-yellow-200",
    not_recommended: "bg-red-50 text-red-700 border-red-200",
  };

  const ratingIcons = {
    best: <CheckCircle2 className={iconSizes[size]} />,
    good: <Circle className={iconSizes[size]} />,
    average: <AlertCircle className={iconSizes[size]} />,
    not_recommended: <XCircle className={iconSizes[size]} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold shadow-sm ${sizeClasses[size]} ${ratingStyles[rating]}`}
    >
      {ratingIcons[rating]}
      <span>{model}</span>
    </span>
  );
}
