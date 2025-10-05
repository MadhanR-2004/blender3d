import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import getGridFSBucket from '@/lib/gridfs';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const thumbnail = formData.get('thumbnail') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedFormats = ['glb', 'gltf', 'obj', 'fbx', 'stl', 'blend'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Allowed formats: ' + allowedFormats.join(', ') },
        { status: 400 }
      );
    }

    // Get GridFS bucket
    const bucket = getGridFSBucket();

    // Upload main file
    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);
    const fileStream = Readable.from(fileBuffer);
    
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const fileUploadStream = bucket.openUploadStream(fileName, {
      metadata: {
        originalName: file.name,
        contentType: file.type || 'application/octet-stream',
        uploadDate: new Date(),
      },
    });

    await new Promise((resolve, reject) => {
      fileStream.pipe(fileUploadStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const fileUrl = `/api/files/${fileUploadStream.id}`;
    const fileId = fileUploadStream.id.toString();

    // Upload thumbnail if provided
    let thumbnailUrl = undefined;
    let thumbnailId = undefined;

    if (thumbnail && thumbnail.size > 0) {
      const thumbnailBytes = await thumbnail.arrayBuffer();
      const thumbnailBuffer = Buffer.from(thumbnailBytes);
      const thumbnailStream = Readable.from(thumbnailBuffer);
      
      const thumbnailName = `thumb-${timestamp}-${thumbnail.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const thumbnailUploadStream = bucket.openUploadStream(thumbnailName, {
        metadata: {
          originalName: thumbnail.name,
          contentType: thumbnail.type || 'image/jpeg',
          uploadDate: new Date(),
          isThumbnail: true,
        },
      });

      await new Promise((resolve, reject) => {
        thumbnailStream.pipe(thumbnailUploadStream)
          .on('finish', resolve)
          .on('error', reject);
      });

      thumbnailUrl = `/api/files/${thumbnailUploadStream.id}`;
      thumbnailId = thumbnailUploadStream.id.toString();
    }

    // Return the file info
    return NextResponse.json({
      success: true,
      data: {
        fileUrl,
        fileId,
        fileName,
        fileSize: file.size,
        format: fileExtension.toUpperCase(),
        thumbnailUrl,
        thumbnailId,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
