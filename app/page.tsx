'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('analysisResults', JSON.stringify(data))
        localStorage.setItem('analyzedUrl', url)
        router.push('/results')
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="https://nxtwaves.in" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Back to nxtwaves.in
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Products</span>
              <span className="text-gray-300">{'>'}</span>
              <span className="text-sm font-medium text-gray-900">Website Clarity Analysis</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Product Introduction */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl text-center mb-8 mt-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                nxtwaves.in Products
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Website Clarity Analysis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A professional website analysis tool that helps businesses identify conversion blockers and optimization opportunities in seconds. Get expert-level insights instantly.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-normal text-gray-900 mb-4">
              <span className="text-blue-500">C</span>
              <span className="text-red-500">l</span>
              <span className="text-yellow-500">a</span>
              <span className="text-blue-500">r</span>
              <span className="text-green-500">i</span>
              <span className="text-red-500">t</span>
              <span className="text-yellow-500">y</span>
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Strengthen your website. Get your free clarity score in 10 seconds.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="mb-8"
          >
            <div className="relative max-w-xl mx-auto mb-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full pl-12 pr-12 py-3 text-base border border-gray-300 rounded-full hover:shadow-md focus:shadow-md focus:outline-none focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="px-6 py-3 bg-gray-100 text-gray-800 text-sm hover:shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded border border-gray-100 min-w-[140px]"
              >
                {isLoading ? 'Analyzing...' : 'Analyze My Site'}
              </button>
              <button
                type="button"
                onClick={() => window.open('https://calendly.com/nxtwave-ventures/30min', '_blank')}
                className="px-6 py-3 bg-gray-100 text-gray-800 text-sm hover:shadow-md hover:bg-gray-200 transition-all duration-200 rounded border border-gray-100 min-w-[140px]"
              >
                Book Free Consultation
              </button>
            </div>
          </motion.form>

          {/* Loading Progress */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-blue-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-gray-600 mt-2 text-sm">Generating your free clarity score...</p>
            </motion.div>
          )}

          {/* Language Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm"
          >
            <p className="text-gray-600">
              Website analysis offered in: {' '}
              <a href="#" className="text-blue-600 hover:underline">English</a>
              {' '}
              <a href="#" className="text-blue-600 hover:underline">Español</a>
              {' '}
              <a href="#" className="text-blue-600 hover:underline">Français</a>
              {' '}
              <a href="#" className="text-blue-600 hover:underline">Deutsch</a>
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-6 mb-2 sm:mb-0">
            <a href="https://nxtwaves.in" className="hover:underline">nxtwaves.in</a>
            <a href="https://nxtwaves.in/privacy" className="hover:underline">Privacy</a>
            <a href="https://nxtwaves.in/terms" className="hover:underline">Terms</a>
          </div>
          <div className="text-xs text-gray-500">
            © 2025 nxtwaves.in - Website Clarity Analysis
          </div>
        </div>
      </footer>
    </div>
  )
}