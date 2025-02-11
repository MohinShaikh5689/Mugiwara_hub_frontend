import React, { createContext, useState, useContext } from 'react';

interface SearchContextType {

  searchQuery: string;
  setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 
  const [searchQuery, setQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};