import React from 'react';
import { X } from 'lucide-react';

const MediaGrid = ({ images, onRemove }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image.url}
            alt={`Preview ${index}`}
            className="w-full h-24 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(index);
            }}
            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;