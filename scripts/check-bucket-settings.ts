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

async function checkBucketSettings() {
  try {
    console.log('Checking bucket settings...\n');
    
    const bucket = await storage.getBucket(APPWRITE_IMAGES_BUCKET_ID);
    
    console.log('Bucket Information:');
    console.log('- Name:', bucket.name);
    console.log('- ID:', bucket.$id);
    console.log('- Enabled:', bucket.enabled);
    console.log('- Maximum File Size:', bucket.maximumFileSize, 'bytes', `(${(bucket.maximumFileSize / 1024 / 1024).toFixed(2)} MB)`);
    console.log('- Allowed File Extensions:', bucket.allowedFileExtensions.length > 0 ? bucket.allowedFileExtensions.join(', ') : 'ALL (no restrictions)');
    console.log('- Compression:', bucket.compression);
    console.log('- Encryption:', bucket.encryption);
    console.log('- Antivirus:', bucket.antivirus);
    
    console.log('\n=== Recommendations ===');
    
    if (bucket.allowedFileExtensions.length > 0) {
      const requiredExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi'];
      const missing = requiredExtensions.filter(ext => !bucket.allowedFileExtensions.includes(ext));
      
      if (missing.length > 0) {
        console.log('⚠️  Missing recommended extensions:', missing.join(', '));
        console.log('\nTo fix this:');
        console.log('1. Go to Appwrite Console > Storage > product-images bucket');
        console.log('2. Click "Settings"');
        console.log('3. Under "Allowed File Extensions", add:', missing.join(', '));
        console.log('4. Or remove all extensions to allow all file types');
      } else {
        console.log('✓ All recommended extensions are allowed');
      }
    } else {
      console.log('✓ All file extensions are allowed (no restrictions)');
    }
    
    if (bucket.maximumFileSize < 50 * 1024 * 1024) {
      console.log(`\n⚠️  Maximum file size is ${(bucket.maximumFileSize / 1024 / 1024).toFixed(2)} MB`);
      console.log('   Consider increasing to 50 MB for video uploads');
    }
    
  } catch (error) {
    console.error('Error checking bucket settings:', error);
  }
}

checkBucketSettings();
