const LogManagerFactory = async (input = {}) => {
    const { modules } = input
    const { winston, util } = modules

    const errorFormat = winston.format((info) => {
        if (info instanceof Error) {
            let message = ''
            if (info.code) {
                message += `Code: ${info.code}\n`
            }
            message += info.stack
            // eslint-disable-next-line no-param-reassign
            info = { ...info, message }
        }
        if (info[Symbol.for('splat')]) {
            let output = ''
            for (const data of info[Symbol.for('splat')]) {
                if (data instanceof Error) {
                    output += `\n ${data.stack}`
                } else if (typeof data === 'object') {
                    output += `\n ${util.format(data)}`
                } else {
                    output += `\n ${data}`
                }
            }
            // eslint-disable-next-line no-param-reassign
            info.message += output
        }
        return info
    })

    const jsonFormat = winston.format((info) => {
        if (typeof info.message === 'object') {
            // eslint-disable-next-line no-param-reassign
            info.message = util.format(info.message)
        }
        return info
    })

    const consoleFormat = winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)

    class LogManager {
        static createLogger(data = {}) {
            const logger = winston.createLogger({
                format: errorFormat()
            })

            if (data.console) {
                logger.add(
                    new winston.transports.Console({
                        stderrLevels: ['error'],
                        format      : winston.format.combine(
                            jsonFormat(),
                            winston.format.timestamp(),
                            winston.format.colorize(),
                            consoleFormat
                        )
                    })
                )
            }

            // if (data.loggly) {
            //     const logglyConfig = Object.assign(
            //         {
            //             level : 'warn',
            //             json  : true,
            //             isBulk: true
            //         },
            //         data.loggly
            //     )
            //     logger.add(new Loggly(logglyConfig))
            // }

            return logger
        }
    }
    return LogManager
}
module.exports = LogManagerFactory
