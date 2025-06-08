# Compass Career Coaching App - Documentation for Claude

## 🎯 Project Overview

Compass is a modern career coaching web application built with Next.js 14 that integrates real AI functionality using OpenAI GPT-4o Mini. The app features an intelligent Russian-speaking career coach that automatically analyzes conversations and updates user profiles through function calling.

## 🚀 Current Status: FULLY WORKING

✅ **OpenAI GPT-4o Mini Integration** - Real AI responses instead of mock data  
✅ **Function Calling** - Automatic profile updates from conversation analysis  
✅ **Dual-Panel Interface** - Chat on left, profile updates on right  
✅ **Russian Language Support** - AI responds in Russian for career coaching  
✅ **Robust Error Handling** - Comprehensive logging and error recovery  
✅ **Stable Implementation** - Non-streaming approach for reliability  

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
- **App Router** - Modern Next.js routing with `src/app/` structure
- **Server & Client Components** - Optimized rendering strategy
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Modern icon library

### Backend (API Routes)
- **OpenAI SDK** - Direct integration with GPT-4o Mini
- **Function Calling** - Structured data extraction from conversations
- **Error Handling** - Comprehensive error management and logging

### AI Integration
- **Model**: GPT-4o Mini
- **Approach**: Traditional function calling (non-streaming)
- **Language**: Russian for career coaching
- **Function**: `update_profile` for automatic profile updates

## 📁 Project Structure

```
compass-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai/
│   │   │       └── route.ts          # OpenAI API integration
│   │   ├── chat/
│   │   │   └── page.tsx              # Chat page with layout
│   │   ├── profile/
│   │   │   └── page.tsx              # User profile page
│   │   ├── analytics/
│   │   │   └── page.tsx              # Analytics dashboard
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatInterface.tsx     # Main chat component
│   │   ├── layout/
│   │   │   └── Header.tsx            # Navigation header
│   │   └── ui/                       # Reusable UI components
│   └── lib/                          # Utility functions
├── .env.local                        # Environment variables (OpenAI API key)
├── package.json                      # Dependencies and scripts
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.js                   # Next.js configuration
```

## 🔧 Key Components

### 1. ChatInterface (`src/components/chat/ChatInterface.tsx`)

**Purpose**: Main chat component with dual-panel layout  
**Features**:
- Real-time chat with OpenAI GPT-4o Mini
- Automatic profile updates via function calling
- Dual-panel layout (chat + profile updates)
- Error handling and loading states
- Russian language support

**Key State**:
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [profileUpdates, setProfileUpdates] = useState<ProfileUpdate[]>([])
const [isLoading, setIsLoading] = useState(false)
```

**Function Calling Integration**:
- Receives function call results from API
- Updates right panel with extracted profile data
- Dispatches custom events for profile updates

### 2. AI API Route (`src/app/api/ai/route.ts`)

**Purpose**: OpenAI integration with function calling  
**Features**:
- GPT-4o Mini integration with OpenAI SDK
- Function calling for profile data extraction
- Comprehensive error handling and logging
- Russian career coaching personality

**Function Schema**:
```typescript
const profileUpdateFunction = {
  name: 'update_profile',
  description: 'Updates user profile based on conversation analysis',
  parameters: {
    type: 'object',
    properties: {
      skills: { /* skill objects with name, level, change */ },
      current_role: { type: 'string' },
      target_role: { type: 'string' },
      experience_years: { type: 'number' },
      goals: { type: 'array', items: { type: 'string' } }
    }
  }
}
```

**AI Personality**:
- Russian-speaking career coach named "Compass"
- Analyzes conversations for career-related information
- Always provides helpful text responses alongside function calls
- Focuses on skills, experience, goals, and career transitions

## 🛠️ Setup Instructions

### 1. Environment Setup

Create `.env.local` with your OpenAI API key:
```env
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: 
- Get your API key from https://platform.openai.com/api-keys
- Never commit your actual API key to version control
- The `.env.local` file is in `.gitignore` for security

### 2. Installation & Run

```bash
# Install dependencies
npm install

# Run development server on port 3001
$env:PORT=3001; npm run dev

# Or default port 3000
npm run dev
```

### 3. Access Points

- **Main App**: http://localhost:3001
- **Chat Interface**: http://localhost:3001/chat
- **Profile Page**: http://localhost:3001/profile
- **Analytics**: http://localhost:3001/analytics

## 📡 API Endpoints

### POST `/api/ai`

**Purpose**: Process chat messages with OpenAI and function calling

**Request**:
```json
{
  "messages": [
    { "role": "user", "content": "Я работаю Python разработчиком 3 года" }
  ]
}
```

