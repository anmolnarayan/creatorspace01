# CreatorSpace

**AI-Powered Cofounder & Campus Launchpad for Student Builders**

CreatorSpace is a production-ready MVP web application that helps students build verified projects, get mentor reviews, and launch their careers. From idea to portfolio-ready in weeks.

## 🚀 Features

- **Launch Packs**: Structured project templates with milestones
- **AI Guidance**: Get instant help with ideas, milestone breakdowns, and implementation checklists
- **Mentor Reviews**: Get verified by experienced mentors and build your reliability score
- **Verified Portfolios**: Shareable, recruiter-ready project portfolios
- **Role-Based Access**: Student, Mentor, and Admin dashboards

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI API (GPT-3.5) with caching
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- GitHub account (for deployment)

## 🏗️ Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd CreativeSpace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file to create the database schema:

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Copy and paste the SQL from supabase/migrations/001_initial_schema.sql
# into the Supabase SQL Editor and run it
```

The migration file is located at: `supabase/migrations/001_initial_schema.sql`

### 5. Seed the Database

Run the seed script to create sample launch packs and milestones:

```bash
npm run db:seed
```

Or use the admin UI at `/admin/seed` (requires admin role).

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
CreativeSpace/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── launch-packs/      # Launch pack pages
│   ├── projects/          # Project workspace
│   ├── mentor/            # Mentor review pages
│   ├── portfolio/         # Public portfolio pages
│   └── admin/             # Admin pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── dashboard/        # Dashboard components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   └── openai.ts         # OpenAI integration
├── supabase/
│   └── migrations/       # Database migrations
└── scripts/              # Seed and utility scripts
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Set Up GitHub Actions

The CI/CD pipeline is configured in `.github/workflows/ci.yml`. It will:
- Run linting and type checking
- Run tests
- Build the application

Make sure to add the following secrets to your GitHub repository:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Database Schema

Key tables:
- `users` - User profiles with roles (student, mentor, admin)
- `launch_packs` - Project templates
- `milestones` - Milestones for each launch pack
- `projects` - User projects
- `project_milestones` - Project milestone tracking
- `reviews` - Mentor reviews
- `portfolios` - Verified project portfolios
- `ai_cache` - Cached AI responses

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## 🔐 Authentication

CreatorSpace uses Supabase Auth with:
- Email/password authentication
- Magic link authentication
- Role-based access control (RLS policies)

## 🤖 AI Features

The app includes AI-powered features:
- **Idea Generator**: Suggest project ideas based on skills and goals
- **Milestone Breaker**: Break projects into milestones
- **Milestone Helper**: Get step-by-step guidance for milestones
- **Portfolio Blurb**: Generate recruiter-friendly descriptions

All AI responses are cached to reduce costs.

## 👥 User Roles

- **Student**: Can start launch packs, build projects, request reviews
- **Mentor**: Can review student projects and verify them
- **Admin**: Can manage users, launch packs, and view metrics

## 📝 Seed Data

The seed script creates:
- 3 Launch Packs (WebApp, DataProject, StartupMVP)
- Milestones for each launch pack
- Sample data structure

Run with: `npm run db:seed`

## 🎯 Core Flows

1. **Student Onboarding**: Sign up → Choose launch pack → Start project
2. **Project Workspace**: Track milestones → Get AI help → Request review
3. **Mentor Review**: Review project → Verify if criteria met → Create portfolio
4. **Public Portfolio**: Share verified projects with recruiters

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run db:seed` - Seed database

## 📚 API Routes

- `/api/projects/start` - Start a new project from a launch pack
- `/api/projects/[id]` - Update project
- `/api/projects/milestones/[id]` - Update project milestone
- `/api/projects/request-review` - Request mentor review
- `/api/reviews/[id]` - Update review
- `/api/portfolios/create` - Create portfolio
- `/api/ai/help` - Get AI help for milestone
- `/api/admin/seed` - Seed data (admin only)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your Supabase credentials in `.env.local`
- Check that RLS policies are correctly set up
- Ensure the migration has been run

### OpenAI API Issues
- Verify your API key is set correctly
- Check API rate limits and usage
- Responses are cached, so check the `ai_cache` table

### Authentication Issues
- Ensure Supabase Auth is enabled
- Check email confirmation settings
- Verify RLS policies allow access

## 📄 License

This project is proprietary. All rights reserved.

## 👤 Support

For issues and questions, please open an issue on GitHub or contact the development team.

## 🎬 Demo Credentials

After seeding, you can create test accounts through the signup flow. For admin access, update a user's role in the Supabase dashboard:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 📈 Pilot Plan

**30 Students, 4-6 Weeks**

### Metrics to Collect:
- Signups per week
- Active projects
- Completed projects
- Verified projects
- Average review time
- Reliability score distribution
- AI help usage

### Success Criteria:
- 30+ student signups
- 20+ active projects
- 10+ verified projects
- Average review time < 10 minutes
- Student satisfaction score > 4/5

---

Built with ❤️ for student builders

