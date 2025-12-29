'use client';

import { useState, useEffect } from 'react';

interface PasteData {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export default function PasteDisplay({ id }: { id: string }) {
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`/api/pastes/${id}`);

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Paste not found');
          setLoading(false);
          return;
        }

        const data: PasteData = await response.json();
        setPaste(data);
      } catch (err) {
        setError('Failed to load paste');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  const copyToClipboard = () => {
    if (paste?.content) {
      navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="text-6xl animate-bounce">📄</div>
        <p className="text-gray-600 font-semibold">Loading paste...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">❌</span> Error
        </h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="p-6 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 rounded-lg">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">⚠️</span> Paste Not Found
        </h2>
        <p className="text-yellow-600">
          The paste you're looking for doesn't exist, has expired, or the view limit has been exceeded.
        </p>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getTimeUntilExpiry = (isoString: string) => {
    const now = new Date();
    const expiry = new Date(isoString);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff < 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-300 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📝</span> Paste Content
          </h2>
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition transform hover:scale-105 active:scale-95 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-words text-gray-800 bg-white p-4 rounded-lg border border-gray-200 overflow-auto max-h-64 font-mono text-sm leading-relaxed">
          {paste.content}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paste.remaining_views !== null && (
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition">
            <p className="text-sm text-blue-600 font-semibold flex items-center gap-2 mb-2">
              <span className="text-xl">👀</span> Remaining Views
            </p>
            <p className="text-3xl font-bold text-blue-700">{paste.remaining_views}</p>
            {paste.remaining_views === 0 && (
              <p className="text-xs text-red-600 mt-1 font-semibold">Last view!</p>
            )}
          </div>
        )}

        {paste.expires_at && (
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg shadow-sm hover:shadow-md transition">
            <p className="text-sm text-purple-600 font-semibold flex items-center gap-2 mb-2">
              <span className="text-xl">⏰</span> Expires At
            </p>
            <p className="text-sm font-semibold text-purple-700">
              {formatDate(paste.expires_at)}
            </p>
            <p className="text-xs text-purple-600 mt-2">
              {getTimeUntilExpiry(paste.expires_at)}
            </p>
          </div>
        )}
      </div>

      <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 rounded-lg">
        <p className="text-sm text-gray-700 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <span>
            <strong>Share this link:</strong> Paste the URL in your browser address bar to share it with others.
            {paste.remaining_views !== null && (
              <span className="block mt-2 text-indigo-700 font-semibold">
                ✨ This paste can be viewed <strong>{paste.remaining_views + 1}</strong> more time{paste.remaining_views !== 0 ? 's' : ''}.
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
}
