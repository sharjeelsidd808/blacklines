class Validator {
    constructor(input = {}) {
        const { schema } = input
        const schemaKeys = Object.keys(schema)
        const newSchema = {}
        for (const schemaKey of schemaKeys) {
            const keys = Object.keys(schema[schemaKey])
            for (const key of keys) {
                newSchema[`${schemaKey}.${key}`] = schema[schemaKey][key]
            }
        }
        this.schema = newSchema
        this.joi = input.joi
    }

    validate(data, key) {
        
        const { error, value } =  this.schema[key].validate(data)
        if (error) {
            throw error
        }
        return value
    }
}

const ValidatorFactory = async (input = {}) => {
    const { modules } = input
    const { joi } = modules

    const schema = {
       art: {
        addLine: joi.object().keys({
            artId: joi.string().required(),
            line: joi.object().keys({
                x1: joi.number().required(),
                y1: joi.number().required(),
                x2: joi.number().required(),
                y2: joi.number().required(),
                addressInfo: joi.object().keys({
                    address: joi.string().required(),
                    balance: joi.number()
                }).unknown(true).required(),
                info: joi.object().unknown(true)
            }).required()
        })
       },
        trade: {
            getTradeOrderByInterval: joi.object().keys({
                pair     : joi.string().required(),
                interval : joi.string().required(),
                startTime: joi.date().required(),
                endTime  : joi.date()
            })
        }
    }

    const validator = new Validator({ schema, joi })
    return validator
}

module.exports = ValidatorFactory
