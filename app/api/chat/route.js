import supabase from '@/app/lib/supabase'

export async function POST(req) {
  try {
    const { message, botId } = await req.json()

    // Save user message
    await supabase.from('messages').insert([
      {
        bot_id: botId,
        role: 'user',
        content: message,
      },
    ])

    // Retrieve relevant chunks
    const words = message
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter((word) => word.length > 2)

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
        allChunks.map((chunk) => [chunk.id, chunk])
      ).values(),
    ]

    const knowledgeBase =
      uniqueChunks
        .slice(0, 5)
        .map((chunk) => chunk.chunk_text)
        .join('\n\n') || ''

    console.log('WORDS:', words)
    console.log('CHUNKS FOUND:', uniqueChunks.length)
    console.log('KNOWLEDGE LENGTH:', knowledgeBase.length)

    // Load conversation history
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('bot_id', botId)
      .order('created_at', {
        ascending: false,
      })
      .limit(20)

    const conversationHistory =
      previousMessages
        ?.reverse()
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        })) || []

    console.log(
      'CONVERSATION HISTORY:',
      conversationHistory
    )

    // System prompt
    const systemPrompt = `
You are a helpful AI assistant.

You have access to:

1. Previous conversation history.
2. A knowledge base from uploaded documents.

RULES:

- ALWAYS remember information shared by the user earlier.
- Previous conversation history has the highest priority.
- Use the knowledge base for document-related questions.
- If the user asks about something they mentioned before, answer from memory.
- Only say "I cannot answer this question based on the available information"
  if the answer is not present in either the conversation history or the knowledge base.

Never say:
- I cannot access PDFs
- I cannot access documents
- I do not remember previous conversations

KNOWLEDGE BASE:

${knowledgeBase}
`

    console.log(
      'KEY EXISTS:',
      !!process.env.OPENROUTER_API_KEY
    )

    console.log(
      'KEY LENGTH:',
      process.env.OPENROUTER_API_KEY?.length
    )

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
              content: systemPrompt,
            },

            ...conversationHistory,

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
      console.log(data)

      return Response.json({
        reply:
          data?.error?.message ||
          'OpenRouter request failed',
      })
    }

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      'No response from AI'

    // Save assistant message
    await supabase.from('messages').insert([
      {
        bot_id: botId,
        role: 'assistant',
        content: aiReply,
      },
    ])

    // Prepare sources
    const sources = uniqueChunks
      .slice(0, 3)
      .map((chunk, index) => ({
        number: index + 1,
        filename:
          chunk.filename || 'Unknown Document',
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