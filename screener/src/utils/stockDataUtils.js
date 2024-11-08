import Papa from 'papaparse';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSH50LZe3rv-T9XsQLEaTaB2tu3TvdsWjk0dTg60rYecyplrgqhcUC29oShrt2Ho0WZlokyihbwy7yX/pub?output=csv';

export async function fetchAndProcessStockData() {
  try {
    const response = await fetch(url);
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log(results.data)
          const stocks = results.data
            .filter(row => row.Name || row.Ticker)
            .map((row, index) => ({
              id: index + 1,
              name: row.Ticker || row.Name,
              marketCap: parseFloat((row['Market Capitalization (B)'] || '0').replace(/,/g, '')),
              pe: parseFloat((row['P/E Ratio'] || '0').replace(/,/g, '')),
              roe: parseFloat((row['ROE (%)'] || '0').replace(/,/g, '')),
              debtToEquity: parseFloat((row['Debt-to-Equity Ratio'] || '0').replace(/,/g, '')),
              divYield: parseFloat((row['Dividend Yield (%)'] || '0').replace(/,/g, '')),
              revenueGrowth: parseFloat((row['Revenue Growth (%)'] || '0').replace(/,/g, '')),
              epsGrowth: parseFloat((row['EPS Growth (%)'] || '0').replace(/,/g, '')),
              currentRatio: parseFloat((row['Current Ratio'] || '0').replace(/,/g, '')),
              grossMargin: parseFloat((row['Gross Margin (%)'] || '0').replace(/,/g, '')),
              latestResults: row['Latest Results Date'] || ''
            }));
          console.log(stocks);
          resolve(stocks);
        },
        error: reject
      });
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

function parseQuery(queryString) {
  // Split by both newlines and AND, then clean up
  const conditions = queryString
    .split(/(?:\r\n|\r|\n|\s+AND\s+)/g)  // Split by newlines and AND
    .map(line => line.trim())
    .filter(line => line.length > 0);  
    // Removess empty lines

  return conditions.map(line => {
    const matches = line.match(/^(.*?)\s*(>|<|=)\s*(\d+\.?\d*)$/);
    if (!matches) {
      console.warn('Invalid condition format:', line);
      return null;
    }
    const [, field, operator, value] = matches;
    return {
      field: field.trim(),
      operator: operator.trim(),
      value: parseFloat(value)
    };
  }).filter(condition => condition !== null);
}

function evaluateCondition(stock, condition) {
  const fieldMap = {
    'Market Capitalization': 'marketCap',
    'Market capitalization': 'marketCap',
    'marketCap': 'marketCap',
    'P/E Ratio': 'pe',
    'Price to earning': 'pe',
    'PE': 'pe',
    'ROE': 'roe',
    'Return on Equity': 'roe',
    'Debt-to-Equity': 'debtToEquity',
    'Debt-to-Equity Ratio': 'debtToEquity',
    'Dividend Yield': 'divYield',
    'Revenue Growth': 'revenueGrowth',
    'EPS Growth': 'epsGrowth',
    'Current Ratio': 'currentRatio',
    'Gross Margin': 'grossMargin'
  };

  const stockField = fieldMap[condition.field];
  if (!stockField) {
    console.warn(`Unknown field: ${condition.field}`);
    return false;
  }

  const stockValue = stock[stockField];
  if (stockValue === undefined || stockValue === null || isNaN(stockValue)) {
    return false;
  }

  switch (condition.operator) {
    case '>':
      return stockValue > condition.value;
    case '<':
      return stockValue < condition.value;
    case '=':
      return stockValue === condition.value;
    default:
      return false;
  }
}

function filterStocks(stocks, query) {
  if (!query.trim()) return stocks;

  const conditions = parseQuery(query);
  return stocks.filter(stock =>
    conditions.every(condition => evaluateCondition(stock, condition))
  );
}

export async function fetchAndFilterStockData(query, showSepResults) {
  const allStocks = await fetchAndProcessStockData();
  let filteredStocks = allStocks;

  if (query) {
    filteredStocks = filterStocks(filteredStocks, query);
  }

  if (showSepResults) {
    const currentDate = new Date();
    const sepDate = new Date(currentDate.getFullYear(), 8, 1);
    filteredStocks = filteredStocks.filter(stock => {
      const resultDate = new Date(stock.latestResults);
      return resultDate >= sepDate;
    });
  }

  if (filteredStocks.length === 0) {
    return { stocks: [], message: "Your query does not match any data." };
  }

  return { stocks: filteredStocks, message: "" };
}