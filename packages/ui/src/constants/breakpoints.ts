export const BREAKPOINTS = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",  
  "2xl": "1536px",
  "3xl": "1600px"
} as const;

export type  BreakpointKey = keyof typeof BREAKPOINTS;