import React from 'react';
import { Plus } from 'lucide-react';
import ProductList from './ProductList';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmation from './DeleteConfirmation';

const ProductsPanel = ({
  products,
  showForm,
  selectedProduct,
  deleteProductId,
  onShowForm,
  onHideForm,
  onSubmit,
  onEdit,
  onDelete,
  onDeleteConfirm,
  onDeleteCancel
}) => {
  return (
    <section className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Products</h2>
        <button
          onClick={onShowForm}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductFormModal
          onSubmit={onSubmit}
          initialData={selectedProduct}
          onClose={onHideForm}
        />
      )}

      <ProductList
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {deleteProductId && (
        <DeleteConfirmation
          onConfirm={onDeleteConfirm}
          onCancel={onDeleteCancel}
        />
      )}
    </section>
  );
};

export default ProductsPanel;