'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [memory, setMemory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (memory.trim() && memory.length <= 100) {
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/interview?memory=${encodeURIComponent(memory)}`)
      }, 2000)
    }
  }

  return (
    <main className="min-h-screen bg-warm-beige flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
          StoryWeaver
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          分享一段记忆，让AI帮你编织成动人的故事
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="分享一段100字以内的真实记忆"
            className="w-full h-48 p-6 text-lg border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-600 bg-white/80 font-serif"
            maxLength={100}
          />
          <div className="flex justify-between items-center">
            <span className={`text-sm ${memory.length > 90 ? 'text-red-500' : 'text-gray-500'}`}>
              {memory.length}/100
            </span>
            <button
              type="submit"
              disabled={!memory.trim() || memory.length > 100 || isLoading}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-serif text-lg"
            >
              {isLoading ? '正在思考...' : '开始编织'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}