/**
 * Image and Video Compression Utilities
 * Uses browser-native APIs for efficient compression
 */

// Configuration for compression
const DEFAULT_IMAGE_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'image/jpeg'
}

const DEFAULT_THUMBNAIL_CONFIG = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.7,
  format: 'image/jpeg'
}

/**
 * Compress an image file using Canvas API
 * @param {File} file - The image file to compress
 * @param {Object} config - Compression configuration
 * @returns {Promise<string>} - Compressed image as base64 data URL
 */
export const compressImage = (file, config = DEFAULT_IMAGE_CONFIG) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'))
      return
    }

    const { maxWidth, maxHeight, quality, format } = { ...DEFAULT_IMAGE_CONFIG, ...config }

    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        
        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to specified format
        const outputFormat = format || file.type
        const dataUrl = canvas.toDataURL(outputFormat, quality)
        
        // Calculate compression ratio
        const originalSize = file.size
        const compressedSize = Math.round((dataUrl.length * 3) / 4) // Base64 to bytes
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
        
        console.log(`Image compressed: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${compressionRatio}% reduction)`)
        
        resolve(dataUrl)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = event.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Create a thumbnail from an image
 * @param {File} file - The image file
 * @returns {Promise<string>} - Thumbnail as base64 data URL
 */
export const createThumbnail = (file) => {
  return compressImage(file, DEFAULT_THUMBNAIL_CONFIG)
}

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} config - Compression configuration
 * @returns {Promise<string[]>} - Array of compressed images
 */
export const compressImages = async (files, config = DEFAULT_IMAGE_CONFIG) => {
  const results = await Promise.all(
    files.map(file => compressImage(file, config))
  )
  return results
}

/**
 * Compress a video file using FFmpeg.wasm (requires library)
 * For browser-native approach, we'll create a thumbnail preview
 * @param {File} file - The video file
 * @returns {Promise<{thumbnail: string, duration: number}>}
 */
export const compressVideo = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('video/')) {
      reject(new Error('Invalid video file'))
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      // Set canvas to video dimensions (capped at 1920)
      let { videoWidth, videoHeight } = video
      
      if (videoWidth > 1920) {
        videoHeight = (videoHeight * 1920) / videoWidth
        videoWidth = 1920
      }
      
      canvas.width = videoWidth
      canvas.height = videoHeight

      // Seek to 10% of video duration for thumbnail
      video.currentTime = Math.min(video.duration * 0.1, 1)
    }

    video.onseeked = () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get thumbnail as JPEG
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
      
      // Get video duration
      const duration = video.duration

      // Clean up
      video.src = ''
      URL.revokeObjectURL(video.src)

      console.log(`Video processed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(thumbnail.length * 3 / 4 / 1024).toFixed(1)}KB thumbnail`)

      resolve({
        thumbnail,
        duration: Math.round(duration * 100) / 100,
        originalSize: file.size,
        dimensions: { width: canvas.width, height: canvas.height }
      })
    }

    video.onerror = () => {
      reject(new Error('Failed to load video'))
    }

    // Load video
    video.src = URL.createObjectURL(file)
  })
}

/**
 * Get file info before compression
 * @param {File} file 
 * @returns {Object} File information
 */
export const getFileInfo = (file) => {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  
  let dimensions = null
  let duration = null
  
  if (isImage) {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    // Dimensions will be available when loaded
  }
  
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    isImage,
    isVideo,
    lastModified: new Date(file.lastModified).toLocaleDateString()
  }
}

/**
 * Format file size to human readable
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file needs compression
 * @param {File} file 
 * @param {number} thresholdMB - Size threshold in MB
 * @returns {boolean}
 */
export const needsCompression = (file, thresholdMB = 1) => {
  return file.size > thresholdMB * 1024 * 1024
}
