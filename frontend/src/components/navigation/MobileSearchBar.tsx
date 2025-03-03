import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const MobileSearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search functionality here
    console.log('Searching for:', searchText);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center w-full"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 
            focus:ring-orange-500 focus:bg-white transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MobileSearchBar;