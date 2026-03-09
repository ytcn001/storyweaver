import { NextRequest, NextResponse } from 'next/server'

function generateMockStory(memory: string, answers: string[]) {
  return `这是一个关于${memory}的故事。

${answers[0] || '那是一个特别的时刻'}，${memory}。${answers[1] || '周围的一切仿佛都静止了'}，只有这个记忆在心中深深烙印。${answers[2] || '从那以后，这个经历一直影响着我，让我明白了生活中最珍贵的东西是什么。'}

时光荏苒，岁月如梭。每当我回想起这段往事，心中总是充满了感激。那些看似平凡的瞬间，却成为了我生命中最宝贵的财富。${memory}不仅仅是一段回忆，更是我成长道路上的一盏明灯，照亮我前行的方向。

在这个快节奏的世界里，我们常常忘记了停下来，去感受那些微小却真实的幸福。而这个故事，就是我对那段美好时光的致敬。它提醒我，无论走到哪里，都不要忘记初心，不要忘记那些曾经感动过我们的人和事。

也许有一天，我会把这个故事讲给更多的人听，让他们也感受到这份温暖和力量。因为我相信，每一个真实的故事，都有改变世界的可能。而这个故事，就从${memory}开始。`
}

export async function POST(request: NextRequest) {
  try {
    const { memory, answers } = await request.json()

    const apiKey = process.env.KIMI_API_KEY
    const apiUrl = process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1/chat/completions'
    const modelName = process.env.KIMI_MODEL || 'moonshot-v1-8k'

    if (!apiKey || apiKey.includes('your') || apiKey.includes('你的')) {
      console.log('使用模拟故事（未配置 API Key）')
      return NextResponse.json({ story: generateMockStory(memory, answers) })
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
        model: modelName,
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
      console.log('API 调用失败，使用模拟故事')
      return NextResponse.json({ story: generateMockStory(memory, answers) })
    }

    const data = await response.json()
    const story = data.choices[0].message.content.trim()

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error in generate-story API:', error)
    console.log('发生错误，使用模拟故事')
    const { memory, answers } = await request.json()
    return NextResponse.json({ story: generateMockStory(memory, answers) })
  }
}
