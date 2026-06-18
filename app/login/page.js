'use client'
import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Login successful!")
      router.push('/dashboard')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-md">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Log in to your BizBot AI account</p>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-black"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 mt-2"
          >
            Log In
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-black font-semibold hover:underline">
            Sign up free
          </a>
        </p>

      </div>
    </main>
  )
}