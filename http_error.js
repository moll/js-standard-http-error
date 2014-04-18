var Http = require("http")
module.exports = HttpError

function HttpError(code, msg) {
  this.code = code
  this.message = msg || Http.STATUS_CODES[code]
  Error.captureStackTrace(this, arguments.callee.caller)
}

HttpError.prototype = Object.create(Error.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

HttpError.prototype.name = HttpError.name

HttpError.prototype.toString = function() {
  return "Error: " + this.code + " " + this.message
}
