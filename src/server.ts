import { PORT } from './config';
import app from './app';

const server = app.listen(PORT, () => {
  console.green(`🟢 Server started on port ${PORT}`);

  /* Used to test server build */
  // @ts-expect-error Nodejs process override
  if (process.env.NODE_ENV === 'build') {
    console.blue('🧪 Testing server build');
    setTimeout(() => {
      console.green('✅ Build test passed');
      process.exit(0);
    }, 5000);
  }
});

export default server;
