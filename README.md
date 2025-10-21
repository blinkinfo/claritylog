# ClarityLog - Decision Journal

A modern, minimalist decision journal web application built with React, TypeScript, and shadcn/ui. Track your important life and business decisions, analyze your decision-making patterns, and improve one of life's most critical skills.

## Features

### Decision Tracking
- **Structured Decision Logging**: Record decisions with context, options considered, reasoning, and expected outcomes
- **Pros & Cons Analysis**: Document advantages and disadvantages for each option
- **Outcome Tracking**: Later revisit decisions to log actual outcomes and rate results (1-5 stars)
- **Lessons Learned**: Capture insights from each decision for continuous improvement

### Analytics & Insights
- **Decision Statistics**: Track total decisions, resolution rate, and average outcome ratings
- **Category Breakdown**: Visualize decisions across different life areas (Career, Business, Personal, Financial, Health, Relationships)
- **Accuracy Rate**: Measure how many decisions had positive outcomes (4+ star ratings)
- **Cognitive Bias Detection**: Automatically identify patterns that may indicate decision-making biases:
  - Confirmation Bias
  - Recency Effect
  - Analysis Paralysis

### User Experience
- **Dark Mode Only**: Easy on the eyes with a beautiful dark theme
- **Mobile-First Design**: Fully responsive from mobile to desktop
- **Clean & Minimal UI**: Focus on what matters with an uncluttered interface
- **Local Storage**: All data persists in your browser - private and secure

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Data Persistence**: Local Storage

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
claritylog/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── DecisionForm.tsx # Decision entry form
│   │   └── DecisionDetail.tsx # Decision detail & outcome logging
│   ├── contexts/
│   │   └── DecisionContext.tsx # Global state management
│   ├── hooks/
│   │   └── useLocalStorage.ts # Local storage hook
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main dashboard view
│   │   └── Analytics.tsx    # Analytics & insights
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

## Best Practices Implemented

### Code Quality
- ✅ TypeScript strict mode for type safety
- ✅ Component-based architecture
- ✅ Custom hooks for reusable logic
- ✅ Context API for state management
- ✅ Type-only imports for better tree-shaking

### Performance
- ✅ Code splitting with lazy loading
- ✅ Optimized build with Vite
- ✅ Efficient re-renders with React best practices
- ✅ Local storage for instant data access

### User Experience
- ✅ Mobile-first responsive design
- ✅ Accessible UI components from Radix UI
- ✅ Loading states and error handling
- ✅ Intuitive navigation and flows
- ✅ Clear visual feedback for actions

### Design
- ✅ Consistent spacing and typography
- ✅ Color-coded categories
- ✅ Card-based layouts for scannability
- ✅ Dark mode optimized theme
- ✅ Modern, minimal aesthetic

## Usage

### Creating a Decision

1. Click "New Decision" button
2. Fill in:
   - Decision title
   - Category (Career, Business, Personal, etc.)
   - Context and background
   - Options considered with pros & cons
   - Select your chosen option
   - Your reasoning
   - Expected outcome
3. Save the decision

### Logging Outcomes

1. Click on a pending decision from the dashboard
2. Click "Log Outcome" at the bottom
3. Describe what actually happened
4. Rate the outcome (1-5 stars)
5. Optionally add lessons learned
6. Save the outcome

### Viewing Analytics

1. Click "Analytics" in the navigation
2. Review:
   - Overall statistics
   - Category breakdown
   - Cognitive bias insights
   - Decision-making tips

## Data Storage

All data is stored locally in your browser using Local Storage. This means:
- ✅ Your data stays private on your device
- ✅ No account required
- ✅ Works offline
- ⚠️ Clearing browser data will delete your decisions
- ⚠️ Data is not synced across devices

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - feel free to use this project for your own decision tracking needs.

## Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Lucide for the icon set
- The decision science and cognitive bias research community
