'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Loading 3D viewer...</div>
    </div>
  ),
});

interface Model {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  format: string;
  tags: string[];
  user?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  userId?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  likes: number;
  views: number;
  fileSize: number;
  createdAt: string;
}

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCounted, setViewCounted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchModel = async () => {
    try {
      const modelId = params.id as string;
      
      // Check if view already counted in this session
      const viewedModels = JSON.parse(localStorage.getItem('viewedModels') || '[]');
      const alreadyViewed = viewedModels.includes(modelId);

      // Fetch model data
      const url = alreadyViewed 
        ? `/api/models/${modelId}?skipViewCount=true` 
        : `/api/models/${modelId}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setModel(data.data);
        
        // Mark as viewed in localStorage
        if (!alreadyViewed) {
          viewedModels.push(modelId);
          localStorage.setItem('viewedModels', JSON.stringify(viewedModels));
          setViewCounted(true);
        }
      } else {
        alert('Model not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching model:', error);
      alert('Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDownload = async () => {
    if (!model) return;

    try {
      setDownloading(true);
      
      // Fetch the file
      const response = await fetch(model.fileUrl);
      if (!response.ok) throw new Error('Download failed');
      
      // Get the blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename (extract from title or use default)
      const fileName = `${model.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${model.format.toLowerCase()}`;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading model:', error);
      alert('Failed to download model. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            {/* Outer rotating ring */}
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            {/* Inner pulsing circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-pulse rounded-full h-10 w-10 bg-blue-400"></div>
            </div>
          </div>
          <p className="text-white text-lg font-semibold">Loading model...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Back to Gallery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="h-[600px]">
              <ModelViewer modelUrl={model.fileUrl} format={model.format} />
            </div>
          </div>

          {/* Model Info */}
          <div className="bg-gray-800 rounded-lg p-6 h-fit">
            <h1 className="text-3xl font-bold text-white mb-4">{model.title}</h1>
            
            <div className="mb-4">
              <span className="text-gray-400">By </span>
              <span className="text-white font-semibold">
                {model.user?.name || 
                 (typeof model.userId === 'object' ? model.userId.name : 'Unknown User')}
              </span>
            </div>

            {/* <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                {model.likes}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {model.views}
              </div>
            </div> */}

            <div className="mb-6">
              <h2 className="text-white font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{model.description}</p>
            </div>

            {model.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <h2 className="text-white font-semibold mb-2">Details</h2>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-semibold">{model.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-semibold">
                    {(model.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span className="font-semibold">
                    {new Date(model.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download Model
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
