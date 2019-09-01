module.exports = {
  apps : [{
    name: 'ADMIN-SERVER',
    script: 'server.js',
    autorestart: true,
    watch: false,
    env: {
      PORT:"4000",
      NODE_ENV: 'development'
    },
    env_production: {
      PORT:"60000",
      NODE_ENV: 'production'
    },
    error_file: "./err.log",
    out_file: "./out.log"
  }],
};
