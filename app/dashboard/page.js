'use client'

import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabase'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const [bots, setBots] = useState([])
  const [botName, setBotName] = useState('')

  const fetchBots = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.uid)

    if (!error) setBots(data)
  }

  const createBot = async () => {
    if (!botName) return alert("Enter bot name")
    if (!user) return alert("User not loaded")

    const { error } = await supabase
      .from('chatbots')
      .insert([
        {
          name: botName,
          user_id: user.uid,
        },
      ])

    if (error) {
      alert(error.message)
    } else {
      setBotName('')
      fetchBots()
    }
  }

  useEffect(() => {
    fetchBots()
  }, [user])

  if (loading) return <p className="p-10">Loading...</p>
  if (!user) return <p className="p-10">Please login</p>

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-10 bg-gray-50 min-h-screen">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">My Chatbots</h1>
            <p className="text-gray-500 mt-1">Manage your AI assistants</p>
          </div>

          <div className="flex gap-2">
            <input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Bot name"
              className="border px-3 py-2 rounded"
            />
            <button
              onClick={createBot}
              className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"
            >
              Create
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Chatbots</p>
            <p className="text-4xl font-bold mt-1">{bots.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white p-6 rounded-2xl shadow-sm">

              <div className="flex items-center justify-between mb-4">
                <a href={`/chat/${bot.id}`} className="text-lg font-bold hover:underline">
  {bot.name}
</a>

                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  Active
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                AI chatbot for your business
              </p>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}