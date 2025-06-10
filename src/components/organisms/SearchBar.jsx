import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import searchService from '@/services/api/searchService';

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const results = await searchService.getAutocomplete(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && query.trim()) {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    setQuery(suggestion.title);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-surface-900">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-primary/20' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="Search" 
            size={18} 
            className={`transition-colors ${
              isFocused ? 'text-primary' : 'text-surface-400'
            }`} 
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search tasks, projects, or comments..."
          className="w-full pl-10 pr-10 py-2 bg-white border border-surface-200 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
          aria-label="Search tasks"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Clear search"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            {isLoading ? (
              <div className="p-4 text-center text-surface-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Searching...</span>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="px-3 py-2 text-xs text-surface-500 font-medium border-b border-surface-100">
                  Suggestions ({suggestions.length})
                </div>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      selectedIndex === index 
                        ? 'bg-primary/5 border-l-2 border-primary' 
                        : 'hover:bg-surface-50'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-1.5 rounded ${
                        suggestion.type === 'task' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <ApperIcon 
                          name={suggestion.type === 'task' ? 'CheckSquare' : 'Folder'} 
                          size={14}
                          className={suggestion.type === 'task' ? 'text-blue-600' : 'text-green-600'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-surface-900 truncate">
                          {highlightMatch(suggestion.title, query)}
                        </div>
                        {suggestion.description && (
                          <div className="text-xs text-surface-500 truncate mt-1">
                            {highlightMatch(suggestion.description, query)}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                            suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {suggestion.priority}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            suggestion.status === 'done' ? 'bg-green-100 text-green-700' :
                            suggestion.status === 'inProgress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {suggestion.status === 'inProgress' ? 'In Progress' : 
                             suggestion.status === 'done' ? 'Done' : 'To Do'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {suggestions.length > 0 && query.trim() && (
                  <div className="border-t border-surface-100">
                    <button
                      onClick={handleSearch}
                      className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-primary/5 transition-colors flex items-center space-x-2"
                    >
                      <ApperIcon name="Search" size={14} />
                      <span>See all results for "{query}"</span>
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;