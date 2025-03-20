
import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
}

const SearchBar = ({
  searchInput,
  setSearchInput,
  onSearch,
  isSearching,
  onClear,
  onKeyDown,
  showResults,
  setShowResults
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle clicks outside of search to hide results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowResults]);

  const handleInputFocus = () => {
    if (searchInput.trim() !== '') {
      setShowResults(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() !== '') {
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-all">
        <div className="flex items-center justify-center bg-primary text-primary-foreground p-3">
          <MapPin className="h-5 w-5" />
        </div>
        <Input
          ref={inputRef}
          value={searchInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={onKeyDown}
          placeholder="Where are you going?"
          className="flex-1 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
        />
        {searchInput && (
          <button
            onClick={() => {
              onClear();
              setShowResults(false);
            }}
            className="flex items-center justify-center p-3 hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => {
            onSearch();
            if (searchInput.trim() !== '') {
              setShowResults(true);
            }
          }}
          disabled={isSearching || !searchInput.trim()}
          className={cn(
            "flex items-center justify-center p-3 transition-colors",
            isSearching || !searchInput.trim() 
              ? "bg-muted text-muted-foreground" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
