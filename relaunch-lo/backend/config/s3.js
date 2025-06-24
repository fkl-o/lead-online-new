import AWS from 'aws-sdk';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// AWS S3 Konfiguration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-central-1'
});

const s3 = new AWS.S3();

// Validate S3 configuration
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_BUCKET_NAME) {
  console.error('❌ AWS S3 configuration is missing!');
  console.error('Please check your .env file and ensure these variables are set:');
  console.error('- AWS_ACCESS_KEY_ID');
  console.error('- AWS_SECRET_ACCESS_KEY');
  console.error('- S3_BUCKET_NAME');
  process.exit(1);
}

console.log('✅ AWS S3 configuration loaded successfully');
console.log(`📦 S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
console.log(`🌍 AWS Region: ${process.env.AWS_REGION || 'eu-central-1'}`);

// Multer Memory Storage - wir laden direkt zu S3 hoch ohne multer-s3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Erlaubte Dateitypen
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

export { upload, s3 };
export default s3;
