import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrismaClient } from '@prisma/client';

interface SearchResult {
  id: string;
  email: string;
}

export const SearchPods = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const prisma = new PrismaClient();
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: searchTerm
          }
        },
        select: {
          id: true,
          email: true
        }
      });
      setResults(users);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search PODs</h1>

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
      </div>

      {results.length === 0 && searchTerm && !isSearching && (
        <p className="text-gray-500 text-center">No PODs found</p>
      )}
    </div>
  );
};