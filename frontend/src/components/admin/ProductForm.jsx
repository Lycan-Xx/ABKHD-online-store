import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import MediaGrid from './MediaGrid';
import UploadProgress from './UploadProgress';

const ProductForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
  });

  const [existingMedia, setExistingMedia] = useState({
    images: initialData?.images || [],
    videos: initialData?.videos || []
  });

  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: []
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Convert FileList to Array and store file objects
      const fileArray = Array.from(files);
      setSelectedFiles(prev => ({
        ...prev,
        [name]: [...prev[name], ...fileArray]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveExisting = (type, index) => {
    setExistingMedia(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleRemoveNew = (type, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    
    const form = new FormData();
    
    // Add basic form data
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);
    
    // Add existing media
    form.append('existingImages', JSON.stringify(existingMedia.images));
    form.append('existingVideos', JSON.stringify(existingMedia.videos));
    
    // Calculate total files for progress
    const totalFiles = selectedFiles.images.length + selectedFiles.videos.length;
    let filesProcessed = 0;

    // Add new files
    selectedFiles.images.forEach(image => {
      form.append('images', image);
      filesProcessed++;
      setUploadProgress((filesProcessed / totalFiles) * 100);
    });

    selectedFiles.videos.forEach(video => {
      form.append('videos', video);
      filesProcessed++;
      setUploadProgress((filesProcessed / totalFiles) * 100);
    });

    try {
      await onSubmit(form);
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name Input - Add this first */}
      <div>
        <label className="block text-gray-400 mb-2">Product Name</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          required
        />
      </div>

      {/* Existing Media Preview */}
      {existingMedia.images.length > 0 && (
        <div>
          <label className="block text-gray-400 mb-2">Current Images</label>
          <MediaGrid 
            images={existingMedia.images}
            onRemove={(index) => handleRemoveExisting('images', index)}
          />
        </div>
      )}

      {/* New Media Upload */}
      <div>
        <label className="block text-gray-400 mb-2">Add New Images</label>
        <div className="space-y-4">
          <label className="cursor-pointer bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 inline-block">
            <Upload className="inline-block mr-2" size={20} />
            Choose Images
            <input
              type="file"
              name="images"
              onChange={handleChange}
              accept="image/*"
              multiple
              className="hidden"
              max="5"
            />
          </label>
          
          {/* New Image Previews */}
          {selectedFiles.images.length > 0 && (
            <MediaGrid 
              images={selectedFiles.images.map(file => ({
                url: URL.createObjectURL(file)
              }))}
              onRemove={(index) => handleRemoveNew('images', index)}
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Videos (max 2)</label>
        <div className="space-y-4">
          <label className="cursor-pointer bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 inline-block">
            <Upload className="inline-block mr-2" size={20} />
            Choose Videos
            <input
              type="file"
              name="videos"
              onChange={handleChange}
              accept="video/*"
              multiple
              className="hidden"
              max="2"
            />
          </label>

          {/* Video file names */}
          <div className="space-y-2">
            {selectedFiles.videos.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                <span className="text-sm text-gray-300">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveNew('videos', index)}
                  className="text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Uploading Media...</h3>
            <UploadProgress progress={uploadProgress} />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading}
        className={`w-full py-2 px-4 rounded-lg ${
          isUploading 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isUploading ? 'Uploading...' : initialData ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;