// Allow importing plain CSS files for global side-effects
declare module '*.css';
declare module '*.scss';

// For CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.css';