**Response**:
```json
{
  "content": "Отлично! Я записал что ты Python разработчик с 3 годами опыта. Расскажи больше о своих проектах!",
  "functionCall": {
    "current_role": "Python Developer",
    "experience_years": 3,
    "skills": [
      {
        "name": "Python",
        "level": 70,
        "change": "основной язык программирования"
      }
    ]
  },
  "model": "gpt-4o-mini"
}
```

## 🎨 User Interface

### Chat Layout
- **Left Panel**: Chat messages with user/AI conversation
- **Right Panel**: Real-time profile updates from function calling
- **Input Area**: Text area with send button
- **Loading States**: Animated indicators during API calls

### Profile Updates Panel
Shows extracted information:
- ⏰ **Timestamp** of each update
- **Роль** (Current Role)
- **Цель** (Target Role)
- **Опыт** (Years of Experience)
- **Навыки** (Skills with levels 0-100)
- **Цели** (Career Goals)

## 🔍 Function Calling Details

### Trigger Conditions
AI calls `update_profile` when users mention:
- Current job title or role
- Target career goals
- Years of experience
- Specific skills or technologies
- Career objectives or plans

### Data Extraction Examples
- "Я Frontend разработчик" → `current_role: "Frontend Developer"`
- "Хочу стать техлидом" → `target_role: "Tech Lead"`
- "Работаю 5 лет" → `experience_years: 5`
- "Изучаю React" → `skills: [{name: "React", level: 30, change: "изучаю"}]`

### Always Text + Function
AI is configured to ALWAYS provide a text response alongside function calls:
```
Function Call: update_profile(...)
Text Response: "Отлично! Я записал информацию о твоем опыте. Расскажи больше!"
```

## 🐛 Debugging & Logging

### Frontend Logging
```javascript
console.log('📤 Sending message:', userMessage.content)
console.log('📨 API Response data:', data)
console.log('🔄 Processing function call:', data.functionCall)
```

### Backend Logging
```javascript
console.log('🚀 API /ai called')
console.log('🤖 Calling OpenAI with function calling...')
console.log('✅ OpenAI response received')
console.log('📤 Sending response with content:', content)
```

## 🔧 Technical Implementation Notes

### OpenAI Integration
- **SDK**: Official OpenAI Node.js SDK
- **Model**: gpt-4o-mini for cost efficiency
- **Approach**: Traditional completion (non-streaming) for stability
- **Function Calling**: Legacy format for better compatibility

### Error Handling
- API key validation
- Network error recovery
- Function call parsing errors
- Fallback responses for edge cases

### Performance Optimizations
- Component-level state management
- Efficient re-renders with proper React patterns
- Minimal API calls with request consolidation

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "14.2.29",
  "react": "^18",
  "typescript": "^5",
  "openai": "latest",
  "lucide-react": "latest",
  "tailwindcss": "^3"
}
```

### Key Features by Dependency
- **OpenAI SDK**: Real AI integration and function calling
- **Lucide React**: Modern icons for UI
- **Tailwind CSS**: Utility-first styling system
- **TypeScript**: Type safety throughout the application

## 🚀 Development Workflow

### Testing Function Calling
1. Start development server: `$env:PORT=3001; npm run dev`
2. Navigate to `/chat`
3. Send career-related messages in Russian:
   - "Я работаю разработчиком 2 года"
   - "Хочу стать тимлидом"
   - "Изучаю TypeScript и Next.js"
4. Observe right panel for automatic profile updates
5. Check browser console for detailed logging

### Common Development Tasks
- **Add new function parameters**: Modify `profileUpdateFunction` schema
- **Update AI personality**: Edit system prompt in API route
- **Modify UI layout**: Update `ChatInterface.tsx` component
- **Add new API endpoints**: Create routes in `src/app/api/`

## 🌟 Success Metrics

The application successfully demonstrates:
✅ Real AI integration with OpenAI GPT-4o Mini  
✅ Functional career coaching in Russian language  
✅ Automatic profile data extraction via function calling  
✅ Stable, production-ready implementation  
✅ Modern Next.js 14 best practices  
✅ Comprehensive error handling and logging  
✅ User-friendly dual-panel interface  

## 🔮 Future Enhancements

Potential improvements for future development:
- Database integration for persistent profiles
- User authentication and multi-user support
- Advanced analytics and career insights
- Streaming responses for better UX
- Mobile-responsive design improvements
- Integration with external career APIs

## 📞 Support & Maintenance

For development support:
- Check browser console for detailed error logs
- Monitor server terminal for API debugging information
- Verify OpenAI API key configuration in `.env.local`
- Test function calling with various Russian career phrases

---

**Last Updated**: January 2025  
**Version**: 1.0.0 - Full OpenAI Integration  
**Status**: Production Ready ✅ 