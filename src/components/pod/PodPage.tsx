import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LinkCard } from './LinkCard';
import { ZapriteButton } from '../payments/ZapriteButton';
import { AgentChat } from '../agent/AgentChat';

interface Link {
  id: string;
  title: string;
  url: string;
}

export const PodPage = () => {
  const { id } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  
  // TODO: Fetch pod data from local DB
  useEffect(() => {
    // Temporary mock data
    setLinks([
      { id: '1', title: 'My Website', url: 'https://example.com' },
      { id: '2', title: 'Twitter', url: 'https://twitter.com/example' },
    ]);
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">My POD</h1>
        <p className="text-gray-600 mb-6">Welcome to my personal POD!</p>
        
        {isOwner && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-6">
            Edit POD
          </button>
        )}

        <div className="space-y-4">
          {links.map(link => (
            <LinkCard key={link.id} {...link} />
          ))}
        </div>

        <div className="mt-8">
          <ZapriteButton />
        </div>

        <div className="mt-8">
          <AgentChat />
        </div>
      </div>
    </div>
  );
};