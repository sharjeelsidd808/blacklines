const ServiceFactory = async (input = {}) => {
    const { utils } = input
    const { modules } = utils
    const { listdir } = modules
    const service = await listdir.loadFiles({ folderPath: __dirname, data: input })
    return service
}

module.exports = ServiceFactory
