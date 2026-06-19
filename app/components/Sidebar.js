'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import useAuth from '../hooks/useAuth'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const menuItems = [
    {
      name: 'My Chatbots',
      icon: '🤖',
      href: '/dashboard',
    },
    {
      name: 'Analytics',
      icon: '📊',
      href: '/dashboard/analytics',
    },
    {
      name: 'Settings',
      icon: '⚙️',
      href: '/dashboard/settings',
    },
    {
      name: 'Billing',
      icon: '💳',
      href: '/dashboard/billing',
    },
  ]

  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col p-6">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          BizBot AI
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          AI SaaS Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200
              
              ${pathname === item.href
                ? 'bg-white text-black font-semibold shadow-lg'
                : 'hover:bg-gray-800'
              }
            `}
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </Link>
        ))}

      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-800 pt-6">

        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Logged in as
        </p>

        <p className="text-sm font-medium mt-2 truncate">
          {user?.email || 'Loading...'}
        </p>

        <button
          onClick={handleLogout}
          className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
        >
          Logout
        </button>

      </div>
    </aside>
  )
}