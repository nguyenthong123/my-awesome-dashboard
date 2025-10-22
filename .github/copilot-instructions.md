# AI Agent Instructions for my-awesome-dashboard

This document guides AI coding assistants on the key patterns and conventions of this React dashboard application.

## Project Architecture

### Core Structure
- Single-page application using Create React App with role-based routing
- Layout hierarchy: `MainLayout` → Role-based routes → Page components
- Data fetching via custom `useFetchData` hook from remote JSON endpoints
- Authentication state managed globally through `AuthContext`

### Key Patterns

1. **Route Organization** (`src/routes/AppRoutes.jsx`):
   - Public routes: No auth required (e.g., `/`, `/san-pham/:slug`)
   - Protected routes: Require login (e.g., `/products`)
   - Role-specific routes:
     - Admin routes: `/dashboard`
     - Sales routes: `/customer-revenue`

2. **Authentication** (`src/context/AuthContext.js`):
   - User data fetched from remote JSON: `USERS_DATA_URL`
   - Local storage persistence with error handling
   - Login by email matching against user list
   - Clear separation between auth state and navigation logic

3. **Component Organization**:
   ```
   components/
   ├── common/      # Reusable UI components
   ├── dashboard/   # Dashboard-specific components
   ├── layout/      # Layout structure components
   └── products/    # Product-related components
   ```

## Development Workflows

### Getting Started
```bash
npm install
npm start         # Runs on http://localhost:3000
```

### Build & Deployment
```bash
npm run build     # Creates production build
npm run deploy    # Deploys to GitHub Pages
```

### Testing
```bash
npm test         # Runs Jest tests
```

## External Dependencies

### Data Sources
- User data: Fetched from GitHub raw content
- All remote data accessed through `useFetchData` hook for consistent error handling

### Major Dependencies
- React Router v7 for routing
- Chart.js with react-chartjs-2 for visualizations
- React GA4 for analytics

## Common Tasks

### Adding New Routes
1. Create page component in `src/pages/`
2. Import in `AppRoutes.jsx`
3. Add route under appropriate protection level (public/protected/role-specific)

### Working with Auth
- Use `useAuth()` hook to access auth context
- Always handle loading states (`isLoadingUsers`)
- Keep navigation logic in components, not auth functions

### Component Guidelines
- UI components go in `common/` if used across multiple pages
- Feature-specific components go in feature-named folders
- Maintain clear separation between layout and feature components

## Conventions

### File Structure
- Use `.jsx` extension for files with JSX
- CSS modules colocated with components
- Routes use Vietnamese-friendly slugs (e.g., `san-pham`)

### State Management
- Context for app-wide state (auth, theme)
- Component state for UI-specific logic
- Custom hooks for reusable logic