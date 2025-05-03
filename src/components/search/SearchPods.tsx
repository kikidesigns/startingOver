import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Loading } from '../common/Loading';
import { Alert } from '../common/Alert';

interface SearchResult {
  id: string;
  email: string;
}

export const SearchPods = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const users = await invoke<SearchResult[]>('search_users', { 
        query: searchTerm 
      });
      setResults(users);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search PODs');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search PODs</h1>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by email..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {isSearching ? (
        <Loading message="Searching PODs..." />
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => navigate(`/pod/${result.id}`)}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-medium">{result.email}</h3>
            </div>
          ))}

          {results.length === 0 && searchTerm && !isSearching && (
            <p className="text-gray-500 text-center">No PODs found</p>
          )}
        </div>
      )}
    </div>
  );
};