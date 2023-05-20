declare global {
  interface Console {
    green(message?: any, ...optionalParams: any[]): void;
    blue(message?: any, ...optionalParams: any[]): void;
    red(message?: any, ...optionalParams: any[]): void;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
