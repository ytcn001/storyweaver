'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function generateStory(memory: string, answers: string[]) {
  return `这是一个关于${memory}的故事。

${answers[0] || '那是一个特别的时刻'}，${memory}。${answers[1] || '周围的一切仿佛都静止了'}，只有这个记忆在心中深深烙印。${answers[2] || '从那以后，这个经历一直影响着我，让我明白了生活中最珍贵的东西是什么。'}

时光荏苒，岁月如梭。每当我回想起这段往事，心中总是充满了感激。那些看似平凡的瞬间，却成为了我生命中最宝贵的财富。${memory}不仅仅是一段回忆，更是我成长道路上的一盏明灯，照亮我前行的方向。

在这个快节奏的世界里，我们常常忘记了停下来，去感受那些微小却真实的幸福。而这个故事，就是我对那段美好时光的致敬。它提醒我，无论走到哪里，都不要忘记初心，不要忘记那些曾经感动过我们的人和事。

也许有一天，我会把这个故事讲给更多的人听，让他们也感受到这份温暖和力量。因为我相信，每一个真实的故事，都有改变世界的可能。而这个故事，就从${memory}开始。`
}

export default function Result() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataParam = searchParams.get('data')
  
  const [data, setData] = useState<{ memory: string; answers: string[] } | null>(null)
  const [story, setStory] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!dataParam) {
      router.push('/')
      return
    }
    try {
      const parsedData = JSON.parse(decodeURIComponent(dataParam))
      setData(parsedData)
      setTimeout(() => {
        const generatedStory = generateStory(parsedData.memory, parsedData.answers)
        setStory(generatedStory)
        setIsGenerating(false)
      }, 2000)
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