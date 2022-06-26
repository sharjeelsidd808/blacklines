const LogManagerFactory = require('./LogManager')

const LoggerFactory = async (input = {}) => {
    const { config } = input
    const logConfig = {
        console: config.console,
        name   : config.name
    }
    const LogManager = await LogManagerFactory(input)
    const logger = LogManager.createLogger(logConfig)
    return logger
}

module.exports = LoggerFactory
