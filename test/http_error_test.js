var HttpError = require("..")

function RemoteError(code, msg) { HttpError.apply(this, arguments) }

RemoteError.prototype = Object.create(HttpError.prototype, {
  constructor: {value: RemoteError, configurable: true, writeable: true}
})

describe("HttpError", function() {
  describe("new", function() {
    it("must be an instance of HttpError", function() {
      new HttpError().must.be.an.instanceof(HttpError)
    })

    it("must set code", function() {
      new HttpError(404).code.must.equal(404)
    })

    it("must set message from code", function() {
      new HttpError(404).message.must.equal("Not Found")
    })

    it("must set message when given", function() {
      new HttpError(404, "Dunno").message.must.equal("Dunno")
    })

    it("must set name to HttpError", function() {
      new HttpError().name.must.equal("HttpError")
    })

    it("must set name to constructor's name", function() {
      new RemoteError().name.must.equal("RemoteError")
    })

    it("must set stack", function() {
      var stack = new HttpError().stack.split(/\n\s*/)
      stack[0].must.equal("HttpError")
      stack[1].must.include("http_error_test.js")
    })

    it("must set stack from constructor", function() {
      var stack = new RemoteError().stack.split(/\n\s*/)
      stack[0].must.equal("RemoteError")
      stack[1].must.include("http_error_test.js")
      stack[2].must.not.include("http_error_test.js")
    })
  })

  describe(".prototype.toString", function() {
    it("must return code and message", function() {
      new HttpError(404, "Dunno").toString().must.equal("HttpError: 404 Dunno")
    })

    it("must use set name", function() {
      var err = new HttpError(404, "Dunno")
      err.name = "OtherError"
      err.toString().must.equal("OtherError: 404 Dunno")
    })
  })
})
