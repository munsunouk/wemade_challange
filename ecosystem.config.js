module.exports = {
  apps: [
    {
      name: 'app',
      script: './dist/run/app.js',
      watch: false,
    },
    {
      name: 'api',
      script: './dist/run/api.js', 
      watch: false,
    },
    {
      name: 'donate',
      script: './dist/run/donate.js', 
      watch: false,
    }
  ],
};
  