'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

function DemoChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    const text = message

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text,
      },
    ])

    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/demo-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.reply,
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Unable to generate response.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-3xl border shadow-xl mt-12">

      <h3 className="font-bold text-2xl mb-6">
        🤖 Live AI Demo
      </h3>

      <div className="space-y-3 h-72 overflow-y-auto mb-6">

        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Ask anything to experience BizBot AI.
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p - 4 rounded - 2xl ${msg.role === 'user'
              ? 'bg-gray-200 ml-auto max-w-[80%]'
              : 'bg-black text-white mr-auto max-w-[80%]'
              } `}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-black text-white p-4 rounded-2xl max-w-[80%]">
            Thinking...
          </div>
        )}

      </div>

      <div className="flex gap-3">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask BizBot AI anything..."
          className="flex-1 border px-4 py-3 rounded-xl outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 text-black">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold">
          BizBot AI
        </h1>

        <div className="flex gap-8 items-center">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Login</Link>

          <Link
            href="/signup"
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </nav >


      <section className="text-center py-32 px-6 relative overflow-hidden">

        <div className="absolute w-[600px] h-[600px] bg-purple-300 opacity-20 blur-3xl rounded-full top-0 left-1/2 -translate-x-1/2"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8">
          AI Chatbots <br />
          That Grow Your Business
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Create intelligent AI assistants powered by your own knowledge base.
        </p>

        <div className="flex justify-center gap-4 mb-16">

          <Link
            href="/signup"
            className="bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Start Free
          </Link>

          <button
            onClick={() =>
              document
                .getElementById('live-demo')
                ?.scrollIntoView({
                  behavior: 'smooth',
                })
            }
            className="border px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition"
          >
            View Demo
          </button>

        </div>

        <div className="flex justify-center gap-16 flex-wrap">
          <div>
            <h3 className="text-4xl font-bold">500+</h3>
            <p className="text-gray-500">Bots Created</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">10K+</h3>
            <p className="text-gray-500">Questions Answered</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">99.9%</h3>
            <p className="text-gray-500">Uptime</p>
          </div>
        </div>
      </section>

      {/* TRUSTED */}
      <section className="py-20 text-center">
        <p className="uppercase tracking-widest text-gray-500 mb-10">
          Trusted By Modern Teams
        </p>

        <div className="flex justify-center gap-12 text-3xl font-bold text-gray-400 flex-wrap">
          <span>Google</span>
          <span>Microsoft</span>
          <span>Amazon</span>
          <span>IBM</span>
          <span>OpenAI</span>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-28 px-10"
      >
        <h2 className="text-5xl font-bold text-center mb-20">
          Why Choose BizBot AI?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            ['🤖', 'Smart AI Bots'],
            ['📄', 'PDF Knowledge Base'],
            ['🧠', 'Conversation Memory'],
            ['⚡', 'Lightning Fast'],
            ['🔒', 'Secure & Reliable'],
            ['🌍', 'Easy Integration'],
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white/70 backdrop-blur border shadow-lg hover:-translate-y-2 transition"
            >
              <div className="text-5xl mb-4">
                {item[0]}
              </div>

              <h3 className="font-bold text-xl mb-3">
                {item[1]}
              </h3>

              <p className="text-gray-600">
                Build AI experiences effortlessly with modern technology.
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-28 text-center">
        <h2 className="text-5xl font-bold mb-20">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto px-10">

          <div>
            <div className="text-6xl mb-4">1️⃣</div>
            <h3 className="font-bold">Create Bot</h3>
          </div>

          <div>
            <div className="text-6xl mb-4">2️⃣</div>
            <h3 className="font-bold">Upload Documents</h3>
          </div>

          <div>
            <div className="text-6xl mb-4">3️⃣</div>
            <h3 className="font-bold">Train AI</h3>
          </div>

          <div>
            <div className="text-6xl mb-4">4️⃣</div>
            <h3 className="font-bold">Deploy Anywhere</h3>
          </div>

        </div>
      </section>

      {/* DEMO */}
      <section
        id="live-demo"
        className="py-28 px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">
            Try BizBot AI Live
          </h2>

          <p className="text-gray-600 text-lg">
            Experience the power of AI instantly.
          </p>
        </div>

        <DemoChat />
      </section>


      {/* TESTIMONIALS */}
      <section className="py-28 px-10">
        <h2 className="text-5xl font-bold text-center mb-20">
          Loved By Developers
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            'BizBot AI transformed our support workflow.',
            'Very easy to use and extremely powerful.',
            'A fantastic AI SaaS project with great UX.',
          ].map((review, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow"
            >
              <div className="text-yellow-500 text-xl">
                ★★★★★
              </div>

              <p className="mt-4 text-gray-600">
                {review}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="text-center py-28"
      >
        <h2 className="text-5xl font-bold mb-16">
          Pricing
        </h2>

        <div className="flex justify-center gap-8 flex-wrap">

          <div className="bg-white p-10 rounded-3xl shadow w-72">
            <h3 className="font-bold text-2xl">
              Free
            </h3>

            <p className="text-5xl font-bold my-6">
              $0
            </p>

            <p>Basic chatbot features</p>
          </div>

          <div className="bg-black text-white p-10 rounded-3xl shadow w-72 scale-105">
            <h3 className="font-bold text-2xl">
              Pro
            </h3>

            <p className="text-5xl font-bold my-6">
              $19/mo
            </p>

            <p>Advanced AI capabilities</p>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-10">
        <h2 className="text-5xl font-bold text-center mb-16">
          FAQ
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold">
              Can I upload PDFs?
            </h3>

            <p className="text-gray-600 mt-2">
              Yes, PDF and TXT documents are supported.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold">
              Can I create multiple bots?
            </h3>

            <p className="text-gray-600 mt-2">
              Yes, you can create and manage multiple chatbots.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-32">
        <h2 className="text-6xl font-bold mb-8">
          Start Building Today
        </h2>

        <Link
          href="/signup"
          className="bg-black text-white px-10 py-5 rounded-2xl text-lg"
        >
          Get Started Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-gray-500">
        © 2026 BizBot AI — Built with ❤️ by Manjunath
      </footer>

    </div >
  )
}