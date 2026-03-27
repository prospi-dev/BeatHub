import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { FaMusic, FaSpinner } from 'react-icons/fa'

const LoginPage = () => {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [longWaitMessage, setLongWaitMessage] = useState(false)

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        setLongWaitMessage(false)

        const timeoutId = setTimeout(() => {
            setLongWaitMessage(true)
        }, 5000)

        try {
            const res = await loginApi(form)
            login(res.data)       // store token + user in AuthContext + localStorage
            navigate('/catalog')  // redirects to catalog on success
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials and try again.')
        } finally {
            clearTimeout(timeoutId)
            setLoading(false)
            setLongWaitMessage(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black px-4">
            
            <div className="bg-gray-800/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md">
                
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="bg-orange-500/10 p-4 rounded-full mb-4">
                        <FaMusic className="text-3xl text-orange-500" />
                    </div>
                    <h1 className='text-3xl font-bold text-white text-center tracking-tight'>Welcome back</h1>
                    <p className='text-gray-400 mt-2 text-center'>Log in to your BeatHub account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="name@domain.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>

                    {longWaitMessage && (
                        <p className="text-orange-400/80 text-sm text-center animate-pulse pt-2">
                            Waking up the server... this might take a few seconds!
                        </p>
                    )}
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:text-orange-400 font-medium hover:underline transition-colors">
                        Sign up here
                    </Link>
                </div>
                
            </div>
        </div>
    );
};

export default LoginPage;