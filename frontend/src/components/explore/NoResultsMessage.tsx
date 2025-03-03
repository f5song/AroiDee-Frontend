import { Button } from "@/components/ui/button";

interface NoResultsMessageProps {
  onReset: () => void;
}

/**
 * Message shown when no recipes match the search criteria
 */
export function NoResultsMessage({ onReset }: NoResultsMessageProps) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">😕</div>
      <h3 className="text-xl font-medium mb-2">
        No recipes match your search
      </h3>
      <p className="text-gray-500 mb-4">
        Try changing your search terms or category to see other results
      </p>
      <Button onClick={onReset}>
        View all recipes
      </Button>
    </div>
  );
}

export default NoResultsMessage;