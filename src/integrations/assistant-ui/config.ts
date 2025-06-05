// Assistant UI configuration for Compass career coaching interface
// Customizes appearance, behavior, and function calling capabilities

export const ASSISTANT_CONFIG = {
  // UI Theme Configuration
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  },

  // Message Configuration
  messages: {
    // Welcome message for new users
    welcome: {
      text: "Hi! I'm your AI career coach. Let's discuss your professional goals and I'll help track your progress.",
      type: 'assistant' as const,
      showActions: true,
    },
    
    // Suggested prompts for career coaching
    suggestions: [
      "Help me plan my career transition",
      "Assess my current skills",
      "Set professional development goals",
      "Analyze job market trends",
    ],
    
    // Function calling prompts
    functionCallPrompts: {
      updateSkills: "I'll update your skills profile based on our conversation.",
      setGoals: "Let me help you set and track career goals.",
      analyzeProgress: "I'll analyze your progress and provide insights.",
    }
  },

  // Function Calling Configuration
  functions: [
    {
      name: 'updateUserProfile',
      description: 'Update user profile with new skills or information',
      parameters: {
        type: 'object',
        properties: {
          skills: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of skills to add or update'
          },
          experience: {
            type: 'string',
            description: 'Years of experience or level'
          },
          interests: {
            type: 'array',
            items: { type: 'string' },
            description: 'Career interests or focus areas'
          }
        }
      }
    },
    {
      name: 'setCareerGoals',
      description: 'Set or update career goals for the user',
      parameters: {
        type: 'object',
        properties: {
          shortTerm: {
            type: 'array',
            items: { type: 'string' },
            description: 'Short-term goals (3-6 months)'
          },
          longTerm: {
            type: 'array',
            items: { type: 'string' },
            description: 'Long-term goals (1-5 years)'
          },
          priority: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
            description: 'Goal priority level'
          }
        }
      }
    },
    {
      name: 'trackProgress',
      description: 'Track progress on skills or goals',
      parameters: {
        type: 'object',
        properties: {
          skillName: {
            type: 'string',
            description: 'Name of the skill being tracked'
          },
          progressPercentage: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Progress percentage (0-100)'
          },
          notes: {
            type: 'string',
            description: 'Additional notes or context'
          }
        }
      }
    }
  ],

  // Performance Settings
  performance: {
    maxTokens: 1000,
    temperature: 0.7,
    streamingEnabled: true,
    retryAttempts: 3,
  }
} as const

export type AssistantConfig = typeof ASSISTANT_CONFIG 