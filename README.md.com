# Mandoscan - Smart Contract Vulnerability Detection Platform

A Next.js-based web application for analyzing and visualizing vulnerabilities in Solidity smart contracts. Mandoscan provides an interactive interface for detecting security issues, viewing control flow graphs, and examining detailed vulnerability reports.

## Overview

Mandoscan is a comprehensive smart contract security analysis tool built with Next.js 15, React, and Tailwind CSS. It enables developers to upload Solidity smart contracts, analyze them for vulnerabilities, and visualize the results through interactive graphs and detailed reports.

## Features

- **Smart Contract Analysis**: Upload and analyze Solidity smart contracts for security vulnerabilities
- **Interactive Control Flow Graphs**: Visualize contract execution flow with 3D force-directed graphs
- **Vulnerability Detection**: Identify common security issues including:
  - Access Control vulnerabilities
  - Reentrancy attacks
  - Integer overflow/underflow
  - And more...
- **Detailed Reporting**: 
  - Coarse-grained vulnerability overview
  - Fine-grained line-by-line analysis
  - Highlighted code sections with vulnerability context
- **Code Viewer**: Syntax-highlighted Solidity code viewer with:
  - Line-by-line vulnerability annotations
  - Hover tooltips for detailed messages
  - Automatic scrolling to vulnerable sections
- **Dark Mode Support**: Full dark mode implementation with theme toggling
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Authentication**: AWS Cognito integration for secure user management

## Tech Stack

