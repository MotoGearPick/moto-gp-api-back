import { S3Client } from '@aws-sdk/client-s3';
import { config } from './index';

export const createS3Client = (): S3Client => {
  const { S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT } = config();
  return new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    ...(S3_ENDPOINT && { endpoint: S3_ENDPOINT, forcePathStyle: true }),
  });
};

export const S3_BUCKET = () => config().S3_BUCKET;
