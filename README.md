# Deal Drop - Premium AI-Powered Price Tracker

**Deal Drop** is a state-of-the-art price monitoring SaaS application designed to help users track price drops across any major e-commerce store (Amazon, Walmart, Best Buy, etc.) in real-time. Simply paste a product link, and the app leverages AI scraping, schedules automatic price checks, plots beautiful historic price charts, and sends instant email alerts when prices drop.

Redesigned with a premium developer-style aesthetic inspired by Linear and Stripe, the app features gorgeous glassmorphic components, fluid animations, custom data visualizations, and robust light/dark mode styling.

---

## ⚡ Key Features

- **Any E-Commerce Link Support**: Scrape and monitor products from any major global merchant.
- **Firecrawl AI Scraper**: Leverages Firecrawl to parse unstructured raw HTML into clean structured JSON schemas (extracts name, currency, price, and image) bypassing bot blocks.
- **Dynamic Recharts Dashboards**:
  - **Area Charts**: Shows smooth gradient price history and minimum/maximum trends.
  - **Donut Charts**: Displays dynamic merchant distribution breakdown on the dashboard sidebar.
- **Elegant Statistics Bento Grid**: Tracks statistics like *Total Tracked Items*, *Active Alerts*, *Savings Triggered Percentage*, and *Estimated Price Savings* (dynamically formatted in `₹` INR or `$` USD based on tracked currencies).
- **Automated Email Notifications**: Dispatches premium, responsive email alerts via the Resend API when price drops are verified.
- **Smooth Theme Toggle**: Fully responsive system supporting dark and light themes with spring-based rotation and opacity animations powered by Framer Motion.
- **Vercel Scheduler**: Standardized background crons to run periodic price checks.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (v16.2.9)](https://nextjs.org/) with App Router and Turbopack
- **UI Logic**: [React (v19)](https://react.dev/)
- **Database & Authentication**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS, `@supabase/ssr`)
- **Scraping Engine**: [Firecrawl JS SDK](https://www.firecrawl.dev/)
- **Email Delivery**: [Resend SDK](https://resend.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Lucide React Icons

---

## 📊 Database Schema

Deal Drop runs on Supabase PostgreSQL. Create the following tables in your database:

### 1. `products` Table
```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text not null,
  current_price numeric(10, 2) not null,
  currency text default 'USD' not null,
  image_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint unique_user_product unique(user_id, url)
);
```

### 2. `price_history` Table
```sql
create table price_history (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  price numeric(10, 2) not null,
  currency text default 'USD' not null,
  checked_at timestamptz default now() not null
);
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the project and populate the following keys:

```ini
# Scraper Configuration
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email configuration
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev # or verified domain

# Cron Scheduler Secret
CRON_SECRET=your_cron_job_auth_secret_key

# Production Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build Validation
To verify compiling behavior and types, compile the project production build:
```bash
npm run build
```

---

## 🌍 Vercel Deployment

For comprehensive step-by-step instructions on deploying the application to Vercel, setting up database redirect callbacks, and configuring automatic background cron schedules, refer to the [Vercel Deployment Guide](file:///C:/Users/Vishu/.gemini/antigravity-ide/brain/65ffef77-3914-47a8-aa37-7c347bbac574/vercel_deployment.md).
