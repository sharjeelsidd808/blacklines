const packageJson = require('../package.json')
const envJson = require('../.env.json')
const UtilsFactory = require('./utils')
const DatabaseFactory = require('./database')
const AppFactory = require('./App')
const ApiServerFactory = require('./ApiServer')
const SocketServerFactory = require('./SocketServer')

const initialize = async () => {
    if (!envJson.NODE_ENV) {
        throw new Error('NODE_ENV is required')
    }
    const utils = await UtilsFactory({ envJson, packageJson })
    const { logger } = utils
    
    const database = await DatabaseFactory({ utils })
    logger.info('database initialized')

    const app = await AppFactory({ utils, database })
    logger.info('application initialized')

    // eslint-disable-next-line no-unused-vars
    const apiServer = await ApiServerFactory({ utils, database, app })
    logger.info('ApiServer initialized')

    await SocketServerFactory({ utils, app, apiServer })
}

initialize()
