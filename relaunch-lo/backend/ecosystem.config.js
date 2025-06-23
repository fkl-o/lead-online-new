module.exports = {
  apps: [{
    name: "leadgen-backend",
    script: "server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 10000
    }
  }]
};
