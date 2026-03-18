# CES Sales System - Technical Specification

## Project Overview
- **Project Name**: CES Sales CRM
- **Type**: Web Application (Mobile-responsive)
- **Core Functionality**: Sales project management with deal tracking, reporting, and role-based access
- **Target Users**: Sales team, Sales Managers

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **State**: React Query + Zustand

## UI/UX Specification

### Color Palette
```css
--primary: #0F172A       /* Slate 900 - Main dark */
--primary-light: #1E293B /* Slate 800 */
--accent: #3B82F6        /* Blue 500 - Actions */
--accent-hover: #2563EB  /* Blue 600 */
--success: #10B981       /* Emerald 500 */
--warning: #F59E0B       /* Amber 500 */
--danger: #EF4444        /* Red 500 */
--background: #F8FAFC    /* Slate 50 */
--surface: #FFFFFF       /* White cards */
--text-primary: #0F172A  /* Slate 900 */
--text-secondary: #64748B /* Slate 500 */
--border: #E2E8F0        /* Slate 200 */
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 700 weight
- **Body**: 400/500 weight
- **Sizes**: h1: 32px, h2: 24px, h3: 20px, body: 14-16px

### Layout
- Sidebar navigation (collapsible on mobile)
- Main content area with max-width 1400px
- Card-based content
- Responsive: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

### Components
- Modern cards with subtle shadows
- Rounded corners (8-12px)
- Smooth transitions (150-200ms)
- Loading skeletons
- Toast notifications

## Pages Structure

### 1. Login Page (`/login`)
- Email/Password form
- Modern centered card design
- Logo and branding

### 2. Dashboard (`/dashboard`)
- Welcome message with user name
- Quick stats cards (My Projects, Active Deals, This Month Revenue)
- Recent projects list
- Quick action buttons

### 3. Projects List (`/projects`)
- Filterable/searchable table
- Status badges (NEW/PROGRESS/DONE/CANCELLED)
- Quick actions (view, edit)
- Pagination
- Create new project button

### 4. Project Detail (`/projects/[id]`)
- Project info header
- Tabs: Details, Deals, Activity, Reports
- Follow-up timeline
- Edit capability

### 5. Create/Edit Project (`/projects/new`, `/projects/[id]/edit`)
- Multi-step form or single page form
- Auto-save drafts
- Client info section
- Custom fields

### 6. Reports (`/reports`)
- Monthly/Weekly reports
- Charts (conversion rate, revenue trends)
- Export to PDF/Excel

### 7. Team View - Manager Only (`/team`)
- All sales team members
- Their active projects
- Team performance summary

## Database Schema

### users
```sql
id uuid PRIMARY KEY
email text UNIQUE
password_hash text
name text
role text (SALE, MANAGER, ADMIN)
avatar_url text
created_at timestamptz
updated_at timestamptz
```

### projects
```sql
id uuid PRIMARY KEY
name text
description text
client_name text
client_contact text
status text (NEW, PROGRESS, DONE, CANCELLED)
created_by uuid REFERENCES users(id)
created_at timestamptz
updated_at timestamptz
```

### project_sales (many-to-many)
```sql
project_id uuid REFERENCES projects(id)
sale_id uuid REFERENCES users(id)
PRIMARY KEY (project_id, sale_id)
```

### project_details
```sql
id uuid PRIMARY KEY
project_id uuid REFERENCES projects(id)
requirement text
budget decimal
timeline text
notes text
custom_fields jsonb
```

### deals
```sql
id uuid PRIMARY KEY
project_id uuid REFERENCES projects(id)
value decimal
probability int
stage text (LEAD, PROPOSAL, NEGOTIATION, WON, LOST)
expected_close_date date
created_at timestamptz
updated_at timestamptz
```

### follow_ups
```sql
id uuid PRIMARY KEY
project_id uuid REFERENCES projects(id)
content text
created_by uuid REFERENCES users(id)
created_at timestamptz
```

### reports
```sql
id uuid PRIMARY KEY
sale_id uuid REFERENCES users(id)
period text (WEEKLY, MONTHLY)
new_projects_count int
won_deals_value decimal
conversion_rate decimal
generated_at timestamptz
```

## API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Projects
- GET /api/projects (list, filter by user role)
- POST /api/projects (create)
- GET /api/projects/[id]
- PUT /api/projects/[id]
- DELETE /api/projects/[id]

### Deals
- GET /api/projects/[id]/deals
- POST /api/projects/[id]/deals
- PUT /api/deals/[id]

### Reports
- GET /api/reports
- POST /api/reports/generate

### Team (Manager only)
- GET /api/team
- GET /api/team/[id]/projects

## Acceptance Criteria

1. ✅ User can login with email/password
2. ✅ Sale sees only their own projects
3. ✅ Manager sees all projects
4. ✅ Can create new project with full details
5. ✅ Can track deal stages and values
6. ✅ Can generate reports
7. ✅ UI is modern and responsive
8. ✅ Dark mode support
9. ✅ Mobile-friendly
