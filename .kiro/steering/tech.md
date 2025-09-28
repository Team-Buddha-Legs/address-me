# Technology Stack

## Core Framework
- **Next.js 15.5.4** - React framework with App Router architecture
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript development

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework with PostCSS integration
- **Geist Fonts** - Vercel's font family (Sans & Mono variants)
- **CSS Custom Properties** - For theme variables and dark mode support

## Development Tools
- **Biome** - Fast formatter and linter (replaces ESLint/Prettier)
- **Turbopack** - Next.js bundler for faster builds
- **TypeScript** - Strict mode enabled with path aliases (`@/*`)

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build with Turbopack
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
```

## Configuration Notes
- Uses 2-space indentation
- Biome handles both linting and formatting
- Path aliases configured for clean imports (`@/*` maps to root)
- Strict TypeScript configuration
- Git integration enabled for Biome VCS features