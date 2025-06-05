// Tremor theme configuration for Compass career coaching dashboard
// Customizes colors, typography, and component styles

export const TREMOR_THEME = {
  // Color palette for career coaching metrics
  colors: {
    // Primary brand colors
    blue: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Success metrics (goals achieved, skills improved)
    emerald: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Success
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    
    // Warning metrics (goals at risk, skill gaps)
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Warning
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Error metrics (overdue goals, declining metrics)
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Error
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Neutral colors for backgrounds and text
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  },

  // Typography configuration
  typography: {
    fontFamily: {
      default: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      'tremor-label': ['12px', '16px'],
      'tremor-default': ['14px', '20px'],
      'tremor-title': ['16px', '24px'],
      'tremor-metric': ['24px', '32px'],
    }
  },

  // Component-specific configurations
  components: {
    // Card configurations for metrics
    card: {
      padding: '24px',
      borderRadius: '12px',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
    },
    
    // Chart configurations  
    chart: {
      height: '300px',
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      grid: {
        strokeDasharray: '3 3',
        stroke: '#e2e8f0',
      },
      axis: {
        fontSize: '12px',
        fill: '#64748b',
      }
    },
    
    // Progress bar configurations
    progressBar: {
      height: '8px',
      borderRadius: '4px',
      backgroundColor: '#f1f5f9',
      colors: {
        skill: '#3b82f6',
        goal: '#10b981',
        overall: '#8b5cf6',
      }
    },
    
    // Metric configurations
    metric: {
      trend: {
        up: {
          color: '#10b981',
          icon: '↗',
        },
        down: {
          color: '#ef4444', 
          icon: '↘',
        },
        flat: {
          color: '#64748b',
          icon: '→',
        }
      }
    }
  },

  // Animation and interaction settings
  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const

// Helper function to get color by progress percentage
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return TREMOR_THEME.colors.emerald[500]
  if (percentage >= 60) return TREMOR_THEME.colors.blue[500]
  if (percentage >= 40) return TREMOR_THEME.colors.amber[500]
  return TREMOR_THEME.colors.red[500]
}

// Helper function to get trend color and icon
export function getTrendIndicator(current: number, previous: number) {
  const change = current - previous
  const percentage = previous === 0 ? 0 : (change / previous) * 100
  
  if (percentage > 5) {
    return {
      color: TREMOR_THEME.components.metric.trend.up.color,
      icon: TREMOR_THEME.components.metric.trend.up.icon,
      text: `+${percentage.toFixed(1)}%`
    }
  } else if (percentage < -5) {
    return {
      color: TREMOR_THEME.components.metric.trend.down.color,
      icon: TREMOR_THEME.components.metric.trend.down.icon,
      text: `${percentage.toFixed(1)}%`
    }
  } else {
    return {
      color: TREMOR_THEME.components.metric.trend.flat.color,
      icon: TREMOR_THEME.components.metric.trend.flat.icon,
      text: `${percentage.toFixed(1)}%`
    }
  }
}

export type TremorTheme = typeof TREMOR_THEME 