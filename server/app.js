import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import { config } from './config/config'
import debug from './utils/debug'
import adminRouter from './routes/admin/admin'

import { responseMiddleware } from './middlewares/responseMiddleware'
import { errorMiddleware } from './middlewares/errorMiddleware'


export const app = express()

export async function initExpress() {
  app.set('superSecret', config.secret)

  // view engine setup
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use(express.static(path.join(__dirname, 'public')))

  if (config.env === 'production') {
    app.get('/bundle.js', function (req, res, next) {
      req.url = req.url + '.gz'
      res.set('Content-Encoding', 'gzip')
      next()
    })
  }

  if (config.env !== 'test') {
    app.use(logger('dev'))
  }

  app.use(responseMiddleware())

  app.use(bodyParser.json({limit: '5mb'}))
  app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }))
  app.use(cookieParser())

  app.use(session({
    key: 'jwt.sid', // Name of the cookie. Defaults to connect.sid.
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
  }))

  app.use('/', adminRouter)
  app.use(errorMiddleware())
}

export async function start() {
  return initExpress()
    .then(() => {
      return new Promise((resolve) => {
        app.listen(config.port, () => {
          debug.info('Server started', { env: config.env, port: config.port })
          return resolve()
        })
      })
    })
}
