const StatusServiceFactory = async (_input = {}) => {
    const { utils } = _input
    const { config } = utils

    const getStatus = async () => ({ version: config.version })

    return {
        getStatus
    }
}

module.exports = StatusServiceFactory
