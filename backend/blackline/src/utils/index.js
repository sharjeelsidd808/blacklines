const modules = require('./modules')
const Constants = require('./constants')
const LoggerFactory = require('./logger')
const ConfigFactory = require('./config')
const ValidatorFactory = require('./Validator')

const UtilsFactory = async (input = {}) => {
    const { envJson, packageJson } = input
    const config = await ConfigFactory({ envJson, packageJson })
    const logger = await LoggerFactory({ config, modules })
    const validator = await ValidatorFactory({ modules })
    const utils = {
        Constants,
        modules,
        config,
        logger,
        validator
    }
    return utils
}

module.exports = UtilsFactory
