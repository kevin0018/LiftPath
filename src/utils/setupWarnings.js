// Filter out specific React Native Web and Expo warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const warningMessage = args.join(' ');
  
  // List of warning messages to ignore
  const ignoredWarnings = [
    'shadow* style props are deprecated',
    'props.pointerEvents is deprecated',
    'style.resizeMode is deprecated',
  ];

  // Check if the warning message includes any of the ignored patterns
  if (!ignoredWarnings.some(warning => warningMessage.includes(warning))) {
    originalConsoleWarn(...args);
  }
};
