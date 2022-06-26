const DatabaseFactory = async (input = {}) => {
    const { utils } = input
    const { modules, config, logger } = utils
    const { mongoose } = modules
    if (!config.mongodb) {
        throw new Error('mongodb credentials are missing')
    }
    const mongodbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    let tries = 0
    const db = mongoose.connection
    db.on('error', (error) => {
        logger.error(`Error in MongoDb connection: ${error}`)
        mongoose.disconnect()
    })
    db.on('connected', () => {
        tries = 0
    })
    db.on('disconnected', () => {
        tries += 1
        logger.error('MongoDB disconnected!')
        mongoose.connect(config.mongodb.url, mongodbOptions)
        if (tries > 3) {
            process.exit(1)
        }
    })
    await mongoose.connect(config.mongodb.url, mongodbOptions)
    if (config.mongodb.debug) {
        mongoose.set('debug', config.mongodb.debug)
    }
    return { mongoose }
}
module.exports = DatabaseFactory
