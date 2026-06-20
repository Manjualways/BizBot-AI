'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    useState,
    useEffect,
    useRef,
} from 'react'

import supabase from '@/app/lib/supabase'

export default function ChatPage() {
    const { id } = useParams()

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [botName, setBotName] = useState('')

    const messagesEndRef = useRef(null)

    // Load previous messages
    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('bot_id', id)
            .order('created_at', {
                ascending: true,
            })

        if (!error && data) {
            setMessages(data)
        }
    }
    const fetchBot = async () => {
        const { data, error } = await supabase
            .from('chatbots')
            .select('name')
            .eq('id', id)
            .single()

        if (!error && data) {
            setBotName(data.name)
        }
    }

    useEffect(() => {
        if (id) {
            fetchMessages()
            fetchBot()
        }
    }, [id])

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [messages, loading])

    // Send message
    const sendMessage = async () => {
        if (!input.trim()) return

        const text = input

        const userMessage = {
            role: 'user',
            content: text,
        }

        setMessages((prev) => [...prev, userMessage])

        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    botId: id,
                    message: text,
                }),
            })

            const data = await res.json()

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply,
                    sources: data.sources || [],
                },
            ])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">

            {/* Header */}

            <div className="bg-white border-b shadow-sm px-6 py-4">
                <div className="max-w-4xl mx-auto text-center">

                    <h1 className="text-3xl font-bold">
                        🤖 {botName}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Public AI Assistant
                    </p>

                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">

                    {messages.length === 0 && (
                        <div className="text-center mt-20">
                            <h2 className="text-3xl font-bold">
                                Welcome to BizBot AI 🚀
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Ask anything about your uploaded documents.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`mb-6 flex ${msg.role === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-2xl px-5 py-4 rounded-3xl shadow ${msg.role === 'user'
                                    ? 'bg-black text-white'
                                    : 'bg-white'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">
                                    {msg.content}
                                </p>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 border-t pt-3">
                                        <p className="text-xs font-bold text-gray-500">
                                            Sources
                                        </p>

                                        {msg.sources.map((source) => (
                                            <div
                                                key={source.number}
                                                className="mt-2 bg-gray-100 rounded-xl p-3 text-xs"
                                            >
                                                <p className="font-semibold text-black">
                                                    📄 {source.filename}
                                                </p>

                                                <p className="text-gray-600 mt-1">
                                                    {source.preview}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading animation */}
                    {loading && (
                        <div className="flex justify-start mb-6">
                            <div className="bg-white px-5 py-4 rounded-3xl shadow">

                                <div className="flex gap-2 text-xl">
                                    <span className="animate-bounce">
                                        ●
                                    </span>

                                    <span
                                        className="animate-bounce"
                                        style={{
                                            animationDelay: '0.2s',
                                        }}
                                    >
                                        ●
                                    </span>

                                    <span
                                        className="animate-bounce"
                                        style={{
                                            animationDelay: '0.4s',
                                        }}
                                    >
                                        ●
                                    </span>
                                </div>

                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />

                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">
                <div className="max-w-4xl mx-auto flex gap-3">

                    <input
                        value={input}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                        placeholder="Ask BizBot AI anything..."
                        className="flex-1 border rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage()
                            }
                        }}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-black text-white px-8 rounded-2xl hover:bg-gray-800 disabled:opacity-50"
                    >
                        Send
                    </button>

                </div>
            </div>

        </div>
    )
}