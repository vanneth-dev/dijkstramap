import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <h1 className="text-8xl md:text-9xl font-bold text-white animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-gray-500 opacity-20 blur-sm">
            404
          </div>
        </div>

        {/* Glitch effect text */}
        <div className="mb-6 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative">
            Page Not Found
            <span className="absolute inset-0 text-gray-400 opacity-50 animate-ping">
              Page Not Found
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the digital void. 
            It might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-900/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-900/50"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Home
          </button>
        </div>

        {/* Search suggestion */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Quick Search</h3>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Home', 'About', 'Services', 'Contact', 'Blog'].map((item) => (
              <button
                key={item}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-all duration-300 hover:scale-105"
                onClick={() => console.log(`Navigate to ${item}`)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-8 text-gray-400 text-sm">
          Error Code: 404 • Page Not Found
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;