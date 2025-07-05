"use client"

import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";

interface ExpandableSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  onSearch,
  placeholder = "Search products...",
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = (): void => {
    setIsExpanded(false);
    setSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && isExpanded) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon Button */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-center transition-all duration-300 ease-in-out"
        aria-label="Toggle search"
      >
        <CiSearch className="text-2xl text-white hover:text-gray-300 transition-colors" />
      </button>

      {/* Search Bar Overlay - covers the navbar */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-in fade-in duration-300"
            onClick={handleClose}
          />
          
          {/* Search Bar Container - overlays the navbar */}
          <div className="fixed left-0 right-0 top-0 bg-[#202124] shadow-lg z-50 animate-in slide-in-from-top-2 duration-500 ease-out">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center animate-in fade-in slide-in-from-top-1 duration-700 delay-200">
                  {/* Search Icon */}
                  <div className="pr-3 flex items-center">
                    <CiSearch className="text-xl text-white/70" />
                  </div>

                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="flex-1 py-3 pr-12 text-white placeholder-gray-400 bg-transparent outline-none border-b border-white/30 focus:border-white transition-colors text-lg"
                  />

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-0 p-2 hover:bg-white/10 rounded transition-colors duration-200"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5 text-white/70 hover:text-white transition-colors duration-200" />
                  </button>
                </div>

                {/* Search Results Dropdown (Optional) */}
                {searchQuery && (
                  <div className="mt-4 bg-[#2a2a2a] rounded-lg border border-white/10 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="p-4 text-sm text-gray-300">
                      Search for "{searchQuery}"...
                    </div>
                    {/* Add your search results here */}
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpandableSearch;