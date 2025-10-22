# Mandoscan - Smart Contract Vulnerability Detection Platform

A Next.js-based web application for analyzing and visualizing vulnerabilities in Solidity smart contracts. Mandoscan provides an interactive interface for detecting security issues, viewing control flow graphs, and examining detailed vulnerability reports.

## Overview

Mandoscan is a comprehensive smart contract security analysis tool built with Next.js 15, React, and Tailwind CSS. It enables developers to upload Solidity smart contracts, analyze them for vulnerabilities, and visualize the results through interactive graphs and detailed reports.

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
