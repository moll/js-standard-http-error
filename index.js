var StandardError = require("standard-error")
var assign = require("objectware").assign
var STATUS_CODE_TO_NAME = require("http").STATUS_CODES
var STATUS_NAME_TO_CODE = require("http-codes")
module.exports = HttpError

function HttpError(code, msg, props) {
  if (typeof code == "string") code = STATUS_NAME_TO_CODE[code]
  if (typeof code != "number") throw new TypeError("Non-numeric HTTP code")
  if (typeof msg == "object") props = msg, msg = null
  StandardError.call(this, msg || STATUS_CODE_TO_NAME[code], props)
  this.code = code
}

HttpError.prototype = Object.create(Error.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

assign(HttpError, STATUS_NAME_TO_CODE)

HttpError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}
