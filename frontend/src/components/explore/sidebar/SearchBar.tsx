import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SearchBarProps } from "@/components/explore/sidebar/types";

export function SearchBar({ searchQuery, setSearchQuery, handleSearch }: SearchBarProps) {
  return (
    <div className="px-4 py-3 border-b">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm"
        />
        <Button type="submit" size="icon" className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white">
          <Search className="h-4 w-4 " />
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;