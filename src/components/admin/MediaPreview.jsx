import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const MediaPreview = ({ media, type = 'image' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!media) {
    return (
      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500">No media</span>
      </div>
    );
  }

  const mediaUrl = typeof media === 'string' ? media : media.url;
  const isVideo = type === 'video' || media.resourceType === 'video';

  if (isVideo) {
    return (
      <div className="relative w-full h-full group">
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          controls={isPlaying}
          onClick={() => setIsPlaying(!isPlaying)}
        />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/75 transition-colors cursor-pointer">
            <Play className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={mediaUrl}
      alt="Product"
      className="w-full h-full object-cover"
      loading="lazy"
      onError={(e) => {
        console.log('Image load error:', mediaUrl);
      }}
    />
  );
};

export default MediaPreview;