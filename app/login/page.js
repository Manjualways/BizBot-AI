'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from '../lib/firebase'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleGoogleLogin = async () => {
    if (googleLoading) return
    setGoogleLoading(true)

    try {
      const provider = new GoogleAuthProvider()

      await signInWithPopup(auth, provider)

      router.push('/dashboard')
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request' &&
        error.code !== 'auth/popup-closed-by-user') {
        console.error(error)
        toast.error(error.message)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-md">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-8">
          Log in to your BizBot AI account
        </p>

        {/* Email Login */}
        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3 mt-1 outline-none focus:border-black"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Log In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1" />
            <span className="text-gray-400 text-sm">
              OR
            </span>
            <hr className="flex-1" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-black font-semibold hover:underline"
          >
            Sign up free
          </a>
        </p>

      </div>

    </main>
  )
}