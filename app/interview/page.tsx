'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Typewriter from '@/components/Typewriter'

const TOTAL_QUESTIONS = 3

export default function Interview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const memory = searchParams.get('memory') || ''
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateQuestion = async () => {
    setIsThinking(true)
    setError(null)
    setShowQuestion(false)
    
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memory,
          previousQuestions: questions,
          previousAnswers: answers
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate question')
      }

      const data = await response.json()
      setQuestions(prev => [...prev, data.question])
      setIsThinking(false)
      setShowQuestion(true)
    } catch (err) {
      console.error('Error generating question:', err)
      setError(err instanceof Error ? err.message : '生成问题失败')
      setIsThinking(false)
    }
  }

  useEffect(() => {
    if (!memory) {
      router.push('/')
      return
    }
    generateQuestion()
  }, [memory, router])

  const handleNext = async () => {
    if (currentAnswer.trim()) {
      const newAnswers = [...answers, currentAnswer]
      setAnswers(newAnswers)
      
      if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setCurrentAnswer('')
        await generateQuestion()
      } else {
        const allData = {
          memory,
          answers: newAnswers
        }
        router.push(`/result?data=${encodeURIComponent(JSON.stringify(allData))}`)
      }
    }
  }

  if (!memory) {
    return null
  }

  return (
    <main className="min-h-screen bg-warm-beige p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          AI 访谈
        </h1>
        
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx <= currentQuestionIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
              <button
                onClick={generateQuestion}
                className="mt-2 text-sm underline"
              >
                重试
              </button>
            </div>
          )}

          {isThinking ? (
            <div className="bg-white/80 rounded-lg p-6 text-center">
              <p className="text-lg text-gray-600">正在思考...</p>
            </div>
          ) : showQuestion && questions[currentQuestionIndex] ? (
            <>
              <div className="bg-white/80 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    AI
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">StoryWeaver AI</p>
                    <p className="text-lg">
                      <Typewriter text={questions[currentQuestionIndex]} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-lg p-6">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="写下你的回答..."
                  className="w-full h-32 p-4 text-lg border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-gray-600 font-serif"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim() || isThinking}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-serif"
                  >
                    {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? '继续' : '完成访谈'}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  )
}