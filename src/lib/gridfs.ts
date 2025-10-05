import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket: GridFSBucket | null = null;

export function getGridFSBucket(): GridFSBucket {
  if (!bucket) {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }
    bucket = new GridFSBucket(db, {
      bucketName: 'models',
    });
  }
  return bucket;
}

export default getGridFSBucket;
