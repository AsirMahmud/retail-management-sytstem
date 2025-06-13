import { Settings, Sparkles } from "lucide-react";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-full inline-block mb-8">
              <Settings className="w-20 h-20 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
            <p className="text-2xl text-gray-700 font-medium">Coming Soon</p>
            <Sparkles className="w-5 h-5 text-yellow-500 animate-bounce" />
          </div>
          <p className="text-base text-gray-500 mt-2 max-w-md mx-auto">
            We're crafting something extraordinary for you. Stay tuned for an
            amazing experience!
          </p>
        </div>
      </div>
    </div>
  );
}
