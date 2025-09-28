# Project Structure

## Next.js App Router Architecture
This project follows the Next.js 13+ App Router pattern with the `app/` directory as the main application structure.

```
├── app/                    # App Router directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page component
│   ├── globals.css        # Global styles with Tailwind
│   └── favicon.ico        # App favicon
├── public/                # Static assets
│   ├── *.svg             # Icon assets (Next.js, Vercel, etc.)
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/          # AI guidance documents
├── node_modules/          # Dependencies
└── [config files]        # Various configuration files
```

## Key Conventions

### File Naming
- React components use `.tsx` extension
- Page components are named `page.tsx`
- Layout components are named `layout.tsx`
- Global styles in `globals.css`

### Component Structure
- Root layout defines HTML structure and global fonts
- Pages are server components by default
- Client components require `"use client"` directive
- Image optimization using `next/image`

### Styling Approach
- Tailwind utility classes for styling
- CSS custom properties for theming
- Dark mode support via `prefers-color-scheme`
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, etc.)

### Import Patterns
- Use path aliases (`@/*`) for clean imports
- Next.js components imported from `next/*`
- Font optimization via `next/font/google`

## Asset Management
- Static assets in `public/` directory
- SVG icons for UI elements
- Optimized font loading with variable fonts
- Image optimization through Next.js Image component