

interface RecipeHeaderProps {
  title: string;
  subtitle: string;
}

export function RecipeHeader({ title, subtitle }: RecipeHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}