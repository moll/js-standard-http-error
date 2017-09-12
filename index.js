exports = module.exports = HttpError
var StandardError = require("standard-error")
var STATUS_CODE_TO_NAME = require("./codes")
var STATUS_NAME_TO_CODE = exports

function HttpError(code, msg, props) {
  if (typeof code == "string") code = STATUS_NAME_TO_CODE[code]
  if (typeof code != "number") throw new TypeError("Non-numeric HTTP code")
  if (typeof msg == "object" && msg != null) { props = msg; msg = null }
  StandardError.call(this, msg || STATUS_CODE_TO_NAME[code], props)
  this.code = code
}

HttpError.prototype = Object.create(StandardError.prototype, {
  constructor: {value: HttpError, configurable: true, writable: true}
})

// Set name explicitly for when the code gets minified.
HttpError.prototype.name = "HttpError"

Object.defineProperties(HttpError.prototype, {
  statusCode: alias("code"),
  statusMessage: alias("message"),

  status: {
    configurable: true,
    get: function() { return this.code },
    set: function(value) {
      Object.defineProperty(this, "status", {
        value: value, configurable: true, enumerable: true, writable: true
      })
    }
  }
})

HttpError.prototype.toString = function() {
  return this.name + ": " + this.code + " " + this.message
}

for (var code in STATUS_CODE_TO_NAME) {
  var name = STATUS_CODE_TO_NAME[code]
  exports[name.replace("'", "").replace(/[- ]/g, "_").toUpperCase()] = +code
}

function alias(name) {
  return {
    configurable: true,
    get: function() { return this[name] },
    set: function(value) { return this[name] = value }
  }
}
