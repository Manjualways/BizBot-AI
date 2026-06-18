'use client'
import { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'

export default function Signup() {
  const [name, setName] = useState('')
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      console.log(userCredential.user)
      alert("Account created successfully!")
      router.push('/dashboard')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-md">
        
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-500 mb-8">Start building AI chatbots today</p>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-black"
            />
          </div>

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
  Create Account
</button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-black font-semibold hover:underline">
            Log in
          </a>
        </p>

      </div>
    </main>
  )
}