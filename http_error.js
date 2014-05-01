var Http = require("http")
var StandardError = require("standard-error")
module.exports = HttpError

function HttpError(code, msg) {
  StandardError.call(this, msg || Http.STATUS_CODES[code], {code: code})
}

HttpError.prototype = Object.create(StandardError.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

HttpError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}
