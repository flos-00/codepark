# CodePark Ticket Management System

This is a modern ticket management application built with Next.js, designed to help teams track and manage support tickets efficiently. The application provides a clean, intuitive interface for creating, updating, and organizing tickets with different statuses.

## Features

- **Ticket Creation and Management**: Create new tickets with titles and detailed content
- **Ticket Status Tracking**: Support for multiple ticket statuses (Open, In Progress, Closed)
- **Real-time Updates**: Server actions for seamless CRUD operations
- **Responsive UI**: Built with modern React components and Tailwind CSS
- **Database Integration**: Uses Prisma ORM with PostgreSQL for robust data management
- **Testing**: Comprehensive test suite with Vitest
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom component library (inspired by shadcn/ui)
- **Testing**: Vitest with React Testing Library
- **Language**: TypeScript
- **Linting**: ESLint with custom configuration

## Project Structure

```
app/
├── features/ticket/          # Ticket-related pages and components
├── tickets/                  # Ticket listing and detail pages
└── layout.tsx                # Root layout

components/
├── ui/                       # Reusable UI components
├── form/                     # Form-related components
└── theme/                    # Theme provider and switcher

lib/
├── prisma.ts                 # Prisma client setup
└── generated/                # Auto-generated Prisma types

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Database seeding script
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd codepark
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up the database:

```bash
# Configure your database connection in prisma/schema.prisma
npx prisma migrate dev
npx prisma db seed
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run test` - Run the test suite
- `npm run lint` - Run ESLint for code quality checks

## Database Management

This project uses Prisma for database management:

- **Migrations**: `npx prisma migrate dev` - Create and apply migrations
- **Studio**: `npx prisma studio` - Open Prisma Studio for database visualization
- **Reset**: `npx prisma migrate reset` - Reset database and migration history

## Testing

Run tests with:

```bash
npm run test
```

Tests are written with Vitest and React Testing Library, focusing on component behavior and user interactions.

## Deployment

The application can be deployed to Vercel, Netlify, or any platform supporting Next.js applications. Make sure to configure your database connection string in the deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
