# 🧭 Compass - AI-Powered Career Coaching Platform

A Next.js 14 application that provides personalized career coaching through AI-powered conversations, automatic profile updates via function calling, and real-time progress visualization.

## ✨ Features

- **🤖 AI Career Coach**: Chat with intelligent AI using OpenRouter's multi-model routing
- **📊 Skills Tracking**: Visual progress bars with @ramonak/react-progress-bar
- **🎯 Goal Management**: Set and track career objectives with AI assistance
- **📈 Analytics Dashboard**: Beautiful charts and metrics with Tremor React
- **⚡ Real-time Updates**: Automatic profile updates through function calling
- **💰 Cost Optimized**: Smart AI model routing to minimize costs ($0.05-0.17/user/month)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **AI Integration**: OpenRouter for multi-model AI routing
- **Chat Interface**: Assistant UI for composable chat components
- **Database**: Supabase for authentication and data persistence
- **Caching**: Upstash Redis for serverless caching
- **UI Components**: Tremor React for dashboard analytics
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for client-side state
- **Progress Visualization**: @ramonak/react-progress-bar

### Key Integrations
- **OpenRouter**: DeepSeek V3, Gemini 2.0 Flash, DeepSeek R1, GPT-4o Mini
- **Assistant UI**: Streaming chat with auto-scrolling and accessibility
- **Upstash Redis**: HTTP-based caching for Edge functions
- **Tremor**: Professional dashboard components
- **Supabase**: Real-time database with authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/compass-app.git
cd compass-app/apps/web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `apps/web` directory:

```env
# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Upstash Redis  
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=your_google_analytics_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `packages/database/migrations/`
3. Update your `.env.local` with Supabase credentials

### 5. Redis Setup (Upstash)

1. Create a Redis database at [upstash.com](https://upstash.com)
2. Get your REST URL and token
3. Update your `.env.local` with Upstash credentials

### 6. AI Setup (OpenRouter)

1. Create an account at [openrouter.ai](https://openrouter.ai)
2. Get your API key from the dashboard
3. Add credits to your account (minimum $5 recommended)
4. Update your `.env.local` with OpenRouter API key

### 7. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main app pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── integrations/          # Third-party integrations
│   │   ├── openrouter/        # AI model routing
│   │   ├── assistant-ui/      # Chat interface
│   │   ├── upstash/           # Redis caching
│   │   ├── supabase/          # Database & auth
│   │   └── tremor/            # Dashboard theme
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── chat/              # Chat interface
│   │   ├── profile/           # Profile components
│   │   ├── analytics/         # Dashboard charts
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utilities and types
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state management
│   └── styles/                # Global styles
├── public/                    # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── next.config.js            # Next.js configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Configuration

### AI Model Selection
The app automatically selects the optimal AI model based on query complexity:

- **Simple queries**: DeepSeek V3 (ultra low cost)
- **Complex analysis**: Gemini 2.0 Flash (free tier)
- **Reasoning tasks**: DeepSeek R1 (advanced reasoning)
- **Function calling**: GPT-4o Mini (reliable)

### Cost Optimization
- Smart model routing keeps costs under $0.17/user/month
- Response caching reduces duplicate API calls
- Configurable cost limits per request

### Function Calling
AI automatically updates user profiles through function calls:
- `updateUserProfile`: Add skills and experience
- `setCareerGoals`: Create short/long-term goals  
- `trackProgress`: Monitor skill development

## 🧪 Development

### Adding New AI Functions
1. Define function schema in `src/integrations/assistant-ui/config.ts`
2. Implement function handler in `src/app/api/ai/route.ts`
3. Update database schema if needed

### Customizing UI Theme
Modify `src/integrations/tremor/theme.ts` to customize:
- Color palette for different metrics
- Chart configurations
- Progress bar styling
- Animation settings

### Adding New Components
Use the established patterns:
- Place in appropriate `/components` subdirectory
- Follow TypeScript interfaces in `/lib/types.ts`
- Use Tailwind classes with `/lib/utils.ts` helpers

## 📊 Analytics & Monitoring

The app tracks:
- AI model usage and costs
- User skill progress over time
- Goal completion rates
- Chat session analytics
- Function call success rates

Access analytics at `/analytics` in the dashboard.

## 🔐 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- Rate limiting on AI API calls
- Input validation and sanitization
- Secure function calling with parameter validation

## 📚 API Documentation

### AI Chat Endpoint
```
POST /api/ai
Content-Type: application/json

{
  "message": "Help me improve my JavaScript skills",
  "sessionId": "session_123",
  "userId": "user_456",
  "context": {
    "type": "skill_assessment"
  }
}
```

### Response Format
```json
{
  "content": "AI response content",
  "model": "deepseek/deepseek-v3",
  "cost": 0.0012,
  "functionResults": [
    {
      "function": "updateUserProfile",
      "result": {
        "message": "Profile updated successfully"
      }
    }
  ],
  "cached": false
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Ensure all service credentials are production-ready
- Configure proper CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Integration Docs**: 
  - [OpenRouter](https://openrouter.ai/docs)
  - [Assistant UI](https://github.com/assistant-ui/assistant-ui)
  - [Tremor React](https://tremor.so/docs)
  - [Upstash](https://upstash.com/docs)
  - [Supabase](https://supabase.com/docs)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced skill assessments
- [ ] Career path recommendations
- [ ] Integration with job boards
- [ ] Team/organization features
- [ ] Advanced analytics and reporting

---

Built with ❤️ using Next.js 14, OpenRouter AI, and modern web technologies. 