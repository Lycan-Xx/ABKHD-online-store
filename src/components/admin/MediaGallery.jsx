import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import MediaPreview from './MediaPreview';

const MediaGallery = ({ images = [], videos = [], onRemove }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const allMedia = [...images, ...videos];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  if (allMedia.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
        <MediaPreview
          media={allMedia[activeIndex]}
          type={activeIndex >= images.length ? 'video' : 'image'}
        />
      </div>

      {allMedia.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(activeIndex)}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75"
        >
          <X size={20} />
        </button>
      )}

      {allMedia.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-yellow-400' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;