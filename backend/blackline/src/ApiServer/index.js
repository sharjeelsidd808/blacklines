const RouteFactory = require('./routes')

const listen = (input = {}) => new Promise((resolve) => {
    const { app, port } = input
    const server = app.listen(port, () => {
        resolve(server)
    })
})

const ApiServerFactory = async (input = {}) => {
    const { utils, app } = input
    const { modules, config, logger } = utils
    const { express, path } = modules

    const api = express()
    api.use(express.static(path.join(__dirname , '../../public/')))
    api.use(express.json())
    api.use(modules.cors())

    const routes = await RouteFactory(input)
    api.use('/', routes)

    const server = await listen({ app: api, port: config.port })

    logger.info(`server listening on port ${config.port}`)
    return server
}

module.exports = ApiServerFactory
