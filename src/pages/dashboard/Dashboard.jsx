import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'

const Dashboard = () => {
  const { user , loading} = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
       <LoaderCircle className='animate-spin mx-auto size-12'/>
      </div>
    );
  }

  // 1. Safety Guard: If nobody is logged in, show a login button
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <h1 className="text-xl font-bold text-red-500">Stop! You are not logged in.</h1>
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Go to Login
        </button>
      </div>
    )
  }

  // 2. Client Layout View
  if (user.role === 'CLIENT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="p-8 bg-white rounded-xl shadow-lg border-2 border-blue-400 text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">🤝 Client Dashboard</h1>
          <p className="text-gray-600">Logged in as: <span className="font-semibold">{user.email || user.role}</span></p>
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium">
            Test Success: Showing Client Content Only
          </div>
        </div>
      </div>
    )
  }

  // 3. Admin Layout View
  if (user.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="p-8 bg-white rounded-xl shadow-lg border-2 border-purple-400 text-center">
          <h1 className="text-2xl font-bold text-purple-600 mb-2">⚡ Admin Control Panel</h1>
          <p className="text-gray-600">Logged in as: <span className="font-semibold">{user.email}</span></p>
          <div className="mt-4 p-3 bg-purple-100 text-purple-800 text-sm rounded-lg font-medium">
            Test Success: Showing Admin Secret Settings
          </div>
        </div>
      </div>
    )
  }

  // 4. Fallback for any unexpected roles
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <h1 className="text-xl font-bold text-yellow-600">Unknown Role: {user.role}</h1>
    </div>
  )
}

export default Dashboard
