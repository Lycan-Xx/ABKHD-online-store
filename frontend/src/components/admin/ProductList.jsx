import React from 'react';
import { Edit, Trash } from 'lucide-react';
import MediaPreview from './MediaPreview';

const getImageUrl = (imageObj) => {
  // Check if imageObj has a url property first
  if (imageObj?.url) {
    return imageObj.url;
  }
  return '';
};

const ProductList = ({ products, onEdit, onDelete }) => {
  const getMainImage = (product) => {
    // Get first image from the product's images array
    return product.images[0]?.url || '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <MediaPreview media={{ url: getMainImage(product) }} type="image" />
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
            <p className="text-yellow-400 font-bold">${product.price.toFixed(2)}</p>
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;