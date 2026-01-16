import React, { useRef } from 'react'

const ImageUploader = ({ images = [], onChange }) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          onChange([...images, event.target.result])
        }
        reader.readAsDataURL(file)
      }
    })
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          onChange([...images, event.target.result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  return (
    <div className="space-y-4">
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
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        The first image will be used as the main product image.
        {images.length > 0 && ` ${images.length} image${images.length > 1 ? 's' : ''} uploaded.`}
      </p>
    </div>
  )
}

export default ImageUploader
