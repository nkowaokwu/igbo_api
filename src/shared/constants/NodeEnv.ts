const NodeEnv: NodeJS.ProcessEnv['NODE_ENV'] | 'build' = process.env.NODE_ENV;

export default NodeEnv;
