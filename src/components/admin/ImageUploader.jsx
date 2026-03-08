import React, { useRef, useState } from 'react'
import { compressImage, compressVideo, formatFileSize, needsCompression } from '../../lib/utils'

const ImageUploader = ({ images = [], onChange }) => {
  const fileInputRef = useRef(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionStats, setCompressionStats] = useState(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    await processFiles(files)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const processFiles = async (files) => {
    setIsCompressing(true)
    let totalOriginalSize = 0
    let totalCompressedSize = 0
    let imageCount = 0

    for (const file of files) {
      totalOriginalSize += file.size

      if (file.type.startsWith('image/')) {
        try {
          // Compress image
          const compressed = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.8
          })
          
          onChange(prev => [...prev, compressed])
          imageCount++
          
          // Calculate compressed size (base64 to bytes approximation)
          const compressedSize = Math.round((compressed.length * 3) / 4)
          totalCompressedSize += compressedSize
          
        } catch (error) {
          console.error('Error compressing image:', error)
          // Fallback to original
          const reader = new FileReader()
          reader.onload = (event) => {
            onChange(prev => [...prev, event.target.result])
          }
          reader.readAsDataURL(file)
        }
      } else if (file.type.startsWith('video/')) {
        try {
          // Process video thumbnail
          const videoData = await compressVideo(file)
          
          // Add video thumbnail as image (for preview)
          onChange(prev => [...prev, videoData.thumbnail])
          
          // Note: For actual video handling, you'd want to store the video file separately
          // This is just a thumbnail preview
          totalCompressedSize += Math.round((videoData.thumbnail.length * 3) / 4)
          
        } catch (error) {
          console.error('Error processing video:', error)
        }
      }
    }

    // Show compression stats
    if (imageCount > 0 && totalOriginalSize > 0) {
      const savings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)
      setCompressionStats({
        original: formatFileSize(totalOriginalSize),
        compressed: formatFileSize(totalCompressedSize),
        savings: savings,
        count: imageCount
      })

      // Clear stats after 5 seconds
      setTimeout(() => setCompressionStats(null), 5000)
    }

    setIsCompressing(false)
  }

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  return (
    <div className="space-y-4">
      {/* Compression Stats */}
      {compressionStats && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <i className="bi bi-check-circle-fill"></i>
            <span className="text-sm">
              {compressionStats.count} image(s) compressed: {compressionStats.original} → {compressionStats.compressed}
            </span>
          </div>
          <span className="text-sm font-medium text-green-600 dark:text-green-300">
            {compressionStats.savings}% smaller
          </span>
        </div>
      )}

      {/* Loading State */}
      {isCompressing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
          <i className="bi bi-arrow-repeat animate-spin text-blue-600"></i>
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Compressing images...
          </span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img 
                src={image} 
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Remove button */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-background/90 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                <i className="bi bi-x-lg text-sm"></i>
              </button>
              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5 ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-muted-foreground">
          <i className="bi bi-cloud-arrow-up text-3xl mb-3 block"></i>
          <p className="text-sm font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs mt-1">
            Images (PNG, JPG, WEBP) and Videos up to 50MB
          </p>
          <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">
            <i className="bi bi-lightning-charge mr-1"></i>
            Files are automatically compressed
          </p>
        </div>
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        The first image will be used as the main product image.
        {images.length > 0 && ` ${images.length} image${images.length > 1 ? 's' : ''} uploaded.`}
        <br />
        <span className="text-blue-600 dark:text-blue-400">
          <i className="bi bi-info-circle mr-1"></i>
          Images over 1MB are automatically compressed to reduce file size while maintaining quality.
        </span>
      </p>
    </div>
  )
}

export default ImageUploader
