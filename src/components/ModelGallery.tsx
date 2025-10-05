'use client';

import { useEffect, useState } from 'react';
import ModelCard from './ModelCard';

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
  createdAt: string;
}

interface ModelGalleryProps {
  searchQuery?: string;
}

export default function ModelGallery({ searchQuery = '' }: ModelGalleryProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/models?page=${page}&limit=12&search=${searchQuery}`
      );
      const data = await response.json();

      if (data.success) {
        setModels(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  return (
    <div className="w-full">
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading models...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No models found</p>
        </div>
      ) : (
        <>
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => (
              <ModelCard key={model._id} model={model} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-black dark:text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-black dark:text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed text-black dark:text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
