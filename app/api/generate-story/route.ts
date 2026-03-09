import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { memory, answers } = await request.json()

    const apiKey = process.env.KIMI_API_KEY
    const apiUrl = process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1/chat/completions'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const answersText = answers.map((a: string, i: number) => 
      `问题${i + 1}的回答：${a}`
    ).join('\n\n')

    const systemPrompt = `你是一个优秀的故事作家。请根据用户提供的记忆和访谈回答，创作一篇约800字的动人故事。

用户的原始记忆：${memory}

访谈回答：
${answersText}

要求：
1. 故事要真实、感人，有细节描写
2. 约800字左右
3. 使用第一人称"我"来叙述
4. 语言优美，富有感染力
5. 不需要标题，直接开始故事`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Kimi API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate story', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const story = data.choices[0].message.content.trim()

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error in generate-story API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
