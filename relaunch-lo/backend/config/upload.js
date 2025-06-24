import multer from 'multer';
import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// AWS S3 Konfiguration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

console.log('✅ S3 Configuration:', {
  region: process.env.AWS_REGION,
  bucket: process.env.S3_BUCKET_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set'
});

// Memory Storage für Multer - wir handhaben S3 Upload manuell
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all common file types
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

// S3 Upload Funktion ohne ACL
export const uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // KEINE ACL Parameter!
  };

  try {
    const result = await s3.upload(params).promise();
    return result;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

export { s3 };

console.log('✅ S3 file upload configuration loaded successfully');
