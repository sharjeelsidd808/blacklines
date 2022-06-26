class SocketAuth {
    constructor(input = {}) {
        const { authenticate, authenticated, timeout } = input
        this.authenticateCB = authenticate
        this.authenticatedCB = authenticated
        this.timeout = timeout || 3000 // 3secs by default
        this.authenticate = this.authenticate.bind(this)
    }

    authenticate(socket) {
        const timer = setTimeout(() => {
            socket.disconnect('Un-Authorized')
        }, this.timeout);
        socket.on('authenticate', (data, callback) => {
            clearTimeout(timer)
            this.authenticateCB(data, (err, decoded, socketResponse) => {
                if (callback) {
                    callback(socketResponse)
                }
                if (err) {
                    socket.disconnect(err)
                } else {
                    // eslint-disable-next-line no-param-reassign
                    socket.decoded = decoded
                    this.authenticatedCB(socket)
                }
            })
        })
    }
}

module.exports = SocketAuth
