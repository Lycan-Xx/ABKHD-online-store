import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="text-red-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
        </div>
        
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;