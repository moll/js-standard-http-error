var Http = require("http")
module.exports = HttpError

function HttpError(code, msg) {
  // Let all properties be enumerable for easier serialization.
  this.code = code
  this.message = msg || Http.STATUS_CODES[code]

  // Name has to be an own property (or on the prototype a single step up) for
  // the stack to be printed with the correct name.
  this.name = this.constructor.name
  Error.captureStackTrace(this, this.constructor)
}

HttpError.prototype = Object.create(Error.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

HttpError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}