- **Framework**: [Next.js 15.1.5](https://nextjs.org/)
- **Language**: TypeScript 5.9.3
- **Styling**: [Tailwind CSS 4.1.14](https://tailwindcss.com/)
- **UI Components**: [@heroui/react](https://heroui.com/)
- **Authentication**: [react-oidc-context](https://github.com/authts/react-oidc-context) with AWS Cognito
- **Visualization**: 
  - [react-force-graph-3d](https://github.com/vasturiano/react-force-graph-3d) for graph visualization
  - [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for code display
- **Code Quality**: ESLint, Prettier

## Project Structure

```
mandoscan/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── auth-provider.tsx     # AWS Cognito authentication provider
│   │   ├── page.js               # Main landing/analysis page
│   │   ├── globals.css           # Global styles and CSS variables
│   │   ├── not-found.tsx         # 404 error page
│   │   └── dashboard/            # Dashboard pages
│   │       └── (admin)/          # Admin dashboard layout
│   ├── components/               # React components
│   │   ├── VulnerabilityCard.jsx # Vulnerability status cards
│   │   ├── VulnerabilityGrid.jsx # Grid layout for vulnerabilities
│   │   ├── FileSelector.jsx      # Smart contract file selector
│   │   ├── ConsoleCode.jsx       # Code viewer component
│   │   ├── Graph.jsx             # Control flow graph visualization
│   │   ├── common/               # Reusable components
│   │   └── header/               # Header components
│   ├── context/                  # React context providers
│   │   └── SidebarContext.tsx    # Sidebar state management
│   ├── layout/                   # Layout components
│   │   ├── AppHeader.tsx         # Application header
│   │   ├── AppSidebar.tsx        # Navigation sidebar
│   │   └── Backdrop.tsx          # Mobile overlay
│   └── icons/                    # SVG icon components
├── public/
│   ├── examples/                 # Sample contracts and reports
│   │   ├── contract_0.sol
│   │   ├── graph_contract_0.json
│   │   └── bug_report_*.json
│   └── images/                   # Static images and assets
├── next.config.mjs               # Next.js configuration
├── tailwind.config.mjs           # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone git@github.com:MANDO-Project/mandoscan.git
cd mandoscan
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables (if needed):
```bash
# Create .env.local file for environment-specific settings
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The development server includes:
- Hot module replacement for instant updates
- Fast refresh for component changes
- TypeScript type checking

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The static site will be exported to the `mando-tool` directory (configured as `distDir` in `next.config.mjs`), and the final static export will be in the `out` directory.

### Running Production Build Locally

After building, you can serve the static export:

```bash
npx serve out
# or use any static file server
```

## Usage

### Analyzing Smart Contracts

1. **Select a Smart Contract**: Use the file selector dropdown to choose from pre-loaded example contracts or upload your own
2. **View Analysis Results**: 
   - Review the vulnerability summary cards showing bug count and status
   - Examine the detailed code viewer with highlighted vulnerable lines
   - Explore the interactive control flow graph
3. **Investigate Vulnerabilities**: 
   - Hover over highlighted code lines to see detailed vulnerability messages
   - Click on graph nodes to navigate to specific code sections
   - Review both coarse-grained and fine-grained vulnerability reports

### Navigation

The application includes:
- **Dashboard**: Overview of analyzed contracts and recent scans
- **API References**: Documentation for API integration
- **User Profile**: Manage your account settings
- **API Keys**: Generate and manage Personal/Organization Access Tokens
- **Contact Us**: Support and feedback
- **Point System**: Track usage and rewards
- **Upgrade Plan**: View and upgrade subscription plans

## Authentication

The application uses AWS Cognito for authentication. Configuration can be found in `src/app/auth-provider.tsx`:

- **Authority**: AWS Cognito User Pool endpoint
- **Client ID**: Application client ID from Cognito
- **Scopes**: email, openid, phone
- **Redirect URIs**: Configure callback URLs in your Cognito settings

## Key Features Explained

### Vulnerability Detection
The platform analyzes smart contracts for common security vulnerabilities and provides:
- **Status indicators**: Visual cards showing BUG or CLEAN status
- **Code highlighting**: Affected lines highlighted in the code viewer
- **Detailed messages**: Hover tooltips with vulnerability descriptions and suggestions
- **Severity levels**: Color-coded indicators for vulnerability severity

### Interactive Graph Visualization
Control flow graphs visualize contract execution paths with:
- **Node types**: Function declarations, expressions, conditionals, etc.
- **Edge types**: Next, True/False branches, Declare relationships
- **Interactive navigation**: Click nodes to jump to corresponding code lines
- **3D force-directed layout**: Intuitive visualization of contract flow
- **Hover effects**: Synchronized highlighting between graph and code

### Code Viewer Features
- Syntax highlighting for Solidity
- Line numbers with vulnerability annotations
- Hover tooltips for detailed vulnerability information
- Auto-scroll to selected lines from graph interaction
- Search functionality with Cmd/Ctrl+K shortcut
- Line-by-line severity indicators

## Configuration

### TypeScript Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Use this:
import Component from "@/components/Component";

// Instead of:
import Component from "../../components/Component";
```

Configuration is in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Next.js Configuration

Key settings in `next.config.mjs`:
- **distDir**: Custom build directory (`mando-tool`)
- **output**: Static export mode for deployment to static hosting
- **images**: Unoptimized images for static export compatibility

### Styling and Theming

Global styles and CSS variables are defined in:
- `src/app/globals.css` - Main stylesheet with custom utilities and z-index variables
- `tailwind.config.mjs` - Tailwind configuration with custom colors and theme extensions

Toggle between light and dark modes using the `ThemeToggleButton` component in the header.

## Deployment

### Static Hosting

Since the application uses `output: 'export'`, it can be deployed to any static hosting service:

**AWS S3 + CloudFront**:
```bash
npm run build
aws s3 sync out/ s3://your-bucket-name
```

### Important Notes for Deployment

1. The application requires client-side JavaScript (it's not a static HTML site)
2. Configure your hosting to serve `index.html` for all routes (SPA mode)
3. Set up proper CORS if using external APIs
4. Update Cognito redirect URIs with your production domain


## Development Guidelines

### Code Style

- Use TypeScript for new components
- Follow ESLint rules (run `npm run lint`)
- Use Tailwind CSS for styling
- Implement responsive design (mobile-first approach)
- Maintain dark mode compatibility

### Component Structure

```tsx
// Example component structure
import React from "react";

interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (
    <div className="responsive-classes dark:dark-mode-classes">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Adding New Features

1. Create components in appropriate directories
2. Use context for global state management
3. Implement proper TypeScript types
4. Add responsive styles with Tailwind
5. Test in both light and dark modes
6. Update navigation if adding new pages

## Troubleshooting

### Common Issues

**Module not found with `@/` imports**:
- Restart TypeScript server: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
- Verify `tsconfig.json` has correct `baseUrl` and `paths` configuration

**Images not displaying after build**:
- Ensure `images.unoptimized: true` is set in `next.config.mjs`
- Check image paths are relative to the `public` directory

**Authentication not working**:
- Verify Cognito configuration in `auth-provider.tsx`
- Check redirect URIs match your deployment URL
- Ensure HTTPS is used in production

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following the code style guidelines
4. Test thoroughly (light/dark mode, responsive design)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## License

This project is proprietary. All rights reserved.

## Support

For issues, questions, or support:
- Create an issue in the repository
- Contact the development team
- Visit [https://mandoscan.com](https://mandoscan.com)

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- HeroUI for beautiful React components
- All contributors and supporters of the project

---

**© 2025 - Mandoscan**

Built with ❤️ using Next.js and Tailwind CSS
