
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import { auth } from '@/app/lib/firebase'
import useAuth from '@/app/hooks/useAuth'

export default function Signup() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signupLoading, setSignupLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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
      setSignupLoading(true)

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      toast.success('Account created successfully!')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error) {
      console.error(error)

      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists')
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password must be at least 6 characters')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setSignupLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (googleLoading) return

    try {
      setGoogleLoading(true)

      const provider = new GoogleAuthProvider()

      await signInWithPopup(auth, provider)

      router.push('/dashboard')
    } catch (error) {
      console.error(error)

      if (
        error.code !== 'auth/popup-closed-by-user' &&
        error.code !== 'auth/cancelled-popup-request'
      ) {
        alert(error.message)
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Start building AI chatbots today
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

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
              className="w-full border rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-black"
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
              className="w-full border rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={signupLoading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {signupLoading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className="flex-1" />
            <span className="text-gray-400 text-sm">
              OR
            </span>
            <hr className="flex-1" />
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full border py-3 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>

            {googleLoading
              ? 'Signing Up...'
              : 'Continue with Google'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </main>
  )
}

