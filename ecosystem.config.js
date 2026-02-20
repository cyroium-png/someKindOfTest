module.exports = {
  apps: [
    {
      name: 'secure-backend',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {}
};
