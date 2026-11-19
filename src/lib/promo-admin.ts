/**
 * Browser-only helpers for the admin promo screens (QR codes + image upload).
 * Reads and writes go through the Appwrite client SDK like the rest of the
 * admin; the promo collections are limited to the admin team in Appwrite.
 */

import QRCode from 'qrcode';
import { Permission, Role } from 'appwrite';
import { storage, ID, APPWRITE_IMAGES_BUCKET_ID } from './appwrite';

// Reuses the store's existing images bucket (the free plan caps bucket count).
const PROMO_IMAGES_BUCKET = APPWRITE_IMAGES_BUCKET_ID;

/** Error correction Q + a 4-module quiet zone survives print wear and glare. */
const QR_OPTIONS = { errorCorrectionLevel: 'Q' as const, margin: 4 };

export function qrPngDataUrl(text: string, width = 1200): Promise<string> {
  return QRCode.toDataURL(text, { ...QR_OPTIONS, width, color: { dark: '#000000', light: '#ffffff' } });
}

export function qrSvgString(text: string): Promise<string> {
  return QRCode.toString(text, { ...QR_OPTIONS, type: 'svg' });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadText(text: string, filename: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Downscale phone photos before upload (long edge max, WebP). */
export async function compressImage(file: File, maxEdge = 1400): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.85)
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
}

/**
 * Upload promo photos to the shared images bucket, each with an explicit
 * public-read permission so the shopper's browser can load it.
 */
export async function uploadPromoImage(file: File): Promise<string> {
  const small = await compressImage(file);
  const uploaded = await storage.createFile(PROMO_IMAGES_BUCKET, ID.unique(), small, [
    Permission.read(Role.any()),
  ]);
  return storage.getFileView(PROMO_IMAGES_BUCKET, uploaded.$id).toString();
}

export function fileIdFromUrl(url: string): string | null {
  const match = url.match(/\/files\/([^/]+)\//);
  return match ? match[1] : null;
}

export async function deletePromoImage(url: string): Promise<void> {
  const id = fileIdFromUrl(url);
  if (!id) return;
  try {
    await storage.deleteFile(PROMO_IMAGES_BUCKET, id);
  } catch (error) {
    console.warn('Could not delete promo image', id, error);
  }
}

export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** ISO string -> value for <input type="datetime-local"> (local time). */
export function toLocalInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}
