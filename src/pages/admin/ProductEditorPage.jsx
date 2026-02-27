import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminProducts } from '../../contexts/AdminProductContext'
import { useToast } from '../../contexts/ToastContext'
import ImageUploader from '../../components/admin/ImageUploader'

const ProductEditorPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addProduct, updateProduct, getProduct, deleteProduct, categories } = useAdminProducts()
  const { showToast } = useToast()
  
  const isEditMode = Boolean(id)
  const existingProduct = isEditMode ? getProduct(id) : null

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [],
    featured: false,
    isArchived: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        description: existingProduct.description || '',
        longDescription: existingProduct.longDescription || '',
        price: existingProduct.price?.toString() || '',
        originalPrice: existingProduct.originalPrice?.toString() || '',
        category: existingProduct.category || '',
        images: existingProduct.images || (existingProduct.image ? [existingProduct.image] : []),
        featured: existingProduct.featured || false,
        isArchived: existingProduct.isArchived || false
      })
    }
  }, [existingProduct])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Short description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (saveAsDraft = false) => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        image: formData.images[0] || null,
        images: formData.images,
        featured: formData.featured,
        isArchived: saveAsDraft || formData.isArchived,
        isActive: !saveAsDraft && !formData.isArchived
      }

      if (isEditMode) {
        updateProduct(id, productData)
        showToast('Product updated successfully!', 'success')
      } else {
        addProduct(productData)
        showToast('Product created successfully!', 'success')
      }

      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      showToast('Failed to save product. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id)
      showToast('Product deleted successfully', 'success')
      navigate('/admin/products')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/products" 
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <i className="bi bi-arrow-left text-lg"></i>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {isEditMode ? 'Edit Product' : 'Create Product'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update product details' : 'Add a new product to your store'}
            </p>
          </div>
        </div>
        {isEditMode && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <i className="bi bi-trash"></i>
            Delete
          </button>
        )}
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Images Section */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <ImageUploader 
            images={formData.images} 
            onChange={handleImagesChange}
          />
        </div>

        {/* Basic Info Section */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Product Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name ? 'border-destructive' : ''
                }`}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.category ? 'border-destructive' : ''
                }`}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id || cat.name} value={cat.name || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₦) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.price ? 'border-destructive' : ''
                }`}
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">{errors.price}</p>
              )}
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Original Price (₦) <span className="text-muted-foreground text-xs">(optional - for discounts)</span>
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <div className="space-y-4">
            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Short Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief product description (shown in product cards)"
                rows={2}
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                  errors.description ? 'border-destructive' : ''
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description}</p>
              )}
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Description <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="Detailed product description with features and specifications"
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <div className="space-y-4">
            {/* Featured */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-ring"
              />
              <div>
                <span className="text-sm font-medium">Featured Product</span>
                <p className="text-xs text-muted-foreground">
                  This product will appear on the home page
                </p>
              </div>
            </label>

            {/* Archived */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isArchived"
                checked={formData.isArchived}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-ring"
              />
              <div>
                <span className="text-sm font-medium">Archive Product</span>
                <p className="text-xs text-muted-foreground">
                  This product will not appear anywhere in the store
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="w-full sm:w-auto btn-secondary"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto btn-secondary"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto btn-primary"
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Save & Publish')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductEditorPage
