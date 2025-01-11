import React from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductFormModal = ({ onSubmit, initialData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <ProductForm
          onSubmit={onSubmit}
          initialData={initialData}
        />
      </div>
    </div>
  );
};

export default ProductFormModal;