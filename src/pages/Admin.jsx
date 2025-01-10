import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { getSettings, updateSettings } from '../services/settings';
import LoginForm from '../components/admin/LoginForm';
import SettingsForm from '../components/admin/SettingsForm';
import ProductList from '../components/admin/ProductList';
import ProductFormModal from '../components/admin/ProductFormModal';
import DeleteConfirmation from '../components/admin/DeleteConfirmation';

const Admin = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  // Data state
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  
  // Modal state
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [settingsData, productsData] = await Promise.all([
        getSettings(),
        getProducts()
      ]);
      setSettings(settingsData);
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load data. Please try again.');
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSettingsSave = async (updatedSettings) => {
    setError(null);
    try {
      await updateSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Failed to update settings. Please try again.');
    }
  };

  const handleProductSubmit = async (formData) => {
    setError(null);
    try {
      if (selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct._id, formData);
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      } else {
        const newProduct = await createProduct(formData);
        setProducts([...products, newProduct]);
      }
      setShowProductForm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setError(null);
    try {
      await deleteProduct(productToDelete);
      setProducts(products.filter(p => p._id !== productToDelete));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-8 flex gap-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
              >
                Add Product
              </button>
            </div>
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
            />
          </div>
        )}

        {activeTab === 'settings' && settings && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <SettingsForm
              initialSettings={settings}
              onSubmit={handleSettingsSave}
            />
          </div>
        )}

        {showProductForm && (
          <ProductFormModal
            initialData={selectedProduct}
            onSubmit={handleProductSubmit}
            onClose={() => {
              setShowProductForm(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmation
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setProductToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;