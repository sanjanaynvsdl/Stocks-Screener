import { useState } from 'react'
import Navbar from './components/Navbar'
import QueryBuilder from './components/QueryBuilder'
import ResultsTable from './components/ResultsTable'

function App() {
  const [showResults, setShowResults] = useState(false)
  const [queryResults, setQueryResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleQuerySubmit = (results) => {
    setQueryResults(results)
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4">
        {!showResults && (
          <QueryBuilder onQuerySubmit={handleQuerySubmit} setLoading={setLoading} />
        )}
        {showResults && (
          <ResultsTable 
            results={queryResults} 
            loading={loading}
            onQuerySubmit={handleQuerySubmit}
            setLoading={setLoading}
          />
        )}
      </main>
    </div>
  )
}

export default App