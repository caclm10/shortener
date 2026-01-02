# URL Shortener

A modern URL shortener application built with React, TypeScript, and Supabase.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth & Database)
- **Charts:** Recharts
- **Forms:** React Hook Form, Zod

## Features

- 🔐 User authentication (login/register)
- 🔗 Create short links with custom or auto-generated aliases
- 📊 Dashboard with statistics and charts
- ✏️ Edit and delete links
- 📋 Copy short links to clipboard
- 📱 Responsive design (mobile-friendly)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

### Database Setup

Create a `links` table in Supabase:

```sql
CREATE TABLE links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    original_url TEXT NOT NULL,
    alias TEXT UNIQUE NOT NULL,
    visit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own links
CREATE POLICY "Users can manage own links" ON links
    FOR ALL USING (auth.uid() = user_id);
```

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

### Build

```bash
bun run build
```

## Project Structure

```
src/
├── components/      # UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and services
├── views/           # Page views
└── router.tsx       # Route definitions
```
