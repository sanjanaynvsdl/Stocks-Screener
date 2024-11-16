# Stock Screener Application

A React-based stock screening tool that allows users to filter and analyze stocks based on various financial metrics like Market Cap, P/E Ratio, ROE, etc. Users can create custom queries with multiple conditions and view results in a sortable table format.

## Features
- Custom query builder with AND conditions
- Sortable results table with pagination
- Financial metrics tooltips
- Responsive design

## Code Structure
```bash
screener/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx                  # Application header
│ │ ├── QueryBuilder.jsx            # Query input and filtering interface
│ │ ├── ResultsTable.jsx            # Displays filtered stocks data
│ │ └── ui/
│ │ └── Tooltip.jsx 
│ ├── utils/
│ │ └── stockDataUtils.js           # Data fetching and processing logic
│ ├── App.jsx                       # Main application component
│ ├── main.jsx 
│ └── index.css                     # Global styles (Tailwind CSS)
└── package.json                    # Project dependencies and scripts
```

## Dataset
The application fetches stock data from a Google Sheets CSV endpoint. The dataset includes various financial metrics for Indian companies including market capitalization, P/E ratio, ROE, and growth metrics.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/sanjanaynvsdl/Stocks-Screener.git
cd screener
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Technology Stack
- React 18
- Vite
- Tailwind CSS
- Papa Parse (CSV parsing)
- Lucide React (Icons)

## Requirements
- Node.js 16+
- npm or yarn




