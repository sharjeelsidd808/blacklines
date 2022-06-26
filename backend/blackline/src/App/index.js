const EntityFactory = require('./entity')
const ServiceFactory = require('./service')

const AppFactory = async (input = {}) => {
    const entity = await EntityFactory(input)
    input.entity = entity
    const service = await ServiceFactory(input)
    input.service = service
    const app = { entity, service }
    return app
}
module.exports = AppFactory
