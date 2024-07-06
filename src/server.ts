import { PORT } from './config';
import app from './app';

const server = app.listen(PORT, () => {
  console.green(`🟢 Server started on port ${PORT}`); // eslint-disable-line

  /* Used to test server build */
  // @ts-expect-error process.env.NODE_ENV
  if (process.env.NODE_ENV === 'build') {
    console.blue('🧪 Testing server build'); // eslint-disable-line
    setTimeout(() => {
      console.green('✅ Build test passed'); // eslint-disable-line
      process.exit(0);
    }, 5000);
  }
});

export default server;
