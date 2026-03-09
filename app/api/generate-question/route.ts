import { NextRequest, NextResponse } from 'next/server'

const mockQuestions = [
  '能告诉我这个记忆发生在什么时候吗？',
  '当时还有其他人在场吗？',
  '这件事对你最大的影响是什么？'
]

export async function POST(request: NextRequest) {
  try {
    const { memory, previousQuestions, previousAnswers } = await request.json()

    const apiKey = process.env.KIMI_API_KEY
    const apiUrl = process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1/chat/completions'
    const modelName = process.env.KIMI_MODEL || 'moonshot-v1-8k'

    if (!apiKey || apiKey.includes('your') || apiKey.includes('你的')) {
      console.log('使用模拟问题（未配置 API Key）')
      const questionIndex = previousQuestions?.length || 0
      return NextResponse.json({ question: mockQuestions[questionIndex] || mockQuestions[0] })
    }

    let systemPrompt = `你是一个善于倾听和提问的故事采访者。用户分享了一段记忆，请你提出一个深入的问题来帮助挖掘更多细节。

用户的原始记忆：${memory}

请只提出一个问题，简洁明了，不超过30个字。`

    if (previousQuestions && previousQuestions.length > 0) {
      const history = previousQuestions.map((q: string, i: number) => 
        `问题${i + 1}: ${q}\n回答${i + 1}: ${previousAnswers[i] || ''}`
      ).join('\n\n')
      
      systemPrompt = `你是一个善于倾听和提问的故事采访者。用户分享了一段记忆，并且已经回答了一些问题。请根据之前的对话提出下一个深入的问题。

用户的原始记忆：${memory}

之前的对话：
${history}

请只提出一个问题，简洁明了，不超过30个字。不要重复之前的问题。`
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Kimi API error:', errorData)
      console.log('API 调用失败，使用模拟问题')
      const questionIndex = previousQuestions?.length || 0
      return NextResponse.json({ question: mockQuestions[questionIndex] || mockQuestions[0] })
    }

    const data = await response.json()
    const question = data.choices[0].message.content.trim()

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error in generate-question API:', error)
    console.log('发生错误，使用模拟问题')
    const { previousQuestions } = await request.json()
    const questionIndex = previousQuestions?.length || 0
    return NextResponse.json({ question: mockQuestions[questionIndex] || mockQuestions[0] })
  }
}
