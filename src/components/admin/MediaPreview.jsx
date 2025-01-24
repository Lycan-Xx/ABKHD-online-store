import React from 'react';
import { Play } from 'lucide-react';

const MediaPreview = ({ media, type = 'image' }) => {
  if (!media) {
    return (
      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500">No media</span>
      </div>
    );
  }

  // Use the URL directly from the media object
  const mediaUrl = media.url;

  if (type === 'video') {
    return (
      <div className="relative w-full h-full">
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          controls
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
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