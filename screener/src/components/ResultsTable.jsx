import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Tooltip } from './ui/Tooltip'
import { fetchAndFilterStockData } from '../utils/stockDataUtils'
import QueryBuilder from './QueryBuilder'

function ResultsTable({ results, loading, onQuerySubmit, setLoading }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const itemsPerPage = 10

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedResults = [...results.stocks].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aVal = parseFloat(a[sortConfig.key]) || 0
    const bVal = parseFloat(b[sortConfig.key]) || 0
    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
  })

  const totalPages = Math.ceil(results.stocks.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedResults.slice(indexOfFirstItem, indexOfLastItem)

  const columns = [
    { id: 'id', label: 'S.No.', fullName: 'Serial Number' },
    { id: 'name', label: 'Name', fullName: 'Company Name' },
    { id: 'marketCap', label: 'Mar Cap', fullName: 'Market Capitalization (Rs. Cr.)' },
    { id: 'pe', label: 'P/E', fullName: 'Price to Earnings Ratio' },
    { id: 'roe', label: 'ROE', fullName: 'Return on Equity (%)' },
    { id: 'debtToEquity', label: 'D/E', fullName: 'Debt to Equity Ratio' },
    { id: 'divYield', label: 'Div Yld', fullName: 'Dividend Yield (%)' },
    { id: 'revenueGrowth', label: 'Rev Gr', fullName: 'Revenue Growth (%)' },
    { id: 'epsGrowth', label: 'EPS Gr', fullName: 'EPS Growth (%)' },
    { id: 'currentRatio', label: 'Curr R', fullName: 'Current Ratio' },
    { id: 'grossMargin', label: 'Gross M', fullName: 'Gross Margin (%)' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Query Results</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            SAVE THIS QUERY
          </button>
        </div>
        
        <div className="p-4 border-b">
          <h3 className="text-lg">
            {results.stocks.length} results found: Showing page {currentPage} of {totalPages}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(({ id, label, fullName }) => (
                  <th 
                    key={id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(id)}
                  >
                    <Tooltip content={fullName}>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">{label}</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">Loading...</td>
                </tr>
              ) : (
                currentItems.length > 0 ? (
                  currentItems.map((stock, index) => (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 hover:underline cursor-pointer">
                        {stock.name}
                      </td>
                      {columns.slice(2).map(({ id }) => (
                        <td key={id} className="px-4 py-3 text-sm">
                          {stock[id] !== undefined ? stock[id].toFixed(2) : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-red-600">
                      {results.message}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <QueryBuilder onQuerySubmit={onQuerySubmit} setLoading={setLoading} />
    </div>
  )
}

export default ResultsTable