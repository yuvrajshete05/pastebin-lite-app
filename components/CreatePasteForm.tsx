'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePasteForm() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate content
      if (!content.trim()) {
        setError('Content cannot be empty');
        setLoading(false);
        return;
      }

      // Validate ttl_seconds
      let ttlValue: number | undefined;
      if (ttlSeconds) {
        ttlValue = parseInt(ttlSeconds, 10);
        if (isNaN(ttlValue) || ttlValue < 1) {
          setError('TTL must be a positive number');
          setLoading(false);
          return;
        }
      }

      // Validate max_views
      let maxViewsValue: number | undefined;
      if (maxViews) {
        maxViewsValue = parseInt(maxViews, 10);
        if (isNaN(maxViewsValue) || maxViewsValue < 1) {
          setError('Max views must be a positive number');
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlValue,
          max_views: maxViewsValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        setLoading(false);
        return;
      }

      setSuccess(`Paste created successfully!`);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');

      // Redirect to paste view after 1 second
      setTimeout(() => {
        router.push(`/p/${data.id}`);
      }, 1000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Paste Content *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here..."
          rows={10}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ttl" className="block text-sm font-medium text-gray-700">
            TTL (seconds) - Optional
          </label>
          <input
            id="ttl"
            type="number"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            placeholder="e.g., 3600 (1 hour)"
            min="1"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            How long until paste expires (in seconds)
          </p>
        </div>

        <div>
          <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700">
            Max Views - Optional
          </label>
          <input
            id="maxViews"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="e.g., 5"
            min="1"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            How many times the paste can be viewed
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Creating...' : 'Create Paste'}
      </button>
    </form>
  );
}
