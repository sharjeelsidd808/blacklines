const LocalConfigFactory = async input => {
    const { config, utils } = input
    if (config.loggly && !config.loggly.level) {
        config.loggly.level = utils.constants.LOG.INFO
    }
}

module.exports = LocalConfigFactory
