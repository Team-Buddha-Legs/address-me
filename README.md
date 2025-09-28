# Address Me - Personalized Policy Address Insights

Address Me is a Next.js web application that provides personalized insights from Hong Kong's Policy Address based on individual user profiles. Users complete a comprehensive assessment to receive tailored recommendations and actionable insights.

## 🚀 Features

### ✨ **Multi-Step Assessment Form**
- 6-step comprehensive profile assessment
- Real-time validation with Zod schemas
- Session storage for form persistence
- Responsive mobile-first design

### 🎨 **Smooth Animations & UX**
- Framer Motion page transitions
- Micro-interactions on form elements
- Loading states and progress indicators
- Animated error handling

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes
- Progressive enhancement

### 🔧 **Technical Stack**
- **Next.js 15.5.4** with App Router
- **React 19.1.0** with concurrent features
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **React Hook Form** for form management
- **Zod** for validation
- **Vitest** for testing

## 📋 Assessment Steps

1. **Personal Information** - Age, gender, marital status
2. **Location** - Hong Kong district
3. **Economic Status** - Income, employment, housing
4. **Family Information** - Children and family details
5. **Education & Transport** - Education level and transportation preferences
6. **Health Information** - Optional health considerations

## 🛠 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd address-me

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
```

### Testing
The project includes comprehensive tests for:
- Form step configuration and navigation (36 tests)
- Client-side form validation (8 tests)
- Validation schemas (31 tests)
- Utility functions (43 tests)
- Home page functionality (6 tests)
- Animation components (4 tests)

Run tests with:
```bash
npm run test:run
```

## 🏗 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── assessment/         # Assessment form pages
│   │   ├── [step]/        # Dynamic step pages
│   │   ├── layout.tsx     # Assessment layout with animations
│   │   └── loading.tsx    # Loading state
│   ├── processing/        # Processing page with progress
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── not-found.tsx     # 404 page
├── components/            # Reusable components
│   ├── form/             # Form-specific components
│   │   ├── FormInput.tsx         # Input component with all field types
│   │   ├── FormStepWrapper.tsx   # Main form wrapper with navigation
│   │   ├── ProgressIndicator.tsx # Progress bar and step counter
│   │   └── ErrorDisplay.tsx      # Error message display
│   └── ui/               # General UI components
│       └── LoadingSpinner.tsx    # Animated loading spinner
├── lib/                  # Utility libraries
│   ├── form-steps.ts     # Form configuration and navigation
│   ├── form-validation.ts # Client-side validation utilities
│   ├── validation.ts     # Zod validation schemas
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   └── index.ts          # Core type definitions
└── test/                 # Test files
    ├── components/       # Component tests
    ├── form-steps.test.ts    # Form step tests
    ├── validation.test.ts    # Validation tests
    ├── utils.test.ts         # Utility tests
    ├── home.test.tsx         # Home page tests
    └── animations.test.tsx   # Animation tests
```

## 🎯 Key Components

### FormStepWrapper
Main form component that handles:
- Form state management with React Hook Form
- Real-time validation
- Navigation between steps
- Session storage persistence
- Animated transitions

### FormInput
Reusable input component supporting:
- Text and number inputs
- Select dropdowns
- Radio button groups
- Checkbox groups
- Real-time validation feedback
- Responsive design

### Form Steps Configuration
Centralized configuration in `lib/form-steps.ts`:
- Step definitions with fields and validation
- Navigation utilities
- Progress calculation
- Route generation

## 🚦 Getting Started

1. **Visit the home page** - Learn about the application and its features
2. **Start assessment** - Click "Start Your Assessment" to begin
3. **Complete steps** - Fill out the 6-step form at your own pace
4. **Processing** - Watch the animated progress as your profile is analyzed
5. **Get results** - Receive your personalized Policy Address insights

## 🔮 Future Enhancements

- AI-powered content analysis integration
- PDF report generation
- User account system
- Historical policy comparison
- Multi-language support
- Advanced analytics dashboard

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for Hong Kong residents to better understand their Policy Address.