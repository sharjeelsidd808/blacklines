module.exports = {
    apps: [
        {
            name              : 'BlackLine',
            script            : 'src/index.js',
            autorestart       : true,
            watch             : false,
            max_memory_restart: '1G'
        }
    ]
}
