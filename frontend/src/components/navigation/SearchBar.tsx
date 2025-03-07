import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import useOutsideClick from '@/lib/hooks/useOutsideClick';

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const handleClickOutside = () => {
    if (searchText.trim() === '') {
      setIsExpanded(false);
    }
  };
  
  const searchRef = useOutsideClick(handleClickOutside);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search functionality here
    console.log('Searching for:', searchText);
  };

  return (
    <div className="relative" ref={searchRef}>
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-72' : 'w-10'}`}
      >
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className={`w-full px-4 py-2 pl-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 
            focus:ring-orange-500 focus:bg-white transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
        />
        <button
          type={isExpanded ? "submit" : "button"}
          onClick={() => !isExpanded && setIsExpanded(true)}
          className={`absolute ${isExpanded ? 'left-3' : 'right-0'} p-2 text-gray-600 hover:text-orange-500 transition-colors`}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;