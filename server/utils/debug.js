import winston from 'winston'
import util from 'util'
import _ from 'lodash'

winston.clear()
function jsonStringify(obj) {
    obj.time = obj.timestamp
    delete obj.timestamp
    return JSON.stringify(obj)
}

function formatter(options) {
    let message = `${options.timestamp()} `
    message += options.level.toUpperCase() + ' '
    message += !_.isUndefined(options.message) ? options.message + ' ' : ''
    if (options.meta && _.keys(options.meta).length) {
        _.mapValues(options.meta, (value) => {
            if (value instanceof Error) {
                checkCriticalError(value)
                return stringifyError(value)
            }
            return value
        })
        message += util.inspect(options.meta)
    }
    return message
}

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function() {
                return new Date().toJSON()
            },
            stringify: jsonStringify,
            formatter: formatter
        })
    ]
})
logger.exitOnError = false

function checkCriticalError(error) {
    return error
}

function stringifyError(err, filter, space) {
    const plainObject = {}
    _.forEach(Object.getOwnPropertyNames(err), (key) => {
        plainObject[key] = err[key]
    })
    return JSON.stringify(plainObject, filter, space)
}

export default logger
