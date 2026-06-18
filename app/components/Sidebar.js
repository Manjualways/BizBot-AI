'use client'

import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useRouter } from "next/navigation"
import useAuth from "../hooks/useAuth"

export default function Sidebar() {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-10">BizBot AI</h1>
      <nav className="flex flex-col gap-2">
        <a href="/dashboard" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-black font-medium">
          🤖 My Chatbots
        </a>
        <a href="#" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:text-black transition">
          📊 Analytics
        </a>
        <a href="#" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:text-black transition">
          ⚙️ Settings
        </a>
        <a href="#" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:text-black transition">
          💳 Billing
        </a>
      </nav>
      <div className="mt-auto border-t border-gray-700 pt-6">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="text-sm font-medium truncate">
          {user ? user.email : "Loading..."}
        </p>
        <button 
          onClick={handleLogout} 
          className="text-left text-sm text-red-400 hover:text-red-300 mt-2 block w-full bg-transparent border-0 cursor-pointer p-0"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}