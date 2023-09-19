declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // @ts-expect-error  Nodejs process override
      readonly NODE_ENV: 'development' | 'production' | 'test' | 'build';
      readonly JWT_SECRET: '@developer@NkowaOkwu@secret@key@';
    }
  }
}

export {};
