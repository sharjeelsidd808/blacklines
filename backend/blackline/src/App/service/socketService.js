const SocketServerFactory = async (_input = {}) => {
    const { app, utils } = _input
    let io
    return {
        setSocketIo: (_io) => {
            io = _io
        },

        onAuthenticate: (data, callback) => {
            const { token } = data
            console.log('got auth');
            callback(false, { user: true }, { status: true })
        },
        onAuthenticated: (socket) => {
            console.log('socket connected ', socket.decoded)
        },
        emitArt: (input) => {
            io.emit("message", {
                event: "art",
                data: input.data
            })
        },
        emitArtCompleted: (input) => {
            console.log("emitting")
            io.emit("message", {
                event: "art_completed",
                data: input.data
            })
        
        }
    }
}

module.exports = SocketServerFactory
