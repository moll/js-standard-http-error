var _ = require("overstrike")
var StandardError = require("standard-error")
var STATUS_CODE_TO_NAME = require("http").STATUS_CODES
var STATUS_NAME_TO_CODE = require("http-codes")
module.exports = HttpError

function HttpError(code, msg) {
  if (typeof code == "string") code = STATUS_NAME_TO_CODE[code]
  if (typeof code != "number") throw new TypeError("Non-numeric HTTP code")
  StandardError.call(this, msg || STATUS_CODE_TO_NAME[code], {code: code})
}

HttpError.prototype = Object.create(StandardError.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

_.assign(HttpError, STATUS_NAME_TO_CODE)

HttpError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}
