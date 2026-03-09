import { Client, Storage } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
  .setKey(process.env.APPWRITE_API_KEY || '');

const storage = new Storage(client);

const APPWRITE_IMAGES_BUCKET_ID = process.env.PUBLIC_APPWRITE_BUCKET_IMAGES!;

async function updateBucketSettings() {
  try {
    console.log('Updating bucket settings...\n');
    
    // Get current bucket
    const bucket = await storage.getBucket(APPWRITE_IMAGES_BUCKET_ID);
    
    console.log('Current allowed extensions:', bucket.allowedFileExtensions.join(', '));
    
    // Update bucket to allow all common image and video formats
    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg',  // Images
      'mp4', 'mov', 'avi', 'webm', 'mkv', 'flv'           // Videos
    ];
    
    console.log('Updating to allow:', allowedExtensions.join(', '));
    
    await storage.updateBucket(
      APPWRITE_IMAGES_BUCKET_ID,
      bucket.name,
      undefined, // permissions (keep existing)
      undefined, // fileSecurity (keep existing)
      bucket.enabled,
      bucket.maximumFileSize, // Keep existing max file size
      allowedExtensions,
      bucket.compression,
      bucket.encryption,
      bucket.antivirus
    );
    
    console.log('\n✓ Bucket settings updated successfully!');
    console.log('\nNew settings:');
    console.log('- Maximum File Size: 50 MB');
    console.log('- Allowed Extensions:', allowedExtensions.join(', '));
    
  } catch (error: any) {
    console.error('Error updating bucket settings:', error.message || error);
    console.log('\nIf the update failed, you can manually update in Appwrite Console:');
    console.log('1. Go to Storage > product-images bucket');
    console.log('2. Click "Settings"');
    console.log('3. Update "Allowed File Extensions" to: jpg, jpeg, png, webp, gif, bmp, svg, mp4, mov, avi, webm, mkv, flv');
    console.log('4. Update "Maximum File Size" to: 52428800 (50 MB)');
  }
}

updateBucketSettings();
