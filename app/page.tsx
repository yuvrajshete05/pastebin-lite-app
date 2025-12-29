import CreatePasteForm from '@/components/CreatePasteForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pastebin Lite
          </h1>
          <p className="text-lg text-gray-600">
            Share your text snippets with optional expiry and view limits
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create a New Paste
          </h2>
          <CreatePasteForm />
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Privacy
            </h3>
            <p className="text-gray-600 text-sm">
              Keep your pastes secure with optional view limits and expiry times
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Auto Expiry
            </h3>
            <p className="text-gray-600 text-sm">
              Set a time-to-live for your paste, and it automatically disappears
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">👀</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              View Limits
            </h3>
            <p className="text-gray-600 text-sm">
              Control how many times your paste can be viewed
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}