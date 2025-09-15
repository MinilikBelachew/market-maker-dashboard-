# Market Makers Dashboard

A modern, dark-themed dashboard for cryptocurrency market makers built with React, Vite, and Tailwind CSS.

## Features

- **Dark Theme**: Modern dark blue-grey color scheme
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data Visualization**: Interactive charts and live data
- **Market Makers Table**: Comprehensive overview of market makers
- **Order Book Visualization**: Visual representation of trading orders
- **Alert System**: Real-time alerts and notifications
- **Live Trading Data**: BTC/USD price chart and trading metrics

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **Inter Font**: Modern typography

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd market-makers-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar
│   ├── MetricCards.jsx     # Key metrics cards
│   ├── MarketMakersTable.jsx # Market makers data table
│   ├── LiveChart.jsx       # BTC/USD price chart
│   ├── OrderBook.jsx       # Order book visualization
│   ├── Alerts.jsx          # Alert notifications
│   ├── Trades.jsx          # Trading statistics
│   └── BottomAlerts.jsx    # Bottom alert cards
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles and Tailwind imports
```

## Customization

### Colors

The dashboard uses a custom color palette defined in `tailwind.config.js`:

- `dark-bg`: #1A1A2E (main background)
- `dark-card`: #16213E (card backgrounds)
- `accent-blue`: #00D4FF (primary accent)
- `accent-purple`: #8B5CF6 (secondary accent)
- `accent-pink`: #EC4899 (highlight color)

### Adding New Components

1. Create a new component in the `src/components/` directory
2. Import and use it in `App.jsx`
3. Follow the existing styling patterns using Tailwind classes

## Features Overview

### Dashboard Sections

1. **Header**: Search bar and navigation icons
2. **Metric Cards**: Key performance indicators
3. **Market Makers Table**: Detailed market maker information
4. **Live Chart**: Real-time BTC/USD price visualization
5. **Order Book**: Visual order book representation
6. **Alerts**: System notifications and warnings
7. **Trades**: Trading statistics and metrics

### Responsive Design

The dashboard is fully responsive and adapts to different screen sizes:
- Mobile: Single column layout
- Tablet: Optimized spacing and sizing
- Desktop: Two-column layout with full features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
