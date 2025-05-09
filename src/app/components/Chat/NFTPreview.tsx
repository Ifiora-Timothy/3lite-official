import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface NFTPreviewProps {
  name: string;
  image: string;
  collection: string;
  sender: string;
}

const NFTPreview: React.FC<NFTPreviewProps> = ({
  name,
  image,
  collection,
  sender,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex justify-start nft-card">
      <div className="glass-effect p-3 rounded-xl max-w-[85%] md:max-w-[70%] glow-border message-bubble">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-accent-color">NFT Shared</h4>
          {expanded && (
            <button 
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div 
          className={`overflow-hidden rounded-lg cursor-pointer ${
            expanded ? 'max-h-[400px]' : 'max-h-[180px]'
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <Image
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            width={expanded ? 400 : 180}
            height={expanded ? 400 : 180}
          />
        </div>
        
        <div className="mt-2">
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm opacity-70">{collection}</p>
          
          {expanded && (
            <div className="mt-3 flex justify-between">
              <span className="text-xs opacity-70">Shared by {sender}</span>
              <a 
                href="#" 
                className="text-xs text-primary-color flex items-center gap-1"
              >
                View on OpenSea <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTPreview;