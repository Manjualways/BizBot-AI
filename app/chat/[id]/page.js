'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import supabase from '@/app/lib/supabase'

export default function ChatPage() {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('bot_id', id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data)
    }
  }

  useEffect(() => {
    if (id) {
      fetchMessages()
    }
  }, [id])

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
      // Save user message
      await supabase.from('messages').insert([
        {
          bot_id: id,
          role: 'user',
          content: text,
        },
      ])

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
      // Save AI reply
      await supabase.from('messages').insert([
        {
          bot_id: id,
          role: 'assistant',
          content: data.reply,
        },
      ])

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
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
      <div className="bg-white border-b px-6 py-4">
        <h1 className="font-bold text-xl">
          Chatbot #{id}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 flex ${msg.role === 'user'
              ? 'justify-end'
              : 'justify-start'
              }`}
          >
            <div
              className={`max-w-xl px-4 py-3 rounded-2xl ${msg.role === 'user'
                ? 'bg-black text-white'
                : 'bg-white'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-4 flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded-lg px-4 py-3"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-6 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}