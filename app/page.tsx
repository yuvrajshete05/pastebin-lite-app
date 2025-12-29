import CreatePasteForm from '@/components/CreatePasteForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-block mb-6">
              <div className="text-6xl animate-bounce">✨</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Pastebin Lite
            </h1>
            <p className="text-xl text-blue-100 max-w-xl mx-auto">
              🚀 Share your text instantly with optional expiry and view limits
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-3xl">📝</span>
              Create a New Paste
            </h2>
            <CreatePasteForm />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Privacy First
              </h3>
              <p className="text-blue-100 text-sm">
                Control who sees your content with view limits and time-based expiry
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Auto Expiry
              </h3>
              <p className="text-blue-100 text-sm">
                Pastes automatically disappear after a set time - no manual cleanup needed
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-5xl mb-4">👀</div>
              <h3 className="text-xl font-bold text-white mb-3">
                View Limits
              </h3>
              <p className="text-blue-100 text-sm">
                Set exactly how many times your paste can be viewed
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Why Pastebin Lite?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-blue-100">⚡ Fast & Reliable</div>
              <div className="text-blue-100">🔐 Secure Storage</div>
              <div className="text-blue-100">🎯 Simple to Use</div>
              <div className="text-blue-100">🌍 Shareable Links</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}