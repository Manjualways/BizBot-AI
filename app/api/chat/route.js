import supabase from '@/app/lib/supabase'

export async function POST(req) {
  try {
    const { message, botId } = await req.json()

    // Load chunks for this bot
    const words = message
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 2)

    let allChunks = []

    for (const word of words) {
      const { data } = await supabase
        .from('document_chunks')
        .select('*')
        .eq('bot_id', botId)
        .ilike('chunk_text', `%${word}%`)
        .limit(3)

      if (data) {
        allChunks.push(...data)
      }
    }
    const uniqueChunks = [
      ...new Map(
        allChunks.map(chunk => [chunk.id, chunk])
      ).values(),
    ]
    console.log(
      uniqueChunks.map(c => c.chunk_text.substring(0, 200))
    )

    const knowledgeBase =
      uniqueChunks
        .slice(0, 3)
        .map(chunk => chunk.chunk_text)
        .join('\n\n')
    console.log("KNOWLEDGE PREVIEW:")
    console.log(knowledgeBase.substring(0, 2000))
    console.log('WORDS:', words)
    console.log('CHUNKS FOUND:', uniqueChunks.length)
    console.log('KNOWLEDGE LENGTH:', knowledgeBase.length)

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'BizBot AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: `
You are a helpful AI assistant.

Use ONLY the information in the knowledge base below.

If the answer exists in the knowledge base, answer directly.

Never say:
- I cannot access PDFs
- I cannot access documents
- Please upload the document

KNOWLEDGE BASE:

${knowledgeBase}

END OF KNOWLEDGE BASE
`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
        }),
      }
    )

    const data = await response.json()

    console.log(
      'MODEL REPLY:',
      data?.choices?.[0]?.message?.content
    )

    if (!response.ok) {
      return Response.json({
        reply:
          data?.error?.message ||
          'OpenRouter request failed',
      })
    }

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      'No response from AI'

    const sources = uniqueChunks
      .slice(0, 3)
      .map((chunk, index) => ({
        number: index + 1,
        preview: chunk.chunk_text.substring(0, 100),
      }))

    return Response.json({
      reply: aiReply,
      sources,
    })
  } catch (error) {
    console.error('API ERROR:', error)

    return Response.json({
      reply: `Server Error: ${error.message}`,
    })
  }
}