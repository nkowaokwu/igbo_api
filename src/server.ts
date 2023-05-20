import { PORT } from './config';
import app from './app';
import NodeEnv from './shared/constants/NodeEnv';

const server = app.listen(PORT, () => {
  console.green(`🟢 Server started on port ${PORT}`);

  /* Used to test server build */
  if (NodeEnv === 'build') {
    console.blue('🧪 Testing server build');
    setTimeout(() => {
      console.green('✅ Build test passed');
      process.exit(0);
    }, 5000);
  }
});

export default server;
