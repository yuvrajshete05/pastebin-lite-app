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

      setSuccess(`✨ Paste created! Redirecting...`);
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

  const charCount = content.length;
  const charLimit = 10000;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
          Paste Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your text here... (code, notes, etc.)"
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition hover:border-gray-400 text-gray-900 bg-white"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-2">
          {content.length} characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ttl" className="block text-sm font-semibold text-gray-700 mb-2">
            ⏰ TTL (seconds) - Optional
          </label>
          <input
            id="ttl"
            type="number"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            placeholder="e.g., 3600 (1 hour)"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition hover:border-gray-400 text-gray-900 bg-white"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Paste expires after this many seconds
          </p>
        </div>

        <div>
          <label htmlFor="maxViews" className="block text-sm font-semibold text-gray-700 mb-2">
            👀 Max Views - Optional
          </label>
          <input
            id="maxViews"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="e.g., 5"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition hover:border-gray-400 text-gray-900 bg-white"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Paste becomes unavailable after this many views
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3 animate-pulse">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3 animate-pulse">
          <span className="text-xl">✅</span>
          <p className="font-semibold">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⏳</span>
            Creating Paste...
          </>
        ) : (
          <>
            <span>✨</span>
            Create Paste
          </>
        )}
      </button>
    </form>
  );
}
