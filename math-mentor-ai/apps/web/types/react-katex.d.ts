declare module 'react-katex' {
  import * as React from 'react';
  export const BlockMath: React.FC<{ children?: React.ReactNode; renderError?: (error: Error) => React.ReactNode }>;
  export const InlineMath: React.FC<{ children?: React.ReactNode; renderError?: (error: Error) => React.ReactNode }>;
}