'use client'

import { useState } from 'react'
import Link from 'next/link'

function DemoChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
    if (!message) return

    const newMessages = [...messages, { role: 'user', text: message }]
    setMessages(newMessages)
    setMessage('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    const data = await res.json()

    setMessages([
      ...newMessages,
      { role: 'ai', text: data.reply },
    ])
  }

  return (
    <div className="max-w-xl mx-auto bg-white/60 backdrop-blur-xl p-6 rounded-2xl border shadow-lg mt-10">
      <p className="text-sm text-gray-500 mb-4">Live AI Demo</p>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl ${
              msg.role === 'user'
                ? 'bg-gray-200'
                : 'bg-black text-white'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className="border px-3 py-2 flex-1 rounded-xl"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 text-black">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-bold">BizBot AI</h1>

        <div className="flex gap-6 items-center">
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="/login">Login</Link>
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-28 px-6 relative">

        <h1 className="text-6xl font-bold mb-6 leading-tight">
          AI Chatbots <br /> That Grow Your Business
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          Build powerful AI assistants for sales, support, and automation.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Start Free
          </Link>

          <Link
            href="/dashboard"
            className="border px-8 py-4 rounded-xl font-semibold"
          >
            View Demo
          </Link>
        </div>

        {/* Glow effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-300 opacity-20 blur-3xl rounded-full"></div>
      </section>

      {/* FEATURES */}
      <section id="features" className="grid md:grid-cols-3 gap-8 px-10 py-20">

        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">
          <h3 className="font-bold text-lg mb-2">🤖 Smart Bots</h3>
          <p className="text-gray-600 text-sm">
            Train bots with your business logic and personality.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">
          <h3 className="font-bold text-lg mb-2">⚡ Fast Responses</h3>
          <p className="text-gray-600 text-sm">
            Real-time AI answers powered by modern models.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur border shadow">
          <h3 className="font-bold text-lg mb-2">🌐 Easy Embed</h3>
          <p className="text-gray-600 text-sm">
            Add chatbot to your website in seconds.
          </p>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-2">Create</h3>
            <p className="text-gray-600 text-sm">Build your AI bot</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Train</h3>
            <p className="text-gray-600 text-sm">Customize responses</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Deploy</h3>
            <p className="text-gray-600 text-sm">Use anywhere instantly</p>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <DemoChat />

      {/* PRICING */}
      <section id="pricing" className="text-center py-20">
        <h2 className="text-3xl font-bold mb-10">Pricing</h2>

        <div className="flex justify-center gap-6 flex-wrap">

          <div className="bg-white p-8 rounded-2xl shadow w-64">
            <h3 className="font-bold">Free</h3>
            <p className="text-3xl font-bold my-4">$0</p>
            <p className="text-sm text-gray-500">Basic features</p>
          </div>

          <div className="bg-black text-white p-8 rounded-2xl shadow w-64">
            <h3 className="font-bold">Pro</h3>
            <p className="text-3xl font-bold my-4">$19/mo</p>
            <p className="text-sm text-gray-300">Advanced AI features</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold mb-6">
          Start building your AI today
        </h2>

        <Link
          href="/signup"
          className="bg-black text-white px-8 py-4 rounded-xl"
        >
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-10">
        © 2026 BizBot AI
      </footer>

    </div>
  )
}