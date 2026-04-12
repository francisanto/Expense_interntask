# 💸 Expense Tracker Application

A modern, mobile-first expense tracking application built with React, TypeScript, and Tailwind CSS.

## 📋 Features

### Core Functionality
- ✅ **Add Expenses** — Log expenses with amount, category, date, and optional notes
- ✅ **Expense List** — View all expenses grouped by date or category, with delete support
- ✅ **Category System** — 7 built-in categories: Food, Travel, Shopping, Bills, Entertainment, Health, Other

### Smart Insights (Mandatory Feature)
- 📊 **Week-over-week comparison** — "You spent 40% more on Food this week compared to last week"
- 📈 **Month-over-month tracking** — Alerts when monthly spending increases or decreases significantly
- 🏆 **Top category detection** — Identifies your biggest spending category each month
- 📅 **Activity tracking** — Tracks how many days you've logged expenses

### Aggregation
- 💰 Total spend per period (week/month)
- 📊 Category-wise breakdown with percentage bars
- 📝 Transaction count summaries

## 🛠 Tech Stack

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/francisanto/Expense_interntask.git
cd Expense_interntask

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── lib/             # Utility functions and helpers
├── App.tsx          # Main App component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## 🎨 UI Components

The project uses shadcn/ui components for a consistent and modern design system:
- Buttons, Cards, Dialogs
- Forms with input validation
- Toast notifications
- Charts and graphs via Recharts

## 💾 Data Management

All expense data is stored locally in the browser's localStorage. The application supports:
- Creating new expenses
- Reading/fetching all expenses
- Updating expense information
- Deleting expenses

## 📊 Smart Analytics

The expense tracker includes intelligent insights such as:
- Automatic categorization of expenses
- Spending trends comparison
- Category-wise spending breakdown
- Weekly and monthly summaries

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📝 Linting

```bash
# Check code quality
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Francis Santo**
- GitHub: [@francisanto](https://github.com/francisanto)

## 🎯 Future Enhancements

- [ ] Export expenses to CSV/PDF
- [ ] Dark mode support
- [ ] Budget setting and alerts
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Cloud synchronization
- [ ] Mobile app version

---

**Last Updated:** April 12, 2026
