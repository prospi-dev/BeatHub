import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/auth'
import { FaMusic, FaSpinner } from 'react-icons/fa'

const RegisterPage = () => {
    const navigate = useNavigate()

    // State now includes 'username' to match your backend
    const [form, setForm] = useState({ username: '', email: '', password: '' })
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

        if (form.password.length < 5) {
            setError('Password must be at least 5 characters long.');
            return;
        }

        const timeoutId = setTimeout(() => {
            setLongWaitMessage(true)
        }, 5000)

        try {
            // Registration API call
            await registerApi(form)
            // If signup is successful, redirect to login so the user can sign in
            navigate('/login')
        } catch (err) {
            // Handle backend errors (e.g., "Email already exists")
            setError(err.response?.data || 'Registration failed. Please check your details and try again.')
        } finally {
            clearTimeout(timeoutId)
            setLoading(false)
            setLongWaitMessage(false)
        }
    }

    return (
        // Same gradient background
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black px-4 py-8">

            {/* Glassmorphism container */}
            <div className="bg-gray-800/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md">

                {/* Header / Branding */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="bg-orange-500/10 p-4 rounded-full mb-4">
                        <FaMusic className="text-3xl text-orange-500" />
                    </div>
                    <h1 className='text-3xl font-bold text-white text-center tracking-tight'>Join BeatHub</h1>
                    <p className='text-gray-400 mt-2 text-center'>Create an account to save your favorite music.</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full p-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="musiclover99"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Input Email */}
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

                    {/* Input Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6} // Good practice for frontend validation
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>

                    {/* Long wait message */}
                    {longWaitMessage && (
                        <p className="text-orange-400/80 text-sm text-center animate-pulse pt-2">
                            Setting up your account... this might take a few seconds!
                        </p>
                    )}
                </form>

                {/* Login link */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-orange-500 hover:text-orange-400 font-medium hover:underline transition-colors">
                        Log in here
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;