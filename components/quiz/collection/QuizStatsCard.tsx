interface QuizStatsCardProps {
  label: string;
  value: string | number;
  variant?: "default" | "success" | "primary";
}

export const QuizStatsCard = ({
  label,
  value,
  variant = "default",
}: QuizStatsCardProps) => {
  const variantStyles = {
    default: "bg-gray-50 border-gray-200",
    success: "bg-green-50 border-green-200",
    primary: "bg-blue-50 border-blue-200",
  };

  const textStyles = {
    default: "text-gray-700",
    success: "text-green-700",
    primary: "text-blue-700",
  };

  return (
    <div className={`px-3 py-2 rounded-lg border ${variantStyles[variant]}`}>
      <div className="text-xs text-gray-600 mb-0.5">{label}</div>
      <div className={`text-sm font-semibold ${textStyles[variant]}`}>
        {value}
      </div>
    </div>
  );
};
