import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">AI Career Chat</h1>
        </div>

        {/* Chat Interface Demo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Career Coach AI</span>
              <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-blue-50 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800">
                  Hello! I'm your AI career coach. I can help you with career planning, 
                  skill development, and professional growth. What would you like to discuss today?
                </p>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              <p>🚧 Demo Mode - Full chat functionality coming soon!</p>
              <p className="mt-2">This will integrate with OpenRouter AI for real conversations.</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type your message here..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">
            To enable full chat functionality, configure your OpenRouter API key in environment variables.
          </p>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 