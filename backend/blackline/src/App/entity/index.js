const models = require('./models')

const ArtEntityFactory = require('./ArtEntity')

// eslint-disable-next-line no-unused-vars
const EntityFactory = async (input = {}) => {
    const artEntity = await ArtEntityFactory({ models })
    const entity = {
        artEntity
    }
    return entity
}

module.exports = EntityFactory
