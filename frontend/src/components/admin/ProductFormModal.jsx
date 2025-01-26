import React, { useState } from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductFormModal = ({ onSubmit, initialData, onClose }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (formData) => {
    try {
      await onSubmit(formData, setUploadProgress);
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
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
        <div className="overflow-y-auto flex-grow">
          <ProductForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;