# Smart Teacher - Qatar MoE Lesson Builder

**المعلّم الذكي** - A professional bilingual (Arabic/English) web application for Qatar Ministry of Education that helps teachers create structured lesson plans, generate slide decks, build question banks, and design interactive learning games.

## Features

### 🎓 Core Modules

1. **Qatar-MoE Structured Lesson Plans**
   - Template fields aligned with Qatar Ministry of Education standards
   - Bilingual support (Arabic/English) with full RTL layout
   - 5E Model: Engage → Explore → Explain → Elaborate → Evaluate
   - SMART learning objectives
   - Differentiation strategies (support & challenge activities)
   - Formative and summative assessment planning
   - Time allocation management
   - AI-assisted lesson generation (coming soon)

2. **Slide Deck Generator**
   - Auto-generate presentation slides from lesson plans
   - Question slides with model answers
   - Speaker notes and bilingual labels
   - Export to PPTX and PDF formats

3. **Question Bank (Item Authoring)**
   - Multiple item types: MCQ, Multi-select, True/False, Short Answer, Matching, Ordering, Cloze
   - Metadata: subject, grade, standard/LO, difficulty (1-5), Bloom's level
   - Bulk import/export (CSV, Excel, QTI 2.2)
   - AI-assisted question generation
   - Assessment assembly from question filters

4. **Interactive Game Designer**
   - Game templates: Timed Quiz, Drag-and-Drop Match, Memory Cards, Sort/Order, Hotspot Click
   - Visual editor with image/audio support
   - Preview and sharing capabilities
   - Export: HTML bundle (.zip) and SCORM 1.2/2004

5. **Role-Based Access Control**
   - **Teacher**: Create and manage own lessons, questions, games
   - **HOD (Head of Department)**: Review and approve lessons, export school-level reports
   - **Admin**: Manage users, taxonomy, system settings

6. **Analytics Dashboard**
   - Track content creation metrics
   - Usage analytics per user
   - Most-used standards and learning outcomes

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Next.js App Router** (via Vite)
- **TailwindCSS 4** + shadcn/ui components
- **RTL Support** with language context
- **Bilingual i18n** (Arabic/English)

### Backend
- **Node.js** with Express
- **tRPC** for type-safe API
- **Drizzle ORM** for database management

### Database
- **MySQL/TiDB** with Drizzle migrations
- Comprehensive schema for lessons, questions, assessments, games, analytics

### Integrations
- **S3-compatible storage** for PPTX/PDF/ZIP exports
- **OAuth** for authentication (Manus OAuth)
- **LLM integration** for AI-assisted content generation

## Project Structure

```
smart-teacher/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Language, Theme)
│   │   ├── lib/              # Utilities (tRPC client)
│   │   └── App.tsx           # Main router
│   └── public/               # Static assets
├── server/                    # Node.js backend
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   └── _core/                # Framework internals
├── drizzle/                   # Database schema & migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # Migration files
├── scripts/                   # Utility scripts
│   └── seed.ts               # Database seeding
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL/TiDB database
- Environment variables configured

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.sample .env
   # Edit .env with your database URL and OAuth credentials
   ```

3. **Initialize database**
   ```bash
   pnpm db:push
   ```

4. **Seed initial data** (optional)
   ```bash
   pnpm tsx scripts/seed.ts
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## Database Schema

### Core Tables
- **users** - User accounts with roles (teacher, hod, admin)
- **subjects** - Subject taxonomy (Mathematics, Science, etc.)
- **grades** - Grade levels (Grade 1-12)
- **standards** - Qatar MoE learning standards/outcomes
- **lessons** - Structured lesson plans
- **slides** - Generated presentation decks
- **questions** - Question bank items
- **assessments** - Assessment collections
- **games** - Interactive learning games
- **analytics** - User activity tracking
- **approvals** - HOD approval workflow

## Bilingual Support

The platform is fully bilingual with:
- **Arabic (RTL)** and **English (LTR)** interface
- Language toggle in the header
- Automatic text direction based on selected language
- Comprehensive i18n translations in `LanguageContext`

## Branding

- **Primary Color**: Maroon (#8A1538)
- **Accent Color**: Gold (#C9A646)
- **Typography**: Cairo (Arabic) + Inter/Segoe UI (English)
- **Professional footer** with bilingual contact information

## API Routes (tRPC)

### Taxonomy
- `taxonomy.getSubjects` - Get all subjects
- `taxonomy.getGrades` - Get all grades
- `taxonomy.getStandardsBySubjectAndGrade` - Get standards by filters

### Lessons
- `lessons.list` - Get user's lessons
- `lessons.getById` - Get lesson details
- `lessons.create` - Create new lesson
- `lessons.update` - Update lesson
- `lessons.delete` - Delete lesson

### Questions
- `questions.list` - Get user's questions
- `questions.create` - Create new question

### Assessments
- `assessments.list` - Get user's assessments
- `assessments.create` - Create new assessment

### Games
- `games.list` - Get user's games
- `games.create` - Create new game

### Analytics
- `analytics.getMyAnalytics` - Get user's activity
- `analytics.getSummary` - Get content summary

## Deployment

The application is ready for deployment on:
- Docker containers
- Managed platforms (Vercel, Netlify, AWS, Google Cloud)
- Traditional VPS/dedicated servers

### Environment Variables Required
```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=oauth-app-id
OAUTH_SERVER_URL=https://oauth.example.com
VITE_OAUTH_PORTAL_URL=https://login.example.com
BUILT_IN_FORGE_API_URL=https://api.example.com
BUILT_IN_FORGE_API_KEY=api-key
```

## Roadmap

### Phase 1 (Current)
- ✅ Database schema and core API
- ✅ Bilingual UI with RTL support
- ✅ Dashboard and navigation
- ✅ Lesson management CRUD
- 🔄 Lesson creation form with AI assistance

### Phase 2
- Slide deck generation from lessons
- Question bank with item authoring
- Assessment assembly
- Game designer

### Phase 3
- PDF/DOCX/PPTX export functionality
- QTI 2.2 export for questions
- SCORM export for games
- Analytics dashboard

### Phase 4
- HOD approval workflow
- School-level workspace
- Advanced analytics and reporting
- xAPI LRS integration

## Testing

### E2E Tests (Planned)
```bash
pnpm test:e2e
```

### Unit Tests (Planned)
```bash
pnpm test:unit
```

## Contributing

This is a professional educational platform. For contributions:
1. Follow the existing code style
2. Maintain bilingual support in all features
3. Test with both Arabic and English interfaces
4. Ensure accessibility (WCAG AA)

## License

© 2025 Smart Teacher. All rights reserved.

## Support

For issues, questions, or feature requests, please contact the development team.

---

**Built with ❤️ for Qatar educators**

