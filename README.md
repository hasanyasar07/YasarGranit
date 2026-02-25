# Yaşar Granit - Next.js Full-Stack E-Commerce Application

A modern, production-ready e-commerce platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **PostgreSQL** (Neon) - Database
- **TailwindCSS** - Styling
- **Server Actions** - Backend operations
- **Zod** - Schema validation
- **bcryptjs** - Password hashing
- **jose** - JWT authentication

## Features

### Public Features
- Responsive homepage with hero section
- Product listing with category filtering
- Product detail pages with full information
- WhatsApp integration for product inquiries
- SEO-optimized pages with metadata
- Social media links in footer

### Admin Features
- Secure admin authentication
- Dashboard with statistics
- Product management (CRUD operations)
- Category management
- Site settings (WhatsApp, social media links)
- Protected admin routes with middleware

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── login/         # Admin login
│   │   └── dashboard/     # Admin dashboard & management
│   ├── products/          # Public product pages
│   └── page.tsx           # Homepage
├── actions/               # Server Actions
│   ├── auth.ts           # Authentication actions
│   ├── product.ts        # Product CRUD actions
│   ├── category.ts       # Category CRUD actions
│   └── settings.ts       # Settings actions
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # JWT utilities
│   └── password.ts       # Password hashing
├── prisma/               # Prisma schema & migrations
├── validations/          # Zod schemas
└── types/                # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yasar-granit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://user:password@host:5432/yasar-granit-db"
JWT_SECRET="your-secret-key-here"
ADMIN_EMAIL="admin@yasargranit.com"
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

5. Create an admin user:
```bash
# Use Prisma Studio to create a user
npx prisma studio

# Or run a script to create admin user
node scripts/create-admin.js
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### User
- Admin authentication
- Email/password credentials
- Role-based access

### Category
- Product categorization
- Cascading delete relations

### Product
- Name, description, price
- Image URL (external storage ready)
- Optional stock tracking
- Category relation

### SiteSettings
- WhatsApp number for inquiries
- Social media URLs (Instagram, Facebook, Twitter)

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Import to Vercel:
   - Connect your repository
   - Add environment variables
   - Deploy

3. Set up database:
   - Create Neon PostgreSQL database
   - Add DATABASE_URL to Vercel environment variables
   - Run migrations:
     ```bash
     npx prisma migrate deploy
     ```

### Important Notes for Production

- **No Prisma Connection Leaks**: Uses singleton pattern
- **Environment Variables**: Set all required vars in Vercel
- **Database Migrations**: Run `prisma migrate deploy` after deployment
- **Image Storage**: Currently uses external URLs. Can integrate with:
  - Vercel Blob Storage
  - AWS S3
  - Cloudflare R2

## WhatsApp Integration

Products include a "Teklif Al" (Get Quote) button that:
- Opens WhatsApp with pre-filled message
- Includes product name automatically
- Uses WhatsApp number from site settings

Format: `https://wa.me/905xxxxxxxxx?text=Merhaba, [Product Name] ürünü için bilgi almak istiyorum.`

## Security Features

- Password hashing with bcryptjs
- JWT authentication with httpOnly cookies
- Protected admin routes via middleware
- Input validation with Zod schemas
- CSRF protection via Next.js

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Prisma commands
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Create migration
npx prisma migrate deploy  # Deploy migrations
```

## License

This project is private and proprietary.
