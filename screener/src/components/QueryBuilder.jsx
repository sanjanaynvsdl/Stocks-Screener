import { useState } from 'react'
import { fetchAndFilterStockData } from '../utils/stockDataUtils'

function QueryBuilder({ onQuerySubmit, setLoading }) {
  const [query, setQuery] = useState('')
  const [showSepResults, setShowSepResults] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const results = await fetchAndFilterStockData(query, showSepResults)
    onQuerySubmit(results)
    setLoading(false)
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">Create a Search Query</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit}>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-48 p-4 border rounded-lg mb-4 font-mono text-sm"
                placeholder="Enter your query (e.g., Market_Cap > 500 AND P/E < 15)"
              />
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showSepResults}
                    onChange={(e) => setShowSepResults(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Only companies with Sep 2024 results
                </label>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                RUN THIS QUERY
              </button>
            </form>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 h-48">
            <h3 className="text-lg font-semibold mb-4">Custom query example</h3>
            <div className="space-y-2 text-gray-700">
              <p>Market capitalization {'>'} 500 AND</p>
              <p>Price to earning {'<'} 15 AND</p>
              <p>Return on capital employed {'>'} 22%</p>
              <a href="#" className="text-blue-600 hover:underline mt-4  block">
              Detailed guide on creating screens
            </a>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueryBuilder