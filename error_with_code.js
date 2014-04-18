module.exports = ErrorWithCode

function ErrorWithCode(code, msg) {
  this.code = code
  this.message = msg
  Error.captureStackTrace(this, arguments.callee.caller)
}

ErrorWithCode.prototype = Object.create(Error.prototype, {
  constructor: {value: ErrorWithCode, configurable: true, writable: true}
})

ErrorWithCode.prototype.name = ErrorWithCode.name

ErrorWithCode.prototype.toString = function() {
  return "Error: " + this.code + " " + this.message
}
