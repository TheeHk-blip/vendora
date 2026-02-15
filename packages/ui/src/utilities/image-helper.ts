import {BREAKPOINTS, BreakpointKey} from "../../src/constants/breakpoints";

type SizeMapping = {
  [key in BreakpointKey]?: string;
} & {
  default?: string;
};

export function getTailwindSizes(mapping: SizeMapping): string {
  const { default: defaultSize, ...breakpointMapping } = mapping;

  const queries = (Object.keys(breakpointMapping) as BreakpointKey[])  
  .sort((a,b) => parseInt(BREAKPOINTS[b]) - parseInt(BREAKPOINTS[a]))
  .map((key) => {
    const width = breakpointMapping[key];
    return `(min-width: ${BREAKPOINTS[key]}) ${width}`;
  });

  return [...queries, defaultSize || "100vw"].join(", ");
}