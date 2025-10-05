'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    format: 'GLB',
    tags: '',
    file: null as File | null,
    thumbnail: null as File | null,
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userStr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, thumbnail: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      // Upload file and thumbnail
      const fileFormData = new FormData();
      fileFormData.append('file', formData.file);
      
      if (formData.thumbnail) {
        fileFormData.append('thumbnail', formData.thumbnail);
      }

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: fileFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload file');
      }

      // Create model entry
      const modelData = {
        title: formData.title,
        description: formData.description,
        fileUrl: uploadData.data.fileUrl,
        fileId: uploadData.data.fileId,
        thumbnailUrl: uploadData.data.thumbnailUrl,
        thumbnailId: uploadData.data.thumbnailId,
        fileSize: uploadData.data.fileSize,
        format: uploadData.data.format,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        userId: user?._id || 'demo-user-id',
        userName: user?.name || 'Demo User',
      };

      const createResponse = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create model');
      }

      alert('Model uploaded successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error uploading model:', error);
      alert('Failed to upload model: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Upload 3D Model</h1>

          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white mb-2" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="My Awesome Model"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white mb-2" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 h-32"
                placeholder="Describe your 3D model..."
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-white mb-2" htmlFor="format">
                Format *
              </label>
              <select
                id="format"
                required
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="GLB">GLB</option>
                <option value="GLTF">GLTF</option>
                <option value="OBJ">OBJ</option>
                <option value="FBX">FBX</option>
                <option value="BLEND">Blender</option>
                <option value="STL">STL</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white mb-2" htmlFor="tags">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="3d, model, character, animation"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white mb-2" htmlFor="file">
                3D Model File * (GLB, GLTF, OBJ, FBX, STL)
              </label>
              <input
                id="file"
                type="file"
                required
                accept=".glb,.gltf,.obj,.fbx,.stl,.blend"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {formData.file && (
                <p className="text-green-500 text-sm mt-2">
                  ✓ {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-white mb-2" htmlFor="thumbnail">
                Thumbnail (optional)
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
              />
              {formData.thumbnail && (
                <p className="text-green-500 text-sm mt-2">
                  ✓ {formData.thumbnail.name} selected
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
              >
                {uploading ? 'Uploading...' : 'Upload Model'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
