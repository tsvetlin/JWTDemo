import _ from 'lodash'
import debug from '../utils/debug'
import { config } from '../config/config'

export function generateResponse(data) {
  const response = {
    error: null,
    data: null
  }

  if (data instanceof Error) {
    const err = data
    response.error = {
      error: _.snakeCase((err.constructor && err.constructor.name) || 'Error'),
      message: err.message
    }
    if (config.includeStackTrace) {
      response.error.stack = err.stack
    }
    response.success = false
    return response
  }
  response.success = true
  if (!_.isUndefined(data) && !_.isNull(data)) {
    response.data = data
  }

  return response
}

export function responseMiddleware() {
  return (req, res, next) => {
    res.finalize = (data) => {
      const err = data instanceof Error && data

      if (err && err.isBoom) {
        const output = err.output

        const statusCode = output.statusCode
        const messageObject = output.payload

        const payload = {
          success: false,
          data: null,
          error: messageObject
        }
        return res.status(statusCode).json(payload)
      }

      if (res.statusCode === 500) {
        debug.info('responseHandler', {
          url: req.originalUrl,
          userid: req.userId,
          status: res.statusCode,
          error: err
        })
      }

      const response = generateResponse(data)
      return response.success === false ? res.status(400).json(response) : res.json(response)
    }

    return next()
  }
}
