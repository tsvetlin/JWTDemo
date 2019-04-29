import './dotenv'

export const config = {
  secret: process.env.APP_SECRET,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  log_level: process.env.LOG_LEVEL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
}
