const SocketServerFactory = async (_input = {}) => {
    const { app, apiServer, utils } = _input
    const { modules, logger } = utils
    const { SocketAuth, socketIO } = modules
    const { service } = app
    const { socketService } = service

    const socketAuth = new SocketAuth({
        authenticate : socketService.onAuthenticate,
        authenticated: socketService.onAuthenticated
    })

    const io = socketIO(apiServer)
    io.sockets.on('connection', (socket) => {
        // socketAuth.authenticate(socket)
        console.log("socket connected")
        setTimeout(()=>{
            io.emit("message", { event: "connected"})
        })
    })
    socketService.setSocketIo(io)
}

module.exports = SocketServerFactory
