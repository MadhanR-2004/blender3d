# GridFS Thumbnail Implementation Guide

## Overview
This project now uses MongoDB GridFS for storing both 3D model files and their thumbnails. This provides persistent, scalable file storage directly in MongoDB Atlas.

## Architecture

### 1. Upload Flow
```
User uploads file + thumbnail
    ↓
/api/upload receives FormData
    ↓
Stores file in GridFS → fileId, fileUrl
    ↓
Stores thumbnail in GridFS → thumbnailId, thumbnailUrl
    ↓
Returns file metadata
    ↓
/api/models creates Model document with IDs
```

### 2. Retrieval Flow
```
Client requests thumbnail/model
    ↓
/api/files/[id] receives fileId
    ↓
Streams file from GridFS
    ↓
Returns file with proper Content-Type
```

## Implementation Details

### Upload API (`/api/upload/route.ts`)
Handles both model files and thumbnails:

```typescript
// Main file upload
const fileStream = Readable.from(fileBuffer);
const fileUploadStream = bucket.openUploadStream(fileName, {
  metadata: {
    originalName: file.name,
    contentType: file.type || 'application/octet-stream',
    uploadDate: new Date(),
  },
});

// Thumbnail upload (optional)
if (thumbnail && thumbnail.size > 0) {
  const thumbnailStream = Readable.from(thumbnailBuffer);
  const thumbnailUploadStream = bucket.openUploadStream(thumbnailName, {
    metadata: {
      originalName: thumbnail.name,
      contentType: thumbnail.type || 'image/jpeg',
      uploadDate: new Date(),
      isThumbnail: true,
    },
  });
}
```

**Returns:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "/api/files/[fileId]",
    "fileId": "gridfs_file_id",
    "thumbnailUrl": "/api/files/[thumbnailId]",
    "thumbnailId": "gridfs_thumbnail_id",
    "fileName": "model.glb",
    "fileSize": 1234567,
    "format": "GLB"
  }
}
```

### File Retrieval API (`/api/files/[id]/route.ts`)
Streams files from GridFS:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bucket = getGridFSBucket();
  const fileId = new mongoose.Types.ObjectId(params.id);
  
  // Get file metadata
  const files = await bucket.find({ _id: fileId }).toArray();
  
  // Stream file
  const downloadStream = bucket.openDownloadStream(fileId);
  
  return new NextResponse(stream, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
```

### Model Schema (`/src/models/Model.ts`)
Updated to include GridFS references:

```typescript
export interface IModel {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;        // e.g., "/api/files/673abc123..."
  fileId?: string;        // GridFS file ObjectId
  thumbnailUrl?: string;  // e.g., "/api/files/673abc456..."
  thumbnailId?: string;   // GridFS thumbnail ObjectId
  fileSize: number;
  format: string;
  // ... other fields
}
```

### Upload Form (`/src/app/upload/page.tsx`)
Handles both file and thumbnail upload:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Upload file and thumbnail together
  const fileFormData = new FormData();
  fileFormData.append('file', formData.file);
  
  if (formData.thumbnail) {
    fileFormData.append('thumbnail', formData.thumbnail);
  }

  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: fileFormData,
  });

  // Create model with returned URLs and IDs
  const modelData = {
    // ... other fields
    fileUrl: uploadData.data.fileUrl,
    fileId: uploadData.data.fileId,
    thumbnailUrl: uploadData.data.thumbnailUrl,
    thumbnailId: uploadData.data.thumbnailId,
  };
};
```

## Usage

### Uploading a Model with Thumbnail

1. Go to `/upload` page (must be logged in)
2. Fill in model details:
   - Title
   - Description
   - Format (GLB, GLTF, OBJ, etc.)
   - Tags (comma-separated)
3. Upload 3D model file (required)
4. Upload thumbnail image (optional)
5. Click "Upload Model"

### How Thumbnails Work

- **Thumbnail provided**: Uses uploaded image from GridFS
- **No thumbnail**: Shows default 3D icon placeholder
- **Image error**: Falls back to default icon

### File Storage

All files are stored in MongoDB GridFS:
- **Collection**: `fs.files` (metadata)
- **Collection**: `fs.chunks` (file data in 255KB chunks)
- **Bucket name**: `uploads`

### File URLs

Files are accessed via:
```
/api/files/[ObjectId]
```

Example:
```
/api/files/673abc1234567890abcdef12
```

## Benefits of GridFS

1. **Persistent Storage**: Files stored in MongoDB Atlas, not local filesystem
2. **Scalability**: Handles large files by chunking
3. **No External Service**: No need for AWS S3, Cloudinary, etc.
4. **Atomic Operations**: File uploads are atomic
5. **Metadata Support**: Store custom metadata with files
6. **Streaming**: Files can be streamed for efficient transfer

## Testing

### Upload Test
```bash
# 1. Start server
npm run dev

# 2. Login with test user
Email: test@example.com
Password: password123

# 3. Navigate to /upload

# 4. Upload a .glb file with a .jpg thumbnail

# 5. Check MongoDB Atlas
# - Collection: models (should have fileId and thumbnailId)
# - Collection: fs.files (should have 2 new files)
# - Collection: fs.chunks (should have file chunks)
```

### Retrieval Test
```bash
# 1. Go to homepage
# 2. Find your uploaded model
# 3. Verify thumbnail displays
# 4. Click to view model detail
# 5. Verify 3D viewer loads the model
```

## Troubleshooting

### Model not uploading
- Check MongoDB connection in `.env.local`
- Verify user is logged in (check localStorage for token)
- Check browser console for errors
- Verify file format is supported

### Thumbnail not displaying
- Check if `thumbnailId` exists in model document
- Verify `/api/files/[thumbnailId]` returns image
- Check browser console for 404 errors
- Verify image Content-Type is correct

### 3D Viewer not loading
- Check if `fileId` exists in model document
- Verify format is GLB or GLTF (others not supported)
- Check browser console for React Three Fiber errors
- Verify `/api/files/[fileId]` returns file data

## Next Steps

- [ ] Add file deletion when model is deleted
- [ ] Add file size limits and validation
- [ ] Add image optimization for thumbnails
- [ ] Add progress indicators for large uploads
- [ ] Add file type validation on server
- [ ] Implement file compression
