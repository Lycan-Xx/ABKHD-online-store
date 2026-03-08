import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price)
}

export const initializeDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for saved preference first, then system preference
  const savedTheme = localStorage.getItem('darkMode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  const isDark = savedTheme !== null 
    ? savedTheme === 'true' 
    : systemPrefersDark

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return isDark
}

export const toggleDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const currentlyDark = document.documentElement.classList.contains('dark')

  if (currentlyDark) {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
    return false
  } else {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
    return true
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// ============== IMAGE & VIDEO COMPRESSION ==============

// Configuration for compression
const DEFAULT_IMAGE_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'image/jpeg'
}

/**
 * Compress an image file using Canvas API
 */
export const compressImage = (file: File, config = DEFAULT_IMAGE_CONFIG) => {
  return new Promise<string>((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'))
      return
    }

    const { maxWidth, maxHeight, quality, format } = { ...DEFAULT_IMAGE_CONFIG, ...config }

    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      
      img.onload = () => {
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')!
        
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        const outputFormat = format || file.type
        const dataUrl = canvas.toDataURL(outputFormat, quality)
        
        resolve(dataUrl)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      img.src = event.target?.result as string
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Compress a video file - creates thumbnail preview
 */
export const compressVideo = async (file: File): Promise<{thumbnail: string, duration: number}> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('video/')) {
      reject(new Error('Invalid video file'))
      return
    }

    const video = document.createElement('video')
    const canvas = document.createElement('canvas')

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      let { videoWidth, videoHeight } = video
      
      if (videoWidth > 1920) {
        videoHeight = (videoHeight * 1920) / videoWidth
        videoWidth = 1920
      }
      
      canvas.width = videoWidth
      canvas.height = videoHeight

      video.currentTime = Math.min(video.duration * 0.1, 1)
    }

    video.onseeked = () => {
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
      const duration = video.duration

      video.src = ''

      resolve({
        thumbnail,
        duration: Math.round(duration * 100) / 100
      })
    }

    video.onerror = () => {
      reject(new Error('Failed to load video'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * Format file size to human readable
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if file needs compression
 */
export const needsCompression = (file: File, thresholdMB = 1): boolean => {
  return file.size > thresholdMB * 1024 * 1024
}