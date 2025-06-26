import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// AWS S3 Client Konfiguration (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
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

// S3 Upload Funktion mit AWS SDK v3
export const uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    
    // AWS SDK v3 gibt keine Location zurück, wir erstellen sie selbst
    const location = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    return {
      ...result,
      Location: location,
      Key: fileName,
      Bucket: process.env.S3_BUCKET_NAME
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw error;
  }
};

export { s3 };

console.log('✅ S3 file upload configuration loaded successfully');
