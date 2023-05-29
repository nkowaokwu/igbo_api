declare global {
  interface Console {
    green(message?: any, ...optionalParams: any[]): void;
    blue(message?: any, ...optionalParams: any[]): void;
    red(message?: any, ...optionalParams: any[]): void;
  }
}

export {};
