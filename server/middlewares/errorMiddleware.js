export function errorMiddleware() {
  return (err, req, res, next) => {
    const errorObj = err.getErrorObject && err.getErrorObject()
    if (err.errors) {
      err.extra = err.errors
    } else if (errorObj) {
      err.extra = errorObj
    }
    return res.finalize(err)
  }
}
