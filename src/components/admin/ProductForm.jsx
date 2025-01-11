import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ProductForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    images: [],
    videos: []
  });

  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: []
  });

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

  const removeFile = (type, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    
    // Append text fields
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);
    
    // Append files
    selectedFiles.images.forEach(image => {
      form.append('images', image);
    });
    selectedFiles.videos.forEach(video => {
      form.append('videos', video);
    });

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-400 mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
          required
        />
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
        <label className="block text-gray-400 mb-2">Images (max 5)</label>
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
          
          {/* Image previews */}
          <div className="grid grid-cols-3 gap-4">
            {selectedFiles.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile('images', index)}
                  className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
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
                  onClick={() => removeFile('videos', index)}
                  className="text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        {initialData ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;