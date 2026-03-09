'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Result() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataParam = searchParams.get('data')
  
  const [data, setData] = useState<{ memory: string; answers: string[] } | null>(null)
  const [story, setStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateStory = async (memory: string, answers: string[]) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memory,
          answers
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate story')
      }

      const data = await response.json()
      setStory(data.story)
      setIsGenerating(false)
    } catch (err) {
      console.error('Error generating story:', err)
      setError(err instanceof Error ? err.message : '生成故事失败')
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (!dataParam) {
      router.push('/')
      return
    }
    try {
      const parsedData = JSON.parse(decodeURIComponent(dataParam))
      setData(parsedData)
      generateStory(parsedData.memory, parsedData.answers)
    } catch (e) {
      router.push('/')
    }
  }, [dataParam, router])

  const handleCopy = () => {
    navigator.clipboard.writeText(story)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartOver = () => {
    router.push('/')
  }

  if (!data) {
    return null
  }

  return (
    <main className="min-h-screen bg-warm-beige p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          你的故事
        </h1>

        {isGenerating ? (
          <div className="bg-white/80 rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600">正在生成你的故事...</p>
          </div>
        ) : error ? (
          <div className="bg-white/80 rounded-lg p-12 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={() => data && generateStory(data.memory, data.answers)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-serif"
            >
              重试
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="flex-1 bg-white/80 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">原始记忆</h2>
                <p className="text-lg leading-relaxed text-gray-700">{data.memory}</p>
              </div>

              <div className="flex-1 bg-white/80 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">AI 生成故事</h2>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    {copied ? '已复制!' : '复制'}
                  </button>
                </div>
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{story}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartOver}
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-serif text-lg"
              >
                开始新故事
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}