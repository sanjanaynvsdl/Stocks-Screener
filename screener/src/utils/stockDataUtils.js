import Papa from 'papaparse'

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSH50LZe3rv-T9XsQLEaTaB2tu3TvdsWjk0dTg60rYecyplrgqhcUC29oShrt2Ho0WZlokyihbwy7yX/pub?output=csv'

export async function fetchAndProcessStockData() {
  try {
    const response = await fetch(url)
    const csvData = await response.text()
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
        //   console.log('Fetched data:', results.data);
          const stocks = results.data
            .filter(row => row.Name || row.Ticker)
            .map((row, index) => ({
              id: index + 1,
              name: row.Ticker || row.Name,
              marketCap: parseFloat(row['Market Capitalization (B)'] || '0'),
              pe: parseFloat(row['P/E Ratio'] || '0'),
              roe: parseFloat(row['ROE (%)'] || '0'),
              debtToEquity: parseFloat(row['Debt-to-Equity Ratio'] || '0'),
              divYield: parseFloat(row['Dividend Yield (%)'] || '0'),
              revenueGrowth: parseFloat(row['Revenue Growth (%)'] || '0'),
              epsGrowth: parseFloat(row['EPS Growth (%)'] || '0'),
              currentRatio: parseFloat(row['Current Ratio'] || '0'),
              grossMargin: parseFloat(row['Gross Margin (%)'] || '0'),
              latestResults: row['Latest Results Date'] || ''
            }))
        //   console.log('Parsed stocks:', stocks);
          resolve(stocks)
        },
        error: reject
      })
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    throw error
  }
}

function parseQuery(query) {
  return query.split('AND').map(condition => {
    const [field, operator, value] = condition.trim().split(/\s+/)
    return { field, operator, value: parseFloat(value) }
  })
}

function filterStocksByQuery(stocks, query) {
  const conditions = parseQuery(query)
  return stocks.filter(stock => 
    conditions.every(({ field, operator, value }) => {
      const stockValue = stock[field.toLowerCase()]
      switch (operator) {
        case '>': return stockValue > value
        case '<': return stockValue < value
        case '=': return stockValue === value
        default: return true
      }
    })
  )
}

export async function fetchAndFilterStockData(query, showSepResults) {
  const allStocks = await fetchAndProcessStockData()
  let filteredStocks = allStocks

  if (query) {
    filteredStocks = filterStocksByQuery(filteredStocks, query)
  }

  if (showSepResults) {
    const currentDate = new Date()
    const sepDate = new Date(currentDate.getFullYear(), 8, 1) 
    filteredStocks = filteredStocks.filter(stock => {
      const resultDate = new Date(stock.latestResults)
      return resultDate >= sepDate
    })
  }

  return filteredStocks
}