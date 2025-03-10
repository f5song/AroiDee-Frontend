interface RecipeHeaderProps {
  title: string;
  subtitle: string;
}

export function RecipeHeader({ title, subtitle }: RecipeHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white"
          >
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
