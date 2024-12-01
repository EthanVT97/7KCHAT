module.exports = {
    apps: [{
        name: 'seven7k-chat',
        script: './backend/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
}; 