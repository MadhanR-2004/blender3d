'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  title: string;
  description: string;
  tags: string;
}

export default function EditModelPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tags: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const fetchModel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${modelId}`);
      const data = await response.json();

      if (data.success) {
        const model = data.data;
        setFormData({
          title: model.title,
          description: model.description,
          tags: model.tags.join(', '),
        });
      } else {
        alert('Model not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching model:', error);
      alert('Failed to load model');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      const response = await fetch(`/api/models/${modelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update model');
      }

      alert('Model updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Failed to update model: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Loading model...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">Edit Model</h1>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white mb-2" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter model title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter model description"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white mb-2" htmlFor="tags">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tags separated by commas (e.g., architecture, furniture, game-ready)"
              />
              <p className="text-gray-400 text-sm mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Note about file */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> You cannot change the 3D model file. To upload a different file, please delete this model and upload a new one.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
