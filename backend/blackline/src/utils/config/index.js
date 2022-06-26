class Config {
    constructor(input = {}) {
        const { envJson, packageJson } = input
        this.name = `${packageJson.name}-${envJson.NODE_ENV}`
        this.version = packageJson.version
        this.console = envJson.CONSOLE
        if (envJson.MONGODB_URL) {
            this.mongodb = {
                url: envJson.MONGODB_URL
            }
        }
        this.port = envJson.PORT || 5000

        this.artConfig = {
            maxLines: 1000,
            maxDays: 7,
            isUnique: true

        }
    }
}

const ConfigFactory = async (input = {}) => {
    const { envJson } = input
    const config = new Config(input)
    // eslint-disable-next-line global-require
    const environmentConfigFactory = require(`./${envJson.NODE_ENV}`)
    await environmentConfigFactory({ ...input, config })
    return config
}

module.exports = ConfigFactory
