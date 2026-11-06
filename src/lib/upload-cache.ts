/**
 * Upload Cache Utility
 * Handles persistence of media files to localStorage for recovery after network failures or page refreshes
 */

const CACHE_KEY = 'abkhd_upload_cache';
const CACHE_EXPIRY_HOURS = 24;

export interface CachedMediaFile {
  id: string;
  type: 'image' | 'video';
  data: string;
  file?: File;
  thumbnail?: string;
  duration?: number;
  isPrimary: boolean;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  uploadedUrl?: string;
  error?: string;
  createdAt: number;
}

export interface UploadCache {
  files: CachedMediaFile[];
  lastUpdated: number;
}

export function saveToCache(files: CachedMediaFile[]): void {
  try {
    const cacheableFiles = files.map(f => ({
      ...f,
      file: undefined,
      createdAt: f.createdAt || Date.now()
    }));
    
    const cache: UploadCache = {
      files: cacheableFiles,
      lastUpdated: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('Upload cache saved:', cacheableFiles.length, 'files');
  } catch (error) {
    console.error('Failed to save to cache:', error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      clearCache();
    }
  }
}

export function loadFromCache(): CachedMediaFile[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    
    const cache: UploadCache = JSON.parse(cached);
    
    const now = Date.now();
    const expiryMs = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
    if (now - cache.lastUpdated > expiryMs) {
      console.log('Upload cache expired, clearing...');
      clearCache();
      return [];
    }
    
    const recentCompleted = cache.files.filter(f => 
      f.status !== 'completed' || (now - f.createdAt) < (60 * 60 * 1000)
    );
    
    console.log('Upload cache loaded:', recentCompleted.length, 'files');
    return recentCompleted;
  } catch (error) {
    console.error('Failed to load from cache:', error);
    clearCache();
    return [];
  }
}

export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Upload cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

export function updateCacheFile(id: string, updates: Partial<CachedMediaFile>): void {
  const files = loadFromCache();
  const index = files.findIndex(f => f.id === id);
  if (index !== -1) {
    files[index] = { ...files[index], ...updates };
    saveToCache(files);
  }
}

export function getPendingFiles(): CachedMediaFile[] {
  const files = loadFromCache();
  return files.filter(f => f.status === 'pending' || f.status === 'failed');
}

export function generateCacheId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createCachedFile(
  type: 'image' | 'video',
  data: string,
  file: File,
  options?: { thumbnail?: string; duration?: number; isPrimary?: boolean }
): CachedMediaFile {
  return {
    id: generateCacheId(),
    type,
    data,
    file,
    thumbnail: options?.thumbnail,
    duration: options?.duration,
    isPrimary: options?.isPrimary || false,
    status: 'pending',
    createdAt: Date.now()
  };
}

export async function uploadSingleFile(
  file: CachedMediaFile,
  bucketId: string,
  storage: any,
  ID: any
): Promise<{ url: string; thumbnailUrl?: string }> {
  if (!file.file) {
    throw new Error('No file to upload');
  }

  file.status = 'uploading';
  
  try {
    const uploaded = await storage.createFile(bucketId, ID.unique(), file.file);
    const url = storage.getFileView(bucketId, uploaded.$id).toString();
    
    let thumbnailUrl: string | undefined;
    
    if (file.type === 'video' && file.thumbnail) {
      const thumbBlob = await fetch(file.thumbnail).then(r => r.blob());
      const thumbFile = new File([thumbBlob], `thumb_${uploaded.$id}.jpg`, { type: 'image/jpeg' });
      const thumbUploaded = await storage.createFile(bucketId, ID.unique(), thumbFile);
      thumbnailUrl = storage.getFileView(bucketId, thumbUploaded.$id).toString();
    }
    
    file.status = 'completed';
    file.uploadedUrl = url;
    
    return { url, thumbnailUrl };
  } catch (error) {
    file.status = 'failed';
    file.error = error instanceof Error ? error.message : 'Upload failed';
    throw error;
  }
}

export async function uploadFilesSequentially(
  files: CachedMediaFile[],
  bucketId: string,
  storage: any,
  ID: any,
  onFileProgress: (file: CachedMediaFile, index: number, total: number) => void,
  onFileComplete: (file: CachedMediaFile, result: { url: string; thumbnailUrl?: string }) => void,
  onFileError: (file: CachedMediaFile, error: Error) => void
): Promise<{ success: CachedMediaFile[]; failed: CachedMediaFile[] }> {
  const success: CachedMediaFile[] = [];
  const failed: CachedMediaFile[] = [];
  
  const filesToUpload = files.filter(f => f.status === 'pending' || f.status === 'failed');
  
  for (let i = 0; i < filesToUpload.length; i++) {
    const file = filesToUpload[i];
    
    updateCacheFile(file.id, { status: 'uploading' });
    
    onFileProgress(file, i + 1, filesToUpload.length);
    
    try {
      const result = await uploadSingleFile(file, bucketId, storage, ID);
      success.push(file);
      onFileComplete(file, result);
      
      updateCacheFile(file.id, { 
        status: 'completed', 
        uploadedUrl: result.url,
        data: result.url
      });
    } catch (error) {
      failed.push(file);
      onFileError(file, error instanceof Error ? error : new Error('Upload failed'));
      
      updateCacheFile(file.id, { 
        status: 'failed',
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  }
  
  return { success, failed };
}

export function hasPendingUploads(): boolean {
  const files = loadFromCache();
  return files.some(f => f.status === 'pending' || f.status === 'failed');
}

export function getPendingCount(): number {
  const files = loadFromCache();
  return files.filter(f => f.status === 'pending' || f.status === 'failed').length;
}
