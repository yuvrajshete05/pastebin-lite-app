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
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-600">Loading paste...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <h2 className="text-lg font-semibold mb-2">Paste Not Found</h2>
        <p>The paste you're looking for doesn't exist or has expired.</p>
      </div>
    );
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Paste Content</h2>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-words text-gray-700 bg-white p-4 rounded border border-gray-200 overflow-auto max-h-96">
          {paste.content}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paste.remaining_views !== null && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-600">Remaining Views</p>
            <p className="text-2xl font-bold text-blue-600">{paste.remaining_views}</p>
          </div>
        )}

        {paste.expires_at && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-gray-600">Expires At</p>
            <p className="text-sm font-semibold text-purple-600">
              {formatDate(paste.expires_at)}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Share the URL in your browser to let others view this paste.
          {paste.remaining_views !== null &&
            ` This paste can be viewed ${paste.remaining_views} more time${
              paste.remaining_views !== 1 ? 's' : ''
            }.`}
        </p>
      </div>
    </div>
  );
}
