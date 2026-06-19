export async function POST(req) {
    try {
        console.log('DEMO CHAT API HIT')

        const { message } = await req.json()

        console.log('MESSAGE:', message)
        export async function POST(req) {
            try {
                const { message } = await req.json()

                if (!message) {
                    return Response.json({
                        reply: 'Please enter a message.',
                    })
                }

                const response = await fetch(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY} `,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'http://localhost:3000',
                            'X-Title': 'BizBot AI Demo',
                        },
                        body: JSON.stringify({
                            model: 'google/gemini-2.5-flash',
                            max_tokens: 300,

                            messages: [
                                {
                                    role: 'system',
                                    content: `
You are BizBot AI Demo Assistant.

Your job is to demonstrate the capabilities of BizBot AI.

    Rules:
- Be friendly and professional.
- Keep responses concise.
- Showcase how AI assistants can help businesses.
- Answer general questions naturally.
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

                if (!response.ok) {
                    return Response.json({
                        reply:
                            data?.error?.message ||
                            'OpenRouter request failed.',
                    })
                }

                return Response.json({
                    reply:
                        data?.choices?.[0]?.message?.content ||
                        'No response generated.',
                })
            } catch (error) {
                console.error(error)

                return Response.json({
                    reply: 'Something went wrong.',
                })
            }
        }

