# 💸 Expense Tracker

A modern, mobile-first expense tracking application built with React and TypeScript.

## Features

### Core Functionality
- **Add Expenses** — Log expenses with amount, category, date, and optional notes
- **Expense List** — View all expenses grouped by date or category, with delete support
- **Category System** — 7 built-in categories: Food, Travel, Shopping, Bills, Entertainment, Health, Other

### Smart Insights (Mandatory Feature)
- **Week-over-week comparison** — "You spent 40% more on Food this week compared to last week"
- **Month-over-month tracking** — Alerts when monthly spending increases or decreases significantly
- **Top category detection** — Identifies your biggest spending category each month
- **Activity tracking** — Tracks how many days you've logged expenses

### Aggregation
- Total spend per period (week/month)
- Category-wise breakdown with percentage bars
- Transaction count summaries

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite 5** for fast development and builds
- **Tailwind CSS v3** with custom design tokens
- **shadcn/ui** component library
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **React Router** for client-side routing
- **Sonner** for toast notifications

### Backend
- **localStorage** for data persistence (client-side storage)
- Full CRUD support: add, fetch, delete expenses

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── BottomNav.tsx          # Mobile bottom navigation
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── expenses.ts            # Expense CRUD & type definitions
│   ├── insights.ts            # Smart insight generation logic
│   └── utils.ts               # Utility functions
├── pages/
│   ├── AddExpense.tsx          # Add new expense form
│   ├── ExpenseList.tsx         # Expense list with grouping
│   └── Insights.tsx            # Spending insights & analytics
├── App.tsx                     # Root component with routing
└── index.css                   # Design tokens & global styles
```

## Screenshots

The app features three main screens:
1. **Add Expense** — Clean form with emoji category selector and date picker
2. **Expenses** — Grouped list view with swipe-to-delete
3. **Insights** — Visual spending breakdown with smart insights

## License

MIT
